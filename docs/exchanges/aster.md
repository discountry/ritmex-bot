# Aster 配置教程

English version: [Aster Configuration Guide](aster.en.md)

## 适用范围

本教程用于配置 ritmex-bot 的 Aster USDT 永续适配器。当前适配器连接 Aster 生产环境的 `https://fapi.asterdex.com`，交易对使用 `BTCUSDT` 这类连续大写格式。

## 1. 准备账户与 API 凭证

1. 在 [Aster](https://www.asterdex.com/zh-CN/referral/4665f3) 完成钱包连接、永续账户开通和入金。
2. 在 Aster API 管理页面创建 API Key，保存页面显示的 API Key 与 API Secret。
3. 开启读取和永续交易权限，关闭提现权限。
4. 为运行机器配置固定 IP 白名单。
5. 将账户持仓模式设置为单向持仓，并在交易所界面设置所需杠杆。

Aster 官方还提供[程序化 API Key 注册说明](https://github.com/asterdex/api-docs/blob/master/demo/aster-api-key-registration.md)。该流程支持交易权限、到期时间和 IP 白名单配置。

## 2. 最小配置

在项目根目录的 `.env` 中填写：

```dotenv
EXCHANGE=aster
ASTER_API_KEY=<your_aster_api_key>
ASTER_API_SECRET=<your_aster_api_secret>
ASTER_SYMBOL=BTCUSDT
```

`ASTER_SYMBOL` 优先于通用的 `TRADE_SYMBOL`。未设置时默认使用 `BTCUSDT`。

## 3. 精度与策略参数

Aster 会返回市场精度，策略配置仍需与目标市场保持一致：

```dotenv
PRICE_TICK=0.1
QTY_STEP=0.001
```

通过 Aster 市场规则确认价格步长、数量步长和最小名义价值。`TRADE_AMOUNT`、止损和做市参数属于策略配置，应在小额验证后设置。

## 4. 环境说明

当前 Aster 适配器没有环境切换变量，也没有自定义 REST/WebSocket 端点变量。Aster 测试网凭证无法用于当前生产端点。测试策略时使用专用小额账户和 ritmex-bot 的 `--dry-run` 写操作模拟。

## 5. 验证配置

先执行本地配置检查：

```bash
bun run index.ts doctor --exchange aster --symbol BTCUSDT --json
```

再执行只读行情连接检查：

```bash
bun run index.ts market ticker --exchange aster --symbol BTCUSDT --json
```

以上命令不会创建订单。启动真实策略前，先用命令模式执行带 `--dry-run` 的订单路由检查。

## 常见问题

- `Missing ASTER_API_KEY`：确认两个 Aster 凭证变量均已填写。
- `Invalid signature`：同步系统时间，检查 API Secret、权限和 IP 白名单。
- `Symbol not found`：使用 Aster 永续市场的原始符号，例如 `BTCUSDT`。
- 精度错误：从市场规则更新 `PRICE_TICK`、`QTY_STEP` 和下单数量。

## 安全要求

- API Key 仅授予读取和交易权限。
- API Secret 只保存在本机运行环境中。
- 凭证泄露后立即删除旧 Key 并创建新 Key。

## 参考资料

- [Aster Futures API](https://github.com/asterdex/api-docs)
- [仓库内 Aster API 参考](../aster/v2-api.md)

