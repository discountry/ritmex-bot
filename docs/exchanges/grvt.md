# GRVT 配置教程

English version: [GRVT Configuration Guide](grvt.en.md)

## 适用范围

本教程用于 GRVT 永续适配器。标准认证路径使用 API Key 登录会话，并使用 API Secret 对订单执行 EIP-712 签名。GRVT 的 API instrument 与 ritmex-bot 展示符号是两个独立配置项。

## 1. 获取账户信息与凭证

1. 在 [GRVT](https://grvt.io/exchange/sign-up?ref=sea) 完成账户和子账户开通。
2. 在账户设置的 API Key 页面创建交易凭证。
3. 保存 API Key 和配套的签名 Secret。
4. 记录目标子账户的数字 ID。
5. 从 GRVT 市场或 `all_instruments` 接口确认完整 instrument 名称。

BTC 永续的标准 instrument 为 `BTC_USDT_Perp`。instrument 区分大小写和分隔符，应使用 GRVT 返回的原始值。

## 2. 最小配置

```dotenv
EXCHANGE=grvt
GRVT_ENV=prod
GRVT_API_KEY=<your_grvt_api_key>
GRVT_API_SECRET=<your_grvt_signing_secret>
GRVT_SUB_ACCOUNT_ID=<your_sub_account_id>
GRVT_INSTRUMENT=BTC_USDT_Perp
GRVT_SYMBOL=BTCUSDT
```

`GRVT_INSTRUMENT` 是当前适配器的必填项。`GRVT_SYMBOL` 用于 ritmex-bot 内部展示和统一仓位映射；省略时会从 instrument 去除 `_` 和 `-` 后生成。

## 3. 环境选择

| `GRVT_ENV` | 用途 |
| --- | --- |
| `prod` | 生产环境 |
| `testnet` | 公共测试环境 |
| `staging` | GRVT staging 环境 |
| `dev` | GRVT development 环境 |

`mainnet` 和 `production` 会解析为 `prod`。API Key、Secret 和子账户 ID 必须属于同一环境。

测试网示例：

```dotenv
GRVT_ENV=testnet
GRVT_INSTRUMENT=BTC_USDT_Perp
GRVT_SYMBOL=BTCUSDT
```

## 4. 复用现有会话

高级部署可以提供：

```dotenv
GRVT_COOKIE=<existing_session_cookie>
GRVT_ACCOUNT_ID=<existing_account_id>
```

这两个变量会跳过 API Key 登录。订单签名仍需要 `GRVT_API_SECRET` 或 `GRVT_SIGNER_PATH` 指向的外部签名模块。

`GRVT_SIGNER_PATH` 适用于自行维护签名服务的部署。模块需要导出签名函数，并返回 GRVT 订单签名字段。

## 5. 验证配置

```bash
bun run index.ts doctor --exchange grvt --symbol BTCUSDT --json
bun run index.ts market ticker --exchange grvt --symbol BTCUSDT --json
```

以上命令不会创建订单。行情检查会验证环境、登录会话和 instrument 元数据。

## 常见问题

- `Missing GRVT_INSTRUMENT`：填写完整 instrument，例如 `BTC_USDT_Perp`。
- `Failed to authenticate with GRVT using API key`：检查环境、API Key 和子账户归属。
- `GRVT_API_SECRET is not configured for local signing`：填写签名 Secret 或配置外部 signer。
- `Unable to load GRVT instrument metadata`：检查 instrument 拼写和 `GRVT_ENV`。
- 签名过期：同步运行机器时间。

## 安全要求

- API Key 和签名 Secret 应使用专用交易凭证。
- 会话 Cookie 具备账户访问能力，应按敏感凭证保护。
- 外部 signer 模块应限制文件权限和调用来源。

## 参考资料

- [GRVT API Documentation](https://api-docs.grvt.io/)
- [GRVT Trading Streams and Authentication](https://api-docs.grvt.io/trading_streams)
- [仓库内 GRVT SDK 参考](../grvt/sdk-readme.md)

