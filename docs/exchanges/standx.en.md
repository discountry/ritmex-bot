# StandX Configuration Guide

中文版：[StandX 配置教程](standx.md)

## Scope

This guide configures the StandX perpetual adapter. A standard setup uses a JWT token and an Ed25519 request-signing private key. The JWT authenticates the session, and the Ed25519 key signs trading requests.

## 1. Obtain the token and signing key

1. Open [StandX API Session](https://standx.com/user/session).
2. Connect the wallet and sign in.
3. Generate an API token.
4. Save the JWT token, Ed25519 private key, creation date, and validity period shown by the page.

The official authentication flow obtains a JWT through wallet signing and uses an Ed25519 key for request-body signatures. The official key format is Base58. The adapter also accepts a 32-byte hexadecimal or Base64 representation.

## 2. Minimal configuration

```dotenv
EXCHANGE=standx
STANDX_TOKEN=<your_standx_jwt>
STANDX_REQUEST_PRIVATE_KEY=<your_ed25519_private_key>
STANDX_SYMBOL=BTC-USD
```

`STANDX_TOKEN` is required during adapter construction. `STANDX_REQUEST_PRIVATE_KEY` is required for signed actions such as creating orders, cancelling orders, and changing margin mode.

## 3. Token-expiry reminder

The official authentication flow uses a seven-day JWT lifetime by default. Configure the reminder from the values shown on the API page:

```dotenv
STANDX_TOKEN_CREATE_DATE=2026-07-12
STANDX_TOKEN_VALIDITY_DAYS=7
```

The legacy `STANDX_TOKEN_EXPIRY` setting accepts a seconds/milliseconds timestamp or an ISO date.

## 4. Optional settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `STANDX_BASE_URL` | `https://perps.standx.com` | REST API base URL |
| `STANDX_WS_URL` | `wss://perps.standx.com/ws-stream/v1` | WebSocket URL |
| `STANDX_SESSION_ID` | Generated UUID | Session identifier for order-response streams |
| `STANDX_WS_DEBUG` | `false` | WebSocket debug logging |
| `STANDX_WS_DEBUG_RAW` | `false` | Raw WebSocket message logging |

Symbols use values such as `BTC-USD`. Confirm `PRICE_TICK`, `QTY_STEP`, and minimum quantity from the StandX market rules.

## 5. Verify the configuration

```bash
bun run index.ts doctor --exchange standx --symbol BTC-USD --json
bun run index.ts market ticker --exchange standx --symbol BTC-USD --json
```

These commands create no orders. Generate a new credential set after expiry and update both the token and signing key.

## Troubleshooting

- `Missing STANDX_TOKEN`: provide a valid JWT token.
- `Request signature skipped`: provide `STANDX_REQUEST_PRIVATE_KEY` and confirm its decoded length is 32 bytes.
- `401` or token expiry: generate a fresh token and update the expiry settings.
- Missing order-response events: keep `STANDX_SESSION_ID` stable and verify the WebSocket URL.

## Security

- The token and signing key together provide trading capability. Protect both as trading credentials.
- Use a dedicated API session and rotate it regularly.
- Revoke the session and generate new credentials immediately after exposure.

## References

- [StandX Authentication](https://docs.standx.com/standx-api/perps-auth)
- [StandX HTTP API](https://docs.standx.com/standx-api/perps-http)
- [Repository StandX authentication reference](../standx/auth.md)
- [StandX Maker Points strategy guide](../standx/maker-points-guide.md)

