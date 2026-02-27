import asyncio
from utils import default_example_setup

AMOUNT = 5.0

async def main():
    client, api_client, _ = default_example_setup()

    # Note: There is no limit or fee for normal withdrawal
    withdraw_tx, response, err = await client.withdraw(
        asset_id=client.ASSET_ID_USDC, # change this to `client.ASSET_ID_ETH` to withdraw ETH. Also, change route_type to spot
        route_type=client.ROUTE_PERP,  # change this to `client.ROUTE_SPOT` to withdraw from spot balance
        amount=AMOUNT,
    )
    if err is not None:
       raise Exception(f"error withdrawing {err}")

    print(withdraw_tx, response)

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())