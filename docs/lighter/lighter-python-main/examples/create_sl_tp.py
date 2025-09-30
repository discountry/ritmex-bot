import asyncio
import logging
import lighter

logging.basicConfig(level=logging.DEBUG)

# The API_KEY_PRIVATE_KEY provided belongs to a dummy account registered on Testnet.
# It was generated using the setup_system.py script, and servers as an example.
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

    tx = await client.create_tp_order(
        market_index=0,
        client_order_index=0,
        base_amount=1000,  # 0.1 ETH
        trigger_price=500000,
        price=500000,
        is_ask=False
    )
    print("Create Order Tx:", tx)


    tx = await client.create_sl_order(
        market_index=0,
        client_order_index=0,
        base_amount=1000,  # 0.1 ETH
        trigger_price=500000,
        price=500000,
        is_ask=False
    )
    print("Create Order Tx:", tx)

    tx = await client.create_tp_limit_order(
        market_index=0,
        client_order_index=0,
        base_amount=1000,  # 0.1 ETH
        trigger_price=500000,
        price=500000,
        is_ask=False
    )

    tx = await client.create_sl_limit_order(
        market_index=0,
        client_order_index=0,
        base_amount=1000,  # 0.1 ETH
        trigger_price=500000,
        price=500000,
        is_ask=False
    )
    print("Create Order Tx:", tx)
    await client.close()


if __name__ == "__main__":
    asyncio.run(main())
