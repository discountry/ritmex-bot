# Paradex Configuration Guide

中文版：[Paradex 配置教程](paradex.md)

## Scope

This guide configures the Paradex perpetual adapter. The current implementation uses CCXT with an EVM wallet address and matching private key for Paradex account authentication. Production and testnet environments are supported.

## 1. Prepare a dedicated wallet and account

1. Create an EVM wallet dedicated to Paradex API trading.
2. Connect that wallet on [Paradex](https://paradex.io/ref/xingxingjun) and complete account onboarding.
3. Accept the trading terms and fund the target environment.
4. Record the wallet's `0x` address and matching 32-byte private key.

The adapter validates these formats:

- `PARADEX_PRIVATE_KEY` must contain `0x` followed by 64 hexadecimal characters.
- `PARADEX_WALLET_ADDRESS` must contain `0x` followed by 40 hexadecimal characters.

## 2. Minimal mainnet configuration

```dotenv
EXCHANGE=paradex
PARADEX_PRIVATE_KEY=<0x_private_key>
PARADEX_WALLET_ADDRESS=<0x_wallet_address>
PARADEX_SANDBOX=false
PARADEX_SYMBOL=BTC-USD-PERP
```

`BTC-USD-PERP` is the native Paradex market ID. The adapter resolves it to the CCXT unified market symbol. The native ID avoids unified-symbol collisions between options, dated futures, and perpetuals.

## 3. Testnet configuration

```dotenv
EXCHANGE=paradex
PARADEX_PRIVATE_KEY=<0x_testnet_private_key>
PARADEX_WALLET_ADDRESS=<0x_testnet_wallet_address>
PARADEX_SANDBOX=true
PARADEX_SYMBOL=BTC-USD-PERP
```

The Paradex testnet account requires separate onboarding. Mainnet and testnet account state, balances, and authentication contexts are independent.

## 4. Optional settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `PARADEX_RECONNECT_DELAY_MS` | `2000` | WebSocket/polling reconnect delay |
| `PARADEX_USE_PRO` | Auto-detect | Allows `ccxt.pro` streaming APIs |
| `PARADEX_DEBUG` | `false` | Adapter debug output |

The project depends on `ccxt` and does not include `ccxt.pro`. A standard installation uses REST polling.

## 5. Verify the configuration

```bash
bun run index.ts doctor --exchange paradex --symbol BTC-USD-PERP --json
bun run index.ts market ticker --exchange paradex --symbol BTC-USD-PERP --json
```

The ticker check loads markets and verifies account access. It creates no orders. An account without onboarding returns a specific error.

## Troubleshooting

- `Invalid PARADEX_PRIVATE_KEY`: use a 32-byte `0x` hexadecimal private key.
- `Invalid PARADEX_WALLET_ADDRESS`: use the matching 20-byte EVM address.
- `Paradex account is not onboarded`: complete onboarding in the selected mainnet or testnet environment.
- `Symbol ... not found`: use the native market ID, such as `BTC-USD-PERP`.
- Balance query failures: verify that the address, private key, and `PARADEX_SANDBOX` setting belong to one environment.

## Security

- Use a dedicated API wallet and keep only strategy capital in it.
- The private key can sign wallet actions. Apply restrictive file permissions and limit host access.
- Move funds and replace the wallet immediately after key exposure.

## References

- [Paradex API Documentation](https://docs.paradex.trade/)
- [Paradex API Quick Start](https://docs.paradex.trade/api/general-information/api-quick-start)
- [Paradex API Authentication](https://docs.paradex.trade/api/general-information/authentication)

