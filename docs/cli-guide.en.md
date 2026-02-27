# ritmex-bot CLI User Guide (English)

This guide documents the `ritmex-bot` command mode (agent-friendly mode), which lets you run structured trading operations without entering the Ink interactive menu.

## 1. Scope

`ritmex-bot` CLI command mode covers:

- Exchange listing and capability checks
- Market data (`ticker` / `depth` / `kline`)
- Account and position queries
- Open/create/cancel/cancel-all order operations
- Strategy execution (including dry-run)

This mode is suitable for:

- Manual terminal usage
- `npx` / `bunx` invocation
- Programmatic AI-agent workflows (recommended with `--json`)

## 2. Installation and Run Modes

### 2.1 Global install (recommended)

```bash
npm install -g ritmex-bot
ritmex-bot doctor
```

### 2.2 Quick run without install

```bash
npx ritmex-bot doctor
bunx ritmex-bot doctor
```

### 2.3 Local dependency

```bash
npm install ritmex-bot
npx ritmex-bot doctor
```

### 2.4 Run from repository source

```bash
bun run index.ts doctor
bun run index.ts market ticker --exchange binance --symbol BTCUSDT
```

> Note: `bin/ritmex-bot` launches the entrypoint via `bun run`, so Bun must be available in the runtime environment.

## 3. Command Shape

```bash
ritmex-bot <root-command> <action> [options]
```

Supported root commands:

- `help`
- `doctor`
- `exchange`
- `market`
- `account`
- `position`
- `order`
- `strategy`

Quick help:

```bash
ritmex-bot help
ritmex-bot market ticker --help
```

## 4. Global Options

| Option | Short | Description | Default |
| --- | --- | --- | --- |
| `--exchange` | `-e` | Exchange ID override | Existing env resolution |
| `--symbol` | - | Trading symbol (pass-through) | Existing env resolution |
| `--json` | `-j` | JSON output | `false` |
| `--dry-run` | `-d` | Simulate write operations | `false` |
| `--timeout` | `-t` | Timeout in milliseconds | `25000` |
| `--help` | `-h` | Show command help | `false` |

## 5. Environment Variables and Symbol Rules

Command mode follows these constraints:

- No new environment variables are introduced.
- No existing environment-variable names are modified.
- Runtime values are read directly from the current CLI environment.
- If `--exchange` is not provided, exchange resolution follows the existing logic (for example `EXCHANGE` / `TRADE_EXCHANGE`).
- If `--symbol` is not provided, symbol resolution follows the existing exchange-specific env logic.
- Symbols are never normalized or rewritten by command mode.

That means symbol variants such as `BTCUSDT`, `BTCUSDC`, spot/perp pairs, and venue-specific naming are fully controlled by your existing environment configuration.

## 6. Command Reference

### 6.1 `doctor`

Checks effective exchange/symbol setup and runtime adapter capabilities.

```bash
ritmex-bot doctor
ritmex-bot doctor --exchange binance --symbol BTCUSDT --json
```

### 6.2 `exchange`

### List supported exchanges

```bash
ritmex-bot exchange list
```

### Inspect exchange capabilities

```bash
ritmex-bot exchange capabilities --exchange standx
```

If runtime adapter initialization fails, CLI falls back to static capability metadata (`source: "static"`) and includes a warning.

### 6.3 `market`

### `market ticker`

```bash
ritmex-bot market ticker --exchange binance --symbol BTCUSDT
```

### `market depth`

```bash
ritmex-bot market depth --exchange binance --symbol BTCUSDT --levels 10
```

`--levels` is optional; when provided, depth levels are truncated to that value.

### `market kline`

```bash
ritmex-bot market kline --exchange binance --symbol BTCUSDT --interval 1m --limit 50
```

Arguments:

- `--interval` is required
- `--limit` is optional (keeps the latest N candles)

### 6.4 `account` and `position`

### Account snapshot

```bash
ritmex-bot account snapshot --exchange standx
ritmex-bot account summary --exchange standx
```

`summary` is an alias of `snapshot`.

### Position list

```bash
ritmex-bot position list --exchange standx
ritmex-bot position list --exchange standx --symbol BTC-USD
```

If `--symbol` is provided, result positions are filtered by that symbol.

### 6.5 `order`

### Open orders

```bash
ritmex-bot order open --exchange binance --symbol BTCUSDT
```

### Create order

```bash
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000
```

Create-order arguments:

| Option | Required | Description |
| --- | --- | --- |
| `--side` | Yes | `buy` / `sell` |
| `--type` | Yes | `limit` / `market` / `stop` / `trailing-stop` / `close` |
| `--quantity` or `--qty` | Yes | Order quantity |
| `--price` | Required for `limit` | Limit price |
| `--stop-price` | Required for `stop` | Stop trigger price |
| `--activation-price` | Required for `trailing-stop` | Trailing-stop activation price |
| `--callback-rate` | Required for `trailing-stop` | Trailing-stop callback rate |
| `--time-in-force` | No | `GTC` / `IOC` / `FOK` / `GTX` |
| `--reduce-only` | No | `true/false` |
| `--close-position` | No | `true/false` |
| `--trigger-type` | No | `UNSPECIFIED` / `TAKE_PROFIT` / `STOP_LOSS` |
| `--sl-price` | No | Stop-loss price (router applies venue capability rules) |
| `--tp-price` | No | Take-profit price (router applies venue capability rules) |

Examples:

```bash
# Market order
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type market --qty 0.01

# Stop order
ritmex-bot order create --exchange binance --symbol BTCUSDT --side sell --type stop --qty 0.01 --stop-price 86000

# Trailing-stop order
ritmex-bot order create --exchange binance --symbol BTCUSDT --side sell --type trailing-stop --qty 0.01 --activation-price 91000 --callback-rate 0.2

# Close intent order (defaults reduceOnly/closePosition in route layer)
ritmex-bot order create --exchange binance --symbol BTCUSDT --side sell --type close --qty 0.01
```

### Cancel order

```bash
ritmex-bot order cancel --exchange binance --symbol BTCUSDT --order-id 123456
```

### Cancel all orders

```bash
ritmex-bot order cancel-all --exchange binance --symbol BTCUSDT
```

If `forceCancelAllOrders` is available on the adapter, CLI uses it first; otherwise it falls back to standard cancel-all behavior.

### 6.6 `strategy`

### Run strategy

```bash
ritmex-bot strategy run --strategy maker --exchange standx --silent
```

Supported strategy IDs:

- `trend`
- `swing`
- `guardian`
- `maker`
- `maker-points`
- `offset-maker`
- `liquidity-maker`
- `basis`
- `grid`

Supported aliases:

- `offset` -> `offset-maker`
- `makerpoints` / `maker_points` -> `maker-points`
- `liquidity` / `liquiditymaker` / `liquidity_maker` -> `liquidity-maker`

Extra options:

- `--silent` (short form `-q`) for quieter strategy startup logs
- `--dry-run` to propagate simulation mode into strategy execution

## 7. `--dry-run` Behavior

With `--dry-run` enabled:

- `order create` / `order cancel` / `order cancel-all` do not send real write operations.
- Response includes `dryRunActions` so you can inspect the simulated intent.
- `strategy run` receives dry-run mode in the strategy runner.
- Read-only commands (market/account/position queries) keep normal behavior.

Example:

```bash
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --dry-run --json
```

## 8. Unsupported Features

Exchange capabilities are intentionally not forced into a fake unified surface. If a venue does not support a feature, CLI returns `UNSUPPORTED` directly.

Typical cases:

- Exchange does not implement `queryOpenOrders`
- Exchange does not implement `queryAccountSnapshot`
- Exchange-specific order type limitations

Callers should handle `UNSUPPORTED` as a first-class outcome.

## 9. Output and Exit Codes

### 9.1 Human-readable output (default)

Success:

```text
[OK] market-ticker
time: 2026-02-27T12:00:00.000Z
exchange: binance
symbol: BTCUSDT
dryRun: false
...
```

Failure:

```text
[ERROR] order-open
time: 2026-02-27T12:00:00.000Z
code: UNSUPPORTED
message: queryOpenOrders is not supported on exchange 'aster'
retryable: false
```

### 9.2 JSON output (`--json`)

Success payload:

```json
{
  "success": true,
  "command": "market-ticker",
  "exchange": "binance",
  "symbol": "BTCUSDT",
  "dryRun": false,
  "ts": "2026-02-27T12:00:00.000Z",
  "data": {}
}
```

Failure payload:

```json
{
  "success": false,
  "command": "order-open",
  "exchange": "aster",
  "symbol": "BTCUSDT",
  "dryRun": false,
  "ts": "2026-02-27T12:00:00.000Z",
  "error": {
    "code": "UNSUPPORTED",
    "message": "queryOpenOrders is not supported on exchange 'aster'",
    "retryable": false
  }
}
```

### 9.3 Exit codes

| Exit Code | Meaning |
| --- | --- |
| `0` | Success |
| `2` | Invalid arguments (`INVALID_ARGS`) |
| `3` | Missing environment setup (`MISSING_ENV`) |
| `5` | Unsupported feature (`UNSUPPORTED`) |
| `6` | Exchange execution error (`EXCHANGE_ERROR`) |
| `7` | Timeout (`TIMEOUT`) |

## 10. Recommended AI-Agent Flow

```bash
# 1) Check venue capabilities
ritmex-bot exchange capabilities --exchange binance --json

# 2) Fetch market state
ritmex-bot market ticker --exchange binance --symbol BTCUSDT --json

# 3) Validate order parameters with dry-run
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --dry-run --json

# 4) Submit live order after validation (remove --dry-run)
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --json
```

## 11. Compatibility With Existing Features

Command mode does not break existing interactive or legacy startup flows:

- `bun run index.ts` still opens the Ink menu
- `bun run index.ts --strategy trend --silent` still starts strategy directly
- Command mode is used only when the first argument matches command roots (for example `market`, `order`, `strategy`)

If you already run the project with current env variables and strategy configs, command mode can be adopted incrementally with no env-key migration.
