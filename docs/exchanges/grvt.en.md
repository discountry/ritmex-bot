# GRVT Configuration Guide

中文版：[GRVT 配置教程](grvt.md)

## Scope

This guide configures the GRVT perpetual adapter. The standard authentication path uses an API key to create a session and an API secret to sign orders with EIP-712. GRVT's API instrument and the ritmex-bot display symbol are separate settings.

## 1. Collect the account values and credentials

1. Activate an account and subaccount on [GRVT](https://grvt.io/exchange/sign-up?ref=sea).
2. Create trading credentials from the API Keys section in account settings.
3. Save the API key and its signing secret.
4. Record the numeric ID of the target subaccount.
5. Read the exact instrument name from the GRVT market list or the `all_instruments` endpoint.

The standard BTC perpetual instrument is `BTC_USDT_Perp`. Instrument names preserve GRVT's capitalization and separators.

## 2. Minimal configuration

```dotenv
EXCHANGE=grvt
GRVT_ENV=prod
GRVT_API_KEY=<your_grvt_api_key>
GRVT_API_SECRET=<your_grvt_signing_secret>
GRVT_SUB_ACCOUNT_ID=<your_sub_account_id>
GRVT_INSTRUMENT=BTC_USDT_Perp
GRVT_SYMBOL=BTCUSDT
```

`GRVT_INSTRUMENT` is required by the current adapter. `GRVT_SYMBOL` controls ritmex-bot display values and unified position mapping. When omitted, the adapter derives it by removing `_` and `-` from the instrument.

## 3. Select an environment

| `GRVT_ENV` | Purpose |
| --- | --- |
| `prod` | Production |
| `testnet` | Public test environment |
| `staging` | GRVT staging environment |
| `dev` | GRVT development environment |

`mainnet` and `production` resolve to `prod`. The API key, secret, and subaccount ID must belong to the same environment.

Testnet example:

```dotenv
GRVT_ENV=testnet
GRVT_INSTRUMENT=BTC_USDT_Perp
GRVT_SYMBOL=BTCUSDT
```

## 4. Reuse an existing session

Advanced deployments can provide:

```dotenv
GRVT_COOKIE=<existing_session_cookie>
GRVT_ACCOUNT_ID=<existing_account_id>
```

These two values bypass API-key login. Order signing still requires `GRVT_API_SECRET` or an external signer configured through `GRVT_SIGNER_PATH`.

`GRVT_SIGNER_PATH` is designed for deployments that maintain their own signing service. The module must export a signing function that returns the GRVT order-signature fields.

## 5. Verify the configuration

```bash
bun run index.ts doctor --exchange grvt --symbol BTCUSDT --json
bun run index.ts market ticker --exchange grvt --symbol BTCUSDT --json
```

These commands create no orders. The ticker check validates the environment, session login, and instrument metadata.

## Troubleshooting

- `Missing GRVT_INSTRUMENT`: provide the complete instrument, such as `BTC_USDT_Perp`.
- `Failed to authenticate with GRVT using API key`: verify the environment, API key, and subaccount ownership.
- `GRVT_API_SECRET is not configured for local signing`: provide the signing secret or configure an external signer.
- `Unable to load GRVT instrument metadata`: verify the instrument spelling and `GRVT_ENV`.
- Expired signatures: synchronize the host clock.

## Security

- Use dedicated trading credentials for the API key and signing secret.
- Protect the session cookie as an account-access credential.
- Restrict file permissions and callers for an external signer module.

## References

- [GRVT API Documentation](https://api-docs.grvt.io/)
- [GRVT Trading Streams and Authentication](https://api-docs.grvt.io/trading_streams)
- [Repository GRVT SDK reference](../grvt/sdk-readme.md)

