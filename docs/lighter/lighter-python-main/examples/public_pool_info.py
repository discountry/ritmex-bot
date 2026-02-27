import asyncio
import lighter
from utils import default_example_setup

POOL_ACCOUNT_INDEX = 281474976710651


async def main():
    client, api_client, _ = default_example_setup()
    account_api = lighter.AccountApi(api_client)

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {err}")
        return

    account = await account_api.account(by="index", value=str(client.account_index))

    # Note: ❗️shares field does not return the shared you have in pools that you're the operator
    for pool in account.accounts[0].shares:
        pool_resp = await account_api.account(by="index", value=str(pool.public_pool_index))
        pool_account = pool_resp.accounts[0]

        share_price = float(pool_account.total_asset_value) / float(pool_account.pool_info.total_shares)
        print(
            f"poolAccountId: {pool.public_pool_index} numShared: {pool.shares_amount} sharePrice: {share_price:.6f} value: {share_price * pool.shares_amount:.2f} pnl: {share_price * pool.shares_amount - float(pool.entry_usdc):.2f}")

    await client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
