import asyncio
import time
from utils import default_example_setup, trim_exception


# this example does the same thing as the send_batch_tx_ws.py example, but sends the TX over HTTP instead of WS
async def main():
    client, api_client, _ = default_example_setup()

    # Note: change this to 2048 to trade spot ETH. Make sure you have at least 0.1 ETH to trade spot.
    market_index = 0

    api_key_index, nonce = client.nonce_manager.next_nonce()
    ask_tx_type, ask_tx_info, ask_tx_hash, error = client.sign_create_order(
        market_index=market_index,
        client_order_index=1001,  # Unique identifier for this order
        base_amount=1000,  # 0.1 ETH
        price=5000_00,  # $5000
        is_ask=True,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce,
        api_key_index=api_key_index,
    )

    if error is not None:
        print(f"Error signing ask order (first batch): {trim_exception(error)}")
        return

    # intentionally pass api_key_index to the client.nonce_manager so it increases the nonce, without changing the API key.
    # in batch TXs, all TXs must come from the same API key.
    api_key_index, nonce = client.nonce_manager.next_nonce(api_key_index)
    bid_tx_type, bid_tx_info, bid_tx_hash, error = client.sign_create_order(
        market_index=market_index,
        client_order_index=1002,  # Different unique identifier
        base_amount=1000,  # 0.1 ETH
        price=1500_00,  # $1500
        is_ask=False,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce,
        api_key_index=api_key_index,
    )

    if error is not None:
        print(f"Error signing second order (first batch): {trim_exception(error)}")
        return

    tx_types = [ask_tx_type, bid_tx_type]
    tx_infos = [ask_tx_info, bid_tx_info]
    tx_hashes = [ask_tx_hash, bid_tx_hash]

    try:
        response = await client.send_tx_batch(tx_types=tx_types, tx_infos=tx_infos)
        print(f"Batch transaction successful: {response} expected: {tx_hashes}")
    except Exception as e:
        print(f"Error sending batch transaction: {trim_exception(e)}")

    # In case we want to see the changes in the UI, sleep a bit
    time.sleep(5)

    # since this is a new batch, we can request a fresh API key
    api_key_index, nonce = client.nonce_manager.next_nonce()
    cancel_tx_type, cancel_tx_info, cancel_tx_hash, error = client.sign_cancel_order(
        market_index=market_index,
        order_index=1001,  # the index of the order we want cancelled
        nonce=nonce,
        api_key_index=api_key_index,
    )

    if error is not None:
        print(f"Error signing first order (second batch): {trim_exception(error)}")
        return

    # intentionally pass api_key_index to the client.nonce_manager so it increases the nonce, without changing the API key.
    # in batch TXs, all TXs must come from the same API key.
    api_key_index, nonce = client.nonce_manager.next_nonce(api_key_index)
    new_ask_tx_type, new_ask_tx_info, new_ask_tx_hash, error = client.sign_create_order(
        market_index=market_index,
        client_order_index=1003,  # Different unique identifier
        base_amount=2000,  # 0.2 ETH
        price=5500_00,  # $5500
        is_ask=True,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce,
        api_key_index=api_key_index,
    )

    if error is not None:
        print(f"Error signing second order (second batch): {trim_exception(error)}")
        return

    tx_types = [cancel_tx_type, new_ask_tx_type]
    tx_infos = [cancel_tx_info, new_ask_tx_info]
    tx_hashes = [cancel_tx_hash, new_ask_tx_hash]

    try:
        response = await client.send_tx_batch(tx_types=tx_types, tx_infos=tx_infos)
        print(f"Batch transaction successful: {response} expected: {tx_hashes}")
    except Exception as e:
        print(f"Error sending batch transaction: {trim_exception(e)}")

    # In case we want to see the changes in the UI, sleep a bit
    time.sleep(5)

    # since this is a new batch, we can request a fresh API key
    api_key_index, nonce = client.nonce_manager.next_nonce()
    cancel_1_tx_type, cancel_1_tx_info, cancel_1_tx_hash, error = client.sign_cancel_order(
        market_index=market_index,
        order_index=1002,  # the index of the order we want cancelled
        nonce=nonce,
        api_key_index=api_key_index,
    )

    if error is not None:
        print(f"Error signing first order (third batch): {trim_exception(error)}")
        return

    api_key_index, nonce = client.nonce_manager.next_nonce(api_key_index)
    cancel_2_tx_type, cancel_2_tx_info, cancel_2_tx_hash, error = client.sign_cancel_order(
        market_index=market_index,
        order_index=1003,  # the index of the order we want cancelled
        nonce=nonce,
        api_key_index=api_key_index,
    )

    if error is not None:
        print(f"Error signing second order (third batch): {trim_exception(error)}")
        return

    tx_types = [cancel_1_tx_type, cancel_2_tx_type]
    tx_infos = [cancel_1_tx_info, cancel_2_tx_info]
    tx_hashes = [cancel_1_tx_hash, cancel_2_tx_hash]

    try:
        response = await client.send_tx_batch(tx_types=tx_types, tx_infos=tx_infos)
        print(f"Batch transaction successful: {response} expected: {tx_hashes}")
    except Exception as e:
        print(f"Error sending batch transaction: {trim_exception(e)}")


    # Clean up
    await client.close()
    await api_client.close()


# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())
