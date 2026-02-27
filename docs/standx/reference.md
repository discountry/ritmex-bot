[API](https://docs.standx.com/standx-api/standx-api "API") Perps Reference

## StandX Perps API Reference

⚠️ This document is under construction.

## Enums

### Symbol

Available symbols (Trading pairs):

- `BTC-USD`

### Margin Mode

- `cross`
- `isolated`

### Token

Available tokens:

- `DUSD`

### Order Side (side)

- `buy`
- `sell`

### Order Type (order\_type)

- `limit`
- `market`

### Order Status (status)

- `open`
- `canceled`
- `filled`
- `rejected`
- `untriggered`

### Time In Force (time\_in\_force)

| Value | Description |
| --- | --- |
| `gtc` | Good Til Canceled - Order remains active until canceled |
| `ioc` | Immediate Or Cancel - Fill as much as possible immediately, cancel the rest |
| `alo` | Add Liquidity Only - Order added to book without immediate execution; only executes as resting order |

### Resolution

Kline resolutions:

- `1T` - 1 tick
- `3S` - 3 seconds
- `1` - 1 minute
- `5` - 5 minutes
- `15` - 15 minutes
- `60` - 60 minutes (1 hour)
- `1D` - 1 day
- `1W` - 1 week
- `1M` - 1 month

## Error Responses

### Common Error Codes

| Code | Description |
| --- | --- |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

Last updated on

[Perps WebSocket API](https://docs.standx.com/standx-api/perps-ws "Perps WebSocket API")