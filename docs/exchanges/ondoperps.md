# Ondo Perps 配置教程

English version: [Ondo Perps Configuration Guide](ondoperps.en.md)

## 适用范围

本教程用于 Ondo Perps 加密资产、股票和商品永续适配器。认证使用 API Key ID 与 API Secret 的 HMAC-SHA256 签名。

## 1. 创建 API Key

1. 在 [Ondo Perps](https://app.ondoperps.xyz/?ref=4A3ACQ) 完成账户开通和入金。
2. 在账户 API 管理页面创建具备读取和交易权限的 API Key。
3. 保存 API Key ID 和 API Secret。
4. 关闭提现权限并配置固定 IPv4 白名单。

## 2. 主网最小配置

```dotenv
EXCHANGE=ondoperps
ONDOPERPS_API_KEY_ID=<your_ondo_key_id>
ONDOPERPS_API_SECRET=<your_ondo_api_secret>
ONDOPERPS_SYMBOL=BTC-USD.P
```

市场符号使用 `{TICKER}-USD.P` 格式，例如：

- `BTC-USD.P`
- `ETH-USD.P`
- `XAU-USD.P`
- `NVDA-USD.P`

适配器也会把 `BTCUSDT`、`BTC/USD` 和 `BTC-USD` 归一化为 `BTC-USD.P`。

## 3. 沙盒配置

```dotenv
EXCHANGE=ondoperps
ONDOPERPS_SANDBOX=true
ONDOPERPS_API_KEY_ID=<your_sandbox_key_id>
ONDOPERPS_API_SECRET=<your_sandbox_api_secret>
ONDOPERPS_SYMBOL=BTC-USD.P
```

启用沙盒后默认使用：

- REST：`https://api.ondoperps-sandbox.xyz`
- WebSocket：`wss://api.ondoperps-sandbox.xyz/ws`

沙盒需要独立生成的凭证。

## 4. 可选配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `ONDOPERPS_BASE_URL` | `https://api.ondoperps.xyz` | REST API 地址 |
| `ONDOPERPS_WS_URL` | `wss://api.ondoperps.xyz/ws` | WebSocket 地址 |
| `ONDOPERPS_BUILDER_CODE` | 空 | Ondo 分配的 Builder Code |
| `ONDOPERPS_BUILDER_FEE_RATE_BPS` | 空 | 正整数 Builder 费率，适配器上限为 10 bps |

兼容别名：

- `EXCHANGE=ondoperp` 或 `EXCHANGE=ondo`
- `ONDOPERP_*` 旧变量前缀
- `ONDO_KEY_ID` 与 `ONDO_API_SECRET`

新部署应统一使用 `ondoperps` 和 `ONDOPERPS_*`。

## 5. 验证配置

```bash
bun run index.ts doctor --exchange ondoperps --symbol BTC-USD.P --json
bun run index.ts market ticker --exchange ondoperps --symbol BTC-USD.P --json
```

行情检查会加载合约精度、连接 WebSocket 并执行只读市场请求，不会创建订单。

## 常见问题

- `Missing ONDOPERPS_API_KEY_ID or ONDOPERPS_API_SECRET`：填写完整凭证对。
- `401` 或签名失败：同步系统时间，检查 Key ID、Secret、环境和 IP 白名单。
- 市场不存在：使用 Ondo 官方市场列表中的 `{TICKER}-USD.P` 符号。
- Builder 费率异常：使用 `1`–`10` 的整数 bps 值。
- 沙盒连接生产账户为空：使用沙盒专用账户和凭证。

## 安全要求

- API Key 仅授予读取和交易权限。
- API Secret 只通过本机运行环境传入。
- 凭证泄露后立即撤销 Key 并创建新凭证。

## 参考资料

- [Ondo Perps API Authentication](https://docs.ondoperps.xyz/api-reference/api_key_authentication.md)
- [Ondo Perps REST Specification](https://docs.ondoperps.xyz/api-reference/rest-spec.json)
- [Ondo Perps WebSocket Specification](https://docs.ondoperps.xyz/api-reference/ws-spec.json)
- [仓库内 Ondo Perps 接入说明](../ondoperps/README.md)

