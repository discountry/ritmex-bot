import time
import json
import asyncio
import lighter
from utils import default_example_setup


async def main():
    client, api_client, _ = default_example_setup()
    tx_api = lighter.TransactionApi(api_client)

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {err}")
        return

    auth, _ = client.create_auth_token_with_expiry()

    # create a public pool
    tx_info, response, err = await client.create_public_pool(
        operator_fee=100000,  # 10%
        initial_total_shares=1_000_000,  # 1000 USDC
        min_operator_share_rate=100,  # 1%
    )
    if err is not None:
        raise Exception(f'failed to create public pool {err}')
    tx_hash = response.tx_hash
    print(f"✅ send create public pool tx. hash: {tx_hash}")

    # fetch pool account index from tx hash
    pool_account_index = -1
    for i in range(10):
        time.sleep(1)
        try:
            response = await tx_api.tx(by="hash", value=tx_hash)
            event_info_j = json.loads(response.event_info)
            pool_account_index = event_info_j['a']
        except Exception as e:
            pass
        if pool_account_index != -1:
            break
    if pool_account_index == -1:
        raise Exception(f"failed to find pool account index for tx {tx_hash}")
    print(f"✅ pool account index: {pool_account_index}")

    # Note: ❗️operator_fee can only decrease
    # modify pool metadata
    tx_info, response, err = await client.update_public_pool(
        public_pool_index=pool_account_index,
        status=0,  # 0 is active | 1 is frozen
        operator_fee=50000,  # 5%
        min_operator_share_rate=1000,  # 10%
    )
    if err is not None:
        raise Exception(f'failed to create update pool {err}')


if __name__ == "__main__":
    asyncio.run(main())
