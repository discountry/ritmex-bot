# Backpack Configuration Guide

中文版：[Backpack 配置教程](backpack.md)

## Scope

This guide configures the Backpack Spot and USDC perpetual adapter. Backpack API authentication uses an Ed25519 keypair: the API key is the verifying public key, and the API secret is the signing private key.

## 1. Create an API key

1. Complete account activation, trading access, and funding on [Backpack Exchange](https://backpack.exchange/join/ritmex).
2. Create a dedicated trading key from the API Keys section in account settings.
3. Save the API key and API secret immediately after creation.
4. Enable read and trading access. Keep withdrawal access disabled.
5. Configure the IP whitelist and target subaccount.

## 2. Minimal perpetual configuration

```dotenv
EXCHANGE=backpack
BACKPACK_API_KEY=<your_backpack_api_key>
BACKPACK_API_SECRET=<your_backpack_api_secret>
BACKPACK_SYMBOL=BTC_USDC_PERP
```

`BTC_USDC_PERP` is Backpack's native perpetual market ID. The adapter also matches the CCXT unified symbol `BTC/USDC:USDC`. Set the `_PERP` symbol explicitly so the matching Spot market is not selected.

## 3. Spot configuration

```dotenv
BACKPACK_SYMBOL=BTC_USDC
```

Spot mode also accepts the CCXT unified symbol `BTC/USDC`.

## 4. Optional settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `BACKPACK_PASSWORD` | Empty | Set only when the credential flow supplies a passphrase |
| `BACKPACK_SUBACCOUNT` | Main account | Target subaccount ID |
| `BACKPACK_WS_WINDOW` | `5000` | Signed-request validity window in milliseconds; official maximum is 60000 |
| `BACKPACK_DEBUG` | `false` | Market-resolution and WebSocket debug output |
| `BACKPACK_SANDBOX` | `false` | Sandbox flag forwarded to CCXT |

The installed CCXT Backpack adapter exposes production API URLs only, and this repository has no Backpack endpoint override variables. `BACKPACK_SANDBOX=true` does not create a documented isolated test environment. Use `--dry-run` for write-operation simulation.

## 5. Verify the configuration

```bash
bun run index.ts doctor --exchange backpack --symbol BTC_USDC_PERP --json
bun run index.ts market ticker --exchange backpack --symbol BTC_USDC_PERP --json
```

These commands create no orders. The ticker check loads Backpack markets and confirms symbol resolution.

## Troubleshooting

- `BACKPACK_API_KEY and BACKPACK_API_SECRET ... required`: provide the complete Ed25519 credential pair.
- `Symbol ... not found in Backpack markets`: use `BTC_USDC_PERP` for perpetuals or `BTC_USDC` for Spot.
- Signature failures: verify that the API key and secret form one pair and synchronize the host clock.
- Empty subaccount balance: confirm that `BACKPACK_SUBACCOUNT` matches the account authorized for the key.

## Security

- The API secret is an Ed25519 private key. Protect it as a trading private key.
- Grant read and trading scopes only.
- Delete the key and create a new pair immediately after exposure.

## References

- [Backpack Exchange API](https://docs.backpack.exchange/)
- [Repository Backpack OpenAPI](../backpack/openapi.json)
