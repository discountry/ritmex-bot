import asyncio
import os
import traceback
from datetime import datetime
from decimal import Decimal

from pysdk.grvt_ccxt_env import GrvtEnv
from pysdk.grvt_ccxt_logging_selector import logger
from pysdk.grvt_ccxt_pro import GrvtCcxtPro
from pysdk.grvt_ccxt_test_utils import validate_return_values
from pysdk.grvt_ccxt_types import DURATION_SECOND_IN_NSEC, GrvtOrderSide
from pysdk.grvt_ccxt_utils import rand_uint32


# Utility functions , not called directly by the __main__ test routine
async def get_open_orders(api: GrvtCcxtPro) -> list[dict]:
    open_orders = await api.fetch_open_orders(

        symbol="BTC_USDT_Perp",
        params={"kind": "PERPETUAL"},
    )
    logger.info(f"open_orders: {open_orders=}")
    return open_orders


async def fetch_order_history(api: GrvtCcxtPro) -> dict:
    order_history: dict = await api.fetch_order_history(
        params={"kind": "PERPETUAL", "limit": 3},
    )
    logger.info(f"order_history: {order_history=}")
    return order_history

async def fetch_funding_history(api: GrvtCcxtPro) -> dict:
    start_date: datetime = datetime.strptime("2025-05-01T00:00:00Z", "%Y-%m-%dT%H:%M:%SZ")
    funding_history: dict = await api.fetch_funding_rate_history(
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


async def cancel_orders(api: GrvtCcxtPro, open_orders: list) -> int:
    FN = "cancel_orders"
    logger.info(f"{FN} START")
    order_count: int = 0
    for order_dict in open_orders:
        client_order_id = order_dict["metadata"].get("client_order_id")
        if client_order_id:
            # Cancel
            logger.info(f"{FN} cancel order by id:{order_dict['order_id']}")
            await api.cancel_order(id=order_dict["order_id"])
            order_count += 1
        else:
            logger.warning(f"{FN} client_order_id not found in {order_dict=}")
    return order_count

async def show_derisk_mm_ratios(api: GrvtCcxtPro, keyword: str) -> None:
    """Show the current derisking market making ratios."""
    FN = "show_derisk_mm_ratios"
    acc_summary = await api.get_account_summary(type="sub-account")
    maintenance_margin = acc_summary.get("maintenance_margin")
    derisk_margin = acc_summary.get("derisk_margin")
    derisk_ratio = acc_summary.get("derisk_to_maintenance_margin_ratio")
    logger.info(f"{FN} {keyword} {maintenance_margin=}")
    logger.info(f"{FN} {keyword} {derisk_margin=}")
    logger.info(f"{FN} {keyword} {derisk_ratio=}")
    logger.info(f"sub-account summary:\n{acc_summary}")

async def set_derisk_mm_ratio(api: GrvtCcxtPro, ratio: str = "1.5") -> None:
    """Set the derisking market making ratio."""
    FN = f"set_derisk_mm_ratio {ratio=}"
    logger.info(f"{FN} START")
    await show_derisk_mm_ratios(api, "BEFORE")
    await api.set_derisk_mm_ratio(ratio)
    await show_derisk_mm_ratios(api, "AFTER")

async def cancel_all_orders(api: GrvtCcxtPro) -> bool:
    FN = "cancel_all_orders"
    logger.info(f"{FN} START")
    cancel_response = await api.cancel_all_orders()
    logger.info(f"{FN} {cancel_response=}")
    return cancel_response


async def print_instruments(api: GrvtCcxtPro):
    logger.info("print_instruments: START")
    if not api.markets:
        return
    for market in list(api.markets.values())[:3]:
        logger.info(f"{market=}")
        instrument = market["instrument"]
        logger.info(f"fetch_mini_ticker: {instrument=}, {await api.fetch_mini_ticker(instrument)}")
        logger.info(f"fetch_ticker: {instrument=}, {await api.fetch_ticker(instrument)}")
        logger.info(
            f"fetch_order_book {instrument=}, {await api.fetch_order_book(instrument, limit=10)}"
        )
        logger.info(
            f"fetch_recent_trades {instrument=}, "
            f"{await api.fetch_recent_trades(instrument, limit=7)}"
        )
        logger.info(f"fetch_trades {instrument=}, {await api.fetch_trades(instrument, limit=5)}")
        logger.info(
            f"fetch_funding_rate_history {instrument=}, "
            f"{await api.fetch_funding_rate_history(instrument, limit=5)}"
        )
        for type in ["TRADE", "MARK", "INDEX", "MID"]:
            ohlc = await api.fetch_ohlcv(
                instrument, timeframe="1m", limit=5, params={"candle_type": type}
            )
            logger.info(f"fetch_ohlcv {type} {instrument=}, {ohlc}")


async def send_order(api: GrvtCcxtPro, side: GrvtOrderSide, client_order_id: int) -> dict:
    price = 64_000 if side == "buy" else 65_000
    send_order_response = await api.create_order(
        symbol="BTC_USDT_Perp",
        order_type="limit",
        side=side,
        amount=0.01,
        price=price,
        params={"client_order_id": client_order_id},
    )
    logger.info(f"send order: {send_order_response=} {client_order_id=}")
    return send_order_response


# Test scenarios, called by the __main__ test routine
async def send_fetch_order(api: GrvtCcxtPro):
    client_order_id = rand_uint32()
    _ = await send_order(api, side="buy", client_order_id=client_order_id)
    order_status = await api.fetch_order(
        id=None,
        params={"client_order_id": client_order_id},
    )
    logger.info(f"result of fetch_order: {order_status=}")


async def send_mkt_order(
    api: GrvtCcxtPro, symbol: str, side: GrvtOrderSide, amount: Decimal, client_order_id: int
) -> dict:
    send_order_response = await api.create_order(
        symbol=symbol,
        order_type="market",
        side=side,
        amount=amount,
        params={"client_order_id": client_order_id},
    )
    logger.info(f"send mkt order: {send_order_response=} {client_order_id=}")
    return send_order_response


async def check_cancel_check_orders(api: GrvtCcxtPro):
    logger.info("check_cancel_check_orders: START")
    open_orders = await get_open_orders(api)
    if open_orders:
        await cancel_orders(api, open_orders)
        await get_open_orders(api)


async def fetch_my_trades(api: GrvtCcxtPro):
    logger.info("fetch_my_trades: START")
    my_trades = await api.fetch_my_trades(
        symbol="BTC_USDT_Perp",
        limit=10,
        params={},
    )
    logger.info(f"my_trades: num trades:{len(my_trades)}")
    logger.info(f"my_trades: {my_trades=}")


async def cancel_send_order(api: GrvtCcxtPro):
    FN = "cancel_send_order"
    logger.info(f"{FN}: START")
    client_order_id: int = rand_uint32()
    logger.info(f"{FN} cancel order by {client_order_id=}")
    result = await api.cancel_order(
        params={"client_order_id": client_order_id, "time_to_live_ms": "1000"}
    )
    logger.info(f"{FN} cancel_order: {result=}")
    order_response = await send_mkt_order(
        api,
        symbol="BTC_USDT_Perp",
        side="sell",
        amount=Decimal("0.01"),
        client_order_id=client_order_id,
    )
    if order_response:
        # Get status
        logger.info(f"{FN} fetch_order by {client_order_id=}")
        order_status = await api.fetch_order(params={"client_order_id": client_order_id})
        logger.info(f"{FN} {order_status=}")


async def print_markets(api: GrvtCcxtPro):
    logger.info("print_markets: START")
    if api.markets:
        logger.info(f"MARKETS:{len(api.markets)}")
        for market in api.markets.values():
            logger.info(f"MARKET:{market}")


async def fetch_all_markets(api: GrvtCcxtPro):
    logger.info("fetch_all_markets: START")
    instruments = await api.fetch_all_markets()
    logger.info(f"fetch_all_markets: num instruments={len(instruments)}")


async def print_account_summary(api: GrvtCcxtPro):
    try:
        logger.info("print_account_summary: START")
        logger.info(f"sub-account summary:\n{await api.get_account_summary(type='sub-account')}")
        logger.info(f"funding-account summary:\n{await api.get_account_summary(type='funding')}")
        logger.info(
            f"aggregated-account summary:\n{await api.get_account_summary(type='aggregated')}"
        )
        logger.info(f"fetch_balance:\n{await api.fetch_balance()}")
    except Exception as e:
        logger.error(f"account summary failed: {e}")


async def print_account_history(api: GrvtCcxtPro):
    try:
        hist = await api.fetch_account_history(params={})
        logger.info(f"account history:\n{hist}")
    except Exception as e:
        logger.error(f"account history failed: {e}")


async def print_positions(api: GrvtCcxtPro):
    try:
        logger.info(f"positions:\n{await api.fetch_positions(symbols=['BTC_USDT_Perp'])}")
    except Exception as e:
        logger.error(f"positions failed: {e}")


async def print_description(api: GrvtCcxtPro):
    try:
        logger.info(f"print_description: {api.describe()}")
    except Exception as e:
        logger.error(f"print_description failed: {e}")


async def grvt_ccxt_pro():
    params = {
        "api_key": os.getenv("GRVT_API_KEY"),
        "trading_account_id": os.getenv("GRVT_TRADING_ACCOUNT_ID"),
        "private_key": os.getenv("GRVT_PRIVATE_KEY"),
    }
    env = GrvtEnv(os.getenv("GRVT_ENV", "testnet"))
    test_api = GrvtCcxtPro(env, logger, parameters=params, order_book_ccxt_format=True)
    await test_api.load_markets()
    await asyncio.sleep(2)
    function_list = [
        print_description,
        # -------- MARKET related
        fetch_all_markets,
        print_markets,
        print_instruments,
        print_account_summary,
        print_account_history,
        print_positions,
        # Order / Trade history
        fetch_my_trades,
        fetch_order_history,
        fetch_funding_history,
        # Trade related
        send_fetch_order,
        check_cancel_check_orders,
        fetch_my_trades,
        fetch_order_history,
        print_positions,
        cancel_send_order,
        get_open_orders,
        send_fetch_order,
        get_open_orders,
        cancel_all_orders,
        get_open_orders,
        set_derisk_mm_ratio,
    ]
    for f in function_list:
        try:
            await f(test_api)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {e} {traceback.format_exc()}")
    validate_return_values(test_api, "test_results.csv")


def test_grvt_ccxt_pro() -> None:
    asyncio.run(grvt_ccxt_pro())


if __name__ == "__main__":
    test_grvt_ccxt_pro()
