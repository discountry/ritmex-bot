import logging
import asyncio
import lighter
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()
    logging.basicConfig(level=logging.INFO)

    account_api = lighter.AccountApi(api_client)
    response = await account_api.account(by="index", value=str(client.account_index))
    if len(response.accounts) == 0:
        raise "No account found"

    account = response.accounts[0]
    # Note: cross-account value does not take into account isolated positions, but total does
    print("=== perp assets ===")
    print(f"total: {account.total_asset_value} available: {account.available_balance}")
    print(f"cross: {account.cross_asset_value} isolated: {float(account.total_asset_value) - float(account.cross_asset_value)}")

    # Spot Assets
    print("=== spot assets ===")
    for asset in account.assets:
        print(f"{asset.symbol} total: {asset.balance} available: {float(asset.balance) - float(asset.locked_balance)}")

    await client.close()
    await api_client.close()

if __name__ == "__main__":
    asyncio.run(main())
