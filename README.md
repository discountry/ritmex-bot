# ritmex-bot

基于 Bun 的多交易所永续合约量化终端，内置趋势跟随（SMA30）与做市策略，支持快速恢复、实时行情订阅、日志追踪与 CLI 仪表盘。

如果您希望获取优惠并支持本项目，请考虑使用以下注册链接：

* [Aster 30% 手续费优惠注册链接](https://www.asterdex.com/zh-CN/referral/4665f3)
* [Binance 手续费优惠注册链接](https://www.binance.com/join?ref=KNKCA9XC)
* [GRVT 手续费优惠注册链接](https://grvt.io/exchange/sign-up?ref=sea)
* [Backpack 手续费优惠注册链接](https://backpack.exchange/join/ritmex)
* [edgex 手续费优惠注册链接](https://pro.edgex.exchange/referral/BULL)
* [Paradex 手续费优惠注册链接](https://paradex.io/ref/xingxingjun)
* [Apex 手续费优惠注册链接](https://join.omni.apex.exchange/SEA)

## 文档索引
- [English README](README_en.md)
- [简明上手指南（零基础）](simple-readme.md)
- [基础网格策略使用教程](grid-trading.md)

## 核心特性
- **实时行情与风控**：Websocket + REST 自动同步账户、挂单与仓位，断线后自动恢复。
- **趋势策略**：SMA30 穿越入场，内置止损、移动止盈、布林带带宽过滤与步进锁盈。
- **做市策略**：支持双边追价、风险阈值控制与订单自愈。
- **模块化架构**：策略引擎、交易所适配器与 Ink CLI 相互解耦，新增交易所或策略更容易。

## 支持的交易所
| 交易所 | 合约类型 | 必填环境变量 | 备注 |
| --- | --- | --- | --- |
| Aster | USDT 永续 | `ASTER_API_KEY`, `ASTER_API_SECRET` | 默认交易所；兼容脚本引导
| GRVT | USDT 永续 | `GRVT_API_KEY`, `GRVT_API_SECRET`, `GRVT_SUB_ACCOUNT_ID` | `GRVT_ENV` 可切换 `prod`/`testnet`
| Lighter | zkLighter 永续 | `LIGHTER_ACCOUNT_INDEX`, `LIGHTER_API_PRIVATE_KEY` | 默认 `LIGHTER_ENV=testnet`
| Backpack | USDC 永续 | `BACKPACK_API_KEY`, `BACKPACK_API_SECRET`, `BACKPACK_PASSWORD` | `BACKPACK_SANDBOX=true` 启用沙盒
| Paradex | StarkEx 永续 | `PARADEX_PRIVATE_KEY`, `PARADEX_WALLET_ADDRESS` | `PARADEX_SANDBOX=true` 使用测试网

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
| `EXCHANGE` | 选择交易所（`aster`/`grvt`/`lighter`/`backpack`/`paradex`） |
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
### Aster
1. 将 `EXCHANGE` 保持为 `aster`（默认值）。
2. 填写 `ASTER_API_KEY` 与 `ASTER_API_SECRET`。
3. 根据交易对调整 `TRADE_SYMBOL`、`PRICE_TICK`、`QTY_STEP` 等精度参数。
4. 一键脚本会自动写入这些变量，手动部署时需自行维护。

### GRVT
1. 在 `.env` 中设置 `EXCHANGE=grvt`。
2. 填写 `GRVT_API_KEY`、`GRVT_API_SECRET`、`GRVT_SUB_ACCOUNT_ID`。
3. 若使用测试网，可将 `GRVT_ENV=testnet` 并调整 `GRVT_INSTRUMENT`/`GRVT_SYMBOL`。
4. 可选：提供 `GRVT_COOKIE` 或自定义 `GRVT_SIGNER_PATH` 以复用已有登录态。

### Lighter
1. 设置 `EXCHANGE=lighter`。
2. 填写 `LIGHTER_ACCOUNT_INDEX` 与 `LIGHTER_API_PRIVATE_KEY`（40 字节十六进制私钥），其中`LIGHTER_ACCOUNT_INDEX`是你的账户索引，需要你在官网按F12观察接口请求获取，`LIGHTER_API_PRIVATE_KEY`是你的API私钥。
3. 如需切换环境，将 `LIGHTER_ENV` 改为 `mainnet`/`staging`/`dev`；必要时指定 `LIGHTER_BASE_URL`。
4. 交易对默认为 `LIGHTER_SYMBOL=BTCUSDT`，也可按需重写价格与数量小数位。

### Backpack
1. 设置 `EXCHANGE=backpack`。
2. 填写 `BACKPACK_API_KEY`、`BACKPACK_API_SECRET`、`BACKPACK_PASSWORD`；如有分账户，补充 `BACKPACK_SUBACCOUNT`，默认填写主账户ID。
3. 使用测试环境时将 `BACKPACK_SANDBOX=true`，并确认 `BACKPACK_SYMBOL` 与实际符号一致（默认 `BTC_USD_PERP`）。
4. 可通过 `BACKPACK_DEBUG=true` 观察适配器详细日志。

### Paradex
1. 设置 `EXCHANGE=paradex`。
2. 提供 `PARADEX_PRIVATE_KEY`（EVM 私钥）与 `PARADEX_WALLET_ADDRESS` 注意这是你EVM钱包的地址和私钥，建议创建全新钱包，不要放置无关资产。
3. 默认连接主网，若需测试网，将 `PARADEX_SANDBOX=true` 并根据需要调整 `PARADEX_SYMBOL`。
4. 复杂环境可额外设置 `PARADEX_USE_PRO`、`PARADEX_RECONNECT_DELAY_MS` 或调试开关。

## 命令速查
```bash
bun run index.ts   # 启动 CLI（默认入口）
bun run start      # 等价于运行 index.ts
bun run dev        # 调试模式
bun x vitest run   # 执行全部测试
```

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
