# Lighter 配置教程

English version: [Lighter Configuration Guide](lighter.en.md)

## 适用范围

本教程用于 Lighter 永续和已接入现货市场。Lighter 凭证由账户索引、API Key 索引和 API 私钥组成，三者必须属于同一网络和同一账户。

## 1. 选择网络

| `LIGHTER_ENV` | REST 地址 | Chain ID |
| --- | --- | --- |
| `mainnet` | `https://mainnet.zklighter.elliot.ai` | `304` |
| `testnet` | `https://testnet.zklighter.elliot.ai` | `300` |
| `staging` | `https://staging.zklighter.elliot.ai` | `300` |
| `dev` | `https://dev.zklighter.elliot.ai` | `300` |

当前默认值为 `testnet`。生产交易应显式设置 `LIGHTER_ENV=mainnet`。

## 2. 获取账户索引和 API Key

1. 在 [Lighter](https://app.lighter.xyz/?referral=111909FA) 创建并入金账户。
2. 按[官方 Get Started](https://apidocs.lighter.xyz/docs/get-started) 使用 L1 地址查询 `account_index`。
3. 按[官方 API Keys 指南](https://apidocs.lighter.xyz/docs/api-keys) 创建 API Key。
4. 保存创建流程返回的 API 私钥，并记录对应的 `api_key_index`。

用户创建的 API Key 索引范围为 `2`–`254`。`0` 和 `1` 由 Web/移动端保留，`255` 用于查询全部 Key。ritmex-bot 代码默认索引为 `0`，用户创建的 Key 应显式填写真实索引。

## 3. 最小测试网配置

```dotenv
EXCHANGE=lighter
LIGHTER_ENV=testnet
LIGHTER_ACCOUNT_INDEX=<your_account_index>
LIGHTER_API_KEY_INDEX=<your_api_key_index>
LIGHTER_API_PRIVATE_KEY=<your_api_private_key_hex>
LIGHTER_SYMBOL=BTC
```

Lighter 永续市场使用 `BTC`、`ETH`、`SOL` 这类市场符号。适配器会从目标网络的市场元数据自动解析 market ID 和精度。

## 4. 主网配置

将同一组变量替换为主网账户生成的值：

```dotenv
LIGHTER_ENV=mainnet
LIGHTER_ACCOUNT_INDEX=<your_mainnet_account_index>
LIGHTER_API_KEY_INDEX=<your_mainnet_api_key_index>
LIGHTER_API_PRIVATE_KEY=<your_mainnet_api_private_key_hex>
LIGHTER_SYMBOL=BTC
```

测试网和主网凭证不可混用。

## 5. 可选配置

| 变量 | 说明 |
| --- | --- |
| `LIGHTER_BASE_URL` | 覆盖 REST 地址；网络可从已知主机名推断 |
| `LIGHTER_L1_ADDRESS` | 账户关联的 L1 地址 |
| `LIGHTER_MARKET_ID` | 强制 market ID；仅在自动解析失败时设置 |
| `LIGHTER_MARKET_TYPE` | `perp` 或 `spot` |
| `LIGHTER_PRICE_DECIMALS` | 强制价格小数位 |
| `LIGHTER_SIZE_DECIMALS` | 强制数量小数位 |
| `LIGHTER_CHAIN_ID` | 覆盖签名 Chain ID |
| `LIGHTER_DEBUG` | 设置为 `1` 或 `true` 输出调试日志 |

现货市场使用 `ETH/USDC` 这类符号。显式 market ID、价格小数位和数量小数位必须与目标网络的 order book 元数据一致。

## 6. 验证配置

```bash
bun run index.ts doctor --exchange lighter --symbol BTC --json
bun run index.ts market ticker --exchange lighter --symbol BTC --json
```

行情检查会加载市场元数据、校验账户/API Key 对并建立 WebSocket，不会创建订单。

## 常见问题

- `LIGHTER_ACCOUNT_INDEX must be an integer`：填写账户接口返回的数字索引。
- `Invalid LIGHTER_API_KEY_INDEX`：使用创建 Key 时记录的非负整数索引。
- `private key does not match the one on Lighter`：账户索引、Key 索引、私钥或网络不匹配。
- `Configured market id ... not found`：检查 `LIGHTER_ENV`、`LIGHTER_SYMBOL` 和手动 market ID。
- signer 加载失败：仓库预置 macOS arm64 与 Linux amd64 签名库，其他平台需要构建兼容签名库或使用受支持的 WSL/Linux 环境。

## 安全要求

- API 私钥可以签署交易，应使用独立 Key 并限制文件权限。
- 保留 API 公钥和索引记录，私钥只存放在运行环境中。
- Key 泄露后在 Lighter 撤销对应索引并创建新 Key。

## 参考资料

- [Lighter Get Started](https://apidocs.lighter.xyz/docs/get-started)
- [Lighter API Keys](https://apidocs.lighter.xyz/docs/api-keys)
- [仓库内 Lighter 入门参考](../lighter/get-start.md)
