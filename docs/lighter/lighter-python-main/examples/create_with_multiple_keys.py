import asyncio
import lighter


BASE_URL = "https://testnet.zklighter.elliot.ai"
# use examples/system_setup.py or the apikeys page (for mainnet) to generate new api keys
KEYS = {
    5: "API_PRIVATE_KEY_5",
    6: "API_PRIVATE_KEY_6",
    7: "API_PRIVATE_KEY_7",
}
ACCOUNT_INDEX = 100  # replace with your account_index


async def main():
    client = lighter.SignerClient(
        url=BASE_URL,
        private_key=KEYS[5],
        account_index=ACCOUNT_INDEX,
        api_key_index=5,
        max_api_key_index=7,
        private_keys=KEYS,
    )

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {err}")
        return

    for i in range(20):
        res_tuple = await client.create_order(
            market_index=0,
            client_order_index=123 + i,
            base_amount=100000 + i,
            price=385000 + i,
            is_ask=True,
            order_type=lighter.SignerClient.ORDER_TYPE_LIMIT,
            time_in_force=lighter.SignerClient.ORDER_TIME_IN_FORCE_GOOD_TILL_TIME,
            reduce_only=0,
            trigger_price=0,
        )
        print(res_tuple)

    await client.cancel_all_orders(time_in_force=client.CANCEL_ALL_TIF_IMMEDIATE, time=0)


if __name__ == "__main__":
    asyncio.run(main())
