import asyncio

from utils import default_example_setup

POOL_ACCOUNT_INDEX = 281474976710651


async def main():
    client, api_client, _ = default_example_setup()

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {err}")
        return

    tx_info, response, err = await client.mint_shares(public_pool_index=POOL_ACCOUNT_INDEX, share_amount=10_000)
    if err is not None:
        raise Exception(f'failed to mint shares {err}')

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
