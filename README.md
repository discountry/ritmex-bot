# ritmex-bot

一个基于 Bun 的 Aster 永续合约终端机器人，内置趋势跟随（SMA30）与做市策略，使用 websocket 实时行情，命令行界面由 Ink 驱动，可在断线后自动恢复运行。

## 快速上手

使用优惠码获取 30% 手续费折扣：[注册 Aster 获取手续费优惠](https://www.asterdex.com/zh-CN/referral/4665f3)

如果你完全不懂代码，可以查看 **[小白教程](simple-readme.md) 了解使用方法。**

遇到Bug，反馈问题，请到 [Telegram群组](https://t.me/+4fdo0quY87o4Mjhh)

### 一键脚本

一键安装并启动（macOS / Linux）：
```bash
curl -fsSL https://github.com/discountry/ritmex-bot/raw/refs/heads/main/setup.sh | bash
```
脚本会自动安装 Bun、安装依赖、引导输入 API Key/Secret，生成 `.env` 并启动程序。

Windows 使用 WSL（推荐）：
1. 先安装并启用 WSL，参考微软官方文档：[在 Windows 上安装 WSL](https://learn.microsoft.com/zh-cn/windows/wsl/install)
2. 在命令行或者 PowerShell 输入 `wsl` 并按下回车打开 WSL。
3. 在 WSL 中运行一键脚本：
   ```bash
   curl -fsSL https://github.com/discountry/ritmex-bot/raw/refs/heads/main/setup.sh | bash
   ```
   按提示输入 ASTER_API_KEY / ASTER_API_SECRET，脚本将自动安装 Bun、依赖并启动程序。

## 手动安装

1. **下载代码**
   - 如果会使用 Git：`git clone https://github.com/discountry/ritmex-bot.git`
   - 如果不会使用 Git：点击仓库页面的 `Code` → `Download ZIP`，将压缩包解压到如 `桌面/ritmex-bot` 的目录。
2. **打开命令行并进入项目目录**
   - macOS：通过 Spotlight (`⌘ + 空格`) 搜索 “Terminal” 并打开。
   - Windows：在开始菜单搜索 “PowerShell” 或 “Windows Terminal” 并打开。
   - 使用 `cd` 切换到项目目录，例如：
     ```bash
     # macOS / Linux
     cd ~/Desktop/ritmex-bot  
     # Windows         
     cd C:\Users\用户名\Desktop\ritmex-bot   
     ```
3. **安装 [Bun](https://bun.com) ≥ 1.2**
   - macOS / Linux：
     ```bash
     curl -fsSL https://bun.sh/install | bash
     ```
   - Windows（PowerShell）：
     ```powershell
     powershell -c "irm bun.sh/install.ps1 | iex"
     ```
   安装完成后关闭并重新打开终端，运行 `bun -v` 确认命令可用。

   如果上述命令无法完成安装，请尝试 [bun官网](https://bun.com/get) 提供的各种安装方式。

   Windows 用户如果无法正常安装，可以尝试先[安装 nodejs](https://nodejs.org/en/download)

   然后使用 `npm` 安装 `bun`：
   ```bash
   npm install -g bun
   ```
4. **安装依赖**
   ```bash
   bun install
   ```
5. **配置环境变量**
   复制 `.env.example` 为 `.env` 并填入你的 Aster API Key/Secret：
   ```bash
   cp .env.example .env
   ```
   然后根据需要修改 `.env` 中的配置项：
   - API KEY 获取地址 [https://www.asterdex.com/zh-CN/api-management](https://www.asterdex.com/zh-CN/api-management)
   - `ASTER_API_KEY` / `ASTER_API_SECRET`：Aster 交易所提供的 API 凭证。
   - `TRADE_SYMBOL`：策略运行的交易对（默认 `BTCUSDT`），需与 API 权限范围一致。
   - `TRADE_AMOUNT`：单次下单数量（合约张数折算后单位为标的货币，例如 BTC）。
   - `LOSS_LIMIT`：单笔允许的最大亏损（USDT），触发即强制平仓。
   - `TRAILING_PROFIT` / `TRAILING_CALLBACK_RATE`：趋势策略的动态止盈触发值（单位 USDT）与回撤百分比（百分数，如 0.2 表示 0.2%）。
   - `PROFIT_LOCK_TRIGGER_USD` / `PROFIT_LOCK_OFFSET_USD`：达到一定浮盈后，将基础止损上调（做多）或下调（做空）到开仓价的偏移量（单位 USDT）。
   - `PRICE_TICK` / `QTY_STEP`：交易对的最小价格变动单位与最小下单数量步长（例如 BTCUSDT 分别为 0.1 与 0.001）。
   - `MAKER_*` 参数：做市策略追价阈值、报价偏移、刷新频率等，可按流动性需求调节。
6. **运行机器人**
   ```bash
   bun run index.ts
   ```
   在终端中按 ↑/↓ 选择 “趋势策略” 或 “做市策略”，回车启动。按 `Esc` 可返回选择菜单，`Ctrl+C` 退出。
7. **风险提示**
   建议先在小额或仿真环境中测试策略；真实资金操作前请确认 API 仅开启必要权限，并逐步验证配置。

A Bun-powered trading workstation for Aster perpetual contracts. The project ships two production strategies—an SMA30 trend follower and a dual-sided maker—that share a modular gateway, UI, and runtime state derived entirely from the exchange. Everything runs in the terminal via Ink, with live websocket refresh and automatic recovery from restarts or network failures.

## Features
- **Live data over websockets** with REST fallbacks and automatic re-sync after reconnects.
- **Trend strategy**: SMA30 crossover entries, automated stop-loss / trailing-stop, and P&L tracking.
- **Maker strategy**: adaptive bid/ask chasing, risk stops, and target order introspection.
- **Extensibility**: exchange gateway, engines, and UI components are modular for new venues or strategies.

## Requirements
- [Bun](https://bun.com) ≥ 1.2
- Node.js (optional, only if you prefer `npm` tooling)
- Valid Aster API credentials with futures access

## Installation
```bash
bun install
```

## Configuration
Create an `.env` (or export environment variables) with at least:
```bash
ASTER_API_KEY=your_key
ASTER_API_SECRET=your_secret
TRADE_SYMBOL=BTCUSDT        # optional, defaults to BTCUSDT
TRADE_AMOUNT=0.001          # position size used by both strategies
LOSS_LIMIT=0.03             # per-trade USD loss cap
TRAILING_PROFIT=0.2         # trailing activation profit in USDT
TRAILING_CALLBACK_RATE=0.2  # trailing callback in percent, e.g. 0.2 => 0.2%
PROFIT_LOCK_TRIGGER_USD=0.1 # profit threshold to start moving base stop (USDT)
PROFIT_LOCK_OFFSET_USD=0.05 # base stop offset from entry after trigger (USDT)
PRICE_TICK=0.1              # price tick size; set per symbol
QTY_STEP=0.001              # quantity step size; set per symbol
```
Additional maker-specific knobs (`MAKER_*`) live in `src/config.ts` and may be overridden via env vars:
```bash
# Maker-specific (units in USDT unless noted)
MAKER_LOSS_LIMIT=0.03             # override maker risk stop; defaults to LOSS_LIMIT
MAKER_PRICE_CHASE=0.3             # chase threshold
MAKER_BID_OFFSET=0                # bid offset from top bid (USDT)
MAKER_ASK_OFFSET=0                # ask offset from top ask (USDT)
MAKER_REFRESH_INTERVAL_MS=1500    # maker refresh cadence (ms)
MAKER_MAX_CLOSE_SLIPPAGE_PCT=0.05 # allowed deviation vs mark when closing
MAKER_PRICE_TICK=0.1              # maker tick size; defaults to PRICE_TICK
```

To switch the entire CLI to GRVT instead of Aster, set `EXCHANGE=grvt` and provide the programmable API credentials:

```bash
EXCHANGE=grvt
GRVT_API_KEY=your_api_key
GRVT_API_SECRET=0xabc123...            # private key used for EIP-712 order signatures
GRVT_SUB_ACCOUNT_ID=your_sub_account   # sub account that actually trades
GRVT_INSTRUMENT=BTC_USDT_Perp          # instrument as defined by GRVT
GRVT_SYMBOL=BTCUSDT                    # optional display symbol; defaults to instrument sans underscores
GRVT_ENV=prod                          # optional environment switch (prod/testnet/staging/dev)
# Optional overrides
# GRVT_SIGNER_PATH=./grvt-signer.cjs   # replace the built-in signer if you run an external service
# GRVT_COOKIE="gravity=..."           # pre-provisioned session cookie (auto-fetched via API key when absent)
# GRVT_ACCOUNT_ID=...                 # populated automatically after login
```

The adapter logs in with `GRVT_API_KEY`, refreshes cookies automatically, and signs orders locally using `GRVT_API_SECRET` following GRVT's EIP‑712 schema. If you prefer to delegate signing to another process, set `GRVT_SIGNER_PATH`; the module should export a function (default export also works) that receives a context object (unsigned order, nonce/expiration, instrument metadata, chain id, etc.) and returns `{ signer, r, s, v, expiration, nonce }`. If you leave `GRVT_SIGNER_PATH` unset, the built-in signer uses `GRVT_API_SECRET` directly.

### 切换到 GRVT 交易所

将环境变量 `EXCHANGE` 设为 `grvt` 后，所有策略会改用 GRVT 适配器：

```bash
EXCHANGE=grvt
GRVT_API_KEY=你的APIKey
GRVT_API_SECRET=0xabc123...                 # 用于订单签名的私钥
GRVT_SUB_ACCOUNT_ID=your_sub_account_id     # 具体交易子账号
GRVT_INSTRUMENT=BTC_USDT_Perp               # 交易品种，需与策略一致
GRVT_SYMBOL=BTCUSDT                         # 可选，内部用于展示，默认由 instrument 推导
GRVT_ENV=prod                               # 可选：prod / testnet / staging / dev，默认 prod
# 可选覆盖项
# GRVT_SIGNER_PATH=./grvt-signer.cjs        # 如果你希望由外部服务签名
# GRVT_COOKIE="gravity=..."                # 预先获取到的 Cookie（若未提供，将使用 API Key 自动登录）
# GRVT_ACCOUNT_ID=...                      # 登录后自动填充
```

适配器会基于 `GRVT_API_SECRET` 自动完成 EIP‑712 签名并提交订单。如果你需要自定义签名流程，可通过 `GRVT_SIGNER_PATH` 指定模块（CommonJS 或 ESM 均可）。模块需导出一个函数，接收签名上下文（未签名订单、nonce/expiration、合约元信息、链 ID 等）并返回包含 `signer/r/s/v/expiration/nonce` 字段的对象，例如：

```js
// grvt-signer.cjs
module.exports = async function signOrder(context) {
  // 调用你自己的签名服务，或者使用本地私钥完成签名
  const signature = await mySigner(context);
  return {
    signer: signature.signer,
    r: signature.r,
    s: signature.s,
    v: signature.v,
    expiration: signature.expiration,
    nonce: signature.nonce,
  };
};
```

如未自定义 `GRVT_SIGNER_PATH`，适配器会直接使用 `GRVT_API_SECRET` 完成签名。

## Running the CLI
```bash
bun run index.ts   # or: bun run dev / bun run start
```
Pick a strategy with the arrow keys. Press `Esc` to return to the menu. The dashboard shows live order books, holdings, pending orders, and recent events. 状态完全以交易所数据为准，重新启动时会自动同步账户和挂单。

## Testing
```bash
bun run test        # bun x vitest run
bun run test:watch  # stay in watch mode
```
Current tests cover the order coordinator utilities and strategy helpers; add unit tests beside new modules as you extend the system.

## Project Layout
- `src/config.ts` – shared runtime configuration
- `src/core/` – trend & maker engines plus order coordination
- `src/exchanges/` – Aster REST/WS gateway and adapters
- `src/ui/` – Ink components and strategy dashboards
- `src/utils/` – math helpers and strategy utilities
- `tests/` – Vitest suites for critical modules

## Troubleshooting
- **Websocket reconnect loops**: ensure outbound access to `wss://fstream.asterdex.com/ws` and REST endpoints.
- **429 or 5xx responses**: the gateway backs off automatically, but check your rate limits and credentials.
- **CLI input errors**: run in a real TTY; non-interactive shells disable keyboard shortcuts but the UI still renders.

## Contributing
Issues and PRs are welcome. When adding strategies or exchanges, follow the modular patterns in `src/core` and add tests under `tests/`.
