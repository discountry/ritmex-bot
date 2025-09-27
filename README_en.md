# ritmex-bot

A Bun-powered trading workstation for Aster perpetual contracts that ships two production-ready agents: an SMA30 trend follower and a dual-sided market maker. The CLI is built with Ink, synchronises risk state from the exchange, and automatically recovers from restarts or disconnects.

## Documentation Map
- [中文 README](README.md)
- [Beginner-friendly Quick Start](simple-readme.md)

## Highlights
- **Live market data & risk sync** via websocket feeds with REST fallbacks, full reconciliation on restart.
- **Trend engine** featuring SMA30 entries, fixed stop loss, trailing stop, Bollinger bandwidth gate, and profit-lock stepping.
- **Market-making loop** with adaptive quote chasing, loss caps, and automatic order healing.
- **Extensible architecture** decoupling exchange adapters, engines, and the Ink CLI for easy venue or strategy additions.

## Requirements
- Bun ≥ 1.2 (`bun`, `bunx` available on PATH)
- macOS, Linux, or Windows via WSL (native Windows works but WSL is recommended)
- Node.js is optional unless your environment requires it for tooling

## One-Line Bootstrap (macOS / Linux / WSL)
```bash
curl -fsSL https://github.com/discountry/ritmex-bot/raw/refs/heads/main/setup.sh | bash
```
The script installs Bun, project dependencies, collects Aster API credentials, generates `.env`, and launches the CLI. Prepare your API Key/Secret before running.

## Manual Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/discountry/ritmex-bot.git
   cd ritmex-bot
   ```
   Alternatively download the ZIP from GitHub and extract it manually.
2. **Install Bun**
   - macOS / Linux: `curl -fsSL https://bun.sh/install | bash`
   - Windows PowerShell: `powershell -c "irm bun.sh/install.ps1 | iex"`
   Re-open the terminal and confirm `bun -v` prints a version.
3. **Install dependencies**
   ```bash
   bun install
   ```
4. **Create your environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your exchange credentials and overrides.
5. **Launch the CLI**
   ```bash
   bun run index.ts
   ```
   Use the arrow keys to pick a strategy, `Enter` to start, `Esc` to return to the menu, and `Ctrl+C` to exit.

## Environment Variables
The most important settings shipped in `.env.example` are summarised below:

| Variable | Purpose |
| --- | --- |
| `ASTER_API_KEY` / `ASTER_API_SECRET` | Required Aster exchange credentials |
| `TRADE_SYMBOL` | Contract symbol, defaults to `BTCUSDT` |
| `TRADE_AMOUNT` | Order size in base asset units |
| `LOSS_LIMIT` | Max per-trade loss (USDT) before forced close |
| `TRAILING_PROFIT` / `TRAILING_CALLBACK_RATE` | Trailing stop trigger amount (USDT) and pullback percentage |
| `PROFIT_LOCK_TRIGGER_USD` / `PROFIT_LOCK_OFFSET_USD` | Move the base stop once unrealised PnL exceeds this trigger |
| `BOLLINGER_LENGTH` / `BOLLINGER_STD_MULTIPLIER` | Window size and std-dev multiplier for bandwidth filtering |
| `MIN_BOLLINGER_BANDWIDTH` | Minimum bandwidth ratio required before opening a new position |
| `PRICE_TICK` / `QTY_STEP` | Exchange precision filters for price and quantity |
| `POLL_INTERVAL_MS` | Trend engine polling cadence in milliseconds |
| `MAX_CLOSE_SLIPPAGE_PCT` | Allowed deviation vs mark price when closing |
| `MAKER_*` | Maker strategy knobs: chase threshold, quote offsets, refresh cadence, etc. |

To trade on GRVT, set `EXCHANGE=grvt` and populate `GRVT_API_KEY`, `GRVT_API_SECRET`, `GRVT_SUB_ACCOUNT_ID`, plus any optional overrides documented in `.env.example`.

## Common Commands
```bash
bun run index.ts   # Launch the CLI
bun run start      # Same as above
bun run dev        # Development entry point
bun x vitest run   # Execute the Vitest suite
```

## Testing
Vitest powers the unit tests:
```bash
bun run test
bun x vitest --watch
```

## Troubleshooting
- **Env not loading**: ensure `.env` resides in the repository root and variable names are spelled correctly.
- **Order rejected for precision**: align `PRICE_TICK`, `QTY_STEP`, and `TRADE_SYMBOL` with the exchange filters.
- **Permission or auth errors**: double-check exchange API scopes.
More step-by-step guidance is available in [simple-readme.md](simple-readme.md).

## Community & Support
- Telegram: [https://t.me/+4fdo0quY87o4Mjhh](https://t.me/+4fdo0quY87o4Mjhh)
- Issues and PRs are welcome for bug reports and feature ideas

## Disclaimer
Algorithmic trading carries risk. Validate strategies with paper accounts or small capital first, safeguard your API keys, and only grant the minimum required permissions.
