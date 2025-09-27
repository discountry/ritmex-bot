from pysdk import grvt_raw_types
from pysdk.grvt_raw_base import GrvtError
from pysdk.grvt_raw_sync import GrvtRawSync

from .test_raw_utils import (
    get_config,
    get_test_order,
    get_test_tpsl_order,
    get_test_transfer,
    get_test_withdrawal,
)


def test_get_all_instruments() -> None:
    api = GrvtRawSync(config=get_config())
    resp = api.get_all_instruments_v1(
        grvt_raw_types.ApiGetAllInstrumentsRequest(is_active=True)
    )
    if isinstance(resp, GrvtError):
        raise ValueError(f"Received error: {resp}")
    if resp.result is None:
        raise ValueError("Expected results to be non-null")
    if len(resp.result) == 0:
        raise ValueError("Expected results to be non-empty")


def test_open_orders() -> None:
    api = GrvtRawSync(config=get_config())

    # Skip test if trading account id is not set
    if api.config.trading_account_id is None or api.config.api_key is None:
        return None  # Skip test if configs are not set

    resp = api.open_orders_v1(
        grvt_raw_types.ApiOpenOrdersRequest(
            # sub_account_id=233, Uncomment to test error path with invalid sub account id
            sub_account_id=str(api.config.trading_account_id),
            kind=[grvt_raw_types.Kind.PERPETUAL],
            base=["BTC", "ETH"],
            quote=["USDT"],
        )
    )
    if isinstance(resp, GrvtError):
        api.logger.error(f"Received error: {resp}")
        return None
    if resp.result is None:
        raise ValueError("Expected orders to be non-null")
    if len(resp.result) == 0:
        api.logger.info("Expected orders to be non-empty")


def test_create_order_with_signing() -> None:
    api = GrvtRawSync(config=get_config())

    inst_resp = api.get_all_instruments_v1(
        grvt_raw_types.ApiGetAllInstrumentsRequest(is_active=True)
    )
    if isinstance(inst_resp, GrvtError):
        raise ValueError(f"Received error: {inst_resp}")

    order = get_test_order(api, {inst.instrument: inst for inst in inst_resp.result})
    if order is None:
        return None  # Skip test if configs are not set
    resp = api.create_order_v1(grvt_raw_types.ApiCreateOrderRequest(order=order))

    if isinstance(resp, GrvtError):
        raise ValueError(f"Received error: {resp}")
    if resp.result is None:
        raise ValueError("Expected order to be non-null")


def test_create_tpsl_order_with_signing() -> None:
    api = GrvtRawSync(config=get_config())

    inst_resp = api.get_all_instruments_v1(
        grvt_raw_types.ApiGetAllInstrumentsRequest(is_active=True)
    )
    if isinstance(inst_resp, GrvtError):
        raise ValueError(f"Received error: {inst_resp}")

    order = get_test_tpsl_order(
        api, {inst.instrument: inst for inst in inst_resp.result}
    )
    if order is None:
        return None  # Skip test if configs are not set
    resp = api.create_order_v1(grvt_raw_types.ApiCreateOrderRequest(order=order))

    if isinstance(resp, GrvtError):
        raise ValueError(f"Received error: {resp}")
    if resp.result is None:
        raise ValueError("Expected order to be non-null")


def test_transfer_with_signing() -> None:
    api = GrvtRawSync(config=get_config())
    transfer = get_test_transfer(api)

    if transfer is None:
        return None  # Skip test if configs are not set

    resp = api.transfer_v1(
        grvt_raw_types.ApiTransferRequest(
            transfer.from_account_id,
            transfer.from_sub_account_id,
            transfer.to_account_id,
            transfer.to_sub_account_id,
            transfer.currency,
            transfer.num_tokens,
            transfer.signature,
            grvt_raw_types.TransferType.STANDARD,
            "",
        )
    )

    if isinstance(resp, GrvtError):
        raise ValueError(f"Received error: {resp}")
    if resp.result is None:
        raise ValueError("Expected transfer response to be non-null")


def test_withdrawal_with_signing() -> None:
    api = GrvtRawSync(config=get_config())
    withdrawal = get_test_withdrawal(api)

    if withdrawal is None:
        return None  # Skip test if configs are not set

    resp = api.withdrawal_v1(
        grvt_raw_types.ApiWithdrawalRequest(
            withdrawal.from_account_id,
            withdrawal.to_eth_address,
            withdrawal.currency,
            withdrawal.num_tokens,
            withdrawal.signature,
        )
    )

    if isinstance(resp, GrvtError):
        raise ValueError(f"Received error: {resp}")
    if resp.result is None:
        raise ValueError("Expected withdrawal response to be non-null")
