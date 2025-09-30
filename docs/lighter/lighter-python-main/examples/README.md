## Setup steps for testnet
- Go to https://testnet.app.lighter.xyz/ and connect a wallet to receive $500
- run `system_setup.py` with the correct ETH Private key configured
  - set an API key index which is not 0, so you won't override the one used by [app.lighter.xyz](https://app.lighter.xyz/)
  - this will require you to enter your Ethereum private key
  - the eth private key will only be used in the Py SDK to sign a message
  - the eth private key is not required in order to trade on the platform
  - the eth private key is not passed to the binary
  - copy the output of the script and post it into `create_cancel_order.py`
  - the output should look like
```
BASE_URL = 'https://testnet.zklighter.elliot.ai'
API_KEY_PRIVATE_KEY = '0xea5d2eca5be67eca056752eaf27b173518b8a5550117c09d2b58c7ea7d306cc4426f913ccf27ab19'
ACCOUNT_INDEX = 595
API_KEY_INDEX = 1
```
- start trading using
  - `create_cancel_order.py` has an example which created an order on testnet & cancels it
  - you'll need to set up both your account index, api key index & API Key private key

## Setup steps for mainnet
- deposit money on Lighter to create an account first
- change the URL to `mainnet.zklighter.elliot.ai`
- repeat setup step