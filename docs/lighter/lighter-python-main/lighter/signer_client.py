import ctypes
from functools import wraps
import inspect
import json
import platform
import logging
import os
import time
from typing import Dict, List, Optional, Union, Tuple

from eth_account import Account
from eth_account.messages import encode_defunct
from pydantic import StrictInt
import lighter
from lighter.configuration import Configuration
from lighter.errors import ValidationError
from lighter.models import TxHash
from lighter import nonce_manager
from lighter.models.resp_send_tx import RespSendTx
from lighter.models.resp_send_tx_batch import RespSendTxBatch
from lighter.transactions import CreateOrder, CancelOrder, Withdraw, CreateGroupedOrders

CODE_OK = 200


class ApiKeyResponse(ctypes.Structure):
    _fields_ = [("privateKey", ctypes.c_char_p), ("publicKey", ctypes.c_char_p), ("err", ctypes.c_char_p)]


class CreateOrderTxReq(ctypes.Structure):
    _fields_ = [
        ("MarketIndex", ctypes.c_uint8),
        ("ClientOrderIndex", ctypes.c_longlong),
        ("BaseAmount", ctypes.c_longlong),
        ("Price", ctypes.c_uint32),
        ("IsAsk", ctypes.c_uint8),
        ("Type", ctypes.c_uint8),
        ("TimeInForce", ctypes.c_uint8),
        ("ReduceOnly", ctypes.c_uint8),
        ("TriggerPrice", ctypes.c_uint32),
        ("OrderExpiry", ctypes.c_longlong),
    ]


class StrOrErr(ctypes.Structure):
    _fields_ = [("str", ctypes.c_char_p), ("err", ctypes.c_char_p)]


class SignedTxResponse(ctypes.Structure):
    _fields_ = [
        ("txType", ctypes.c_uint8),
        ("txInfo", ctypes.c_char_p),
        ("txHash", ctypes.c_char_p),
        ("messageToSign", ctypes.c_char_p),
        ("err", ctypes.c_char_p),
    ]


__signer = None


def __get_shared_library():
    is_linux = platform.system() == "Linux"
    is_mac = platform.system() == "Darwin"
    is_windows = platform.system() == "Windows"
    is_x64 = platform.machine().lower() in ("amd64", "x86_64")
    is_arm = platform.machine().lower() == "arm64"

    current_file_directory = os.path.dirname(os.path.abspath(__file__))
    path_to_signer_folders = os.path.join(current_file_directory, "signers")

    if is_arm and is_mac:
        return ctypes.CDLL(os.path.join(path_to_signer_folders, "lighter-signer-darwin-arm64.dylib"))
    elif is_linux and is_x64:
        return ctypes.CDLL(os.path.join(path_to_signer_folders, "lighter-signer-linux-amd64.so"))
    elif is_linux and is_arm:
        return ctypes.CDLL(os.path.join(path_to_signer_folders, "lighter-signer-linux-arm64.so"))
    elif is_windows and is_x64:
        return ctypes.CDLL(os.path.join(path_to_signer_folders, "lighter-signer-windows-amd64.dll"))
    else:
        raise Exception(
            f"Unsupported platform/architecture: {platform.system()}/{platform.machine()}. "
            "Currently supported: Linux(x86_64), macOS(arm64), and Windows(x86_64)."
        )


def __populate_shared_library_functions(signer):
    signer.GenerateAPIKey.argtypes = [ctypes.c_char_p]
    signer.GenerateAPIKey.restype = ApiKeyResponse

    signer.CreateClient.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int, ctypes.c_int, ctypes.c_longlong]
    signer.CreateClient.restype = ctypes.c_char_p

    signer.CheckClient.argtypes = [ctypes.c_int, ctypes.c_longlong]
    signer.CheckClient.restype = ctypes.c_char_p

    signer.SignChangePubKey.argtypes = [ctypes.c_char_p, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignChangePubKey.restype = SignedTxResponse

    signer.SignCreateOrder.argtypes = [ctypes.c_int, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_int,
                                            ctypes.c_int, ctypes.c_int, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignCreateOrder.restype = SignedTxResponse

    signer.SignCreateGroupedOrders.argtypes = [ctypes.c_uint8, ctypes.POINTER(CreateOrderTxReq), ctypes.c_int, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignCreateGroupedOrders.restype = SignedTxResponse

    signer.SignCancelOrder.argtypes = [ctypes.c_int, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignCancelOrder.restype = SignedTxResponse

    signer.SignWithdraw.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignWithdraw.restype = SignedTxResponse

    signer.SignCreateSubAccount.argtypes = [ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignCreateSubAccount.restype = SignedTxResponse

    signer.SignCancelAllOrders.argtypes = [ctypes.c_int, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignCancelAllOrders.restype = SignedTxResponse

    signer.SignModifyOrder.argtypes = [ctypes.c_int, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignModifyOrder.restype = SignedTxResponse

    signer.SignTransfer.argtypes = [ctypes.c_longlong, ctypes.c_int16, ctypes.c_int8, ctypes.c_int8, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_char_p, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignTransfer.restype = SignedTxResponse

    signer.SignCreatePublicPool.argtypes = [ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignCreatePublicPool.restype = SignedTxResponse

    signer.SignUpdatePublicPool.argtypes = [ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignUpdatePublicPool.restype = SignedTxResponse

    signer.SignMintShares.argtypes = [ctypes.c_longlong, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignMintShares.restype = SignedTxResponse

    signer.SignBurnShares.argtypes = [ctypes.c_longlong, ctypes.c_longlong, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignBurnShares.restype = SignedTxResponse

    signer.SignUpdateLeverage.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignUpdateLeverage.restype = SignedTxResponse

    signer.CreateAuthToken.argtypes = [ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.CreateAuthToken.restype = StrOrErr

    # Note: SwitchAPIKey is no longer exported in the new binary
    # All functions now take api_key_index directly, so switching is handled via parameters

    signer.SignUpdateMargin.argtypes = [ctypes.c_int, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong, ctypes.c_int, ctypes.c_longlong]
    signer.SignUpdateMargin.restype = SignedTxResponse


def get_signer():
    # check if singleton exists already
    global __signer
    if __signer is not None:
        return __signer

    # create shared library & populate methods
    __signer = __get_shared_library()
    __populate_shared_library_functions(__signer)
    return __signer


def create_api_key(seed=""):
    result = get_signer().GenerateAPIKey(ctypes.c_char_p(seed.encode("utf-8")))

    private_key_str = result.privateKey.decode("utf-8") if result.privateKey else None
    public_key_str = result.publicKey.decode("utf-8") if result.publicKey else None
    error = result.err.decode("utf-8") if result.err else None

    return private_key_str, public_key_str, error


def trim_exc(exception_body: str):
    return exception_body.strip().split("\n")[-1]


def process_api_key_and_nonce(func):
    @wraps(func)
    async def wrapper(self, *args, **kwargs):
        # Get the signature
        sig = inspect.signature(func)

        # Bind args and kwargs to the function's signature
        bound_args = sig.bind(self, *args, **kwargs)
        bound_args.apply_defaults()
        # Extract api_key_index and nonce from kwargs or use defaults
        api_key_index = bound_args.arguments.get("api_key_index", 255)
        nonce = bound_args.arguments.get("nonce", -1)
        if api_key_index == 255 and nonce == -1:
            api_key_index, nonce = self.nonce_manager.next_nonce()

        # Call the original function with modified kwargs
        ret: TxHash
        try:
            partial_arguments = {k: v for k, v in bound_args.arguments.items() if k not in ("self", "nonce", "api_key_index")}
            created_tx, ret, err = await func(self, **partial_arguments, nonce=nonce, api_key_index=api_key_index)
            if (ret is None and err) or (ret and ret.code != CODE_OK):
                self.nonce_manager.acknowledge_failure(api_key_index)
        except lighter.exceptions.BadRequestException as e:
            if "invalid nonce" in str(e):
                self.nonce_manager.hard_refresh_nonce(api_key_index)
                return None, None, trim_exc(str(e))
            else:
                self.nonce_manager.acknowledge_failure(api_key_index)
                return None, None, trim_exc(str(e))

        return created_tx, ret, err

    return wrapper


class SignerClient:
    DEFAULT_NONCE = -1
    DEFAULT_API_KEY_INDEX = 255

    USDC_TICKER_SCALE = 1e6
    ETH_TICKER_SCALE = 1e8

    ORDER_TYPE_LIMIT = 0
    ORDER_TYPE_MARKET = 1
    ORDER_TYPE_STOP_LOSS = 2
    ORDER_TYPE_STOP_LOSS_LIMIT = 3
    ORDER_TYPE_TAKE_PROFIT = 4
    ORDER_TYPE_TAKE_PROFIT_LIMIT = 5
    ORDER_TYPE_TWAP = 6

    ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL = 0
    ORDER_TIME_IN_FORCE_GOOD_TILL_TIME = 1
    ORDER_TIME_IN_FORCE_POST_ONLY = 2

    CANCEL_ALL_TIF_IMMEDIATE = 0
    CANCEL_ALL_TIF_SCHEDULED = 1
    CANCEL_ALL_TIF_ABORT = 2

    NIL_TRIGGER_PRICE = 0
    DEFAULT_28_DAY_ORDER_EXPIRY = -1
    DEFAULT_IOC_EXPIRY = 0
    DEFAULT_10_MIN_AUTH_EXPIRY = -1
    MINUTE = 60

    CROSS_MARGIN_MODE = 0
    ISOLATED_MARGIN_MODE = 1

    ISOLATED_MARGIN_REMOVE_COLLATERAL = 0
    ISOLATED_MARGIN_ADD_COLLATERAL = 1

    GROUPING_TYPE_ONE_TRIGGERS_THE_OTHER = 1
    GROUPING_TYPE_ONE_CANCELS_THE_OTHER = 2
    GROUPING_TYPE_ONE_TRIGGERS_A_ONE_CANCELS_THE_OTHER = 3

    ROUTE_PERP = 0
    ROUTE_SPOT = 1

    ASSET_ID_USDC = 3
    ASSET_ID_ETH = 1

    def __init__(
            self,
            url,
            account_index,
            api_private_keys: Dict[int, str],
            nonce_management_type=nonce_manager.NonceManagerType.OPTIMISTIC,
    ):
        self.url = url
        self.chain_id = 304 if "mainnet" in url else 300

        self.validate_api_private_keys(api_private_keys)
        self.api_key_dict = api_private_keys
        self.account_index = account_index
        self.signer = get_signer()
        self.api_client = lighter.ApiClient(configuration=Configuration(host=url))
        self.tx_api = lighter.TransactionApi(self.api_client)
        self.order_api = lighter.OrderApi(self.api_client)

        self.nonce_manager = nonce_manager.nonce_manager_factory(
            nonce_manager_type=nonce_management_type,
            account_index=account_index,
            api_client=self.api_client,
            api_keys_list=list(api_private_keys.keys()),
        )
        for api_key_index in api_private_keys.keys():
            self.create_client(api_key_index)

    # === signer helpers ===
    @staticmethod
    def __decode_tx_info(result: SignedTxResponse) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        if result.err:
            error = result.err.decode("utf-8")
            return None, None, None, error
        
        # Use txType from response if available, otherwise use the provided type
        tx_type = result.txType
        tx_info_str = result.txInfo.decode("utf-8") if result.txInfo else None
        tx_hash_str = result.txHash.decode("utf-8") if result.txHash else None

        return tx_type, tx_info_str, tx_hash_str, None

    @staticmethod
    def __decode_and_sign_tx_info(eth_private_key: str, result: SignedTxResponse) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        if result.err:
            err = result.err.decode("utf-8")
            return None, None, None, err

        tx_type = result.txType
        tx_info_str = result.txInfo.decode("utf-8") if result.txInfo else None
        tx_hash_str = result.txHash.decode("utf-8") if result.txHash else None
        msg_to_sign = result.messageToSign.decode("utf-8") if result.messageToSign else None

        # sign the message
        acct = Account.from_key(eth_private_key)
        message = encode_defunct(text=msg_to_sign)
        signature = acct.sign_message(message)

        # add signature to tx_info
        tx_info = json.loads(tx_info_str)
        tx_info["L1Sig"] = signature.signature.to_0x_hex()
        return tx_type, json.dumps(tx_info), tx_hash_str, None

    def validate_api_private_keys(self, private_keys: Dict[int, str]):
        if len(private_keys) == 0:
            raise ValidationError("No API keys provided")

        # trim 0x
        for api_key_index, private_key in private_keys.items():
            if private_key.startswith("0x"):
                private_keys[api_key_index] = private_key[2:]

    def create_client(self, api_key_index):
        err = self.signer.CreateClient(
            self.url.encode("utf-8"),
            self.api_key_dict[api_key_index].encode("utf-8"),
            self.chain_id,
            api_key_index,
            self.account_index,
        )

        if err is None:
            return

        if err is not None:
            raise Exception(err.decode("utf-8"))

    def __signer_check_client(
            self,
            api_key_index: int,
            account_index: int,
    ) -> Optional[str]:
        err = self.signer.CheckClient(api_key_index, account_index)
        if err is None:
            return None

        return err.decode("utf-8")

    # check_client verifies that the given API key associated with (api_key_index, account_index) matches the one on Lighter
    def check_client(self):
        for api_key in self.api_key_dict.keys():
            err = self.__signer_check_client(api_key, self.account_index)
            if err is not None:
                return err + f" on api key {api_key}"
        return None

    @staticmethod
    def create_api_key(self, seed=""):
        return create_api_key(seed=seed)

    def get_api_key_nonce(self, api_key_index: int, nonce: int) -> Tuple[int, int]:
        if api_key_index != self.DEFAULT_API_KEY_INDEX and nonce != self.DEFAULT_NONCE:
            return api_key_index, nonce

        if nonce != self.DEFAULT_NONCE:
            if len(self.api_key_dict) == 1:
                return self.nonce_manager.next_nonce()
            else:
                raise Exception("ambiguous api key")
        return self.nonce_manager.next_nonce()

    def create_auth_token_with_expiry(self, deadline: int = DEFAULT_10_MIN_AUTH_EXPIRY, *, timestamp: int = None, api_key_index: int = DEFAULT_API_KEY_INDEX):
        if deadline == SignerClient.DEFAULT_10_MIN_AUTH_EXPIRY:
            deadline = 10 * SignerClient.MINUTE
        if timestamp is None:
            timestamp = int(time.time())

        result = self.signer.CreateAuthToken(deadline+timestamp, api_key_index, self.account_index)

        auth = result.str.decode("utf-8") if result.str else None
        error = result.err.decode("utf-8") if result.err else None
        return auth, error

    def sign_change_api_key(self, eth_private_key: str, new_pubkey: str, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_and_sign_tx_info(eth_private_key, self.signer.SignChangePubKey(
            ctypes.c_char_p(new_pubkey.encode("utf-8")),
            nonce,
            api_key_index,
            self.account_index
        ))

    async def change_api_key(self, eth_private_key: str, new_pubkey: str, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX):
        tx_type, tx_info, tx_hash, error = self.sign_change_api_key(eth_private_key, new_pubkey, nonce, api_key_index)
        if error is not None:
            return None, error

        logging.debug(f"Change Pub Key TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Change Pub Key Send. TxResponse: {api_response}")
        return api_response, None

    def sign_create_order(
            self,
            market_index,
            client_order_index,
            base_amount,
            price,
            is_ask,
            order_type,
            time_in_force,
            reduce_only=False,
            trigger_price=NIL_TRIGGER_PRICE,
            order_expiry=DEFAULT_28_DAY_ORDER_EXPIRY,
            nonce: int = DEFAULT_NONCE,
            api_key_index: int = DEFAULT_API_KEY_INDEX
    ) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignCreateOrder(
            market_index,
            client_order_index,
            base_amount,
            price,
            int(is_ask),
            order_type,
            time_in_force,
            reduce_only,
            trigger_price,
            order_expiry,
            nonce,
            api_key_index,
            self.account_index,
        ))

    def sign_create_grouped_orders(
            self,
            grouping_type: int,
            orders: List[CreateOrderTxReq],
            nonce: int = DEFAULT_NONCE,
            api_key_index=DEFAULT_API_KEY_INDEX
    ) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        arr_type = CreateOrderTxReq * len(orders)
        orders_arr = arr_type(*orders)

        return self.__decode_tx_info(self.signer.SignCreateGroupedOrders(
            grouping_type, orders_arr, len(orders), nonce, api_key_index, self.account_index
        ))

    def sign_cancel_order(self, market_index: int, order_index: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignCancelOrder(market_index, order_index, nonce, api_key_index, self.account_index))

    def sign_withdraw(self, asset_index: int, route_type: int, amount: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignWithdraw(asset_index, route_type, amount, nonce, api_key_index, self.account_index))

    def sign_create_sub_account(self, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignCreateSubAccount(nonce, api_key_index, self.account_index))

    def sign_cancel_all_orders(self, time_in_force: int, timestamp_ms: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignCancelAllOrders(time_in_force, timestamp_ms, nonce, api_key_index, self.account_index))

    def sign_modify_order(self, market_index: int, order_index: int, base_amount: int, price: int, trigger_price: int = NIL_TRIGGER_PRICE, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignModifyOrder(market_index, order_index, base_amount, price, trigger_price, nonce, api_key_index, self.account_index))

    def sign_transfer(self, eth_private_key: str, to_account_index: int, asset_id: int, route_from: int, route_to: int, usdc_amount: int, fee: int, memo: str, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_and_sign_tx_info(eth_private_key, self.signer.SignTransfer(to_account_index, asset_id, route_from, route_to, usdc_amount, fee, ctypes.c_char_p(memo.encode("utf-8")), nonce, api_key_index, self.account_index))

    def sign_create_public_pool(self, operator_fee: int, initial_total_shares: int, min_operator_share_rate: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignCreatePublicPool(operator_fee, initial_total_shares, min_operator_share_rate, nonce, api_key_index, self.account_index))

    def sign_update_public_pool(self, public_pool_index: int, status: int, operator_fee: int, min_operator_share_rate: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignUpdatePublicPool(public_pool_index, status, operator_fee, min_operator_share_rate, nonce, api_key_index, self.account_index))

    def sign_mint_shares(self, public_pool_index: int, share_amount: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignMintShares(public_pool_index, share_amount, nonce, api_key_index, self.account_index))

    def sign_burn_shares(self, public_pool_index: int, share_amount: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignBurnShares(public_pool_index, share_amount, nonce, api_key_index, self.account_index))

    def sign_update_leverage(self, market_index: int, fraction: int, margin_mode: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignUpdateLeverage(market_index, fraction, margin_mode, nonce, api_key_index, self.account_index))

    def sign_update_margin(self, market_index: int, usdc_amount: int, direction: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[str, str, str, None], Tuple[None, None, None, str]]:
        return self.__decode_tx_info(self.signer.SignUpdateMargin(market_index, usdc_amount, direction, nonce, api_key_index, self.account_index))

    @process_api_key_and_nonce
    async def create_order(
            self,
            market_index,
            client_order_index,
            base_amount,
            price,
            is_ask,
            order_type,
            time_in_force,
            reduce_only=False,
            trigger_price=NIL_TRIGGER_PRICE,
            order_expiry=DEFAULT_28_DAY_ORDER_EXPIRY,
            nonce: int = DEFAULT_NONCE,
            api_key_index: int = DEFAULT_API_KEY_INDEX
    ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        tx_type, tx_info, tx_hash, error = self.sign_create_order(
            market_index,
            client_order_index,
            base_amount,
            price,
            int(is_ask),
            order_type,
            time_in_force,
            reduce_only,
            trigger_price,
            order_expiry,
            nonce,
            api_key_index,
        )
        if error is not None:
            return None, None, error

        logging.debug(f"Create Order TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Create Order Send. TxResponse: {api_response}")
        return CreateOrder.from_json(tx_info), api_response, None

    @process_api_key_and_nonce
    async def create_grouped_orders(
            self,
            grouping_type: int,
            orders: List[CreateOrderTxReq],
            nonce: int = DEFAULT_NONCE,
            api_key_index: int = DEFAULT_API_KEY_INDEX
    ) ->Union[Tuple[CreateGroupedOrders, RespSendTx, None], Tuple[None, None, str]]:
        tx_type, tx_info, tx_hash, error = self.sign_create_grouped_orders(
            grouping_type,
            orders,
            nonce,
            api_key_index
        )
        if error is not None:
            return None, None, error

        logging.debug(f"Create Grouped Orders TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Create Grouped Orders Send. TxResponse: {api_response}")
        return CreateGroupedOrders.from_json(tx_info), api_response, None

    async def create_market_order(
            self,
            market_index,
            client_order_index,
            base_amount,
            avg_execution_price,
            is_ask,
            reduce_only: bool = False,
            nonce: int = DEFAULT_NONCE,
            api_key_index: int = DEFAULT_API_KEY_INDEX
    ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        return await self.create_order(
            market_index,
            client_order_index,
            base_amount,
            avg_execution_price,
            is_ask,
            order_type=self.ORDER_TYPE_MARKET,
            time_in_force=self.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
            order_expiry=self.DEFAULT_IOC_EXPIRY,
            reduce_only=reduce_only,
            nonce=nonce,
            api_key_index=api_key_index,
        )

    # will only do the amount such that the slippage is limited to the value provided
    async def create_market_order_limited_slippage(
            self,
            market_index,
            client_order_index,
            base_amount,
            max_slippage,
            is_ask,
            reduce_only: bool = False,
            nonce: int = DEFAULT_NONCE,
            api_key_index: int = DEFAULT_API_KEY_INDEX,
            ideal_price=None
    ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        if ideal_price is None:
            order_book_orders = await self.order_api.order_book_orders(market_index, 1)
            logging.debug(
                "Create market order limited slippage is doing an API call to get the current ideal price. You can also provide it yourself to avoid this.")
            ideal_price = int((order_book_orders.bids[0].price if is_ask else order_book_orders.asks[0].price).replace(".", ""))

        acceptable_execution_price = round(ideal_price * (1 + max_slippage * (-1 if is_ask else 1)))
        return await self.create_order(
            market_index,
            client_order_index,
            base_amount,
            price=acceptable_execution_price,
            is_ask=is_ask,
            order_type=self.ORDER_TYPE_MARKET,
            time_in_force=self.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
            order_expiry=self.DEFAULT_IOC_EXPIRY,
            reduce_only=reduce_only,
            nonce=nonce,
            api_key_index=api_key_index,
        )

    # will only execute the order if it executes with slippage <= max_slippage
    async def create_market_order_if_slippage(
            self,
            market_index,
            client_order_index,
            base_amount,
            max_slippage,
            is_ask,
            reduce_only: bool = False,
            nonce: int = DEFAULT_NONCE,
            api_key_index: int = DEFAULT_API_KEY_INDEX,
            ideal_price=None
    ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        order_book_orders = await self.order_api.order_book_orders(market_index, 100)
        if ideal_price is None:
            ideal_price = int((order_book_orders.bids[0].price if is_ask else order_book_orders.asks[0].price).replace(".", ""))

        matched_usd_amount, matched_size = 0, 0
        for order_book_order in (order_book_orders.bids if is_ask else order_book_orders.asks):
            if matched_size == base_amount:
                break
            curr_order_price = int(order_book_order.price.replace(".", ""))
            curr_order_size = int(order_book_order.remaining_base_amount.replace(".", ""))
            to_be_used_order_size = min(base_amount - matched_size, curr_order_size)
            matched_usd_amount += curr_order_price * to_be_used_order_size
            matched_size += to_be_used_order_size

        potential_execution_price = matched_usd_amount / matched_size
        acceptable_execution_price = ideal_price * (1 + max_slippage * (-1 if is_ask else 1))
        if (is_ask and potential_execution_price < acceptable_execution_price) or (not is_ask and potential_execution_price > acceptable_execution_price):
            return None, None, "Excessive slippage"

        if matched_size < base_amount:
            return None, None, "Cannot be sure slippage will be acceptable due to the high size"

        return await self.create_order(
            market_index,
            client_order_index,
            base_amount,
            price=round(acceptable_execution_price),
            is_ask=is_ask,
            order_type=self.ORDER_TYPE_MARKET,
            time_in_force=self.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
            order_expiry=self.DEFAULT_IOC_EXPIRY,
            reduce_only=reduce_only,
            nonce=nonce,
            api_key_index=api_key_index,
        )

    @process_api_key_and_nonce
    async def cancel_order(self, market_index, order_index, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX
                           ) -> Union[Tuple[CancelOrder, RespSendTx, None], Tuple[None, None, str]]:
        tx_type, tx_info, tx_hash, error = self.sign_cancel_order(market_index, order_index, nonce, api_key_index)

        if error is not None:
            return None, None, error

        logging.debug(f"Cancel Order TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Cancel Order Send. TxResponse: {api_response}")
        return CancelOrder.from_json(tx_info), api_response, None

    async def create_tp_order(self, market_index, client_order_index, base_amount, trigger_price, price, is_ask, reduce_only=False,
                              nonce: int = DEFAULT_NONCE,
                              api_key_index: int = DEFAULT_API_KEY_INDEX
                              ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        return await self.create_order(
            market_index,
            client_order_index,
            base_amount,
            price,
            is_ask,
            self.ORDER_TYPE_TAKE_PROFIT,
            self.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
            reduce_only,
            trigger_price,
            self.DEFAULT_28_DAY_ORDER_EXPIRY,
            nonce,
            api_key_index,
        )

    async def create_tp_limit_order(self, market_index, client_order_index, base_amount, trigger_price, price, is_ask, reduce_only=False,
                                    nonce: int = DEFAULT_NONCE,
                                    api_key_index: int = DEFAULT_API_KEY_INDEX
                                    ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        return await self.create_order(
            market_index,
            client_order_index,
            base_amount,
            price,
            is_ask,
            self.ORDER_TYPE_TAKE_PROFIT_LIMIT,
            self.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
            reduce_only,
            trigger_price,
            self.DEFAULT_28_DAY_ORDER_EXPIRY,
            nonce,
            api_key_index,
        )

    async def create_sl_order(self, market_index, client_order_index, base_amount, trigger_price, price, is_ask, reduce_only=False,
                              nonce: int = DEFAULT_NONCE,
                              api_key_index: int = DEFAULT_API_KEY_INDEX
                              ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        return await self.create_order(
            market_index,
            client_order_index,
            base_amount,
            price,
            is_ask,
            self.ORDER_TYPE_STOP_LOSS,
            self.ORDER_TIME_IN_FORCE_IMMEDIATE_OR_CANCEL,
            reduce_only,
            trigger_price,
            self.DEFAULT_28_DAY_ORDER_EXPIRY,
            nonce,
            api_key_index,
        )

    async def create_sl_limit_order(self, market_index, client_order_index, base_amount, trigger_price, price, is_ask, reduce_only=False,
                                    nonce: int = DEFAULT_NONCE,
                                    api_key_index: int = DEFAULT_API_KEY_INDEX
                                    ) -> Union[Tuple[CreateOrder, RespSendTx, None], Tuple[None, None, str]]:
        return await self.create_order(
            market_index,
            client_order_index,
            base_amount,
            price,
            is_ask,
            self.ORDER_TYPE_STOP_LOSS_LIMIT,
            self.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
            reduce_only,
            trigger_price,
            self.DEFAULT_28_DAY_ORDER_EXPIRY,
            nonce,
            api_key_index,
        )

    @process_api_key_and_nonce
    async def withdraw(self, asset_id: int, route_type: int, amount: float, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX) -> Union[Tuple[Withdraw, RespSendTx, None], Tuple[None, None, str]]:
        if asset_id == self.ASSET_ID_USDC:
            amount = int(amount * self.USDC_TICKER_SCALE)
        elif asset_id == self.ASSET_ID_ETH:
            amount = int(amount * self.ETH_TICKER_SCALE)
        else:
            raise ValueError(f"Unsupported asset id: {asset_id}")

        tx_type, tx_info, tx_hash, error = self.sign_withdraw(asset_id, route_type, amount, nonce, api_key_index)
        if error is not None:
            return None, None, error

        logging.debug(f"Withdraw TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Withdraw Send. TxResponse: {api_response}")
        return Withdraw.from_json(tx_info), api_response, None

    @process_api_key_and_nonce
    async def create_sub_account(self, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX):
        tx_type, tx_info, tx_hash, error = self.sign_create_sub_account(nonce, api_key_index)
        if error is not None:
            return None, None, error

        logging.debug(f"Create Sub Account TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Create Sub Account Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def cancel_all_orders(self, time_in_force, timestamp_ms, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX)-> Union[Tuple[Withdraw, RespSendTx, None], Tuple[None, None, str]]:
        tx_type, tx_info, tx_hash, error = self.sign_cancel_all_orders(time_in_force, timestamp_ms, nonce, api_key_index)
        if error is not None:
            return None, None, error

        logging.debug(f"Cancel All Orders TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Cancel All Orders Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def modify_order(
            self, market_index, order_index, base_amount, price, trigger_price=NIL_TRIGGER_PRICE, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX
    ):
        tx_type, tx_info, tx_hash, error = self.sign_modify_order(market_index, order_index, base_amount, price, trigger_price, nonce, api_key_index)
        if error is not None:
            return None, None, error

        logging.debug(f"Modify Order TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Modify Order Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def transfer(self, eth_private_key: str, to_account_index: int, asset_id: int, route_from: int, route_to: int, amount: float, fee: int, memo: str, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX):
        if asset_id == self.ASSET_ID_USDC:
            amount = int(amount * self.USDC_TICKER_SCALE)
        elif asset_id == self.ASSET_ID_ETH:
            amount = int(amount * self.ETH_TICKER_SCALE)
        else:
            raise ValueError(f"Unsupported asset id: {asset_id}")

        tx_type, tx_info, tx_hash, error = self.sign_transfer(eth_private_key, to_account_index, asset_id, route_from, route_to, amount, fee, memo, nonce, api_key_index)
        if error is not None:
            return None, None, error

        logging.debug(f"Transfer TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Transfer Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def create_public_pool(
            self, operator_fee, initial_total_shares, min_operator_share_rate, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX
    ):
        tx_type, tx_info, tx_hash, error = self.sign_create_public_pool(
            operator_fee, initial_total_shares, min_operator_share_rate, nonce, api_key_index
        )
        if error is not None:
            return None, None, error

        logging.debug(f"Create Public Pool TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Create Public Pool Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def update_public_pool(
            self, public_pool_index, status, operator_fee, min_operator_share_rate, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX
    ):
        tx_type, tx_info, tx_hash, error = self.sign_update_public_pool(
            public_pool_index, status, operator_fee, min_operator_share_rate, nonce, api_key_index
        )
        if error is not None:
            return None, None, error

        logging.debug(f"Update Public Pool TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Update Public Pool Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def mint_shares(self, public_pool_index, share_amount, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX):
        tx_type, tx_info, tx_hash, error = self.sign_mint_shares(public_pool_index, share_amount, nonce, api_key_index)
        if error is not None:
            return None, None, error

        logging.debug(f"Mint Shares TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Mint Shares Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def burn_shares(self, public_pool_index, share_amount, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX):
        tx_type, tx_info, tx_hash, error = self.sign_burn_shares(public_pool_index, share_amount, nonce, api_key_index)
        if error is not None:
            return None, None, error

        logging.debug(f"Burn Shares TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Burn Shares Send. TxResponse: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def update_leverage(self, market_index, margin_mode, leverage, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX):
        imf = int(10_000 / leverage)
        tx_type, tx_info, tx_hash, error = self.sign_update_leverage(market_index, imf, margin_mode, nonce, api_key_index)

        if error is not None:
            return None, None, error

        logging.debug(f"Update Leverage TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Update Leverage Tx Response: {api_response}")
        return tx_info, api_response, None

    @process_api_key_and_nonce
    async def update_margin(self, market_index: int, usdc_amount: float, direction: int, nonce: int = DEFAULT_NONCE, api_key_index: int = DEFAULT_API_KEY_INDEX):
        usdc_amount = int(usdc_amount * self.USDC_TICKER_SCALE)
        tx_type, tx_info, tx_hash, error = self.sign_update_margin(market_index, usdc_amount, direction, nonce, api_key_index)

        if error is not None:
            return None, None, error

        logging.debug(f"Update Margin TxHash: {tx_hash} TxInfo: {tx_info}")
        api_response = await self.send_tx(tx_type=tx_type, tx_info=tx_info)
        logging.debug(f"Update Margin Tx Response: {api_response}")
        return tx_info, api_response, None

    async def send_tx(self, tx_type: StrictInt, tx_info: str) -> RespSendTx:
        if tx_info[0] != "{":
            raise Exception(tx_info)
        return await self.tx_api.send_tx(tx_type=tx_type, tx_info=tx_info)

    async def send_tx_batch(self, tx_types: List[StrictInt], tx_infos: List[str]) -> RespSendTxBatch:
        if len(tx_types) != len(tx_infos):
            raise Exception("Tx types and tx infos must be of same length")
        if len(tx_types) == 0:
            raise Exception("Empty tx types and tx infos")

        if tx_infos[0][0] != "{":
            raise Exception(tx_infos)
        return await self.tx_api.send_tx_batch(tx_types=json.dumps(tx_types), tx_infos=json.dumps(tx_infos))

    async def close(self):
        await self.api_client.close()

    @staticmethod
    def are_keys_equal(key1, key2) -> bool:
        start_index1, start_index2 = 0, 0
        if key1.startswith("0x"):
            start_index1 = 2
        if key2.startswith("0x"):
            start_index2 = 2
        return key1[start_index1:] == key2[start_index2:]
