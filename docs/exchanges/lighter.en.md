# Lighter Configuration Guide

中文版：[Lighter 配置教程](lighter.md)

## Scope

This guide configures Lighter perpetuals and the integrated Spot markets. Lighter credentials consist of an account index, an API-key index, and an API private key. All three values must belong to the same network and account.

## 1. Select a network

| `LIGHTER_ENV` | REST URL | Chain ID |
| --- | --- | --- |
| `mainnet` | `https://mainnet.zklighter.elliot.ai` | `304` |
| `testnet` | `https://testnet.zklighter.elliot.ai` | `300` |
| `staging` | `https://staging.zklighter.elliot.ai` | `300` |
| `dev` | `https://dev.zklighter.elliot.ai` | `300` |

The current default is `testnet`. Set `LIGHTER_ENV=mainnet` explicitly for production trading.

## 2. Obtain the account index and API key

1. Create and fund an account on [Lighter](https://app.lighter.xyz/?referral=111909FA).
2. Follow the official [Get Started guide](https://apidocs.lighter.xyz/docs/get-started) to query `account_index` from the L1 address.
3. Follow the official [API Keys guide](https://apidocs.lighter.xyz/docs/api-keys) to create an API key.
4. Save the API private key returned by the creation flow and record its `api_key_index`.

User-created API-key indices range from `2` to `254`. Indices `0` and `1` are reserved for Web/mobile clients, and `255` queries all keys. ritmex-bot defaults to index `0`, so a user-created key needs an explicit matching index.

## 3. Minimal testnet configuration

```dotenv
EXCHANGE=lighter
LIGHTER_ENV=testnet
LIGHTER_ACCOUNT_INDEX=<your_account_index>
LIGHTER_API_KEY_INDEX=<your_api_key_index>
LIGHTER_API_PRIVATE_KEY=<your_api_private_key_hex>
LIGHTER_SYMBOL=BTC
```

Lighter perpetual markets use symbols such as `BTC`, `ETH`, and `SOL`. The adapter resolves the market ID and precision from metadata for the selected network.

## 4. Mainnet configuration

Replace the values with credentials generated for the mainnet account:

```dotenv
LIGHTER_ENV=mainnet
LIGHTER_ACCOUNT_INDEX=<your_mainnet_account_index>
LIGHTER_API_KEY_INDEX=<your_mainnet_api_key_index>
LIGHTER_API_PRIVATE_KEY=<your_mainnet_api_private_key_hex>
LIGHTER_SYMBOL=BTC
```

Testnet and mainnet credentials cannot be mixed.

## 5. Optional settings

| Variable | Purpose |
| --- | --- |
| `LIGHTER_BASE_URL` | Overrides the REST URL; known hostnames also determine the network |
| `LIGHTER_L1_ADDRESS` | L1 address associated with the account |
| `LIGHTER_MARKET_ID` | Forces a market ID when metadata resolution fails |
| `LIGHTER_MARKET_TYPE` | `perp` or `spot` |
| `LIGHTER_PRICE_DECIMALS` | Forces price decimals |
| `LIGHTER_SIZE_DECIMALS` | Forces size decimals |
| `LIGHTER_CHAIN_ID` | Overrides the signing chain ID |
| `LIGHTER_DEBUG` | Set to `1` or `true` for debug output |

Spot markets use symbols such as `ETH/USDC`. Explicit market IDs and decimal overrides must match order-book metadata for the selected network.

## 6. Verify the configuration

```bash
bun run index.ts doctor --exchange lighter --symbol BTC --json
bun run index.ts market ticker --exchange lighter --symbol BTC --json
```

The ticker check loads market metadata, validates the account/API-key pair, and opens WebSocket connections. It creates no orders.

## Troubleshooting

- `LIGHTER_ACCOUNT_INDEX must be an integer`: use the numeric index returned by the account API.
- `Invalid LIGHTER_API_KEY_INDEX`: use the non-negative integer recorded during key creation.
- `private key does not match the one on Lighter`: the account index, key index, private key, or network differs.
- `Configured market id ... not found`: verify `LIGHTER_ENV`, `LIGHTER_SYMBOL`, and any manual market ID.
- Signer loading failures: the repository ships macOS arm64 and Linux amd64 signer libraries. Other platforms require a compatible signer build or a supported WSL/Linux environment.

## Security

- The API private key can sign transactions. Use a dedicated key and restrictive file permissions.
- Keep public-key/index records separately and store the private key only in the runtime environment.
- Revoke the affected index and create a new key after exposure.

## References

- [Lighter Get Started](https://apidocs.lighter.xyz/docs/get-started)
- [Lighter API Keys](https://apidocs.lighter.xyz/docs/api-keys)
- [Repository Lighter introduction](../lighter/get-start.md)
