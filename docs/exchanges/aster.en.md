# Aster Configuration Guide

中文版：[Aster 配置教程](aster.md)

## Scope

This guide configures the ritmex-bot Aster USDT perpetual adapter. The current adapter connects to the production endpoint at `https://fapi.asterdex.com`. Market symbols use compact uppercase values such as `BTCUSDT`.

## 1. Prepare the account and credentials

1. Connect a wallet, activate perpetual trading, and fund the account on [Aster](https://www.asterdex.com/en/referral/4665f3).
2. Create an API key from Aster's API management page and save the API key and API secret shown there.
3. Enable read and perpetual-trading permissions. Keep withdrawal permission disabled.
4. Add the bot server's fixed IP address to the key whitelist.
5. Select one-way position mode and configure leverage in the Aster interface.

Aster also publishes a [programmatic API-key registration flow](https://github.com/asterdex/api-docs/blob/master/demo/aster-api-key-registration.md) with trading scopes, expiry, and IP whitelist settings.

## 2. Minimal configuration

Add these values to the project-root `.env` file:

```dotenv
EXCHANGE=aster
ASTER_API_KEY=<your_aster_api_key>
ASTER_API_SECRET=<your_aster_api_secret>
ASTER_SYMBOL=BTCUSDT
```

`ASTER_SYMBOL` takes priority over the shared `TRADE_SYMBOL`. The default is `BTCUSDT`.

## 3. Precision and strategy values

Aster returns market precision metadata. Keep the strategy values aligned with the selected market:

```dotenv
PRICE_TICK=0.1
QTY_STEP=0.001
```

Confirm the price increment, quantity increment, and minimum notional in Aster's market rules. Configure `TRADE_AMOUNT`, stop-loss values, and maker settings after a small-account validation run.

## 4. Environment behavior

The current Aster adapter uses production REST and WebSocket endpoints. It exposes no environment switch or custom endpoint variables. Aster testnet credentials cannot authenticate against these production endpoints. Use a dedicated low-balance account and ritmex-bot `--dry-run` write simulation for strategy checks.

## 5. Verify the configuration

Run the local configuration check:

```bash
bun run index.ts doctor --exchange aster --symbol BTCUSDT --json
```

Then run a read-only market connection check:

```bash
bun run index.ts market ticker --exchange aster --symbol BTCUSDT --json
```

These commands create no orders. Run an order command with `--dry-run` before starting a live strategy.

## Troubleshooting

- `Missing ASTER_API_KEY`: fill both Aster credential variables.
- `Invalid signature`: synchronize system time and verify the secret, permissions, and IP whitelist.
- `Symbol not found`: use the native Aster perpetual symbol, such as `BTCUSDT`.
- Precision errors: update `PRICE_TICK`, `QTY_STEP`, and the order quantity from the market rules.

## Security

- Grant read and trading scopes only.
- Keep the API secret in the local runtime environment.
- Delete and replace a credential immediately after exposure.

## References

- [Aster Futures API](https://github.com/asterdex/api-docs)
- [Repository Aster API reference](../aster/v2-api.md)

