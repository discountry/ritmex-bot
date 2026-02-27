import asyncio
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()

    # Note: the HTTP method `update_margin` receives `usdc_amount` (float) as the argument,
    # while the WS one that calls `sign_update_margin` to get the TX to send it directly over WS
    # receives `usdc_amount` (int) as the argument, which is the float one * 1_000_000
    # this was kept this way to not break backwards compatibility. Ideally, they would be consistent.

    tx, tx_hash, err = await client.update_margin(
        market_index=0,
        usdc_amount=10.5,
        direction=client.ISOLATED_MARGIN_ADD_COLLATERAL
    )

    print(f"Update Margin {tx=} {tx_hash=} {err=}")
    if err is not None:
        raise Exception(err)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())

