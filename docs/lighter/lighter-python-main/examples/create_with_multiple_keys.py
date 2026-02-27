import time
import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    # create 20 orders. The client will use as many API keys as it was configured.

    for i in range(20):
        res_tuple = await client.create_order(
            market_index=0,
            client_order_index=123 + i,
            base_amount=1000 + i,  # 0.1 ETH + dust
            price=3850_00 + i,
            is_ask=True,
            order_type=client.ORDER_TYPE_LIMIT,
            time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
            reduce_only=False,
            trigger_price=0,
        )
        print(res_tuple)

    # wait for orders to be created
    time.sleep(1)
    await client.cancel_all_orders(time_in_force=client.CANCEL_ALL_TIF_IMMEDIATE, timestamp_ms=0)


if __name__ == "__main__":
    asyncio.run(main())
