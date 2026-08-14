# Lighter 配置教程

English version: [Lighter Configuration Guide](lighter.en.md)

## 适用范围

本教程用于 Lighter 永续和已接入现货市场。Lighter 凭证由账户索引、API Key 索引和 API 私钥组成，三者必须属于同一网络和同一账户。

## 1. 选择网络

| `LIGHTER_ENV` | REST 地址 | WebSocket | 签名 Chain ID | 计价资产 |
| --- | --- | --- | --- | --- |
| `mainnet` | `https://mainnet.zklighter.elliot.ai` | `wss://mainnet.zklighter.elliot.ai/stream` | `304` | USDC |
| `rh` | `https://api.rh.lighter.xyz` | `wss://api.rh.lighter.xyz/stream` | `466324` | USDG |
| `testnet` | `https://testnet.zklighter.elliot.ai` | `wss://testnet.zklighter.elliot.ai/stream` | `300` | USDC |
| `rh-testnet` | `https://api.rh-testnet.lighter.xyz` | `wss://api.rh-testnet.lighter.xyz/stream` | `300` | USDG |
| `staging` | `https://staging.zklighter.elliot.ai` | `wss://staging.zklighter.elliot.ai/stream` | `300` | USDC |
| `dev` | `https://dev.zklighter.elliot.ai` | `wss://dev.zklighter.elliot.ai/stream` | `300` | USDC |

`rh` 是 Robinhood Chain 部署（网页端 `robinhoodchain.lighter.xyz`）。它与主站是两条独立的链：账户、API Key、market ID 和资金都不互通，签名 Chain ID 也不同。

**切换平台只需要改 `LIGHTER_ENV` 这一个变量** —— REST 地址、WebSocket 地址和签名 Chain ID 都由它一起派生，不会出现只改了一半的错配。别名 `robinhood`、`robinhoodchain`、`rhc` 等价于 `rh`。

当前默认值为 `testnet`。生产交易应显式设置 `LIGHTER_ENV=mainnet` 或 `LIGHTER_ENV=rh`。

启动时机器人会打印一行确认，并调用 `/api/v1/layer1BasicInfo` 用 L1 Chain ID 与 ZkLighter 合约地址核对连接的确实是配置声明的那条链，不一致直接报错退出：

```
[Lighter] env=rh rest=https://api.rh.lighter.xyz ws=wss://api.rh.lighter.xyz/stream chainId=466324 account=12345
```

## 2. 获取账户索引和 API Key

1. 创建并入金账户：[Robinhood Chain](https://robinhoodchain.lighter.xyz/?referral=RITMEX)（额外 10% 积分加成）或 [Lighter 主站](https://app.lighter.xyz/?referral=111909FA)。两个平台的账户互相独立。
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

## 5. Robinhood Chain 配置

```dotenv
EXCHANGE=lighter
LIGHTER_ENV=rh
LIGHTER_ACCOUNT_INDEX=<your_rh_account_index>
LIGHTER_API_KEY_INDEX=<your_rh_api_key_index>
LIGHTER_API_PRIVATE_KEY=<your_rh_api_private_key_hex>
LIGHTER_SYMBOL=BTC
```

切换平台时的注意事项：

- **凭证不通用**：Robinhood Chain 的账户索引和 API Key 必须在该平台单独创建。
- **market ID 是另一套编号**，跨平台复用必然指向错误的标的。除非自动解析失败，否则不要设置 `LIGHTER_MARKET_ID`；从主站切过来时务必清掉这个变量。
- **现货计价资产是 USDG 而非 USDC**，现货符号写成 `ETH/USDG`。
- 该平台提供股票类永续（`TSLA`、`AAPL`、`NVDA` 等）和代币化股票现货。
- `SGOV/USDG`、`ORCL/USDG`、`MU/USDG` 三个现货市场的合约 `multiplier` 不等于 1，而下单数量/价格换算按 1.0 处理，因此这些市场会被直接拒绝。确认自己清楚换算关系后可用 `LIGHTER_ALLOW_NON_UNIT_MULTIPLIER=1` 放行。

## 6. 可选配置

| 变量 | 说明 |
| --- | --- |
| `LIGHTER_BASE_URL` | 覆盖 REST 地址；已知主机名会自动推断网络，填入网页端地址（如 `robinhoodchain.lighter.xyz`）会自动换成对应 API 地址 |
| `LIGHTER_WS_URL` | 覆盖 WebSocket 地址；不填时由 `LIGHTER_ENV` 或 `LIGHTER_BASE_URL` 派生 |
| `LIGHTER_L1_ADDRESS` | 账户关联的 L1 地址 |
| `LIGHTER_MARKET_ID` | 强制 market ID；仅在自动解析失败时设置，且不可跨平台复用 |
| `LIGHTER_MARKET_TYPE` | `perp` 或 `spot` |
| `LIGHTER_PRICE_DECIMALS` | 强制价格小数位 |
| `LIGHTER_SIZE_DECIMALS` | 强制数量小数位 |
| `LIGHTER_CHAIN_ID` | 覆盖签名 Chain ID；自建/代理主机无法识别网络时必填 |
| `LIGHTER_ALLOW_NON_UNIT_MULTIPLIER` | 允许交易 `multiplier ≠ 1` 的市场 |
| `LIGHTER_DEBUG` | 设置为 `1` 或 `true` 输出调试日志 |

现货市场使用 `ETH/USDC`（主站）或 `ETH/USDG`（Robinhood Chain）这类符号。显式 market ID、价格小数位和数量小数位必须与目标网络的 order book 元数据一致。

自建节点或走代理时，若主机名无法识别为已知部署，则必须显式设置 `LIGHTER_CHAIN_ID` —— 签名 Chain ID 没有任何接口可以查询，猜错会导致每一笔交易验签失败，因此这里选择直接报错而不是使用默认值。

## 7. 验证配置

```bash
bun run index.ts doctor --exchange lighter --symbol BTC --json
bun run index.ts market ticker --exchange lighter --symbol BTC --json
```

行情检查会加载市场元数据、校验账户/API Key 对并建立 WebSocket，不会创建订单。

## 常见问题

- `LIGHTER_ACCOUNT_INDEX must be an integer`：填写账户接口返回的数字索引。
- `Invalid LIGHTER_API_KEY_INDEX`：使用创建 Key 时记录的非负整数索引。
- `private key does not match the one on Lighter`：账户索引、Key 索引、私钥或网络不匹配。
- `Configured market id ... not found`：检查 `LIGHTER_ENV`、`LIGHTER_SYMBOL` 和手动 market ID。跨平台切换后最常见的原因是 `LIGHTER_MARKET_ID` 仍是上一个平台的编号。
- `Lighter network mismatch`：REST 地址与 `LIGHTER_ENV` 指向了不同的部署，机器人在下单前拦下了这个错配。按上表核对 `LIGHTER_ENV` 与 `LIGHTER_BASE_URL`。
- `Unknown Lighter environment`：`LIGHTER_ENV` 拼写错误，报错信息会列出全部合法取值与别名。
- `has contract multiplier ... not 1.0`：该市场的合约乘数不为 1，换算可能失真；确认无误后用 `LIGHTER_ALLOW_NON_UNIT_MULTIPLIER=1` 放行。
- signer 加载失败：仓库预置 macOS arm64 与 Linux amd64 签名库，其他平台需要构建兼容签名库或使用受支持的 WSL/Linux 环境。

## 安全要求

- API 私钥可以签署交易，应使用独立 Key 并限制文件权限。
- 保留 API 公钥和索引记录，私钥只存放在运行环境中。
- Key 泄露后在 Lighter 撤销对应索引并创建新 Key。

## 参考资料

- [Lighter Get Started](https://apidocs.lighter.xyz/docs/get-started)
- [Lighter API Keys](https://apidocs.lighter.xyz/docs/api-keys)
- [仓库内 Lighter 入门参考](../lighter/get-start.md)
