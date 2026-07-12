# Backpack 配置教程

English version: [Backpack Configuration Guide](backpack.en.md)

## 适用范围

本教程用于 Backpack 现货和 USDC 永续适配器。Backpack API 使用 Ed25519 密钥对：API Key 是验证公钥，API Secret 是签名私钥。

## 1. 创建 API Key

1. 在 [Backpack Exchange](https://backpack.exchange/join/ritmex) 完成账户、交易权限和入金设置。
2. 在账户设置的 API Keys 页面创建专用交易 Key。
3. 创建后立即保存 API Key 和 API Secret。
4. 开启读取和交易权限，关闭提现权限。
5. 配置 IP 白名单和目标子账户。

## 2. 永续最小配置

```dotenv
EXCHANGE=backpack
BACKPACK_API_KEY=<your_backpack_api_key>
BACKPACK_API_SECRET=<your_backpack_api_secret>
BACKPACK_SYMBOL=BTC_USDC_PERP
```

`BTC_USDC_PERP` 是 Backpack 原始永续 market ID。适配器也能匹配 CCXT 统一符号 `BTC/USDC:USDC`。应显式设置 `_PERP` 符号，避免同名现货市场被选中。

## 3. 现货配置

```dotenv
BACKPACK_SYMBOL=BTC_USDC
```

现货也可使用 CCXT 统一符号 `BTC/USDC`。

## 4. 可选配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `BACKPACK_PASSWORD` | 空 | 仅在凭证流程提供 passphrase 时填写 |
| `BACKPACK_SUBACCOUNT` | 主账户 | 目标子账户 ID |
| `BACKPACK_WS_WINDOW` | `5000` | 签名请求有效窗口，单位毫秒，官方最大值为 60000 |
| `BACKPACK_DEBUG` | `false` | 输出市场解析和 WebSocket 调试日志 |
| `BACKPACK_SANDBOX` | `false` | 传递给 CCXT 的 sandbox 标志 |

当前安装的 CCXT Backpack 适配器只公开生产 API 地址，仓库也没有 Backpack 自定义端点变量。`BACKPACK_SANDBOX=true` 不构成独立的已文档化测试环境。测试写操作时使用 `--dry-run`。

## 5. 验证配置

```bash
bun run index.ts doctor --exchange backpack --symbol BTC_USDC_PERP --json
bun run index.ts market ticker --exchange backpack --symbol BTC_USDC_PERP --json
```

以上命令不会创建订单。行情检查会加载 Backpack 市场列表并确认符号解析。

## 常见问题

- `BACKPACK_API_KEY and BACKPACK_API_SECRET ... required`：填写完整 Ed25519 凭证对。
- `Symbol ... not found in Backpack markets`：永续使用 `BTC_USDC_PERP`，现货使用 `BTC_USDC`。
- 签名失败：检查 API Key/Secret 是否属于同一密钥对，并同步系统时间。
- 子账户余额为空：确认 `BACKPACK_SUBACCOUNT` 与创建 Key 时授权的账户一致。

## 安全要求

- API Secret 是 Ed25519 私钥，应按交易私钥保护。
- Key 仅授予读取和交易权限。
- Secret 泄露后立即删除 Key 并创建新密钥对。

## 参考资料

- [Backpack Exchange API](https://docs.backpack.exchange/)
- [仓库内 Backpack OpenAPI](../backpack/openapi.json)
