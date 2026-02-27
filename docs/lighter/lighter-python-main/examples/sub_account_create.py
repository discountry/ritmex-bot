import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {err}")
        return

    tx_info, response, err = await client.create_sub_account()
    print(tx_info, response, err)

if __name__ == "__main__":
    asyncio.run(main())