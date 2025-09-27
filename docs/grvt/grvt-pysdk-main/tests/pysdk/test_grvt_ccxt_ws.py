import asyncio
import os
import signal
import sys
import traceback

from pysdk.grvt_ccxt_env import GrvtEnv, GrvtWSEndpointType
from pysdk.grvt_ccxt_logging_selector import logger
from pysdk.grvt_ccxt_types import GrvtOrderSide
from pysdk.grvt_ccxt_utils import rand_uint32
from pysdk.grvt_ccxt_ws import GrvtCcxtWS


# Utility functions , not called directly by the __main__ test routine
async def callback_general(message: dict) -> None:
    message.get("params", {}).get("channel")
    logger.info(f"callback_general(): message:{message}")


async def grvt_ws_subscribe(api: GrvtCcxtWS, args_list: dict) -> None:
    """Subscribes to Websocket channels/feeds in args list."""
    for stream, (callback, ws_endpoint_type, params) in args_list.items():
        logger.info(f"Subscribing to {stream} {params=}")
        await api.subscribe(
            stream=stream,
            callback=callback,
            ws_end_point_type=ws_endpoint_type,
            params=params,
        )
        await asyncio.sleep(0)


async def subscribe(loop) -> GrvtCcxtWS:
    """Subscribe to Websocket channels and feeds."""
    params = {
        "api_key": os.getenv("GRVT_API_KEY"),
        "trading_account_id": os.getenv("GRVT_TRADING_ACCOUNT_ID"),
        "api_ws_version": os.getenv("GRVT_WS_STREAM_VERSION", "v1"),
    }
    if os.getenv("GRVT_PRIVATE_KEY"):
        params["private_key"] = os.getenv("GRVT_PRIVATE_KEY")
    env = GrvtEnv(os.getenv("GRVT_ENV", "testnet"))

    test_api = GrvtCcxtWS(env, loop, logger, parameters=params)
    await test_api.initialize()
    pub_args_dict = {
        # ********* Market Data *********
        "mini.s": (
            callback_general,
            None,  # use deafult endpoint
            {"instrument": "BTC_USDT_Perp"},
        ),
        "mini.d": (
            callback_general,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            {"instrument": "BTC_USDT_Perp", "rate": 0},
        ),
        "ticker.s": (
            callback_general,
            None,  # use deafult endpoint
            {"instrument": "BTC_USDT_Perp"},
        ),
        "ticker.d": (
            callback_general,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            {"instrument": "BTC_USDT_Perp"},
        ),
        "book.s": (
            callback_general,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            {"instrument": "BTC_USDT_Perp"},
        ),
        "book.d": (
            callback_general,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            {"instrument": "BTC_USDT_Perp"},
        ),
        "trade": (
            callback_general,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            {"instrument": "BTC_USDT_Perp"},
        ),
        "candle": (
            callback_general,
            GrvtWSEndpointType.MARKET_DATA_RPC_FULL,
            {
                "instrument": "BTC_USDT_Perp",
                "interval": "CI_1_M",
                "type": "TRADE",
            },
        ),
    }
    prv_args_dict = {
        # ********* Trade Data *********
        "position": (
            callback_general,
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
            {},
        ),
        "order": (
            callback_general,
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
            {
                "instrument": "BTC_USDT_Perp",
            },
        ),
        "cancel": (
            callback_general,
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
            {},
        ),
        "state": (
            callback_general,
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
            {
                "instrument": "BTC_USDT_Perp",
            },
        ),
        "fill": (
            callback_general,
            GrvtWSEndpointType.TRADE_DATA_RPC_FULL,
            {
                "instrument": "BTC_USDT_Perp",
            },
        ),
        "deposit": (callback_general, GrvtWSEndpointType.TRADE_DATA, {}),
        "transfer": (callback_general, GrvtWSEndpointType.TRADE_DATA, {}),
        "withdrawal": (callback_general, GrvtWSEndpointType.TRADE_DATA, {}),
    }
    try:
        if "private_key" in params:
            await grvt_ws_subscribe(test_api, {**pub_args_dict, **prv_args_dict})
        else:  # not private_key , subscribe to public feeds only
            await grvt_ws_subscribe(test_api, pub_args_dict)
    except Exception as e:
        logger.error(f"Error in grvt_ws_subscribe: {e} {traceback.format_exc()}")
    return test_api


async def rpc_create_order(
    test_api: GrvtCcxtWS, side: GrvtOrderSide, price: str, client_order_id: str = ""
) -> str:
    if test_api and test_api._private_key:
        # Send order
        if not client_order_id:
            client_order_id = str(rand_uint32())
        payload = await test_api.rpc_create_order(
            symbol="BTC_USDT_Perp",
            order_type="limit",
            side=side,
            amount=0.001,
            price=price,
            params={
                "client_order_id": client_order_id,
                #    "time_in_force": "IMMEDIATE_OR_CANCEL",
                "time_in_force": "GOOD_TILL_TIME",
            },
        )
        logger.info(f"rpc_create_order: {payload=}")
        return client_order_id
    return ""


async def rpc_create_mkt_order(
    test_api: GrvtCcxtWS, symbol: str, side: GrvtOrderSide, client_order_id: str = ""
) -> str:
    FN = "rpc_create_mkt_order"
    if test_api and test_api._private_key:
        # Send order
        if not client_order_id:
            client_order_id = str(rand_uint32())
        payload = await test_api.rpc_create_order(
            symbol=symbol,
            order_type="market",
            side=side,
            amount=0.001,
            params={
                "client_order_id": client_order_id,
                "time_in_force": "GOOD_TILL_TIME",
            },
        )
        logger.info(f"{FN}: {payload=}")
        return client_order_id
    return ""


async def rpc_fetch_order(test_api: GrvtCcxtWS, client_order_id: str) -> None:
    if test_api and test_api._private_key:
        # Send order
        payload = await test_api.rpc_fetch_order(
            params={
                "client_order_id": client_order_id,
            },
        )
        logger.info(f"rpc_fetch_order: {payload=}")


async def rpc_fetch_open_orders(test_api: GrvtCcxtWS) -> None:
    if test_api and test_api._private_key:
        # Send order
        payload: dict = await test_api.rpc_fetch_open_orders()
        logger.info(f"rpc_fetch_open_orders: {payload=}")


async def rpc_cancel_order(
    test_api: GrvtCcxtWS, client_order_id: str, time_to_live_ms: str = ""
) -> None:
    if test_api and test_api._private_key:
        # Send order
        params: dict = {"client_order_id": client_order_id}
        if time_to_live_ms:
            params["time_to_live_ms"] = time_to_live_ms
        payload = await test_api.rpc_cancel_order(params=params)
        logger.info(f"rpc_cancel_order: {payload=}")


async def rpc_cancel_all_orders(test_api: GrvtCcxtWS) -> None:
    if test_api and test_api._private_key:
        # Send order
        payload: dict = await test_api.rpc_cancel_all_orders()
        logger.info(f"rpc_cancel_all_orders: {payload=}")


async def cancel_send_rpc_order(test_api: GrvtCcxtWS) -> None:
    FN = "cancel_send_rpc_order"
    """Cancels order then sends an order to be canceled."""
    if test_api and test_api._private_key:
        cloid = str(rand_uint32())
        logger.info(f"{FN} {cloid=}")
        await rpc_cancel_order(test_api, cloid, time_to_live_ms="0")
        await asyncio.sleep(1)
        await rpc_cancel_order(test_api, cloid, time_to_live_ms="5000")
        await asyncio.sleep(0.01)
        await rpc_create_mkt_order(
            test_api, symbol="BTC_USDT_Perp", side="buy", client_order_id=cloid
        )
        await asyncio.sleep(0.01)
        await rpc_fetch_order(test_api, cloid)


async def send_check_cancel_rpc_order(test_api: GrvtCcxtWS) -> None:
    if test_api and test_api._private_key:
        # Send order
        cloid = await rpc_create_order(test_api, side="buy", price="60000")
        if cloid:
            await rpc_fetch_open_orders(test_api)
            await rpc_fetch_order(test_api, cloid)
            await asyncio.sleep(5)
            await rpc_cancel_order(test_api, cloid)
        cloid = await rpc_create_order(test_api, side="sell", price="70000")
        if cloid:
            await rpc_fetch_open_orders(test_api)
            await rpc_fetch_order(test_api, cloid)
            await asyncio.sleep(5)
            await rpc_cancel_all_orders(test_api)


async def send_rpc_messages(test_api: GrvtCcxtWS) -> None:
    """Sends test RPC messages for send/fetch/cancel orders."""
    await send_check_cancel_rpc_order(test_api)
    await cancel_send_rpc_order(test_api)


async def shutdown(loop, test_api: GrvtCcxtWS) -> None:
    """Clean up resources and stop the bot gracefully."""
    import time
    logger.info("Shutting down gracefully...")
    if test_api:
        for stream, message in test_api._last_message.items():
            logger.info(f"Last message: {stream=} {message=}")
    logger.info("Delete GrvtCcxtWS...")
    del test_api  # Close the websocket connection and session
    time.sleep(3)  # Allow time for cleanup
    await asyncio.sleep(5)  # Allow time for cleanup
    logger.info("Cancelling all tasks...")
    tasks = [t for t in asyncio.all_tasks(loop) if t is not asyncio.current_task(loop)]
    _ = [task.cancel() for task in tasks]
    logger.info(f"Cancelling {len(tasks)=}")
    await asyncio.gather(*tasks, return_exceptions=True)
    logger.info("Shutdown complete.")
    sys.exit(0)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    test_api = loop.run_until_complete(subscribe(loop))
    if not test_api:
        logger.error("Failed to subscribe to Websocket channels.")
        sys.exit(1)
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(
            sig, lambda: asyncio.create_task(shutdown(loop, test_api))
        )
    loop.run_until_complete(asyncio.sleep(5))
    loop.run_until_complete(send_rpc_messages(test_api))
    loop.run_forever()
    loop.close()
