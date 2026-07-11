# Ondo Perps 接入说明

## 链接

- 邀请注册：https://app.ondoperps.xyz/?ref=4A3ACQ
- 官方文档索引：https://ondoperps.mintlify.app/llms.txt
- REST OpenAPI：https://docs.ondoperps.xyz/api-reference/rest-spec.json
- WebSocket OpenAPI：https://docs.ondoperps.xyz/api-reference/ws-spec.json
- API Key 鉴权：https://docs.ondoperps.xyz/api-reference/api_key_authentication.md

## 配置

```bash
EXCHANGE=ondoperps
ONDOPERPS_API_KEY_ID=ondoKeyId_xxx
ONDOPERPS_API_SECRET=ondoApiSecret_xxx
ONDOPERPS_SYMBOL=BTC-USD.P
```

Ondo Perps 市场使用 `{TICKER}-USD.P` 格式。默认值为 `BTC-USD.P`，其他示例包括 `ETH-USD.P`、`XAU-USD.P`、`NVDA-USD.P` 与 `AMD-USD.P`。

兼容入口：`EXCHANGE=ondoperp` 会解析为 `ondoperps`，旧 `ONDOPERP_*` 环境变量会在对应 `ONDOPERPS_*` 变量缺失时使用。

可选配置：

| 变量 | 说明 |
| --- | --- |
| `ONDOPERPS_SANDBOX` | `true` 时连接官方沙盒 REST 与 WebSocket 地址 |
| `ONDOPERPS_BASE_URL` | 覆盖 REST API 地址 |
| `ONDOPERPS_WS_URL` | 覆盖 WebSocket 地址 |
| `ONDOPERPS_BUILDER_CODE` | Ondo 分配的 Builder Code |
| `ONDOPERPS_BUILDER_FEE_RATE_BPS` | Builder 订单费率，适配器限制在 1–10 bps |

## 已接入能力

- API Key HMAC-SHA256 REST 鉴权
- 限价单、Post Only 限价单、市价单、批量撤单与全部撤单
- 仓位级止损与止盈，映射到统一订单类型
- 账户余额、仓位、活动订单与市场精度查询
- 深度、标记价、K 线、资金费率、订单、仓位与余额 WebSocket 订阅
- REST 定时校准，覆盖 WebSocket 断线和私有频道鉴权异常场景
- 生产与沙盒端点切换

## 鉴权规则

REST 请求发送以下请求头：

- `ONDO-KEY-ID`
- `ONDO-TIMESTAMP`
- `ONDO-SIGN`

签名内容为 `timestamp + uppercaseMethod + requestPathWithQuery + body`，使用 API Secret 进行 HMAC-SHA256 并输出十六进制字符串。

WebSocket 登录消息使用 API Key ID、毫秒时间戳与 `time + "ondo_perps_ws_login"` 的 HMAC-SHA256 签名。连接空闲限制为 180 秒，适配器每 30 秒发送一次 ping。

## 安全

API Secret 只通过运行环境传入。仓库文件、日志与错误信息均不保存请求签名头或凭证内容。建议在 Ondo Perps 后台配置固定 IPv4 白名单，并为 API Key 只授予策略需要的权限。
