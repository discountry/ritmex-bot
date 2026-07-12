# ritmex-bot

**Language Setting**: Set `LANG=en` in your `.env` file to display the CLI interface in English.

A Bun-powered multi-exchange perpetuals workstation that ships an SMA30 trend engine, a Guardian stop sentinel, and two market-making modes. It offers instant restarts, realtime market data, structured logging, and an Ink-based CLI dashboard.

If you'd like to support this project and get fee discounts, please consider using these referral links:

* [Lighter referral link](https://app.lighter.xyz/?referral=111909FA)
* [Ondo Perps invite link](https://app.ondoperps.xyz/?ref=4A3ACQ)
* [Aster referral link](https://www.asterdex.com/en/referral/4665f3)
* [StandX referral link](https://standx.com/referral?code=xingxingjun)
* [Binance referral link](https://www.binance.com/join?ref=KNKCA9XC)
* [GRVT referral link](https://grvt.io/exchange/sign-up?ref=sea)
* [Nado referral link](https://app.nado.xyz?join=LKbIUs5)
* [Backpack referral link](https://backpack.exchange/join/ritmex)
* [edgex referral link](https://pro.edgex.exchange/referral/BULL)
* [Paradex referral link](https://paradex.io/ref/xingxingjun)
* [Apex referral link](https://join.omni.apex.exchange/SEA)
* [Hyperliquid invite link](https://app.hyperliquid.xyz/join/RITMEX)

## CLI Command Mode (`ritmex-bot`)
`ritmex-bot` provides an agent-friendly command interface for exchange capability checks, market data, account/position queries, order operations, and strategy execution.

- It keeps the current environment-variable system intact: no renaming and no new required keys.
- `--symbol` is passed through exactly as provided (no symbol normalization).
- It supports `--dry-run` simulation and `--json` structured output for automation.

### Install This Project Skill (`skills add`)
```bash
bunx skills add https://github.com/discountry/ritmex-bot --skill use-ritmex-bot
```
If you need a specific branch/tag, append `--ref <branch-or-tag>`.

Full guide: [ritmex-bot CLI User Guide (English)](cli-guide.en.md)

## Documentation Map
- [ritmex-bot CLI User Guide (English)](cli-guide.en.md)
- [ritmex-bot CLI 使用手册（中文）](cli-guide.md)
- [Beginner-friendly Quick Start](simple-readme.md)
- [Grid Trading Strategy Guide](grid-trading.md)
- [Bilingual Exchange Configuration Guides](#exchange-setup-guides)
- [Ondo Perps Integration Guide](docs/ondoperps/README.md)

## Highlights
- **Live data & risk sync** via websockets with REST fallbacks and full reconciliation on restart.
- **Trend strategy** featuring SMA30 entries, fixed stop loss, trailing stop, Bollinger bandwidth gate, and profit-lock stepping.
- **Guardian strategy** that never opens trades but mirrors your live exposure, ensuring every position has a synced stop loss and trailing stop.
- **Market-making loop** with dual-sided quote chasing, loss caps, and automatic order healing.
- **Modular architecture** decoupling engines, exchange adapters, and the Ink CLI for easy venue or strategy extensions.

## Supported Exchanges

| Exchange | Market Type | Standard Required Settings | Notes |
| --- | --- | --- | --- |
| Aster | USDT perpetuals | `ASTER_API_KEY`, `ASTER_API_SECRET` | Production; default exchange |
| Binance | Spot + USDⓈ-M perpetuals | `BINANCE_API_KEY`, `BINANCE_API_SECRET` | `BINANCE_MARKET_TYPE` selects the market |
| StandX | USD perpetuals | `STANDX_TOKEN`, `STANDX_REQUEST_PRIVATE_KEY` | JWT authentication + Ed25519 trade signing |
| GRVT | USDT perpetuals | `GRVT_API_KEY`, `GRVT_API_SECRET`, `GRVT_SUB_ACCOUNT_ID`, `GRVT_INSTRUMENT` | `GRVT_ENV` supports `prod`/`testnet` |
| Lighter | Perpetuals + selected Spot markets | `LIGHTER_ACCOUNT_INDEX`, `LIGHTER_API_KEY_INDEX`, `LIGHTER_API_PRIVATE_KEY` | Defaults to `LIGHTER_ENV=testnet` |
| Backpack | Spot + USDC perpetuals | `BACKPACK_API_KEY`, `BACKPACK_API_SECRET` | Use an explicit `*_PERP` symbol for perpetuals |
| Paradex | USD perpetuals | `PARADEX_PRIVATE_KEY`, `PARADEX_WALLET_ADDRESS` | `PARADEX_SANDBOX=true` selects testnet |
| Nado | USDC perpetuals | `NADO_SIGNER_PRIVATE_KEY`, `NADO_SUBACCOUNT_OWNER` | `NADO_ENV` supports `inkMainnet`/`inkTestnet` |
| Ondo Perps | Crypto/equity/commodity perpetuals | `ONDOPERPS_API_KEY_ID`, `ONDOPERPS_API_SECRET` | HMAC authentication with production and sandbox endpoints |

## Requirements
- Bun >= 1.2 (both `bun` and `bunx` on PATH)
- macOS, Linux, or Windows via WSL (native Windows works but WSL is recommended)
- Node.js is optional unless your tooling requires it

## Quick Start
### One-line bootstrap (macOS / Linux / WSL)
```bash
curl -fsSL https://github.com/discountry/ritmex-bot/raw/refs/heads/main/setup.sh | bash
```
The script installs Bun, project dependencies, collects Aster API credentials, generates `.env`, and launches the CLI. Prepare the relevant exchange API keys before running it.

### Manual installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/discountry/ritmex-bot.git
   cd ritmex-bot
   ```
   Alternatively, download the ZIP from GitHub and extract it manually.
2. **Install Bun**
   - macOS / Linux: `curl -fsSL https://bun.sh/install | bash`
   - Windows PowerShell: `powershell -c "irm bun.sh/install.ps1 | iex"`
   Re-open the terminal and verify `bun -v` prints a version.
3. **Install dependencies**
   ```bash
   bun install
   ```
4. **Create your environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with the exchange credentials and overrides you plan to use.
5. **Launch the CLI**
   ```bash
   bun run index.ts
   ```
   Use the arrow keys to pick a strategy, `Enter` to start, `Esc` to go back, and `Ctrl+C` to exit.

## Shared Configuration
`.env.example` captures all defaults; the most common settings are summarised below.

| Variable | Purpose |
| --- | --- |
| `EXCHANGE` | Choose the venue (`aster` / `binance` / `standx` / `grvt` / `lighter` / `backpack` / `paradex` / `nado` / `ondoperps`) |
| `TRADE_SYMBOL` | Contract symbol (defaults to `BTCUSDT`) |
| `TRADE_AMOUNT` | Order size in base asset units |
| `LOSS_LIMIT` | Max per-trade loss in USDT before forced close |
| `TRAILING_PROFIT` / `TRAILING_CALLBACK_RATE` | Trailing stop trigger (USDT) and pullback percentage |
| `PROFIT_LOCK_TRIGGER_USD` / `PROFIT_LOCK_OFFSET_USD` | Profit lock trigger and offset thresholds |
| `BOLLINGER_*` | Bollinger bandwidth filters for the trend engine |
| `PRICE_TICK` / `QTY_STEP` | Exchange precision filters for price and quantity |
| `POLL_INTERVAL_MS` | Trend engine polling cadence in milliseconds |
| `MAX_CLOSE_SLIPPAGE_PCT` | Allowed deviation vs mark price when closing |
| `MAKER_*` | Maker-specific knobs (quote offsets, refresh cadence, slippage guard, etc.) |

> CLI flags override environment variables at runtime:
> ```bash
> bun run index.ts --exchange grvt --strategy maker
> bun run index.ts -e lighter -s offset-maker --silent
> ```

## Exchange Setup Guides

Each supported exchange has a standalone Chinese and English configuration guide covering credential creation, required variables, environment selection, symbol formats, read-only verification, and security controls.

| Exchange | English Guide | 中文教程 |
| --- | --- | --- |
| Aster | [Configuration Guide](docs/exchanges/aster.en.md) | [配置教程](docs/exchanges/aster.md) |
| Binance | [Configuration Guide](docs/exchanges/binance.en.md) | [配置教程](docs/exchanges/binance.md) |
| StandX | [Configuration Guide](docs/exchanges/standx.en.md) | [配置教程](docs/exchanges/standx.md) |
| GRVT | [Configuration Guide](docs/exchanges/grvt.en.md) | [配置教程](docs/exchanges/grvt.md) |
| Lighter | [Configuration Guide](docs/exchanges/lighter.en.md) | [配置教程](docs/exchanges/lighter.md) |
| Backpack | [Configuration Guide](docs/exchanges/backpack.en.md) | [配置教程](docs/exchanges/backpack.md) |
| Paradex | [Configuration Guide](docs/exchanges/paradex.en.md) | [配置教程](docs/exchanges/paradex.md) |
| Nado | [Configuration Guide](docs/exchanges/nado.en.md) | [配置教程](docs/exchanges/nado.md) |
| Ondo Perps | [Configuration Guide](docs/exchanges/ondoperps.en.md) | [配置教程](docs/exchanges/ondoperps.md) |

## Command Cheatsheet
```bash
bun run index.ts   # Launch the CLI (default entrypoint)
bun run start      # Alias for bun run index.ts
bun run dev        # Development entrypoint
bun run lint       # Run Oxlint checks
bun run lint:fix   # Apply safe Oxlint fixes
bun x vitest run   # Execute the full Vitest suite
```

## ritmex-bot Command Mode (Agent-friendly)
The project now supports a standalone command mode with the command name `ritmex-bot`:

```bash
ritmex-bot doctor
ritmex-bot exchange list
ritmex-bot market ticker --exchange binance --symbol BTCUSDT
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --dry-run
ritmex-bot strategy run --strategy maker --exchange standx --silent --dry-run
```

### Run Modes
```bash
# Global install
bun add -g ritmex-bot
ritmex-bot doctor

# No install
bunx ritmex-bot doctor
```

### Global Flags
- `--exchange`: picks exchange using the existing env/config logic
- `--symbol`: passed through as-is (no symbol normalization)
- `--dry-run`: simulation mode (no real create/cancel side effects)
- `--json`: structured JSON output for AI agents
- `--timeout`: command timeout in milliseconds

## Silent & Background Execution
### Direct silent launch
Skip the Ink menu and start a strategy directly:
```bash
bun run index.ts --strategy trend --silent
bun run index.ts --strategy maker --silent
bun run index.ts --strategy offset-maker --silent
```
Combine with `--exchange/-e` to pin the venue for that run.

### Package scripts
Convenience aliases exposed via `package.json`:
```bash
bun run start:trend:silent
bun run start:maker:silent
bun run start:offset:silent
```

### Daemonising with pm2
Install `pm2` locally (e.g. `bun add -d pm2`) and launch the process:
```bash
bunx pm2 start bun --name ritmex-trend --cwd . --restart-delay 5000 -- run index.ts --strategy trend --silent
```
You can also call the bundled scripts:
```bash
bun run pm2:start:trend
bun run pm2:start:maker
bun run pm2:start:offset
```
Run `pm2 save` afterwards if you want the process list to survive reboots.

## Testing
Powered by Vitest:
```bash
bun run lint
bun run lint:fix
bun run test
bun x vitest --watch
```

## Troubleshooting
- Keep at least 50-100 USDT in the account before deploying a live strategy.
- Configure leverage on the exchange manually (~50x is recommended); the bot will not change it.
- Ensure your server or workstation clock is in sync to avoid signature errors.
- Accounts must run in one-way position mode.
- **Env not loading**: make sure `.env` lives in the repo root and variable names are spelled correctly.
- **Permission rejected**: confirm the API key has perpetual trading scopes enabled.
- **Precision errors**: align `PRICE_TICK`, `QTY_STEP`, and `TRADE_SYMBOL` with the exchange filters.
See [simple-readme.md](simple-readme.md) for more detailed walkthroughs.

## Community & Support
- Telegram: [https://t.me/+4fdo0quY87o4Mjhh](https://t.me/+4fdo0quY87o4Mjhh)
- Issues and PRs are welcome for bug reports and feature requests

## Disclaimer
Algorithmic trading carries risk. Validate strategies with paper trading or small capital first, safeguard your API keys, and only grant the minimum required permissions.
