# Swing strategy (RSI on Binance ETHBTC)

This repo’s `swing` strategy **trades the exchange symbol you run the bot with** (e.g. `TRADE_SYMBOL`), but **uses Binance spot `ETHBTC` 4h RSI(14)** as the global signal source (per `docs/swingtrading/strategy.md`).

## Key behavior

- **Signal source**: Binance spot `ETHBTC`, `4h` klines, RSI period `14`.
- **Trade target**: your selected exchange’s `TRADE_SYMBOL` / `*_SYMBOL` (same as other strategies).
- **Default mode**: short-only (configurable to long / short / both).
- **Stop-loss**:
  - Tries to place a stop-loss order when supported by the venue.
  - Always runs a real-time “kill-switch”: if price crosses the stop threshold, it market-closes.
- **Spot accounts**: if the connected account is `marketType=spot` and you configure `SWING_DIRECTION=short` (or `both`), the strategy will refuse to trade.

## Environment variables

- **Core**
  - `SWING_DIRECTION`: `short` (default) | `long` | `both`
  - `SWING_TRADE_AMOUNT`: position size (falls back to `TRADE_AMOUNT`)
  - `SWING_POLL_INTERVAL_MS`: loop interval (default `500`)
- **RSI / signal**
  - `SWING_RSI_PERIOD`: default `14`
  - `SWING_RSI_HIGH`: default `70`
  - `SWING_RSI_LOW`: default `30`
  - `SWING_SIGNAL_SYMBOL`: default `ETHBTC`
  - `SWING_SIGNAL_INTERVAL`: default `4h`
- **Risk / precision**
  - `SWING_STOP_LOSS_PCT`: default `0.05` (5%)
  - `SWING_MAX_CLOSE_SLIPPAGE_PCT`: default `0.05`
  - `SWING_PRICE_TICK`, `SWING_QTY_STEP`: optional overrides (otherwise synced from exchange when supported)

## Run

```bash
bun run index.ts --strategy swing
```

Silent mode:

```bash
bun run index.ts --strategy swing --silent
```

