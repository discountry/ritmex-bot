import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    # Note: the HTTP method `update_leverage` receives `leverage` as the argument,
    # while the WS one that calls `sign_update_leverage` to get the TX to send it directly over WS
    # receives `fraction` as the argument, which is 10_000 / leverage
    # this was kept this way to not break backwards compatibility. Ideally, they would be consistent.

    tx, tx_hash, err = await client.update_leverage(
        market_index=0,
        leverage=20,
        margin_mode=client.CROSS_MARGIN_MODE
    )

    print(f"Update Leverage {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())

