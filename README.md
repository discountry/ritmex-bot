# ritmex-bot

基于 Bun 的 Aster 永续合约量化终端，内置趋势跟随（SMA30）与做市策略，支持快速恢复、实时行情订阅与日志追踪。

* [Aster 30% 手续费优惠注册链接](https://www.asterdex.com/zh-CN/referral/4665f3)
* [GRVT 手续费优惠注册链接](https://grvt.io/exchange/sign-up?ref=sea)

## 文档索引
- [English README](README_en.md)
- [简明上手指南（零基础）](simple-readme.md)

## 项目亮点
- **实时行情与风控**：Websocket + REST 自动同步账户、挂单与仓位。
- **趋势策略**：SMA30 穿越入场，内置止损、移动止盈、布林带带宽过滤与步进锁盈。
- **做市策略**：支持双边追价、风险阈值与订单自愈。
- **模块化设计**：适配器、策略引擎与 CLI 解耦，方便扩展新交易所或策略。

## 环境要求
- Bun ≥ 1.2（含 `bun`、`bunx` 命令）
- macOS、Linux 或 Windows (WSL 推荐)
- Node.js 仅在某些安装路径需要，可选

## 快速启动脚本（macOS / Linux / WSL）
```bash
curl -fsSL https://github.com/discountry/ritmex-bot/raw/refs/heads/main/setup.sh | bash
```
脚本会安装 Bun、依赖，收集 Aster API Key/Secret，生成 `.env` 并启动 CLI。运行前请准备好 API 凭证。

## 手动安装步骤
1. **获取代码**
   ```bash
   git clone https://github.com/discountry/ritmex-bot.git
   cd ritmex-bot
   ```
   不方便使用 Git 时，可在仓库页面下载 ZIP 并手动解压。
2. **安装 Bun**
   - macOS / Linux：`curl -fsSL https://bun.sh/install | bash`
   - Windows PowerShell：`powershell -c "irm bun.sh/install.ps1 | iex"`
   安装后重新打开终端，确认 `bun -v` 正常输出版本号。
3. **安装依赖**
   ```bash
   bun install
   ```
4. **复制环境变量模板并填写**
   ```bash
   cp .env.example .env
   ```
   按下文说明修改 `.env`，至少需要正确配置 Aster 或 GRVT 的 API。
5. **运行 CLI**
   ```bash
   bun run index.ts
   ```
   方向键选择策略，回车启动；`Esc` 返回菜单，`Ctrl+C` 退出。

## 环境变量配置指南
核心变量在 `.env.example` 中给出默认值：

| 变量 | 说明 |
| --- | --- |
| `ASTER_API_KEY` / `ASTER_API_SECRET` | Aster API 凭证，运行策略必填 |
| `TRADE_SYMBOL` | 交易对（默认 `BTCUSDT`） |
| `TRADE_AMOUNT` | 单笔下单数量（标的资产计） |
| `LOSS_LIMIT` | 单笔最大亏损触发的强平额度（USDT） |
| `TRAILING_PROFIT` / `TRAILING_CALLBACK_RATE` | 动态止盈触发值（USDT）与回撤百分比 |
| `PROFIT_LOCK_TRIGGER_USD` / `PROFIT_LOCK_OFFSET_USD` | 浮盈超过阈值后上调止损的触发金额与偏移 |
| `BOLLINGER_LENGTH` / `BOLLINGER_STD_MULTIPLIER` | 布林带宽度判定的窗口长度与标准差倍数 |
| `MIN_BOLLINGER_BANDWIDTH` | 仅当带宽 ≥ 此比例时才触发入场信号 |
| `PRICE_TICK` / `QTY_STEP` | 交易所要求的最小报价与数量精度 |
| `POLL_INTERVAL_MS` | 趋势策略循环间隔（毫秒） |
| `MAX_CLOSE_SLIPPAGE_PCT` | 平仓时相对标记价允许的最大偏差 |
| `MAKER_*` 系列 | 做市策略独有参数（追价阈值、报价偏移、刷新频率等） |

切换到 GRVT 时，将 `EXCHANGE=grvt` 并补齐 `GRVT_API_KEY`、`GRVT_API_SECRET`、`GRVT_SUB_ACCOUNT_ID` 等变量；详情见 `.env.example`。

## 常用命令
```bash
bun run index.ts   # 启动 CLI（默认）
bun run start      # 同上
bun run dev        # 调试模式，等价于运行 index.ts
bun x vitest run   # 执行单元测试
```

## 测试
项目使用 Vitest：
```bash
bun run test        # 运行全部测试
bun x vitest --watch
```

## 常见问题

- 你需要至少 50-100 USDT 的资金才能运行策略
- 请在交易所自行设置 50 倍左右的杠杆，本策略不包含杠杆设置
- 请确保你电脑/服务器的时间是准确的真实世界时间
- 持仓方式需要保持单向持仓
- `.env` 未读取：确认文件位于项目根目录且变量名无误。
- API 拒绝访问：检查交易所后台权限，确保开启合约读写。
- 精度错误：同步交易对的最小价格与数量步长。
更多排查步骤可参考 [简明上手指南](simple-readme.md)。

## 社区与支持
- Telegram 交流群：[https://t.me/+4fdo0quY87o4Mjhh](https://t.me/+4fdo0quY87o4Mjhh)
- 反馈或新特性建议请提交 Issue 或 PR

## 风险提示
量化交易具备风险。建议在仿真或小额账户中验证策略表现，妥善保管 API 密钥，仅开启必要权限。
