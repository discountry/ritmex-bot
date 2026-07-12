# Ondo Perps Configuration Guide

中文版：[Ondo Perps 配置教程](ondoperps.md)

## Scope

This guide configures the Ondo Perps crypto, equity, and commodity perpetual adapter. Authentication uses an API key ID and an API secret with HMAC-SHA256 signatures.

## 1. Create an API key

1. Activate and fund an account on [Ondo Perps](https://app.ondoperps.xyz/?ref=4A3ACQ).
2. Create an API key with read and trading permissions from the account API settings.
3. Save the API key ID and API secret.
4. Keep withdrawal access disabled and add a fixed IPv4 whitelist.

## 2. Minimal mainnet configuration

```dotenv
EXCHANGE=ondoperps
ONDOPERPS_API_KEY_ID=<your_ondo_key_id>
ONDOPERPS_API_SECRET=<your_ondo_api_secret>
ONDOPERPS_SYMBOL=BTC-USD.P
```

Market symbols use the `{TICKER}-USD.P` format, including:

- `BTC-USD.P`
- `ETH-USD.P`
- `XAU-USD.P`
- `NVDA-USD.P`

The adapter also normalizes `BTCUSDT`, `BTC/USD`, and `BTC-USD` to `BTC-USD.P`.

## 3. Sandbox configuration

```dotenv
EXCHANGE=ondoperps
ONDOPERPS_SANDBOX=true
ONDOPERPS_API_KEY_ID=<your_sandbox_key_id>
ONDOPERPS_API_SECRET=<your_sandbox_api_secret>
ONDOPERPS_SYMBOL=BTC-USD.P
```

Sandbox mode defaults to:

- REST: `https://api.ondoperps-sandbox.xyz`
- WebSocket: `wss://api.ondoperps-sandbox.xyz/ws`

The sandbox requires separately generated credentials.

## 4. Optional settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `ONDOPERPS_BASE_URL` | `https://api.ondoperps.xyz` | REST API base URL |
| `ONDOPERPS_WS_URL` | `wss://api.ondoperps.xyz/ws` | WebSocket URL |
| `ONDOPERPS_BUILDER_CODE` | Empty | Builder code assigned by Ondo |
| `ONDOPERPS_BUILDER_FEE_RATE_BPS` | Empty | Positive integer builder fee, capped at 10 bps by the adapter |

Compatibility aliases:

- `EXCHANGE=ondoperp` or `EXCHANGE=ondo`
- Legacy `ONDOPERP_*` variable prefix
- `ONDO_KEY_ID` and `ONDO_API_SECRET`

Use `ondoperps` and `ONDOPERPS_*` for new deployments.

## 5. Verify the configuration

```bash
bun run index.ts doctor --exchange ondoperps --symbol BTC-USD.P --json
bun run index.ts market ticker --exchange ondoperps --symbol BTC-USD.P --json
```

The ticker check loads contract precision, opens WebSocket connections, and performs read-only market requests. It creates no orders.

## Troubleshooting

- `Missing ONDOPERPS_API_KEY_ID or ONDOPERPS_API_SECRET`: provide the complete credential pair.
- `401` or signature failures: synchronize system time and verify the key ID, secret, environment, and IP whitelist.
- Missing market: use a `{TICKER}-USD.P` symbol from the official Ondo market list.
- Invalid builder fee: use an integer from `1` to `10` bps.
- Empty production account in sandbox: use the dedicated sandbox account and credentials.

## Security

- Grant read and trading permissions only.
- Pass the API secret through the local runtime environment.
- Revoke and replace the key immediately after exposure.

## References

- [Ondo Perps API Authentication](https://docs.ondoperps.xyz/api-reference/api_key_authentication.md)
- [Ondo Perps REST Specification](https://docs.ondoperps.xyz/api-reference/rest-spec.json)
- [Ondo Perps WebSocket Specification](https://docs.ondoperps.xyz/api-reference/ws-spec.json)
- [Repository Ondo Perps integration reference](../ondoperps/README.md)

