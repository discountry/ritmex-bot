
import os
import time
import traceback
from datetime import datetime
from decimal import Decimal

from pysdk.grvt_ccxt import GrvtCcxt
from pysdk.grvt_ccxt_env import GrvtEnv
from pysdk.grvt_ccxt_logging_selector import logger
from pysdk.grvt_ccxt_test_utils import validate_return_values
from pysdk.grvt_ccxt_types import DURATION_SECOND_IN_NSEC, GrvtOrderSide
from pysdk.grvt_ccxt_utils import rand_uint32


def get_open_orders(api: GrvtCcxt) -> list[dict]:
    open_orders: list[dict] = api.fetch_open_orders(
        symbol="BTC_USDT_Perp",
        params={"kind": "PERPETUAL"},
    )
    logger.info(f"open_orders: {open_orders=}")
    return open_orders


def fetch_order_history(api: GrvtCcxt) -> dict:
    order_history: dict = api.fetch_order_history(
        params={"kind": "PERPETUAL", "limit": 3},
    )
    logger.info(f"order_history: {order_history=}")
    return order_history

def fetch_funding_history(api: GrvtCcxt) -> dict:
    start_date: datetime = datetime.strptime("2025-05-01T00:00:00Z", "%Y-%m-%dT%H:%M:%SZ")
    funding_history: dict = api.fetch_funding_rate_history(
        symbol="BTC_USDT_Perp",
        since=int(start_date.timestamp() * DURATION_SECOND_IN_NSEC),  # Convert to nanoseconds
        limit=500,
    )
    results: list = funding_history.get("result", [])
    if results:
        logger.info(f"funding_history: START={results[0]}")
        logger.info(f"funding_history: END={results[-1]}")
    else:
        logger.info(f"funding_history: No results found in {funding_history=}")
    return funding_history


def cancel_orders(api: GrvtCcxt, open_orders: list) -> int:
    FN = "cancel_orders"
    order_count = 0
    for order_dict in open_orders:
        client_order_id = order_dict["metadata"].get("client_order_id")
        if client_order_id:
            # Cancel
            logger.info(f"{FN} cancel order by id:{order_dict['order_id']}")
            success = api.cancel_order(
                id=order_dict["order_id"], params={"time_to_live_ms": "1000"}
            )
            order_count += int(success)
        else:
            logger.warning(f"{FN} client_order_id not found in {order_dict=}")
    return order_count

def show_derisk_mm_ratios(api: GrvtCcxt, keyword: str) -> None:
    """Show the current derisking market making ratios."""
    FN = "show_derisk_mm_ratios"
    acc_summary = api.get_account_summary(type="sub-account")
    maintenance_margin = acc_summary.get("maintenance_margin")
    derisk_margin = acc_summary.get("derisk_margin")
    derisk_ratio = acc_summary.get("derisk_to_maintenance_margin_ratio")
    logger.info(f"{FN} {keyword} {maintenance_margin=}")
    logger.info(f"{FN} {keyword} {derisk_margin=}")
    logger.info(f"{FN} {keyword} {derisk_ratio=}")
    logger.info(f"sub-account summary:\n{acc_summary}")

def set_derisk_mm_ratio(api: GrvtCcxt, ratio: str = "1.4") -> None:
    """Set the derisking market making ratio."""
    FN = f"set_derisk_mm_ratio {ratio=}"
    logger.info(f"{FN} START")
    show_derisk_mm_ratios(api, "BEFORE")
    api.set_derisk_mm_ratio(ratio)
    show_derisk_mm_ratios(api, "AFTER")


def cancel_all_orders(api: GrvtCcxt) -> bool:
    FN = "cancel_all_orders"
    logger.info(f"{FN} START")
    cancel_response = api.cancel_all_orders()
    logger.info(f"{FN} {cancel_response=}")
    return cancel_response


def print_instruments(api: GrvtCcxt):
    logger.info("print_instruments: START")
    if not api.markets:
        return
    for market in list(api.markets.values())[:3]:
        logger.info(f"{market=}")
        instrument = market["instrument"]
        logger.info(f"fetch_market: {instrument=}, {api.fetch_market(instrument)}")
        logger.info(f"fetch_mini_ticker: {instrument=}, {api.fetch_mini_ticker(instrument)}")
        logger.info(f"fetch_ticker: {instrument=}, {api.fetch_ticker(instrument)}")
        logger.info(f"fetch_order_book {instrument=}, {api.fetch_order_book(instrument, limit=10)}")
        logger.info(
            f"fetch_recent_trades {instrument=}, {api.fetch_recent_trades(instrument, limit=5)}"
        )
        logger.info(f"fetch_trades {instrument=}, {api.fetch_trades(instrument, limit=5)}")
        logger.info(
            f"fetch_funding_rate_history {instrument=}, "
            f"{api.fetch_funding_rate_history(instrument, limit=5)}"
        )
        for type in ["TRADE", "MARK", "INDEX", "MID"]:
            ohlc = api.fetch_ohlcv(
                instrument, timeframe="5m", limit=5, params={"candle_type": type}
            )
            logger.info(f"fetch_ohlcv {type} {instrument=}, {ohlc}")


def send_order(api: GrvtCcxt, side: GrvtOrderSide, client_order_id: int) -> dict:
    price = 94_000 if side == "buy" else 95_000
    send_order_response: dict = api.create_order(
        symbol="BTC_USDT_Perp",
        order_type="limit",
        side=side,
        amount=0.01,
        price=price,
        params={"client_order_id": client_order_id},
    )
    logger.info(f"send order: {send_order_response=} {client_order_id=}")
    return send_order_response


def send_mkt_order(
    api: GrvtCcxt, symbol: str, side: GrvtOrderSide, amount: Decimal, client_order_id: int
) -> dict:
    send_order_response: dict = api.create_order(
        symbol=symbol,
        order_type="market",
        side=side,
        amount=amount,
        params={"client_order_id": client_order_id},
    )
    logger.info(f"send mkt order: {send_order_response=} {client_order_id=}")
    return send_order_response


# Test scenarios, called by the __main__ test routine
def send_fetch_order(api: GrvtCcxt):
    client_order_id = rand_uint32()
    _ = send_order(api, side="buy", client_order_id=client_order_id)
    time.sleep(0.1)
    order_status = api.fetch_order(
        id=None,
        params={"client_order_id": client_order_id},
    )
    logger.info(f"result of fetch_order: {order_status=}")


def check_cancel_check_orders(api: GrvtCcxt):
    logger.info("check_cancel_check_orders: START")
    open_orders = get_open_orders(api)
    if open_orders:
        cancel_orders(api, open_orders)
        get_open_orders(api)


def fetch_my_trades(api: GrvtCcxt):
    logger.info("fetch_my_trades: START")
    my_trades = api.fetch_my_trades(
        symbol="BTC_USDT_Perp",
        limit=10,
        params={},
    )
    logger.info(f"my_trades: num trades:{len(my_trades)}")
    logger.info(f"my_trades: {my_trades=}")


def cancel_send_order(api: GrvtCcxt):
    FN = "cancel_send_order"
    logger.info(f"{FN}: START")
    client_order_id: int = rand_uint32()
    logger.info(f"{FN} cancel order by {client_order_id=}")
    result = api.cancel_order(
        params={"client_order_id": client_order_id, "time_to_live_ms": "1000"}
    )
    logger.info(f"{FN} cancel_order: {result=}")
    order_response = send_mkt_order(
        api,
        symbol="BTC_USDT_Perp",
        side="sell",
        amount=Decimal("0.01"),
        client_order_id=client_order_id,
    )
    if order_response:
        time.sleep(0.1)
        # Get status
        logger.info(f"{FN} fetch_order by {client_order_id=}")
        order_status = api.fetch_order(params={"client_order_id": client_order_id})
        logger.info(f"{FN} {order_status=}")
    else:
        logger.warning(f"{FN}: order_response is None")


def send_fetch_mkt_order(api: GrvtCcxt):
    FN = "send_fetch_mkt_order"
    logger.info(f"{FN}: START")
    client_order_id: int = rand_uint32()
    order_response = send_mkt_order(
        api,
        symbol="BTC_USDT_Perp",
        side="sell",
        amount=Decimal("0.01"),
        client_order_id=client_order_id,
    )
    if order_response:
        time.sleep(0.1)
        # Get status
        logger.info(f"{FN} fetch_order by {client_order_id=}")
        order_status = api.fetch_order(params={"client_order_id": client_order_id})
        logger.info(f"{FN} {order_status=}")
    else:
        logger.warning(f"{FN}: order_response is None")


def print_markets(api: GrvtCcxt):
    logger.info("print_markets: START")
    if api.markets:
        logger.info(f"MARKETS:{len(api.markets)}")
        for market in api.markets.values():
            logger.info(f"MARKET:{market}")


def fetch_all_markets(api: GrvtCcxt):
    logger.info("fetch_all_markets: START")
    instruments = api.fetch_all_markets()
    logger.info(f"fetch_all_markets: num instruments={len(instruments)}")


def print_account_summary(api: GrvtCcxt):
    try:
        logger.info(f"sub-account summary:\n{api.get_account_summary(type='sub-account')}")
        logger.info(f"funding-account summary:\n{api.get_account_summary(type='funding')}")
        logger.info(f"aggregated-account summary:\n{api.get_account_summary(type='aggregated')}")
        logger.info(f"fetch_balance:\n{api.fetch_balance()}")
    except Exception as e:
        logger.error(f"account summary failed: {e}")


def print_account_history(api: GrvtCcxt):
    try:
        hist = api.fetch_account_history(params={})
        logger.info(f"account history:\n{hist}")
    except Exception as e:
        logger.error(f"account history failed: {e}")


def print_positions(api: GrvtCcxt):
    try:
        logger.info(f"positions:\n{api.fetch_positions(symbols=['BTC_USDT_Perp'])}")
    except Exception as e:
        logger.error(f"positions failed: {e}")


def print_description(api: GrvtCcxt):
    try:
        logger.info(f"print_description: {api.describe()}")
    except Exception as e:
        logger.error(f"print_description failed: {e}")


def test_grvt_ccxt():
    params = {
        "api_key": os.getenv("GRVT_API_KEY"),
        "trading_account_id": os.getenv("GRVT_TRADING_ACCOUNT_ID"),
        "private_key": os.getenv("GRVT_PRIVATE_KEY"),
    }
    env = GrvtEnv(os.getenv("GRVT_ENV", "testnet"))
    test_api = GrvtCcxt(env, logger, parameters=params, order_book_ccxt_format=True)
    function_list = [
        print_description,
        # -------- MARKET related
        fetch_all_markets,
        print_markets,
        print_instruments,
        print_account_summary,
        print_account_history,
        # print_positions,
        # -------- TRADE related
        # fetch_my_trades,
        fetch_order_history,
        fetch_funding_history,
        # # -------- order related
        send_fetch_order,
        fetch_my_trades,
        print_positions,
        check_cancel_check_orders,
        cancel_send_order,
        send_fetch_mkt_order,
        get_open_orders,
        send_fetch_order,
        get_open_orders,
        cancel_all_orders,
        get_open_orders,
        # Derisk MM ratio
        set_derisk_mm_ratio,
    ]
    for f in function_list:
        try:
            f(test_api)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {e} {traceback.format_exc()}")
    validate_return_values(test_api, "test_results_sync.csv")


if __name__ == "__main__":
    test_grvt_ccxt()
