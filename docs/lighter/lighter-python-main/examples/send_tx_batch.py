import asyncio
import logging
import lighter
import json

logging.basicConfig(level=logging.DEBUG)

# The API_KEY_PRIVATE_KEY provided belongs to a dummy account registered on Testnet.
# It was generated using the setup_system.py script, and servers as an example.
BASE_URL = "https://testnet.zklighter.elliot.ai"
API_KEY_PRIVATE_KEY = "0xed636277f3753b6c0275f7a28c2678a7f3a95655e09deaebec15179b50c5da7f903152e50f594f7b"
ACCOUNT_INDEX = 65
API_KEY_INDEX = 1

def trim_exception(e: Exception) -> str:
    return str(e).strip().split("\n")[-1]


async def main():
    # Initialize configuration and clients
    configuration = lighter.Configuration(BASE_URL)
    api_client = lighter.ApiClient(configuration)
    transaction_api = lighter.TransactionApi(api_client)

    # Initialize signer client
    client = lighter.SignerClient(
        url=BASE_URL,
        private_key=API_KEY_PRIVATE_KEY,
        account_index=ACCOUNT_INDEX,
        api_key_index=API_KEY_INDEX
    )

    # Check client connection
    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {trim_exception(err)}")
        return

    # use next nonce for getting nonces
    next_nonce = await transaction_api.next_nonce(account_index=ACCOUNT_INDEX, api_key_index=API_KEY_INDEX)
    nonce_value = next_nonce.nonce

    ask_tx_info, error = client.sign_create_order(
        market_index=0,
        client_order_index=1001,  # Unique identifier for this order
        base_amount=100000,
        price=280000,
        is_ask=True,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce_value
    )
    nonce_value += 1

    if error is not None:
        print(f"Error signing first order (first batch): {trim_exception(error)}")
        return

    # Sign second order
    bid_tx_info, error = client.sign_create_order(
        market_index=0,
        client_order_index=1002,  # Different unique identifier
        base_amount=200000,
        price=200000,
        is_ask=False,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce_value
    )
    nonce_value += 1

    if error is not None:
        print(f"Error signing second order (first batch): {trim_exception(error)}")
        return

    tx_types = json.dumps([client.TX_TYPE_CREATE_ORDER, client.TX_TYPE_CREATE_ORDER])
    tx_infos = json.dumps([ask_tx_info, bid_tx_info])

    try:
        tx_hashes = await transaction_api.send_tx_batch(tx_types=tx_types, tx_infos=tx_infos)
        print(f"Batch transaction successful: {tx_hashes}")
    except Exception as e:
        print(f"Error sending batch transaction: {trim_exception(e)}")

    # In case we want to see the changes in the UI, sleep a bit
    import time
    time.sleep(5)

    cancel_tx_info, error = client.sign_cancel_order(
        market_index=0,
        order_index=1001, # the index of the order we want cancelled
        nonce=nonce_value
    )
    nonce_value += 1

    if error is not None:
        print(f"Error signing first order (second batch): {trim_exception(error)}")
        return

    # Sign second order
    new_ask_tx_info, error = client.sign_create_order(
        market_index=0,
        client_order_index=1003,  # Different unique identifier
        base_amount=300000,
        price=310000,
        is_ask=True,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce_value
    )
    nonce_value += 1

    if error is not None:
        print(f"Error signing second order (second batch): {trim_exception(error)}")
        return

    tx_types = json.dumps([client.TX_TYPE_CANCEL_ORDER, client.TX_TYPE_CREATE_ORDER])
    tx_infos = json.dumps([cancel_tx_info, new_ask_tx_info])

    try:
        tx_hashes = await transaction_api.send_tx_batch(tx_types=tx_types, tx_infos=tx_infos)
        print(f"Batch 2 transaction successful: {tx_hashes}")
    except Exception as e:
        print(f"Error sending batch transaction 2: {trim_exception(e)}")

    # Clean up
    await client.close()
    await api_client.close()

# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())