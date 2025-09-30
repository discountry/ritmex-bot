import asyncio
import lighter


from examples.secrets import BASE_URL, API_KEY_PRIVATE_KEY, ETH_PRIVATE_KEY

API_KEY_INDEX = 10
TO_ACCOUNT_INDEX = 9
ACCOUNT_INDEX = 10  # replace with your account_index


async def main():
    client = lighter.SignerClient(
        url=BASE_URL,
        private_key=API_KEY_PRIVATE_KEY,
        account_index=ACCOUNT_INDEX,
        api_key_index=API_KEY_INDEX,
    )
    api_client = lighter.ApiClient(configuration=lighter.Configuration(host=BASE_URL))
    info_api = lighter.InfoApi(api_client)
    order_api = lighter.OrderApi(api_client)

    auth_token, _ = client.create_auth_token_with_expiry()
    fee_info = await info_api.transfer_fee_info(ACCOUNT_INDEX, authorization=auth_token, auth=auth_token, to_account_index=TO_ACCOUNT_INDEX) 
    print(fee_info)

    err = client.check_client()
    if err is not None:
        print(f"CheckClient error: {err}")
        return
    memo = "a"*32  # memo is a user message and it has to be exactly 32 bytes long
    transfer_tx, response, err = await client.transfer(
        ETH_PRIVATE_KEY,
        usdc_amount=100,  # decimals are added by sdk
        to_account_index=TO_ACCOUNT_INDEX,
        fee=fee_info.transfer_fee_usdc,
        memo=memo,
    )
    if err != None:
       raise Exception(f"error transferring {err}")
    print(transfer_tx, response)

    lev_tx, response, err = await client.update_leverage(4, client.CROSS_MARGIN_MODE, 3)
    print(lev_tx, response, err)

if __name__ == "__main__":
    asyncio.run(main())