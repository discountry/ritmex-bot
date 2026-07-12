# Binance 配置教程

English version: [Binance Configuration Guide](binance.en.md)

## 适用范围

ritmex-bot 的 Binance 适配器支持现货和 USDⓈ-M 永续。`BINANCE_MARKET_TYPE` 决定市场类型，交易对后缀可以显式指定现货或永续。

## 1. 创建 API Key

1. 在 [Binance API Management](https://www.binance.com/en/my/settings/api-management) 创建专用 API Key。
2. 开启读取权限。
3. 永续策略开启 Futures 权限；现货策略开启 Spot Trading 权限。
4. 关闭提现权限并配置固定 IP 白名单。
5. 永续账户使用单向持仓模式，并在交易所界面设置杠杆。

主网 Key 与测试网 Key 相互独立。Spot Testnet 按[官方测试网指南](https://developers.binance.com/docs/binance-spot-api-docs/testnet)创建凭证；USDⓈ-M Futures Testnet 使用 Binance Futures Testnet 凭证。

## 2. 永续最小配置

```dotenv
EXCHANGE=binance
BINANCE_API_KEY=<your_binance_api_key>
BINANCE_API_SECRET=<your_binance_api_secret>
BINANCE_MARKET_TYPE=perp
BINANCE_SYMBOL=BTCUSDT_PERP
```

`BTCUSDT_PERP` 强制选择永续市场。`BTCUSDT` 配合 `BINANCE_MARKET_TYPE=perp` 也会选择永续。

## 3. 现货最小配置

```dotenv
EXCHANGE=binance
BINANCE_API_KEY=<your_binance_api_key>
BINANCE_API_SECRET=<your_binance_api_secret>
BINANCE_MARKET_TYPE=spot
BINANCE_SYMBOL=BTCUSDT_SPOT
```

现货也可使用 `BINANCE_SYMBOL=BTCUSDT`。现货模式不提供永续专属的持仓、资金费率和部分保护单能力。

## 4. 市场模式与符号

| 配置 | 含义 |
| --- | --- |
| `BINANCE_MARKET_TYPE=perp` | 默认模式，优先 USDⓈ-M 永续 |
| `BINANCE_MARKET_TYPE=spot` | 现货模式 |
| `BINANCE_MARKET_TYPE=auto` | 根据符号匹配市场，同名市场由默认逻辑选择 |
| `BTCUSDT_PERP` | 强制永续 |
| `BTCUSDT_SPOT` | 强制现货 |

期现套利使用显式拆分交易对：

```dotenv
BASIS_FUTURES_SYMBOL=BTCUSDT_PERP
BASIS_SPOT_SYMBOL=BTCUSDT_SPOT
```

## 5. 测试网配置

`BINANCE_SANDBOX=true` 会切换 CCXT REST 客户端。适配器的原生 WebSocket 地址由独立变量控制，完整测试网配置应同时设置 REST 与 WebSocket 地址：

```dotenv
BINANCE_SANDBOX=true
BINANCE_SPOT_REST_URL=https://testnet.binance.vision
BINANCE_SPOT_WS_URL=wss://stream.testnet.binance.vision/ws
BINANCE_FUTURES_REST_URL=https://testnet.binancefuture.com
BINANCE_FUTURES_WS_URL=wss://fstream.binancefuture.com
```

测试网配置必须使用对应测试网生成的 API Key。

## 6. 其他可选配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `BINANCE_ACCOUNT_POLL_MS` | `5000` | 账户 REST 校准间隔，最小 1000 ms |
| `BINANCE_ORDERS_POLL_MS` | `3000` | 订单 REST 校准间隔，最小 1000 ms |
| `BINANCE_SPOT_REST_URL` | `https://api.binance.com` | 现货 REST 地址 |
| `BINANCE_FUTURES_REST_URL` | `https://fapi.binance.com` | 永续 REST 地址 |
| `BINANCE_SPOT_WS_URL` | `wss://stream.binance.com:9443/ws` | 现货 WebSocket 地址 |
| `BINANCE_FUTURES_WS_URL` | `wss://fstream.binance.com/ws` | 永续 WebSocket 地址 |

## 7. 验证配置

```bash
bun run index.ts doctor --exchange binance --symbol BTCUSDT_PERP --json
bun run index.ts market ticker --exchange binance --symbol BTCUSDT_PERP --json
```

以上命令不会创建订单。真实策略启动前，先使用带 `--dry-run` 的订单命令检查下单参数。

## 常见问题

- `Invalid API-key, IP, or permissions`：检查市场权限、IP 白名单和主网/测试网 Key。
- `Binance symbol not found`：使用 `BTCUSDT_PERP` 或 `BTCUSDT_SPOT` 明确市场。
- `Position side does not match`：将 USDⓈ-M Futures 账户切换为单向持仓模式。
- 时间戳错误：同步运行机器时间。

## 参考资料

- [Binance Spot API](https://developers.binance.com/docs/binance-spot-api-docs)
- [Binance USDⓈ-M Futures API](https://developers.binance.com/docs/derivatives/usds-margined-futures)
- [仓库内 Binance API 参考](../binance/binance-spot/README.md)
