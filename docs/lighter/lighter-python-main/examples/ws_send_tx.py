import lighter
import json
import websockets
import asyncio

# The API_KEY_PRIVATE_KEY provided belongs to a dummy account registered on Testnet.
# It was generated using the setup_system.py script, and servers as an example.
# Alternatively, you can go to https://app.lighter.xyz/apikeys for mainnet api keys
BASE_URL = "https://testnet.zklighter.elliot.ai"
API_KEY_PRIVATE_KEY = (
    "0xed636277f3753b6c0275f7a28c2678a7f3a95655e09deaebec15179b50c5da7f903152e50f594f7b"
)
ACCOUNT_INDEX = 65
API_KEY_INDEX = 3


async def ws_flow(tx_type, tx_info):
    async with websockets.connect(f"{BASE_URL.replace('https', 'wss')}/stream") as ws:
        msg = await ws.recv()
        print("Received:", msg)

        await ws.send(
            json.dumps(
                {
                    "type": "jsonapi/sendtx",
                    "data": {
                        "id": f"my_random_id_{12345678}", # optional, helps id the response
                        "tx_type": tx_type,
                        "tx_info": json.loads(tx_info),
                    },
                }
            )
        )

        print("Response:", await ws.recv())


async def main():
    client = lighter.SignerClient(
        url=BASE_URL,
        private_key=API_KEY_PRIVATE_KEY,
        account_index=ACCOUNT_INDEX,
        api_key_index=API_KEY_INDEX,
    )
    configuration = lighter.Configuration(BASE_URL)
    api_client = lighter.ApiClient(configuration)
    transaction_api = lighter.TransactionApi(api_client)

    next_nonce = await transaction_api.next_nonce(
        account_index=ACCOUNT_INDEX, api_key_index=API_KEY_INDEX
    )
    nonce_value = next_nonce.nonce

    tx_info, error = client.sign_create_order(
        market_index=0,
        client_order_index=1002,  # Different unique identifier
        base_amount=200000,
        price=200000,
        is_ask=False,
        order_type=client.ORDER_TYPE_LIMIT,
        time_in_force=client.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
        reduce_only=False,
        trigger_price=0,
        nonce=nonce_value,
    )
    if error is not None:
        print(f"Error signing order: {error}")
        return

    await ws_flow(lighter.SignerClient.TX_TYPE_CREATE_ORDER, tx_info)


if __name__ == "__main__":
    asyncio.run(main())
