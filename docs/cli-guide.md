# ritmex-bot CLI 使用手册（中文）

本文档介绍 `ritmex-bot` 的命令模式（Agent 友好模式），用于在不进入 Ink 菜单的情况下执行结构化交易操作。

## 1. 适用范围

`ritmex-bot` CLI 命令模式覆盖以下能力：

- 交易所列表与能力查询
- 行情（ticker/depth/kline）
- 账户与仓位查询
- 订单查询、下单、撤单、全撤
- 策略启动（支持 dry-run）

这套命令适合：

- 直接在终端手动执行
- 通过 `npx` / `bunx` 调用
- 被 AI Agent / 自动化系统程序化调用（推荐配合 `--json`）

## 2. 安装与运行方式

### 2.1 全局安装（推荐）

```bash
npm install -g ritmex-bot
ritmex-bot doctor
```

### 2.2 无需安装直接运行

```bash
npx ritmex-bot doctor
bunx ritmex-bot doctor
```

### 2.3 作为项目依赖

```bash
npm install ritmex-bot
npx ritmex-bot doctor
```

### 2.4 在仓库源码中运行

```bash
bun run index.ts doctor
bun run index.ts market ticker --exchange binance --symbol BTCUSDT
```

> 注意：`bin/ritmex-bot` 会调用 `bun run` 启动入口文件，因此运行环境需要可用的 Bun。

## 3. 命令结构

```bash
ritmex-bot <root-command> <action> [options]
```

支持的根命令：

- `help`
- `doctor`
- `exchange`
- `market`
- `account`
- `position`
- `order`
- `strategy`

快速帮助：

```bash
ritmex-bot help
ritmex-bot market ticker --help
```

## 4. 全局参数

| 参数 | 短参数 | 说明 | 默认值 |
| --- | --- | --- | --- |
| `--exchange` | `-e` | 指定交易所 ID | 走现有环境变量解析 |
| `--symbol` | - | 指定交易对，原样透传 | 走现有环境变量解析 |
| `--json` | `-j` | 以 JSON 输出结果 | `false` |
| `--dry-run` | `-d` | 模拟执行（不发真实写操作） | `false` |
| `--timeout` | `-t` | 超时毫秒数 | `25000` |
| `--help` | `-h` | 显示命令帮助 | `false` |

## 5. 环境变量与 Symbol 规则

`ritmex-bot` 命令模式遵循以下约束：

- 不新增环境变量，不修改任何已有变量名称。
- 从当前 CLI 执行环境读取已有配置（例如 `.env` 已加载到进程环境后）。
- `--exchange` 未指定时，按现有逻辑解析交易所（例如 `EXCHANGE` / `TRADE_EXCHANGE`）。
- `--symbol` 未指定时，按现有逻辑从对应交易所配置中解析符号。
- 对 `symbol` 不做统一、不做改写、不做跨交易所映射。你传什么就用什么。

这意味着像 Binance 的 `BTCUSDT`、`BTCUSDC`、现货/永续等差异，全部由你通过现有配置自行决定。

## 6. 命令详解

### 6.1 `doctor`

用于检查当前交易所/交易对配置与适配器能力。

```bash
ritmex-bot doctor
ritmex-bot doctor --exchange binance --symbol BTCUSDT --json
```

### 6.2 `exchange`

### 列出支持的交易所

```bash
ritmex-bot exchange list
```

### 查询交易所能力

```bash
ritmex-bot exchange capabilities --exchange standx
```

如果运行时无法构建适配器，会返回静态能力信息（`source: "static"`）及警告。

### 6.3 `market`

### `market ticker`

```bash
ritmex-bot market ticker --exchange binance --symbol BTCUSDT
```

### `market depth`

```bash
ritmex-bot market depth --exchange binance --symbol BTCUSDT --levels 10
```

`--levels` 为可选，指定后会截断返回档位数量。

### `market kline`

```bash
ritmex-bot market kline --exchange binance --symbol BTCUSDT --interval 1m --limit 50
```

参数说明：

- `--interval` 必填
- `--limit` 可选（仅保留最后 N 条）

### 6.4 `account` 与 `position`

### 账户快照

```bash
ritmex-bot account snapshot --exchange standx
ritmex-bot account summary --exchange standx
```

`summary` 是 `snapshot` 的别名。

### 仓位列表

```bash
ritmex-bot position list --exchange standx
ritmex-bot position list --exchange standx --symbol BTC-USD
```

传 `--symbol` 时会在返回结果中做符号过滤。

### 6.5 `order`

### 查询当前挂单

```bash
ritmex-bot order open --exchange binance --symbol BTCUSDT
```

### 创建订单

```bash
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000
```

创建订单参数：

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `--side` | 是 | `buy` / `sell` |
| `--type` | 是 | `limit` / `market` / `stop` / `trailing-stop` / `close` |
| `--quantity` 或 `--qty` | 是 | 下单数量 |
| `--price` | `limit` 必填 | 限价单价格 |
| `--stop-price` | `stop` 必填 | 触发价 |
| `--activation-price` | `trailing-stop` 必填 | 激活价 |
| `--callback-rate` | `trailing-stop` 必填 | 回调比例 |
| `--time-in-force` | 否 | `GTC` / `IOC` / `FOK` / `GTX` |
| `--reduce-only` | 否 | `true/false` |
| `--close-position` | 否 | `true/false` |
| `--trigger-type` | 否 | `UNSPECIFIED` / `TAKE_PROFIT` / `STOP_LOSS` |
| `--sl-price` | 否 | 止损价（路由层按交易所能力处理） |
| `--tp-price` | 否 | 止盈价（路由层按交易所能力处理） |

示例：

```bash
# 市价单
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type market --qty 0.01

# 止损单
ritmex-bot order create --exchange binance --symbol BTCUSDT --side sell --type stop --qty 0.01 --stop-price 86000

# 移动止损单
ritmex-bot order create --exchange binance --symbol BTCUSDT --side sell --type trailing-stop --qty 0.01 --activation-price 91000 --callback-rate 0.2

# close 语义单（默认会补全 reduceOnly/closePosition）
ritmex-bot order create --exchange binance --symbol BTCUSDT --side sell --type close --qty 0.01
```

### 撤单

```bash
ritmex-bot order cancel --exchange binance --symbol BTCUSDT --order-id 123456
```

### 全撤

```bash
ritmex-bot order cancel-all --exchange binance --symbol BTCUSDT
```

若交易所支持 `forceCancelAllOrders`，会优先走该能力；否则回退普通批量撤单逻辑。

### 6.6 `strategy`

### 启动策略

```bash
ritmex-bot strategy run --strategy maker --exchange standx --silent
```

支持策略 ID：

- `trend`
- `swing`
- `guardian`
- `maker`
- `maker-points`
- `offset-maker`
- `liquidity-maker`
- `basis`
- `grid`

常用别名：

- `offset` -> `offset-maker`
- `makerpoints` / `maker_points` -> `maker-points`
- `liquidity` / `liquiditymaker` / `liquidity_maker` -> `liquidity-maker`

额外参数：

- `--silent`（短参数 `-q`）静默运行
- `--dry-run` 传递到策略运行器，启用策略级模拟

## 7. `--dry-run` 模拟执行

当开启 `--dry-run`：

- `order create` / `order cancel` / `order cancel-all` 不会发送真实写操作。
- 返回结果包含 `dryRunActions`，用于观察本次模拟会执行什么操作。
- `strategy run` 会将 dry-run 模式传入策略执行链路。
- 只读类命令（行情、查询）不会改变行为。

示例：

```bash
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --dry-run --json
```

## 8. 不支持能力的处理

不同交易所能力不完全一致。对于未实现或不支持的功能，CLI 会直接返回 `UNSUPPORTED` 错误，而不是静默忽略。

常见场景：

- 某些交易所不支持 `queryOpenOrders`
- 某些交易所不支持 `queryAccountSnapshot`
- 某些交易所不支持特定委托类型

建议调用方按错误码降级处理。

## 9. 输出格式与退出码

### 9.1 文本输出（默认）

成功：

```text
[OK] market-ticker
time: 2026-02-27T12:00:00.000Z
exchange: binance
symbol: BTCUSDT
dryRun: false
...
```

失败：

```text
[ERROR] order-open
time: 2026-02-27T12:00:00.000Z
code: UNSUPPORTED
message: queryOpenOrders is not supported on exchange 'aster'
retryable: false
```

### 9.2 JSON 输出（`--json`）

成功结构：

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

失败结构：

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

### 9.3 退出码

| 退出码 | 含义 |
| --- | --- |
| `0` | 成功 |
| `2` | 参数错误（`INVALID_ARGS`） |
| `3` | 缺少环境配置（`MISSING_ENV`） |
| `5` | 功能不支持（`UNSUPPORTED`） |
| `6` | 交易所执行错误（`EXCHANGE_ERROR`） |
| `7` | 超时（`TIMEOUT`） |

## 10. AI Agent 推荐调用流程

```bash
# 1) 确认交易所能力
ritmex-bot exchange capabilities --exchange binance --json

# 2) 拉取行情
ritmex-bot market ticker --exchange binance --symbol BTCUSDT --json

# 3) dry-run 验证下单参数
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --dry-run --json

# 4) 确认后执行真实下单（去掉 --dry-run）
ritmex-bot order create --exchange binance --symbol BTCUSDT --side buy --type limit --quantity 0.01 --price 90000 --json
```

## 11. 与现有功能兼容性

命令模式不会破坏现有 Ink 交互模式与原有参数入口：

- `bun run index.ts` 仍进入交互菜单
- `bun run index.ts --strategy trend --silent` 仍可直接跑策略
- 仅当首参数匹配命令模式根命令时，才进入 `ritmex-bot` 命令执行路径

如果你已在使用现有环境变量与策略配置，可直接增量接入命令模式，无需迁移变量名。
