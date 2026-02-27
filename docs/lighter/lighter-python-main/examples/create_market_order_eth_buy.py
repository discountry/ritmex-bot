import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()
    client.check_client()

    # Note: change this to 2048 to trade spot ETH. Make sure you have at least 0.1 ETH to trade spot.
    market_index = 0

    tx, tx_hash, err = await client.create_market_order(
        market_index=market_index,
        client_order_index=0,
        base_amount=1000,  # 0.1 ETH
        avg_execution_price=4000_00,  # $4000 -- worst acceptable price for the order
        is_ask=False,
    )
    print(f"Create Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
