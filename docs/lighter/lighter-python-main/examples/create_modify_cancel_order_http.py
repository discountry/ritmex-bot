import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()
    client.check_client()

    # Note: change this to 2048 to trade spot ETH. Make sure you have at least 0.1 ETH to trade spot.
    market_index = 0

    # create order
    api_key_index, nonce = client.nonce_manager.next_nonce()
    tx, tx_hash, err = await client.create_order(
        market_index=market_index,
        client_order_index=123,
        base_amount=1000,  # 0.1 ETH
        price=4050_00,  # $4050
        is_ask=True,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce,
        api_key_index=api_key_index,
    )
    print(f"Create Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    ## modify order
    # use the same API key so the TX goes after the create order TX
    api_key_index, nonce = client.nonce_manager.next_nonce(api_key_index)
    tx, tx_hash, err = await client.modify_order(
        market_index=market_index,
        order_index=123,
        base_amount=1100,  # 0.11 ETH
        price=4100_00,  # $4100
        trigger_price=0,
        nonce=nonce,
        api_key_index=api_key_index,
    )
    print(f"Modify Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    ## cancel order
    # use the same API key so the TX goes after the modify order TX
    api_key_index, nonce = client.nonce_manager.next_nonce(api_key_index)
    tx, tx_hash, err = await client.cancel_order(
        market_index=market_index,
        order_index=123,
        nonce=nonce,
        api_key_index=api_key_index,
    )
    print(f"Cancel Order {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
