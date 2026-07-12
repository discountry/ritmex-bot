# Paradex 配置教程

English version: [Paradex Configuration Guide](paradex.en.md)

## 适用范围

本教程用于 Paradex 永续适配器。当前实现通过 CCXT 使用 EVM 钱包地址和对应私钥完成 Paradex 账户认证，并支持生产环境与测试网。

## 1. 准备专用钱包与账户

1. 创建一个专用于 Paradex API 交易的 EVM 钱包。
2. 在 [Paradex](https://paradex.io/ref/xingxingjun) 连接该钱包并完成账户 onboarding。
3. 接受交易条款并为目标环境准备保证金。
4. 记录钱包的 `0x` 地址和对应 32 字节私钥。

适配器会校验：

- `PARADEX_PRIVATE_KEY` 必须是 `0x` 加 64 个十六进制字符。
- `PARADEX_WALLET_ADDRESS` 必须是 `0x` 加 40 个十六进制字符。

## 2. 主网最小配置

```dotenv
EXCHANGE=paradex
PARADEX_PRIVATE_KEY=<0x_private_key>
PARADEX_WALLET_ADDRESS=<0x_wallet_address>
PARADEX_SANDBOX=false
PARADEX_SYMBOL=BTC-USD-PERP
```

`BTC-USD-PERP` 是 Paradex 原始 market ID。适配器会将其解析到 CCXT 统一市场符号。使用原始 market ID 可以避免期权、交割合约和永续市场的统一符号冲突。

## 3. 测试网配置

```dotenv
EXCHANGE=paradex
PARADEX_PRIVATE_KEY=<0x_testnet_private_key>
PARADEX_WALLET_ADDRESS=<0x_testnet_wallet_address>
PARADEX_SANDBOX=true
PARADEX_SYMBOL=BTC-USD-PERP
```

Paradex 测试网账户需要独立 onboarding。主网和测试网账户状态、余额与认证上下文相互独立。

## 4. 可选配置

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PARADEX_RECONNECT_DELAY_MS` | `2000` | WebSocket/轮询重连延迟 |
| `PARADEX_USE_PRO` | 自动检测 | 允许使用 `ccxt.pro` 流式接口 |
| `PARADEX_DEBUG` | `false` | 输出适配器调试日志 |

项目依赖包含 `ccxt`，未包含 `ccxt.pro`。当前标准安装会使用 REST 轮询路径。

## 5. 验证配置

```bash
bun run index.ts doctor --exchange paradex --symbol BTC-USD-PERP --json
bun run index.ts market ticker --exchange paradex --symbol BTC-USD-PERP --json
```

行情检查会加载市场并验证账户访问，不会创建订单。未完成 onboarding 时会返回明确错误。

## 常见问题

- `Invalid PARADEX_PRIVATE_KEY`：私钥必须是 32 字节 `0x` 十六进制值。
- `Invalid PARADEX_WALLET_ADDRESS`：填写与私钥匹配的 20 字节 EVM 地址。
- `Paradex account is not onboarded`：在当前主网或测试网完成 onboarding。
- `Symbol ... not found`：使用原始市场 ID，例如 `BTC-USD-PERP`。
- 余额查询失败：检查钱包地址、私钥和 `PARADEX_SANDBOX` 是否属于同一环境。

## 安全要求

- 使用专用 API 钱包，钱包中只保留策略所需资产。
- 私钥具备钱包签名能力，应使用严格文件权限并限制机器访问。
- 私钥泄露后立即转移资产并更换钱包。

## 参考资料

- [Paradex API Documentation](https://docs.paradex.trade/)
- [Paradex API Quick Start](https://docs.paradex.trade/api/general-information/api-quick-start)
- [Paradex API Onboarding](https://docs.paradex.trade/api/general-information/authentication)

