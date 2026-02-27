import asyncio
import logging
import time
import eth_account
import lighter
from utils import save_api_key_config

logging.basicConfig(level=logging.DEBUG)

# this is a dummy private key registered on Testnet.
# It serves as a good example
BASE_URL = "https://testnet.zklighter.elliot.ai"
ETH_PRIVATE_KEY = "1234567812345678123456781234567812345678123456781234567812345678"
API_KEY_INDEX = 3
NUM_API_KEYS = 5

# If you set this to something other than None, the script will use that account index instead of using the master account index.
# This is useful if you have multiple accounts on the same L1 address or are the owner of a public pool.
# You need to use the private key associated to the master account or the owner of the public pool to change the API keys.
ACCOUNT_INDEX = None

async def main():
    # verify that the account exists & fetch account index
    api_client = lighter.ApiClient(configuration=lighter.Configuration(host=BASE_URL))
    eth_acc = eth_account.Account.from_key(ETH_PRIVATE_KEY)
    eth_address = eth_acc.address

    if ACCOUNT_INDEX is not None:
        account_index = ACCOUNT_INDEX
    else:
        try:
            response = await lighter.AccountApi(api_client).accounts_by_l1_address(l1_address=eth_address)
        except lighter.ApiException as e:
            if e.data.message == "account not found":
                print(f"error: account not found for {eth_address}")
                return
            else:
                raise e

        if len(response.sub_accounts) > 1:
            for sub_account in response.sub_accounts:
                print(f"found accountIndex: {sub_account.index}")

            account = min(response.sub_accounts, key=lambda x: int(x.index))
            account_index = account.index
            print(f"multiple accounts found, using the master account {account_index}")
        else:
            account_index = response.sub_accounts[0].index


    # create a private/public key pair for the new API key
    # pass any string to be used as seed for create_api_key like
    # create_api_key("Hello world random seed to make things more secure")

    private_keys = {}
    public_keys = []

    for i in range(NUM_API_KEYS):
        private_key, public_key, err = lighter.create_api_key()
        if err is not None:
            raise Exception(err)
        public_keys.append(public_key)
        private_keys[API_KEY_INDEX + i] = private_key

    tx_client = lighter.SignerClient(
        url=BASE_URL,
        account_index=account_index,
        api_private_keys=private_keys,
    )

    # change all API keys
    for i in range(NUM_API_KEYS):
        response, err = await tx_client.change_api_key(
            eth_private_key=ETH_PRIVATE_KEY,
            new_pubkey=public_keys[i],
            api_key_index=API_KEY_INDEX + i
        )
        if err is not None:
            raise Exception(err)

    # wait some time so that we receive the new API key in the response
    time.sleep(10)

    # check that the API key changed on the server
    err = tx_client.check_client()
    if err is not None:
        raise Exception(err)

    save_api_key_config(BASE_URL, account_index, private_keys)

    await tx_client.close()
    await api_client.close()


if __name__ == "__main__":
    asyncio.run(main())
