# Nado 配置教程

English version: [Nado Configuration Guide](nado.en.md)

## 适用范围

本教程用于 Nado 永续适配器。Nado 使用 Ink 网络、子账户和 linked signer。ritmex-bot 需要已授权 linked signer 的私钥、子账户 owner 地址和子账户名称。

## 1. 准备 Nado 账户

1. 在 [Nado](https://app.nado.xyz?join=LKbIUs5) 连接 EVM 钱包。
2. 为 Ink 网络准备 ETH gas 和受支持的保证金资产。
3. 完成入金并创建目标子账户。
4. 记录子账户 owner 的 EVM 地址和子账户名称，默认名称为 `default`。

## 2. 获取 linked signer 私钥

Nado 官方 SDK 提供 `createStandardLinkedSigner` 和 `createDeterministicLinkedSignerPrivateKey`，用于创建并授权子账户 linked signer。

当前 Nado Web UI 会在官方域名的浏览器本地存储中保存已授权 signer 信息。使用 Web UI 创建 signer 后，可以在浏览器开发者工具的 `Application` → `Local Storage` 中检查 `nado.userSettings`，读取其中的 `privateKey` 字段。该值属于交易私钥，应在读取后关闭开发者工具并清理任何临时记录。

`NADO_SIGNER_PRIVATE_KEY` 必须是 `0x` 加 64 个十六进制字符。它应是 linked signer 私钥。钱包助记词和主钱包私钥不应填入该变量。

## 3. 主网最小配置

```dotenv
EXCHANGE=nado
NADO_ENV=inkMainnet
NADO_SIGNER_PRIVATE_KEY=<0x_linked_signer_private_key>
NADO_SUBACCOUNT_OWNER=<0x_owner_address>
NADO_SUBACCOUNT_NAME=default
NADO_SYMBOL=BTC-PERP
```

`NADO_SUBACCOUNT_OWNER` 可以使用兼容别名 `NADO_EVM_ADDRESS`。

## 4. 测试网配置

```dotenv
NADO_ENV=inkTestnet
NADO_SIGNER_PRIVATE_KEY=<0x_testnet_linked_signer_private_key>
NADO_SUBACCOUNT_OWNER=<0x_testnet_owner_address>
NADO_SUBACCOUNT_NAME=default
NADO_SYMBOL=BTC-PERP
```

linked signer 的授权与环境绑定。主网 signer 无法用于测试网子账户。

## 5. 符号格式

Nado 永续市场使用 `BTC-PERP`、`ETH-PERP` 这类产品符号。适配器还接受：

- `BTCPERP` → `BTC-PERP`
- `BTCUSDT0` → `BTC-PERP`
- `BTC/PERP` → `BTC-PERP`

应优先使用 Nado API 返回的原始 `*-PERP` 符号。

## 6. 可选配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NADO_GATEWAY_WS_URL` | 按环境选择 | 交易网关 WebSocket |
| `NADO_SUBSCRIPTIONS_WS_URL` | 按环境选择 | 行情订阅 WebSocket |
| `NADO_ARCHIVE_URL` | 生产/测试 archive | 历史和索引查询地址 |
| `NADO_TRIGGER_URL` | 生产/测试 trigger | 止损止盈服务地址 |
| `NADO_MARKET_SLIPPAGE_PCT` | `0.01` | 市价/触发单保护范围，`0.01` 表示 1% |
| `NADO_STOP_TRIGGER_SOURCE` | `oracle` | `oracle`、`last` 或 `mid` |
| `NADO_MIN_SIZE_POLICY` | `adjust` | `adjust` 自动上调到最小量；`reject` 直接拒绝 |
| `NADO_DEBUG` | `false` | 详细错误日志 |

## 7. 验证配置

```bash
bun run index.ts doctor --exchange nado --symbol BTC-PERP --json
bun run index.ts market ticker --exchange nado --symbol BTC-PERP --json
```

行情检查会验证网络、linked signer、子账户和产品元数据，不会创建订单。

## 常见问题

- `Missing NADO_SIGNER_PRIVATE_KEY`：填写已授权 linked signer 的 32 字节私钥。
- `Invalid NADO private key`：确认值包含 `0x` 和 64 个十六进制字符。
- `Missing NADO_SUBACCOUNT_OWNER`：填写子账户 owner 的 20 字节 EVM 地址。
- 签名/权限错误：确认 signer 已链接到相同 owner、子账户名称和网络。
- 产品未找到：使用 `BTC-PERP` 这类 Nado 原始符号。

## 安全要求

- linked signer 可以执行交易，应使用专用 signer 并定期轮换。
- 主钱包私钥和助记词不进入 ritmex-bot 配置。
- signer 泄露后立即在 Nado 撤销授权并创建新 signer。

## 参考资料

- [Nado Onboarding](../nado/onboarding-tutorial.md)
- [Nado TypeScript SDK](https://docs.nado.xyz/developer-resources/typescript-sdk)
- [创建 Nado Client](../nado/developer-resources/typescript-sdk/how-to/create-a-nado-client.md)
