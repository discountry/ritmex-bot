import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    # tx = await client.create_market_order_limited_slippage(market_index=0, client_order_index=0, base_amount=30000000,
    #                                                        max_slippage=0.001, is_ask=True)
    tx = await client.create_market_order_if_slippage(
        market_index=0,  # ETH
        client_order_index=0,
        base_amount=1000,  # 0.1 ETH
        max_slippage=0.01,  # 1%
        is_ask=True,
        ideal_price=300000  # $3000
    )

    print("Create Order Tx:", tx)
    await client.close()


if __name__ == "__main__":
    asyncio.run(main())
