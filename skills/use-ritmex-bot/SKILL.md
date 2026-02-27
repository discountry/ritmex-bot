---
name: use-ritmex-bot
description: Use when the task requires operating exchanges with the ritmex-bot CLI, including capability checks, market/account/position queries, order operations, strategy run, dry-run simulation, and JSON output parsing.
---

# Use ritmex-bot CLI

This skill is for running `ritmex-bot` in an agent-safe, exchange-compatible way.

## Use This Skill When

- The user asks to use `ritmex-bot` commands directly.
- The user wants market data, account/position, or order operations from supported exchanges.
- The user wants AI-agent-friendly CLI execution with `--json` output.
- The user wants simulation with `--dry-run` before real writes.

## Hard Rules

1. Do not change environment-variable names and do not invent new env keys.
2. Read config from the current shell environment as-is.
3. Do not normalize or rewrite `--symbol`; pass it through exactly.
4. If a feature is not supported by an exchange, return it as unsupported (`UNSUPPORTED`), do not fake behavior.
5. For write actions (`order create`, `order cancel`, `order cancel-all`), prefer `--dry-run` first unless the user explicitly asks to skip simulation.
6. Use `--json` whenever output must be consumed by another agent/tool.

## Command Entry Options

Use one of these:

```bash
ritmex-bot <command>
npx ritmex-bot <command>
bunx ritmex-bot <command>
bun run index.ts <command>
```

If `ritmex-bot` is unavailable, use `bun run index.ts <command>` from repo root.

## Default Agent Workflow

1. Determine exchange and symbol from user request.
2. If missing, rely on existing env resolution; do not create fallback env variables.
3. Run capability precheck:
   - `exchange list`
   - `exchange capabilities --exchange <id>`
4. For read operations, run command directly (prefer `--json`).
5. For write operations:
   - Run the exact command with `--dry-run --json`.
   - Validate payload and dry-run actions.
   - Run live command only when user confirmed or explicitly requested live execution.
6. Post-check with `order open`, `position list`, or `account snapshot` as needed.

## Global Flags

| Flag | Short | Meaning |
| --- | --- | --- |
| `--exchange` | `-e` | Exchange override |
| `--symbol` | - | Trading symbol (pass-through) |
| `--json` | `-j` | JSON output |
| `--dry-run` | `-d` | Simulate write ops |
| `--timeout` | `-t` | Timeout in ms (default 25000) |
| `--help` | `-h` | Show help |

## Root Commands

- `help`
- `doctor`
- `exchange`
- `market`
- `account`
- `position`
- `order`
- `strategy`

## Command Reference

### `doctor`

```bash
ritmex-bot doctor
ritmex-bot doctor --exchange binance --symbol BTCUSDT --json
```

Returns effective setup and runtime capabilities.

### `exchange`

```bash
ritmex-bot exchange list
ritmex-bot exchange capabilities --exchange standx
```

If runtime adapter cannot initialize, capabilities may fallback to static metadata.

### `market`

```bash
ritmex-bot market ticker --exchange <id> --symbol <symbol>
ritmex-bot market depth --exchange <id> --symbol <symbol> --levels 10
ritmex-bot market kline --exchange <id> --symbol <symbol> --interval 1m --limit 100
```

Rules:

- `kline` requires `--interval`.
- `depth --levels` is optional.
- `kline --limit` is optional.

### `account`

```bash
ritmex-bot account snapshot --exchange <id>
ritmex-bot account summary --exchange <id>
```

`summary` is an alias of `snapshot`.

### `position`

```bash
ritmex-bot position list --exchange <id>
ritmex-bot position list --exchange <id> --symbol <symbol>
```

### `order`

### Query open orders

```bash
ritmex-bot order open --exchange <id> --symbol <symbol>
```

### Create order

```bash
ritmex-bot order create --exchange <id> --symbol <symbol> --side buy --type limit --quantity 0.01 --price 90000
```

Required:

- `--side` = `buy|sell`
- `--type` = `limit|market|stop|trailing-stop|close`
- `--quantity` or `--qty`

Conditional required:

- `limit`: `--price`
- `stop`: `--stop-price`
- `trailing-stop`: `--activation-price` and `--callback-rate`

Optional:

- `--time-in-force` (`GTC|IOC|FOK|GTX`)
- `--reduce-only` (`true|false`)
- `--close-position` (`true|false`)
- `--trigger-type` (`UNSPECIFIED|TAKE_PROFIT|STOP_LOSS`)
- `--sl-price`
- `--tp-price`

### Cancel one order

```bash
ritmex-bot order cancel --exchange <id> --symbol <symbol> --order-id <id>
```

### Cancel all

```bash
ritmex-bot order cancel-all --exchange <id> --symbol <symbol>
```

### `strategy`

```bash
ritmex-bot strategy run --strategy maker --exchange standx --silent
ritmex-bot strategy run --strategy offset --exchange binance --dry-run
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

Aliases:

- `offset` -> `offset-maker`
- `makerpoints` / `maker_points` -> `maker-points`
- `liquidity` / `liquiditymaker` / `liquidity_maker` -> `liquidity-maker`

Extra flags:

- `--silent` (short alias `-q`)
- `--dry-run`

## Dry-Run First Patterns

### Create order safely

```bash
# 1) Simulate
ritmex-bot order create --exchange <id> --symbol <symbol> --side buy --type limit --quantity 0.01 --price 90000 --dry-run --json

# 2) Execute live only after confirmation
ritmex-bot order create --exchange <id> --symbol <symbol> --side buy --type limit --quantity 0.01 --price 90000 --json
```

### Cancel safely

```bash
# 1) Simulate
ritmex-bot order cancel --exchange <id> --symbol <symbol> --order-id <id> --dry-run --json

# 2) Execute live
ritmex-bot order cancel --exchange <id> --symbol <symbol> --order-id <id> --json
```

## Agent Output Handling

Prefer `--json` and parse:

- `success` (boolean)
- `command` (executed command kind)
- `exchange`
- `symbol`
- `dryRun`
- `data` (success payload)
- `error.code`, `error.message`, `error.retryable` (failure payload)

Human-readable mode is fine for manual terminal use; `--json` is preferred for automation.

## Error Codes and Exit Codes

Map failures by code/exit code:

- `INVALID_ARGS` -> exit `2`
- `MISSING_ENV` -> exit `3`
- `UNSUPPORTED` -> exit `5`
- `EXCHANGE_ERROR` -> exit `6`
- `TIMEOUT` -> exit `7`

Handling policy:

1. `INVALID_ARGS`: fix command arguments and retry once.
2. `MISSING_ENV`: report missing configuration; do not invent env keys.
3. `UNSUPPORTED`: return clearly as unsupported for that exchange.
4. `EXCHANGE_ERROR`: return details and retry only if user requests.
5. `TIMEOUT`: optionally retry with larger `--timeout` once.

## Symbol and Exchange-Specific Behavior

- Never apply cross-exchange symbol mapping inside the skill.
- Respect user-provided symbols exactly (examples: `BTCUSDT`, `BTCUSDC`, `BTC_USD_PERP`, `BTC-PERP`).
- If no `--symbol` is provided, let existing exchange config resolve it.
- If no `--exchange` is provided, let existing env resolution decide it.

## Ready-to-Use Recipes

### Preflight

```bash
ritmex-bot exchange list --json
ritmex-bot exchange capabilities --exchange <id> --json
ritmex-bot doctor --exchange <id> --symbol <symbol> --json
```

### Read-only market/account state

```bash
ritmex-bot market ticker --exchange <id> --symbol <symbol> --json
ritmex-bot market depth --exchange <id> --symbol <symbol> --levels 20 --json
ritmex-bot market kline --exchange <id> --symbol <symbol> --interval 1m --limit 120 --json
ritmex-bot account snapshot --exchange <id> --json
ritmex-bot position list --exchange <id> --symbol <symbol> --json
```

### Write flow (safe)

```bash
ritmex-bot order create --exchange <id> --symbol <symbol> --side buy --type market --qty 0.01 --dry-run --json
ritmex-bot order create --exchange <id> --symbol <symbol> --side buy --type market --qty 0.01 --json
ritmex-bot order open --exchange <id> --symbol <symbol> --json
```

### Strategy flow

```bash
ritmex-bot strategy run --strategy trend --exchange <id> --dry-run
ritmex-bot strategy run --strategy trend --exchange <id> --silent
```

## Completion Checklist

Before returning results to user:

1. Confirm command and parameters used.
2. Confirm whether run was `dryRun` or live.
3. For live writes, provide immediate post-check output (`order open` / `position list`).
4. If unsupported, explicitly name exchange + unsupported method.
5. If failed, return error code/message and next corrective action.
