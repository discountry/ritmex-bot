import asyncio
import logging
import lighter

logging.basicConfig(level=logging.DEBUG)

# The API_KEY_PRIVATE_KEY provided belongs to a dummy account registered on Testnet.
# It was generated using the setup_system.py script, and serves as an example.
BASE_URL = "https://testnet.zklighter.elliot.ai"
API_KEY_PRIVATE_KEY = "0xe0fa55e11d6b5575d54c0500bd2f3b240221ae90241e3b573f2307e27de20c04ea628de3f1936e56"
ACCOUNT_INDEX = 22
API_KEY_INDEX = 3


def trim_exception(e: Exception) -> str:
    return str(e).strip().split("\n")[-1]


async def main():
    client = lighter.SignerClient(
        url=BASE_URL,
        private_key=API_KEY_PRIVATE_KEY,
        account_index=ACCOUNT_INDEX,
        api_key_index=API_KEY_INDEX,
    )

    # tx = await client.create_market_order_limited_slippage(market_index=0, client_order_index=0, base_amount=30000000,
    #                                                        max_slippage=0.001, is_ask=True)
    tx = await client.create_market_order_if_slippage(market_index=0, client_order_index=0, base_amount=30000000,
                                                           max_slippage=0.01, is_ask=True, ideal_price=300000)
    print("Create Order Tx:", tx)
    await client.close()


if __name__ == "__main__":
    asyncio.run(main())
