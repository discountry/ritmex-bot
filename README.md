# ritmex-bot

> For English users, please see [README_en.md](README_en.md).

Please set `LANG=en` in `.env` for English interface.

A Bun-powered multi-exchange perpetuals workstation that ships an SMA30 trend engine, a Guardian stop sentinel, and two market-making modes. It offers instant restarts, realtime market data, structured logging, and an Ink-based CLI dashboard.

基于 Bun 的多交易所永续合约量化终端，内置趋势跟随（SMA30）、Guardian 防守与做市策略，支持快速恢复、实时行情订阅、日志追踪与 CLI 仪表盘。

如果您希望获取优惠并支持本项目，请考虑使用以下注册链接：

* [Lighter 手续费优惠注册链接](https://app.lighter.xyz/?referral=RITMEX)
* [Hyperliquid 邀请注册链接](https://app.hyperliquid.xyz/join/RITMEX)
* [Ondo Perps 邀请注册链接](https://app.ondoperps.xyz/?ref=4A3ACQ)
* [Aster 手续费优惠注册链接](https://www.asterdex.com/zh-CN/referral/4665f3)
* [StandX 手续费优惠注册链接](https://standx.com/referral?code=xingxingjun)
* [Binance 手续费优惠注册链接](https://www.binance.com/join?ref=KNKCA9XC)
* [Nado 手续费优惠注册链接](https://app.nado.xyz?join=LKbIUs5)
* [Backpack 手续费优惠注册链接](https://backpack.exchange/join/ritmex)
* [edgex 手续费优惠注册链接](https://pro.edgex.exchange/referral/BULL)
* [Paradex 手续费优惠注册链接](https://paradex.io/ref/xingxingjun)
* [Apex 手续费优惠注册链接](https://join.omni.apex.exchange/SEA)
* [GRVT 手续费优惠注册链接](https://grvt.io/exchange/sign-up?ref=sea)

## CLI 命令模式（ritmex-bot）
`ritmex-bot` 支持 Agent 友好的结构化命令调用，覆盖交易所能力查询、行情、账户、仓位、下单、撤单与策略启动。

- 保持现有环境变量体系，不新增也不改名，只读取当前执行环境中的变量。
- `--symbol` 原样透传，不对交易对做统一改写。
- 支持 `--dry-run` 模拟执行与 `--json` 结构化输出，便于自动化系统集成。

### 安装当前项目 Skill（skills add）
```bash
bunx skills add https://github.com/discountry/ritmex-bot --skill use-ritmex-bot
```
如需指定分支，可追加 `--ref <branch-or-tag>`。

完整文档请见：[ritmex-bot CLI 使用手册（中文）](cli-guide.md)

## 文档索引
- [ritmex-bot CLI 使用手册（中文）](cli-guide.md)
- [ritmex-bot CLI User Guide (English)](cli-guide.en.md)
- [简明上手指南（零基础）](simple-readme.md)
- [基础网格策略使用教程](grid-trading.md)
- [各交易所中英文配置教程](#交易所配置指南)
- [Ondo Perps 接入说明](docs/ondoperps/README.md)

## 核心特性
- **实时行情与风控**：Websocket + REST 自动同步账户、挂单与仓位，断线后自动恢复。
- **趋势策略**：SMA30 穿越入场，内置止损、移动止盈、布林带带宽过滤与步进锁盈。
- **Guardian 策略**：不主动开单，实时监听账户仓位并强制补挂/移动止损与动态止盈，防止裸奔。
- **做市策略**：支持双边追价、风险阈值控制与订单自愈。
- **模块化架构**：策略引擎、交易所适配器与 Ink CLI 相互解耦，新增交易所或策略更容易。

## 支持的交易所

| 交易所 | 市场类型 | 标准配置必填项 | 备注 |
| --- | --- | --- | --- |
| Aster | USDT 永续 | `ASTER_API_KEY`, `ASTER_API_SECRET` | 生产环境；默认交易所 |
| Binance | 现货 + USDⓈ-M 永续 | `BINANCE_API_KEY`, `BINANCE_API_SECRET` | `BINANCE_MARKET_TYPE` 选择市场 |
| StandX | USD 永续 | `STANDX_TOKEN`, `STANDX_REQUEST_PRIVATE_KEY` | JWT 认证 + Ed25519 交易签名 |
| GRVT | USDT 永续 | `GRVT_API_KEY`, `GRVT_API_SECRET`, `GRVT_SUB_ACCOUNT_ID`, `GRVT_INSTRUMENT` | `GRVT_ENV` 支持 `prod`/`testnet` |
| Lighter | 永续 + 部分现货 | `LIGHTER_ACCOUNT_INDEX`, `LIGHTER_API_KEY_INDEX`, `LIGHTER_API_PRIVATE_KEY` | 默认 `LIGHTER_ENV=testnet` |
| Backpack | 现货 + USDC 永续 | `BACKPACK_API_KEY`, `BACKPACK_API_SECRET` | 永续应显式使用 `*_PERP` 符号 |
| Paradex | USD 永续 | `PARADEX_PRIVATE_KEY`, `PARADEX_WALLET_ADDRESS` | `PARADEX_SANDBOX=true` 使用测试网 |
| Nado | USDC 永续 | `NADO_SIGNER_PRIVATE_KEY`, `NADO_SUBACCOUNT_OWNER` | `NADO_ENV` 支持 `inkMainnet`/`inkTestnet` |
| Ondo Perps | 加密资产/股票/商品永续 | `ONDOPERPS_API_KEY_ID`, `ONDOPERPS_API_SECRET` | HMAC 鉴权；支持生产与沙盒环境 |

## 系统要求
- Bun ≥ 1.2（需同时包含 `bun`、`bunx` 命令）
- macOS、Linux 或 Windows (推荐 WSL)
- Node.js 仅在部分工具链场景需要，可选

## 快速上手
### 一键脚本（macOS / Linux / WSL）
```bash
curl -fsSL https://github.com/discountry/ritmex-bot/raw/refs/heads/main/setup.sh | bash
```
脚本会安装 Bun、项目依赖，收集 Aster API 凭证，生成 `.env` 并启动 CLI。运行前请准备好对应交易所的 API Key/Secret。

### 手动安装
1. **获取代码**
   ```bash
   git clone https://github.com/discountry/ritmex-bot.git
   cd ritmex-bot
   ```
   不便使用 Git 时，可在仓库页面下载 ZIP 后手动解压。
2. **安装 Bun**
   - macOS / Linux：`curl -fsSL https://bun.sh/install | bash`
   - Windows PowerShell：`powershell -c "irm bun.sh/install.ps1 | iex"`
   安装完成后重新打开终端，确认 `bun -v` 正常输出版本号。
3. **安装依赖**
   ```bash
   bun install
   ```
4. **复制环境变量模板并填写**
   ```bash
   cp .env.example .env
   ```
   按下文指南修改 `.env`，至少需要正确配置一个交易所的凭证。
5. **运行 CLI**
   ```bash
   bun run index.ts
   ```
   方向键选择策略并回车启动；`Esc` 返回菜单，`Ctrl+C` 退出。

## 通用环境变量
`.env.example` 提供了所有默认键值，下表概括最常用参数：

| 变量 | 说明 |
| --- | --- |
| `EXCHANGE` | 选择交易所（`aster`/`binance`/`standx`/`grvt`/`lighter`/`backpack`/`paradex`/`nado`/`ondoperps`） |
| `TRADE_SYMBOL` | 交易对（默认 `BTCUSDT`） |
| `TRADE_AMOUNT` | 单笔下单数量（标的资产计） |
| `LOSS_LIMIT` | 单笔最大亏损触发的强平额度（USDT） |
| `TRAILING_PROFIT` / `TRAILING_CALLBACK_RATE` | 动态止盈触发值（USDT）与回撤百分比 |
| `PROFIT_LOCK_TRIGGER_USD` / `PROFIT_LOCK_OFFSET_USD` | 浮盈超过阈值后上调止损的触发金额与偏移 |
| `BOLLINGER_*` | 趋势策略布林带过滤参数 |
| `PRICE_TICK` / `QTY_STEP` | 交易所要求的最小报价与数量精度 |
| `POLL_INTERVAL_MS` | 趋势策略循环间隔（毫秒） |
| `MAX_CLOSE_SLIPPAGE_PCT` | 平仓时相对标记价允许的最大偏差 |
| `MAKER_*` | 做市策略专属参数（追价阈值、报价偏移、刷新频率等） |

> 可通过命令行临时覆盖交易所与策略（优先级高于 `.env`）：
> ```bash
> bun run index.ts --exchange grvt --strategy maker
> bun run index.ts -e lighter -s offset-maker --silent
> ```

## 交易所配置指南

每个受支持交易所均提供独立的中文与英文配置教程。教程覆盖凭证获取、必填变量、网络选择、符号格式、只读验证和安全要求。

| 交易所 | 中文教程 | English Guide |
| --- | --- | --- |
| Aster | [配置教程](docs/exchanges/aster.md) | [Configuration Guide](docs/exchanges/aster.en.md) |
| Binance | [配置教程](docs/exchanges/binance.md) | [Configuration Guide](docs/exchanges/binance.en.md) |
| StandX | [配置教程](docs/exchanges/standx.md) | [Configuration Guide](docs/exchanges/standx.en.md) |
| GRVT | [配置教程](docs/exchanges/grvt.md) | [Configuration Guide](docs/exchanges/grvt.en.md) |
| Lighter | [配置教程](docs/exchanges/lighter.md) | [Configuration Guide](docs/exchanges/lighter.en.md) |
| Backpack | [配置教程](docs/exchanges/backpack.md) | [Configuration Guide](docs/exchanges/backpack.en.md) |
| Paradex | [配置教程](docs/exchanges/paradex.md) | [Configuration Guide](docs/exchanges/paradex.en.md) |
| Nado | [配置教程](docs/exchanges/nado.md) | [Configuration Guide](docs/exchanges/nado.en.md) |
| Ondo Perps | [配置教程](docs/exchanges/ondoperps.md) | [Configuration Guide](docs/exchanges/ondoperps.en.md) |

## 命令速查
```bash
bun run index.ts   # 启动 CLI（默认入口）
bun run start      # 等价于运行 index.ts
bun run dev        # 调试模式
bun run lint       # 执行 Oxlint 检查
bun run lint:fix   # 自动修复可安全修复的问题
bun x vitest run   # 执行全部测试
```

## ritmex-bot 命令模式（Agent 友好）
项目现已支持独立命令模式，命令名为 `ritmex-bot`：

```bash
ritmex-bot doctor
ritmex-bot exchange list
ritmex-bot market ticker --exchange binance --symbol BTCUSDT
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --dry-run
ritmex-bot strategy run --strategy maker --exchange standx --silent --dry-run
```

### 运行方式
```bash
# 全局安装
bun add -g ritmex-bot
ritmex-bot doctor

# 不安装直接运行
bunx ritmex-bot doctor
```

### 全局参数
- `--exchange`：按现有逻辑选择交易所（不修改原有环境变量体系）
- `--symbol`：原样透传，不做统一或改写
- `--dry-run`：模拟执行，不发真实下单/撤单请求
- `--json`：输出结构化 JSON，便于 AI Agent 解析
- `--timeout`：命令超时毫秒数

## 静默启动与后台运行
### 直接静默启动
无需进入 Ink 菜单，可用命令行直接拉起指定策略：
```bash
bun run index.ts --strategy trend --silent
bun run index.ts --strategy maker --silent
bun run index.ts --strategy offset-maker --silent
```
如需同时指定交易所，可叠加 `--exchange/-e` 参数。

### 项目内置脚本
`package.json` 提供了便捷脚本：
```bash
bun run start:trend:silent
bun run start:maker:silent
bun run start:offset:silent
```

### 使用 pm2 守护并自动重启
安装 `pm2`（示例：`bun add -d pm2`）后，可在项目内直接运行：
```bash
bunx pm2 start bun --name ritmex-trend --cwd . --restart-delay 5000 -- run index.ts --strategy trend --silent
```
或调用预置脚本：
```bash
bun run pm2:start:trend
bun run pm2:start:maker
bun run pm2:start:offset
```
完成配置后可执行 `pm2 save` 持久化进程列表。

## 测试
项目使用 Vitest：
```bash
bun run lint
bun run lint:fix
bun run test
bun x vitest --watch
```

## 常见问题
- 至少准备 50–100 USDT 资金以覆盖策略运行需求。
- 杠杆需在交易所提前设置（建议 ~50 倍），程序不会自动调整。
- 请确保服务器/电脑时间同步真实世界时间，避免签名过期。
- 账户需保持单向持仓模式。
- `.env` 未读取：确认文件位于项目根目录且变量名无误。
- API 拒绝访问：检查交易所后台权限，确保开启合约读写。
- 精度错误：同步交易对的最小价格与数量步长。
更多排查细节可参见 [简明上手指南](simple-readme.md)。

## 社区与支持
- Telegram 交流群：[https://t.me/+4fdo0quY87o4Mjhh](https://t.me/+4fdo0quY87o4Mjhh)
- 欢迎通过 Issue 或 PR 提交反馈、特性建议

## 风险提示
量化交易具备风险。请先在仿真或小额账户中验证策略表现，妥善保管 API 密钥，仅开启必要权限。
