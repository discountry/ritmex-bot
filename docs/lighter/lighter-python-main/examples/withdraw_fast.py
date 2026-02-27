import asyncio
import json
import lighter
from utils import default_example_setup

ETH_PRIVATE_KEY = "1234567812345678123456781234567812345678123456781234567812345678"
WITHDRAW_ADDRESS = "0x0000..."
AMOUNT_USDC = 5.0

async def main():
    client, api_client, _ = default_example_setup()

    auth_token, err = client.create_auth_token_with_expiry()
    if err:
        raise Exception(f"Auth token failed: {err}")

    info_api = lighter.InfoApi(api_client)

    try:
        # Get fast withdraw pool
        params = api_client.param_serialize(
            method='GET',
            resource_path='/api/v1/fastwithdraw/info',
            query_params=[('account_index', client.account_index)],
            header_params={'Authorization': auth_token}
        )
        response = await api_client.call_api(*params)
        await response.read()
        data = response.data
        assert data is not None

        # get account to which to send money
        pool_info = json.loads(data.decode('utf-8'))
        if pool_info.get('code') != 200:
            raise Exception(f"Pool info failed: {pool_info.get('message')}")
        to_account = pool_info['to_account_index']
        print(f"Pool: {to_account}, Limit: {pool_info.get('withdraw_limit')}")

        # get transfer fee
        fee_info = await info_api.transfer_fee_info(
            account_index=client.account_index,
            to_account_index=to_account,
            auth=auth_token
        )
        fee = fee_info.transfer_fee_usdc # this is already int

        # Get Nonce & API key -- you can get this using HTTP call as well
        api_key_index, nonce = client.nonce_manager.next_nonce()

        # Build memo (20-byte address + 12 zeros)
        addr_hex = WITHDRAW_ADDRESS.lower().removeprefix("0x")
        addr_bytes = bytes.fromhex(addr_hex)
        if len(addr_bytes) != 20:
            raise ValueError(f"Invalid address length: {len(addr_bytes)}")
        memo_list = list(addr_bytes + b"\x00" * 12)
        memo_hex = ''.join(format(b, '02x') for b in memo_list)

        # create TX
        tx_type, tx_info_str, tx_hash, err = client.sign_transfer(
            eth_private_key=ETH_PRIVATE_KEY,
            to_account_index=to_account,
            asset_id=client.ASSET_ID_USDC,
            route_from=client.ROUTE_PERP,
            route_to=client.ROUTE_PERP,
            usdc_amount=int(AMOUNT_USDC) * 10 ** 6,
            fee=fee,
            memo=memo_hex,
            api_key_index=api_key_index,
            nonce=nonce
        )
        if err:
            raise Exception(f"L2 signing failed: {err}")

        # Submit
        params = api_client.param_serialize(
            method='POST',
            resource_path='/api/v1/fastwithdraw',
            post_params=[
                ('tx_info', tx_info_str),
                ('to_address', WITHDRAW_ADDRESS)
            ],
            header_params={
                'Authorization': auth_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        )
        response = await api_client.call_api(*params)
        await response.read()
        data = response.data
        assert data is not None
        result = json.loads(data.decode('utf-8'))

        if result.get('code') == 200:
            print(f"✓ Success! TX: {result.get('tx_hash')}")
        else:
            raise Exception(f"Failed: {result.get('message')}")

    finally:
        await client.close()
        await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())