import asyncio
import os
import traceback

from pysdk.grvt_ccxt_env import GrvtEnv
from pysdk.grvt_ccxt_logging_selector import logger
from pysdk.grvt_ccxt_pro import GrvtCcxtPro


async def call_vault_manager_investor_history(api: GrvtCcxtPro):
    FN = "call_vault_manager_investor_history"
    logger.info(f"{FN}: START")
    try:
        history = await api.fetch_vault_manager_investor_history()
        # Expect dict with result key and list of dicts with history items
        # [{'event_time': '1752057360756255849', 'off_chain_account_id': 'ACC:2s**fW',
        # 'vault_id': '2002239639', 'type': 'VAULT_REDEEM', 'price': '0.998912', 'size': '1900.0',
        # 'realized_pnl': '-0.077452', 'performance_fee': '0.0'}, ...]
        logger.info(f"{FN}: {history=}")
    except Exception as e:
        logger.error(f"{FN} failed: {e}")


async def call_vault_redemption_queue(api: GrvtCcxtPro):
    FN = "call_vault_redemption_queue"
    logger.info(f"{FN}: START")
    try:
        redemption_queue = await api.fetch_vault_redemption_queue()
        logger.info(f"{FN}: {redemption_queue=}")
    except Exception as e:
        logger.error(f"{FN} failed: {e}")


async def grvt_ccxt_vault_pro():
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
        call_vault_manager_investor_history,
        call_vault_redemption_queue,
    ]
    for f in function_list:
        try:
            await f(test_api)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {e} {traceback.format_exc()}")


def test_grvt_ccxt_vault_pro() -> None:
    asyncio.run(grvt_ccxt_vault_pro())


if __name__ == "__main__":
    test_grvt_ccxt_vault_pro()
