import websockets
import asyncio
from utils import default_example_setup, ws_send_tx


# this example does the same thing as the create_modify_cancel_order.py example, but sends the TX over WS instead of HTTP
async def main():
    client, api_client, ws_client_promise = default_example_setup()
    client.check_client()

    # set up WS client and print a connected message
    ws_client: websockets.ClientConnection = await ws_client_promise
    print("Received:", await ws_client.recv())

    # Note: change this to 2048 to trade spot ETH. Make sure you have at least 0.1 ETH to trade spot.
    market_index = 0

    # create order
    api_key_index, nonce = client.nonce_manager.next_nonce()
    tx_type, tx_info, tx_hash, err = client.sign_create_order(
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
    if err is not None:
        raise Exception(err)
    await ws_send_tx(ws_client, tx_type, tx_info, tx_hash)

    ## modify order
    # use the same API key so the TX goes after the create order TX
    api_key_index, nonce = client.nonce_manager.next_nonce(api_key_index)
    tx_type, tx_info, tx_hash, err = client.sign_modify_order(
        market_index=market_index,
        order_index=123,
        base_amount=1100,  # 0.11 ETH
        price=4100_00,  # $4100
        trigger_price=0,
        nonce=nonce,
        api_key_index=api_key_index,
    )
    if err is not None:
        raise Exception(err)
    await ws_send_tx(ws_client, tx_type, tx_info, tx_hash)

    ## cancel order
    # use the same API key so the TX goes after the modify order TX
    api_key_index, nonce = client.nonce_manager.next_nonce(api_key_index)
    tx_type, tx_info, tx_hash, err = client.sign_cancel_order(
        market_index=market_index,
        order_index=123,
        nonce=nonce,
        api_key_index=api_key_index,
    )
    if err is not None:
        raise Exception(err)
    await ws_send_tx(ws_client, tx_type, tx_info, tx_hash)

    await client.close()
    await api_client.close()
    await ws_client.close()


if __name__ == "__main__":
    asyncio.run(main())
