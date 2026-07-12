# StandX 配置教程

English version: [StandX Configuration Guide](standx.en.md)

## 适用范围

本教程用于 StandX 永续适配器。标准配置包含 JWT Token 和 Ed25519 请求签名私钥。JWT 负责身份认证，签名私钥负责交易类请求签名。

## 1. 获取 Token 与签名私钥

1. 打开 [StandX API Session](https://standx.com/user/session)。
2. 连接钱包并完成登录。
3. 生成 API Token。
4. 保存页面显示的 JWT Token、Ed25519 Private Key、创建日期和有效期。

官方认证流程使用钱包签名获取 JWT，并使用 Ed25519 密钥签署请求正文。官方密钥格式为 Base58，适配器也接受 32 字节十六进制或 Base64 表示。

## 2. 最小配置

```dotenv
EXCHANGE=standx
STANDX_TOKEN=<your_standx_jwt>
STANDX_REQUEST_PRIVATE_KEY=<your_ed25519_private_key>
STANDX_SYMBOL=BTC-USD
```

`STANDX_TOKEN` 是适配器初始化的必填项。`STANDX_REQUEST_PRIVATE_KEY` 是下单、撤单和修改保证金模式等签名请求的必填项。

## 3. Token 到期提醒

StandX 官方认证流程的默认 JWT 有效期为 7 天。按 API 页面显示的信息配置到期提醒：

```dotenv
STANDX_TOKEN_CREATE_DATE=2026-07-12
STANDX_TOKEN_VALIDITY_DAYS=7
```

旧配置也支持 `STANDX_TOKEN_EXPIRY`，其值可以是秒级/毫秒级时间戳或 ISO 日期。

## 4. 可选配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `STANDX_BASE_URL` | `https://perps.standx.com` | REST API 地址 |
| `STANDX_WS_URL` | `wss://perps.standx.com/ws-stream/v1` | WebSocket 地址 |
| `STANDX_SESSION_ID` | 自动生成 UUID | 订单响应流会话标识 |
| `STANDX_WS_DEBUG` | `false` | 输出 WebSocket 调试日志 |
| `STANDX_WS_DEBUG_RAW` | `false` | 输出原始 WebSocket 消息 |

交易对使用 `BTC-USD` 这类格式。通过市场规则确认 `PRICE_TICK`、`QTY_STEP` 和最小数量。

## 5. 验证配置

```bash
bun run index.ts doctor --exchange standx --symbol BTC-USD --json
bun run index.ts market ticker --exchange standx --symbol BTC-USD --json
```

以上命令不会创建订单。Token 到期后重新生成凭证，并同步更新 Token 与签名私钥。

## 常见问题

- `Missing STANDX_TOKEN`：填写有效 JWT Token。
- `Request signature skipped`：填写 `STANDX_REQUEST_PRIVATE_KEY`，确认 Base58 解码后为 32 字节。
- `401` 或 Token 过期：重新生成 Token，更新到期配置。
- 订单响应流缺失：保持 `STANDX_SESSION_ID` 稳定并检查 WebSocket 地址。

## 安全要求

- Token 与签名私钥组合具备交易能力，应按交易凭证级别保护。
- 使用独立 API 会话并定期轮换。
- 凭证泄露后立即在 StandX 撤销会话并生成新凭证。

## 参考资料

- [StandX Authentication](https://docs.standx.com/standx-api/perps-auth)
- [StandX HTTP API](https://docs.standx.com/standx-api/perps-http)
- [仓库内 StandX 认证参考](../standx/auth.md)
- [StandX 做市积分策略教程](../standx/maker-points-guide.md)

