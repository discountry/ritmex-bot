# Lighter Configuration Guide

中文版：[Lighter 配置教程](lighter.md)

## Scope

This guide configures Lighter perpetuals and the integrated Spot markets. Lighter credentials consist of an account index, an API-key index, and an API private key. All three values must belong to the same network and account.

## 1. Select a network

| `LIGHTER_ENV` | REST URL | WebSocket | Signing chain ID | Quote asset |
| --- | --- | --- | --- | --- |
| `mainnet` | `https://mainnet.zklighter.elliot.ai` | `wss://mainnet.zklighter.elliot.ai/stream` | `304` | USDC |
| `rh` | `https://api.rh.lighter.xyz` | `wss://api.rh.lighter.xyz/stream` | `466324` | USDG |
| `testnet` | `https://testnet.zklighter.elliot.ai` | `wss://testnet.zklighter.elliot.ai/stream` | `300` | USDC |
| `rh-testnet` | `https://api.rh-testnet.lighter.xyz` | `wss://api.rh-testnet.lighter.xyz/stream` | `300` | USDG |
| `staging` | `https://staging.zklighter.elliot.ai` | `wss://staging.zklighter.elliot.ai/stream` | `300` | USDC |
| `dev` | `https://dev.zklighter.elliot.ai` | `wss://dev.zklighter.elliot.ai/stream` | `300` | USDC |

`rh` is the Robinhood Chain deployment (web app at `robinhoodchain.lighter.xyz`). It is a separate chain from the main venue: accounts, API keys, market IDs and funds are not shared, and the signing chain ID differs.

**Switching venues means changing only `LIGHTER_ENV`** — the REST URL, WebSocket URL and signing chain ID are all derived from it together, so they cannot drift apart. The aliases `robinhood`, `robinhoodchain` and `rhc` all mean `rh`.

The current default is `testnet`. Set `LIGHTER_ENV=mainnet` or `LIGHTER_ENV=rh` explicitly for production trading.

At startup the bot prints one confirmation line and calls `/api/v1/layer1BasicInfo` to check the L1 chain ID and ZkLighter contract address against the configured deployment, failing immediately on a mismatch:

```
[Lighter] env=rh rest=https://api.rh.lighter.xyz ws=wss://api.rh.lighter.xyz/stream chainId=466324 account=12345
```

## 2. Obtain the account index and API key

1. Create and fund an account on [Robinhood Chain](https://robinhoodchain.lighter.xyz/?referral=RITMEX) (10% bonus points) or the [Lighter main venue](https://app.lighter.xyz/?referral=111909FA). Accounts on the two are independent.
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

## 5. Robinhood Chain configuration

```dotenv
EXCHANGE=lighter
LIGHTER_ENV=rh
LIGHTER_ACCOUNT_INDEX=<your_rh_account_index>
LIGHTER_API_KEY_INDEX=<your_rh_api_key_index>
LIGHTER_API_PRIVATE_KEY=<your_rh_api_private_key_hex>
LIGHTER_SYMBOL=BTC
```

What changes when switching venues:

- **Credentials are venue-specific.** Create the account index and API key on Robinhood Chain itself.
- **Market IDs use a different numbering**, so reusing one across venues points at the wrong instrument. Leave `LIGHTER_MARKET_ID` unset unless metadata resolution fails, and clear it when coming from the main venue.
- **Spot is quoted in USDG, not USDC** — spot symbols look like `ETH/USDG`.
- The venue lists equity perpetuals (`TSLA`, `AAPL`, `NVDA`, …) and tokenized equity spot markets.
- `SGOV/USDG`, `ORCL/USDG` and `MU/USDG` have a contract `multiplier` other than 1 while order scaling assumes 1.0, so those markets are refused. Set `LIGHTER_ALLOW_NON_UNIT_MULTIPLIER=1` to trade them anyway.

## 6. Optional settings

| Variable | Purpose |
| --- | --- |
| `LIGHTER_BASE_URL` | Overrides the REST URL; known hostnames determine the network, and a web-app URL (e.g. `robinhoodchain.lighter.xyz`) is remapped to its API host |
| `LIGHTER_WS_URL` | Overrides the WebSocket URL; derived from `LIGHTER_ENV` or `LIGHTER_BASE_URL` otherwise |
| `LIGHTER_L1_ADDRESS` | L1 address associated with the account |
| `LIGHTER_MARKET_ID` | Forces a market ID when metadata resolution fails; never reuse across venues |
| `LIGHTER_MARKET_TYPE` | `perp` or `spot` |
| `LIGHTER_PRICE_DECIMALS` | Forces price decimals |
| `LIGHTER_SIZE_DECIMALS` | Forces size decimals |
| `LIGHTER_CHAIN_ID` | Overrides the signing chain ID; required for a self-hosted or proxied host that cannot be recognized |
| `LIGHTER_ALLOW_NON_UNIT_MULTIPLIER` | Allows trading markets whose `multiplier` is not 1 |
| `LIGHTER_DEBUG` | Set to `1` or `true` for debug output |

Spot markets use symbols such as `ETH/USDC` (main venue) or `ETH/USDG` (Robinhood Chain). Explicit market IDs and decimal overrides must match order-book metadata for the selected network.

For a self-hosted node or a proxy whose hostname cannot be recognized, `LIGHTER_CHAIN_ID` is mandatory: no endpoint exposes the signing chain ID, and guessing it wrong makes every transaction fail signature verification, so startup fails loudly instead of assuming a default.

## 7. Verify the configuration

```bash
bun run index.ts doctor --exchange lighter --symbol BTC --json
bun run index.ts market ticker --exchange lighter --symbol BTC --json
```

The ticker check loads market metadata, validates the account/API-key pair, and opens WebSocket connections. It creates no orders.

## Troubleshooting

- `LIGHTER_ACCOUNT_INDEX must be an integer`: use the numeric index returned by the account API.
- `Invalid LIGHTER_API_KEY_INDEX`: use the non-negative integer recorded during key creation.
- `private key does not match the one on Lighter`: the account index, key index, private key, or network differs.
- `Configured market id ... not found`: verify `LIGHTER_ENV`, `LIGHTER_SYMBOL`, and any manual market ID. After switching venues the usual cause is a `LIGHTER_MARKET_ID` left over from the previous one.
- `Lighter network mismatch`: the REST URL and `LIGHTER_ENV` point at different deployments, caught before any order is signed. Reconcile `LIGHTER_ENV` and `LIGHTER_BASE_URL` against the table above.
- `Unknown Lighter environment`: `LIGHTER_ENV` is misspelled; the error lists every valid value and alias.
- `has contract multiplier ... not 1.0`: the market's contract multiplier is not 1 and sizing could be wrong; set `LIGHTER_ALLOW_NON_UNIT_MULTIPLIER=1` once you have verified the scaling.
- Signer loading failures: the repository ships macOS arm64 and Linux amd64 signer libraries. Other platforms require a compatible signer build or a supported WSL/Linux environment.

## Security

- The API private key can sign transactions. Use a dedicated key and restrictive file permissions.
- Keep public-key/index records separately and store the private key only in the runtime environment.
- Revoke the affected index and create a new key after exposure.

## References

- [Lighter Get Started](https://apidocs.lighter.xyz/docs/get-started)
- [Lighter API Keys](https://apidocs.lighter.xyz/docs/api-keys)
- [Repository Lighter introduction](../lighter/get-start.md)
