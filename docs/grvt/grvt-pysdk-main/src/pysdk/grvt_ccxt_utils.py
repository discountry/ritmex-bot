# ruff: noqa: D200
# ruff: noqa: D204
# ruff: noqa: D205
# ruff: noqa: D404
# ruff: noqa: W291
# ruff: noqa: D400
# ruff: noqa: E501

import json
import logging
import random
import time
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import Enum
from http.cookies import SimpleCookie
from typing import Any

import aiohttp
import requests
from eth_account import Account
from eth_account.messages import encode_typed_data, SignableMessage

from .grvt_ccxt_env import CHAIN_IDS, GrvtEnv
from .grvt_ccxt_types import (
    BTC_ETH_SIZE_MULTIPLIER,
    DURATION_SECOND_IN_NSEC,
    Amount,
    GrvtOrderSide,
    GrvtOrderType,
    Num,
)


def rand_uint32():
    return random.randint(0, 2**32 - 1)


class TimeInForce(Enum):
    """
    |                       | Must Fill All | Can Fill Partial |
    | -                     | -             | -                |
    | Must Fill Immediately | FOK           | IOC              |
    | Can Fill Till Time    | AON           | GTC              |.

    """

    # GTT - Remains open until it is cancelled, or expired
    GOOD_TILL_TIME = "GOOD_TILL_TIME"
    # AON - Either fill the whole order or none of it (Block Trades Only)
    ALL_OR_NONE = "ALL_OR_NONE"
    # IOC - Fill the order as much as possible, when hitting the orderbook. Then cancel it
    IMMEDIATE_OR_CANCEL = "IMMEDIATE_OR_CANCEL"
    # FOK - Both AoN and IoC. Either fill the full order when hitting the orderbook, or cancel it
    FILL_OR_KILL = "FILL_OR_KILL"


class SignTimeInForce(Enum):
    GOOD_TILL_TIME = 1
    ALL_OR_NONE = 2
    IMMEDIATE_OR_CANCEL = 3
    FILL_OR_KILL = 4


TIME_IN_FORCE_TO_SIGN_TIME_IN_FORCE = {
    TimeInForce.GOOD_TILL_TIME: SignTimeInForce.GOOD_TILL_TIME,
    TimeInForce.ALL_OR_NONE: SignTimeInForce.ALL_OR_NONE,
    TimeInForce.IMMEDIATE_OR_CANCEL: SignTimeInForce.IMMEDIATE_OR_CANCEL,
    TimeInForce.FILL_OR_KILL: SignTimeInForce.FILL_OR_KILL,
}


def get_EIP712_domain_data(env: GrvtEnv) -> dict[str, str | int]:
    # DO NOT MODIFY THESE VALUES ##############
    return {
        "name": "GRVT Exchange",
        "version": "0",
        "chainId": CHAIN_IDS[env.value],
    }


def get_cookie_with_expiration(
    path: str, api_key: str | None
) -> dict[str, str | float | None] | None:
    """
    Authenticates and retrieves the session cookie, its expiration time and grvt-account-id token.
    :return: The session cookie.
    """
    FN = f"get_cookie_with_expiration {path=}"
    if api_key:
        data = {}
        try:
            data = {"api_key": api_key}
            session = requests.Session()
            return_value = session.post(
                path,
                json=data,
                headers={"Content-Type": "application/json"},
                timeout=5,
            )
            if return_value.ok:
                cookie = SimpleCookie()
                cookie.load(return_value.headers.get("Set-Cookie", ""))
                cookie_value: str = cookie["gravity"].value
                cookie_expiry: datetime = datetime.strptime(
                    cookie["gravity"]["expires"],
                    "%a, %d %b %Y %H:%M:%S %Z",
                )
                grvt_account_id: str = return_value.headers.get("X-Grvt-Account-Id", "")
                logging.info(
                    f"{FN} OK response {cookie_value=} {cookie_expiry=} {grvt_account_id=}"
                )
                return {
                    "gravity": cookie_value,
                    "expires": cookie_expiry.timestamp(),
                    "X-Grvt-Account-Id": grvt_account_id,
                }
            logging.warning(f"{FN} Invalid return_value {data=} {path=} {return_value=}")
            return None
        except Exception as e:
            logging.error(f"{FN} Error getting cookie: {e}")
            return None
    else:
        return None


async def get_cookie_with_expiration_async(
    path: str, api_key: str | None
) -> dict[str, str | float | None] | None:
    """
    Authenticates and retrieves the session cookie, its expiration time and grvt-account-id token.
    :return: The session cookie.
    """
    FN = f"get_cookie_with_expiration_async {path=}"
    if api_key:
        data = {}
        try:
            data = {"api_key": api_key}
            logging.info(f"{FN} ask for cookie {path=} {data=}")
            async with aiohttp.ClientSession() as session:
                async with session.post(url=path, json=data, timeout=5) as return_value:
                    logging.info(f"{FN} {return_value=}")
                    if return_value.ok:
                        cookie = SimpleCookie()
                        cookie.load(return_value.headers.get("Set-Cookie", ""))
                        cookie_value: str = cookie["gravity"].value
                        cookie_expiry: datetime = datetime.strptime(
                            cookie["gravity"]["expires"],
                            "%a, %d %b %Y %H:%M:%S %Z",
                        )
                        grvt_account_id: str = return_value.headers.get("X-Grvt-Account-Id", "")
                        logging.info(
                            f"{FN} OK response {cookie_value=} {cookie_expiry=} {grvt_account_id=}"
                        )
                        return {
                            "gravity": cookie_value,
                            "expires": cookie_expiry.timestamp(),
                            "X-Grvt-Account-Id": grvt_account_id,
                        }
        except Exception as e:
            logging.error(f"{FN} Error getting cookie: {e}")
            return None
    else:
        return None


class GrvtKind(Enum):
    PERPETUAL = 1
    FUTURE = 2
    CALL = 3
    PUT = 4
    SPOT = 5


class GrvtCurrency(Enum):
    USD = 1
    USDC = 2
    USDT = 3
    ETH = 4
    BTC = 5


def hexlify(data: bytes) -> str:
    """Convert a byte array to a hex string with a 0x prefix."""
    return f"0x{data.hex()}"


class EnumEncoder(json.JSONEncoder):
    def default(self, o):
        """
        Custom JSON encoder for Enum types.
        :param obj: Object to serialize.
        :return: Serialized object.
        """
        if isinstance(o, Enum):
            return o.value
        return super().default(o)


def get_kuq_from_symbol(symbol: str) -> tuple[str, str, str]:
    parts = symbol.split("_")
    if len(parts) == 3:
        underlying, quote, kind = parts
        if kind == "Perp":
            kind = "PERPETUAL"
        else:
            raise ValueError(f"Invalid {symbol=} {kind=}")
    elif len(parts) == 4:
        underlying, quote, kind, time_str = parts
        if kind == "Fut":
            kind = "FUTURE"
        else:
            raise ValueError(f"Invalid {symbol=} {kind=}")
    elif len(parts) == 5:
        underlying, quote, kind, time_str, strike_price = parts
        if kind in {"Call", "Put"}:
            kind = kind.upper()
        else:
            raise ValueError(f"Invalid {symbol=} {kind=}")
    else:
        raise ValueError(f"Invalid {symbol=}")
    return kind, underlying, quote


# Custom types
EIP712_ORDER_MESSAGE_TYPE = {
    "Order": [
        {"name": "subAccountID", "type": "uint64"},
        {"name": "isMarket", "type": "bool"},
        {"name": "timeInForce", "type": "uint8"},
        {"name": "postOnly", "type": "bool"},
        {"name": "reduceOnly", "type": "bool"},
        {"name": "legs", "type": "OrderLeg[]"},
        {"name": "nonce", "type": "uint32"},
        {"name": "expiration", "type": "int64"},
    ],
    "OrderLeg": [
        {"name": "assetID", "type": "uint256"},
        {"name": "contractSize", "type": "uint64"},
        {"name": "limitPrice", "type": "uint64"},
        {"name": "isBuyingContract", "type": "bool"},
    ],
}


@dataclass
class GrvtSignature:
    # The address (public key) of the wallet signing the payload
    signer: str
    r: str
    s: str
    v: int
    # Timestamp after which this signature expires, expressed in unix nanoseconds.
    # Must be capped at 30 days
    expiration: str
    """
    Users can randomly generate this value, used as a signature deconflicting key.
    ie. You can send the same exact instruction twice with different nonces.
    When the same nonce is used, the same payload will generate the same signature.
    Our system will consider the payload a duplicate, and ignore it.
    """
    nonce: int


@dataclass
class OrderMetadata:
    """
    Metadata fields are used to support Backend only operations.
    Hence, fields in here are never signed, and is never transmitted to the smart contract.
    """

    """
    `client_order_id`: A unique identifier of an active order, specified by the client
    This is used to identify the order in the client's system
    This value must be unique for all active orders in a subaccount,
    otehrwise amendment / cancellation will not work as expected
    Gravity UI will generate a random clientOrderID for each order in the range [0, 2^63 - 1]
    To prevent any conflicts, client machines should generate a random clientOrderID
    in the range [2^63, 2^64 - 1].
    When GRVT Backend receives an order with duplicate `client_order_id`, it will reject the order
    with rejectReason set to duplicate `client_order_id`.
    """
    client_order_id: str
    # [Filled by GRVT Backend] Time at which the order was received by GRVT in unix nanoseconds
    create_time: str | None = None


@dataclass
class GrvtOrderLeg:
    # The instrument to trade in this leg
    instrument: str
    # The total number of contracts to trade in this leg, expressed in base currency units.
    size: Decimal
    # Specifies if the order leg is a buy or sell
    is_buying_asset: bool
    """
    The limit price of the order leg, expressed in `9` decimals.
    This is the number of quote currency units to pay/receive for this leg.
    This should be `null/0` if the order is a market order
    """
    limit_price: Decimal


@dataclass
class GrvtOrder:
    """
    Order is a typed payload used throughout the GRVT platform to express all orders.
    GRVT orders are capable of expressing both single-legged, and multi-legged orders by default.
    All fields in the Order payload (except `id`, `metadata`, and `state`) are trustlessly enforced
    on our Hyperchain.
    This minimizes the amount of trust users have to offer to GRVT.
    """

    # The subaccount initiating the order
    sub_account_id: str
    # Supported time_in_force : GTT, IOC, FOK:<ul>
    time_in_force: TimeInForce
    legs: list[GrvtOrderLeg]
    # The signature approving this order
    signature: GrvtSignature
    # Order Metadata, ignored by the smart contract, and unsigned by the client
    metadata: OrderMetadata
    # is_market: If the order is a market order
    is_market: bool
    post_only: bool = False
    # If True, Order must reduce the position size, or be cancelled
    reduce_only: bool = False


def get_signable_message(
    order: GrvtOrder, env: GrvtEnv, instruments: dict[str, dict]
) -> bytes | None:
    FN = f"get_signable_message {order=}"
    size_multiplier = BTC_ETH_SIZE_MULTIPLIER
    PRICE_MULTIPLIER = 1_000_000_000
    legs = []
    for leg in order.legs:
        instrument = instruments.get(leg.instrument)
        if not instrument or not isinstance(instrument, dict):
            logging.error(f"{FN}: {leg.instrument=} not found in {instruments=}")
            return None
        if "base_decimals" not in instrument:
            logging.error(f"{FN}: no 'base_decimals' in {instrument=}")
            return None
        size_multiplier = 10 ** instrument["base_decimals"]
        if "instrument_hash" not in instrument:
            logging.error(f"{FN}: no 'instrument_hash' in {instrument=}")
            return None
        legs.append(
            {
                "assetID": instrument["instrument_hash"],
                "contractSize": int(Decimal(leg.size) * Decimal(size_multiplier)),
                "limitPrice": int(Decimal(leg.limit_price) * Decimal(PRICE_MULTIPLIER)),
                "isBuyingContract": leg.is_buying_asset,
            }
        )
    message_data = {
        "subAccountID": order.sub_account_id,
        "isMarket": order.is_market or False,
        "timeInForce": TIME_IN_FORCE_TO_SIGN_TIME_IN_FORCE[order.time_in_force].value,
        "postOnly": order.post_only or False,
        "reduceOnly": order.reduce_only or False,
        "legs": legs,
        "nonce": order.signature.nonce,
        "expiration": order.signature.expiration,
    }
    domain_data: dict[str, str | int]= get_EIP712_domain_data(env)
    logging.info(f"{FN} {domain_data=}\n{EIP712_ORDER_MESSAGE_TYPE=}\n{message_data=}")
    return encode_typed_data(domain_data, EIP712_ORDER_MESSAGE_TYPE, message_data)


def get_order_payload(
    order: GrvtOrder, private_key: str, env: GrvtEnv, instruments: dict[str, dict]
) -> dict:
    signable_message = get_signable_message(order, env, instruments)
    if signable_message is None:
        raise ValueError("Failed to create signable message")
    signed_message = Account.sign_message(signable_message, private_key)
    order.signature.s = "0x" + signed_message.s.to_bytes(32, byteorder="big").hex()
    order.signature.r = "0x" + signed_message.r.to_bytes(32, byteorder="big").hex()
    order.signature.v = signed_message.v
    order.signature.signer = Account.from_key(private_key).address

    return {
        "order": {
            "sub_account_id": str(order.sub_account_id),
            "is_market": order.is_market,
            "time_in_force": order.time_in_force.name,
            "post_only": order.post_only,
            "reduce_only": order.reduce_only,
            "legs": [
                {
                    "instrument": leg.instrument,
                    "size": str(leg.size),
                    "limit_price": str(leg.limit_price),
                    "is_buying_asset": bool(leg.is_buying_asset),
                }
                for leg in order.legs
            ],
            "signature": {
                "r": order.signature.r,
                "s": order.signature.s,
                "v": order.signature.v,
                "expiration": order.signature.expiration,
                "nonce": order.signature.nonce,
                "signer": order.signature.signer,
            },
            "metadata": {
                "client_order_id": order.metadata.client_order_id,
            },
        }
    }


def get_order_rpc_payload(
    order: GrvtOrder,
    private_key: str,
    env: GrvtEnv,
    instruments: dict[str, dict],
    version: str = "v1",
) -> dict:
    order_payload = get_order_payload(order, private_key, env, instruments)
    return {
        "jsonrpc": "2.0",
        "method": f"{version}/create_order",
        "params": order_payload,
    }


def get_grvt_order(
    sub_account_id: str,
    symbol: str,
    order_type: GrvtOrderType,
    side: GrvtOrderSide,
    amount: Amount,
    limit_price: Num,
    order_duration_secs: float = 5 * 60,
    params: dict = {},
) -> GrvtOrder:
    """
    Creates an order for a specified symbol with the given limit price and size.

    Args:
        symbol .
        limit_price (int): The limit price for the order.
        size (float): The size of the order.
        is_buying_asset(bool) : Buy or Sell.

    Returns:
        Order: The created perpetual order.
    """
    limit_price = limit_price or 0
    is_buying_asset = side == "buy"
    is_market = order_type == "market"
    leg = GrvtOrderLeg(
        instrument=symbol,
        size=round(Decimal(amount), 9),
        is_buying_asset=is_buying_asset,
        limit_price=round(Decimal(limit_price), 9),
    )

    # create an expiry time
    time_in_force = TimeInForce.GOOD_TILL_TIME
    if "time_in_force" in params:
        time_in_force = TimeInForce[params["time_in_force"]]
    post_only: bool = False
    if "post_only" in params:
        post_only = params["post_only"]
    reduce_only: bool = False
    if "reduce_only" in params:
        reduce_only = params["reduce_only"]
    expiry_ns: int = 0
    if order_duration_secs:
        expiry_ns = time.time_ns() + int(order_duration_secs * DURATION_SECOND_IN_NSEC)
    if "client_order_id" in params:
        client_order_id = int(params["client_order_id"])
    else:
        client_order_id = rand_uint32()
    signature = GrvtSignature(
        signer="",
        r="",
        s="",
        v=0,
        expiration=str(expiry_ns),
        nonce=rand_uint32(),
    )
    metadata = OrderMetadata(client_order_id=str(client_order_id))
    return GrvtOrder(
        sub_account_id=sub_account_id,
        time_in_force=time_in_force,
        legs=[leg],
        signature=signature,
        metadata=metadata,
        is_market=is_market,
        post_only=post_only,
        reduce_only=reduce_only,
    )

def sign_derisk_mm_ratio_request(
    env: GrvtEnv, sub_account_id: int, ratio: str, private_key_hex: str
):
    """
    Generate a signature for setting the derisk to maintenance margin ratio.
    
    :param sub_account_id: The sub-account ID to set the ratio for.
    :param ratio: The derisk to maintenance margin ratio as a string (e.g., "2.0").
    :param private_key_hex: The private key in hexadecimal format.
    :return: A dictionary containing the signature for the payload.
    """
    derisk_ratio_int = int(Decimal(ratio) * 1_000_000)
    expiration_ns = int((time.time() + 86400) * 1_000_000_000)
    nonce = random.randint(1, 2**32 - 1)

    domain_data = get_EIP712_domain_data(env)

    types = {
        "SetDeriskToMaintenanceMarginRatio": [
            {"name": "subAccountID", "type": "uint64"},
            {"name": "deriskToMaintenanceMarginRatio", "type": "uint32"},
            {"name": "nonce", "type": "uint32"},
            {"name": "expiration", "type": "int64"},
        ]
    }

    signature_payload = {
        "subAccountID": sub_account_id,
        "deriskToMaintenanceMarginRatio": derisk_ratio_int,
        "nonce": nonce,
        "expiration": expiration_ns,
    }

    message = encode_typed_data(domain_data, types, signature_payload)
    signed = Account.sign_message(message, private_key_hex)
    signer = Account.from_key(private_key_hex)

    return {
        "signer": signer.address.lower(),
        "r": hex(signed.r),
        "s": hex(signed.s),
        "v": signed.v,
        "expiration": str(expiration_ns),
        "nonce": nonce,
    }