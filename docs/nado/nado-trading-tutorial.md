# Nado 交易机器人完全新手教程

> 本教程面向零基础用户，手把手教你如何在 Nado 交易所使用 ritmex-bot 进行自动化交易。

## 目录

1. [什么是 Nado 和 ritmex-bot](#什么是-nado-和-ritmex-bot)
2. [准备工作](#准备工作)
3. [安装 Bun 运行环境](#安装-bun-运行环境)
4. [下载并安装 ritmex-bot](#下载并安装-ritmex-bot)
5. [在 Nado 创建账户并入金](#在-nado-创建账户并入金)
6. [获取 Nado 鉴权信息（重要）](#获取-nado-鉴权信息重要)
7. [配置 .env 文件](#配置-env-文件)
8. [启动交易机器人](#启动交易机器人)
9. [策略说明与选择](#策略说明与选择)
10. [常见问题与排查](#常见问题与排查)

---

## 什么是 Nado 和 ritmex-bot

### Nado 交易所

Nado 是一个运行在 **Ink L2 网络**（基于 Optimism Superchain）的去中心化永续合约交易所。它支持 BTC、ETH 等主流加密货币的永续合约交易，具有以下特点：

- **去中心化**：资产由用户钱包控制，无需信任中心化机构
- **低延迟**：使用 L2 网络，交易确认快速
- **统一保证金**：支持多种资产作为抵押品

注册使用 Nado 目前需要邀请码：

* [https://app.nado.xyz?join=eGp9qPD](https://app.nado.xyz?join=eGp9qPD)
* [https://app.nado.xyz?join=LKbIUs5](https://app.nado.xyz?join=LKbIUs5)

### ritmex-bot 交易机器人

ritmex-bot 是一个多交易所量化交易终端，支持多种自动化交易策略：

- **趋势跟随策略**：基于 SMA30 均线的趋势交易
- **做市策略**：双边挂单赚取买卖价差
- **Guardian 防守策略**：自动监控仓位，补挂止损止盈
- **网格策略**：区间震荡行情的网格交易

---

## 准备工作

在开始之前，请确保你具备以下条件：

### 硬件要求

- 一台可以联网的电脑（macOS、Linux 或 Windows）
- 稳定的网络连接

### 软件要求

- **终端/命令行工具**
  - macOS：使用自带的"终端"应用
  - Windows：推荐使用 WSL（Windows Subsystem for Linux）或 PowerShell
  - Linux：使用自带的终端

### 资金要求

- 至少 **50-100 USDT** 等值的资金用于交易
- 少量 **ETH**（约 0.01-0.05 ETH）用于支付 Gas 费用

### 钱包要求

- 一个支持 EVM 的钱包，推荐：
  - **MetaMask**（浏览器插件）
  - **Rabby Wallet**（更专业的交易钱包）

---

## 安装 Bun 运行环境

ritmex-bot 使用 **Bun** 作为运行环境。Bun 是一个快速的 JavaScript 运行时。

### macOS / Linux 安装

打开终端，输入以下命令：

```bash
curl -fsSL https://bun.sh/install | bash
```

安装完成后，**关闭并重新打开终端**，然后验证安装：

```bash
bun -v
```

如果显示版本号（如 `1.2.x`），说明安装成功。

### Windows 安装

**方法一：使用 PowerShell（推荐）**

以管理员身份打开 PowerShell，输入：

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**方法二：使用 WSL（更稳定）**

1. 先安装 WSL：在 PowerShell 中运行 `wsl --install`
2. 重启电脑
3. 打开 WSL 终端，按照 Linux 方式安装 Bun

---

## 下载并安装 ritmex-bot

### 方法一：使用 Git（推荐）

```bash
# 克隆代码仓库
git clone https://github.com/discountry/ritmex-bot.git

# 进入项目目录
cd ritmex-bot

# 安装依赖
bun install
```

### 方法二：直接下载 ZIP

1. 访问 https://github.com/discountry/ritmex-bot
2. 点击绿色的 "Code" 按钮
3. 选择 "Download ZIP"
4. 解压下载的文件
5. 在终端中进入解压后的目录
6. 运行 `bun install`

---

## 在 Nado 创建账户并入金

### 步骤 1：连接钱包

1. 访问 Nado 官网：https://app.nado.xyz
2. 点击右上角的 **"Connect Wallet"**
3. 选择你的钱包（如 MetaMask）
4. 在钱包中确认连接

### 步骤 2：添加 Ink 网络到钱包

Nado 运行在 Ink L2 网络上，你需要先添加这个网络：

**自动添加方式：**
1. 访问 https://chainlist.org/
2. 搜索 "Ink"
3. 点击 "Add to MetaMask"

**手动添加方式：**

在钱包设置中添加自定义网络，填写以下信息：

| 参数 | 值 |
|------|-----|
| 网络名称 | INK |
| RPC URL | https://rpc-gel.inkonchain.com |
| Chain ID | 57073 |
| 货币符号 | ETH |
| 区块浏览器 | https://explorer.inkonchain.com |

### 步骤 3：获取 Gas 费用（ETH）

在 Ink 网络上进行任何操作都需要少量 ETH 作为 Gas 费用。

**获取方式：**

- **从 CEX 直接提现**：Kraken 支持零手续费提现到 Ink 网络
- **跨链桥接**：使用 [Superbridge](https://superbridge.app/)、[Bungee](https://bungee.exchange/) 或 [Relay](https://relay.link/) 从其他链桥接 ETH 到 Ink

> 建议至少准备 0.01-0.05 ETH 用于支付 Gas 费用

### 步骤 4：存入交易资金

1. 在 Nado 网站导航到 **Portfolio** 页面
2. 点击 **Deposit**
3. 选择要存入的资产（支持 USDT0、wETH、USDC、kBTC、wBTC）
4. 输入金额并确认交易

---

## 获取 Nado 鉴权信息（重要）

这是配置机器人最关键的一步。Nado 使用基于 EVM 的签名认证方式，你需要获取以下两个关键信息：

- **NADO_SIGNER_PRIVATE_KEY**：签名私钥
- **NADO_SUBACCOUNT_OWNER**：子账户所有者地址

### 获取方式：从浏览器开发者工具提取

#### 步骤 1：登录 Nado 交易界面

1. 访问 https://app.nado.xyz
2. 连接你的钱包并完成登录
3. 确保你已经在 Nado 启用了一键交易功能并能正常下单

#### 步骤 2：打开浏览器开发者工具

- **Chrome / Edge**：按 `F12` 或 `Ctrl+Shift+I`（Mac 上是 `Cmd+Option+I`）
- **Firefox**：按 `F12` 或 `Ctrl+Shift+I`
- **Safari**：先在偏好设置中启用开发者菜单，然后按 `Cmd+Option+I`

#### 步骤 3：找到 Local Storage 中的私钥

1. 在开发者工具中，切换到 **Application** 标签（Chrome/Edge）或 **Storage** 标签（Firefox）
2. 在左侧菜单找到 **Local Storage**
3. 点击展开，找到 `https://app.nado.xyz`
4. 在右侧列表中找到 **`nado.userSettings`** 这一项
5. 点击这一项，查看其 Value（值）

#### 步骤 4：提取私钥

`nado.userSettings` 的值是一个 JSON 对象，大致结构如下：

```json
"signingPreferenceBySubaccountKey": {
  "inkMainnet_default": {
    {
      "privateKey": "0x1234567890abcdef...",
      ...
    }
  }
}
```

**你需要的是 `privateKey` 字段的值**，它是一个以 `0x` 开头的 64 位十六进制字符串。

将这个值复制下来，这就是你的 `NADO_SIGNER_PRIVATE_KEY`。

#### 步骤 5：获取子账户所有者地址

`NADO_SUBACCOUNT_OWNER` 就是你连接到 Nado 的钱包地址。

获取方式：
1. 打开你的钱包（如 MetaMask）
2. 复制你的钱包地址（以 `0x` 开头的 42 位地址）

这就是你的 `NADO_SUBACCOUNT_OWNER`。

### 关于 Linked Signer（进阶）

Nado 支持 "Linked Signer" 功能，允许你使用一个专门的签名密钥来代表你的主账户进行交易。这提供了额外的安全层：

- 主钱包私钥保持离线安全
- Linked Signer 只有交易权限，无法提取资金
- 可以随时撤销 Linked Signer

当你在 Nado 网站首次连接钱包时，系统会自动为你创建一个 Linked Signer，这个签名密钥就存储在浏览器的 Local Storage 中。

> **重要安全提示**：
> - `NADO_SIGNER_PRIVATE_KEY` 是 Linked Signer 的私钥，不是你主钱包的私钥
> - 这个私钥只能用于在 Nado 上签署交易，无法直接转移你的链上资产
> - 但仍需妥善保管，不要分享给他人

---

## 配置 .env 文件

### 步骤 1：创建 .env 文件

在项目根目录下，复制示例配置文件：

```bash
cp .env.example .env
```

### 步骤 2：编辑 .env 文件

使用任意文本编辑器打开 `.env` 文件：

```bash
# macOS
open -e .env

# Linux
nano .env

# Windows
notepad .env
```

### 步骤 3：填写 Nado 配置

在 `.env` 文件中找到并修改以下配置项：

```bash
# ============================================
# 交易所选择
# ============================================
EXCHANGE=nado

# ============================================
# Nado 交易所配置（必填）
# ============================================

# 签名私钥 - 从浏览器 Local Storage 获取
# 格式：以 0x 开头的 64 位十六进制字符串
NADO_SIGNER_PRIVATE_KEY=0x你的私钥

# 子账户所有者地址 - 你的钱包地址
# 格式：以 0x 开头的 42 位地址
NADO_SUBACCOUNT_OWNER=0x你的钱包地址

# 子账户名称（可选，默认为 default）
NADO_SUBACCOUNT_NAME=default

# 网络环境（可选）
# inkMainnet = 主网（真实交易）
# inkTestnet = 测试网（模拟交易）
NADO_ENV=inkMainnet

# 交易品种（可选，默认 BTC-PERP）
NADO_SYMBOL=BTC-PERP

# ============================================
# 交易参数配置
# ============================================

# 单笔交易数量（以 BTC 计）
TRADE_AMOUNT=0.001

# 止损金额（USD）- 亏损超过此金额触发平仓
LOSS_LIMIT=10

# 移动止盈触发金额（USD）
TRAILING_PROFIT=5

# 移动止盈回撤比例（0.2 = 20%）
TRAILING_CALLBACK_RATE=0.2
```

### 完整的 Nado 配置示例

```bash
# 交易所选择
EXCHANGE=nado

# Nado 凭证
NADO_SIGNER_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
NADO_SUBACCOUNT_OWNER=0xAbCdEf1234567890AbCdEf1234567890AbCdEf12
NADO_SUBACCOUNT_NAME=default
NADO_ENV=inkMainnet
NADO_SYMBOL=BTC-PERP

# 交易参数
TRADE_AMOUNT=0.001

# 趋势策略
LOSS_LIMIT=10
TRAILING_PROFIT=5
TRAILING_CALLBACK_RATE=0.2

# 波段策略
SWING_DIRECTION=short
SWING_STOP_LOSS_PCT=0.05 # 价格反向运动 5% 止损

# 做市策略参数（如果使用做市策略）
LOSS_LIMIT=0.08
MAKER_LOSS_LIMIT=0.08
LIQUIDITY_MAKER_LOSS_LIMIT=0.08
LIQUIDITY_MAKER_CLOSE_TICK_OFFSET=5
MAKER_ENTRY_DEPTH_LEVEL=1
```

## 启动交易机器人

### 方法一：交互式启动（推荐新手）

```bash
bun run index.ts
```

启动后会显示一个交互式菜单，使用方向键选择策略，按回车确认。

### 方法二：命令行直接启动

```bash
# 启动趋势策略
bun run index.ts --strategy trend --silent

# 启动做市策略
bun run index.ts --strategy maker --silent
```

### 方法三：使用 PM2 后台运行（推荐生产环境）

```bash
# 安装 PM2
bun add -d pm2

# 后台启动趋势策略
bunx pm2 start bun --name ritmex-trend --cwd . --restart-delay 5000 -- run index.ts --strategy trend --silent

# 查看运行状态
bunx pm2 list

# 查看日志
bunx pm2 logs ritmex-trend

# 停止运行
bunx pm2 stop ritmex-trend
```

---

## 策略说明与选择

### 趋势策略（Trend）

**适用场景**：单边行情，趋势明显的市场

**工作原理**：
- 使用 SMA30（30 周期简单移动平均线）判断趋势
- 价格突破均线时开仓
- 内置止损和移动止盈

**配置参数**：
```bash
TRADE_AMOUNT=0.001      # 单笔交易量
LOSS_LIMIT=10           # 止损金额（USD）
TRAILING_PROFIT=5       # 移动止盈触发金额
TRAILING_CALLBACK_RATE=0.2  # 回撤比例
```

### 做市策略（Maker）

**适用场景**：震荡行情，低波动市场

**工作原理**：
- 在买卖盘口双边挂单
- 赚取买卖价差
- 根据持仓自动调整挂单方向

**配置参数**：
```bash
MAKER_BID_OFFSET=0      # 买单价格偏移
MAKER_ASK_OFFSET=0      # 卖单价格偏移
MAKER_REFRESH_INTERVAL_MS=500  # 刷新间隔
```

## 常见问题与排查

### 问题 1：启动时提示 "Missing NADO_SIGNER_PRIVATE_KEY"

**原因**：未正确配置签名私钥

**解决方案**：
1. 确认 `.env` 文件存在于项目根目录
2. 检查 `NADO_SIGNER_PRIVATE_KEY` 是否正确填写
3. 确保私钥以 `0x` 开头

### 问题 2：启动时提示 "Missing NADO_SUBACCOUNT_OWNER"

**原因**：未配置子账户所有者地址

**解决方案**：
1. 在 `.env` 中填写 `NADO_SUBACCOUNT_OWNER` 为你的钱包地址
2. 也可以使用 `NADO_EVM_ADDRESS` 作为替代

### 问题 3：连接失败，无法获取账户信息

**可能原因及解决方案**：

1. **网络问题**：检查网络连接，确保能访问 Nado API
2. **私钥错误**：重新从浏览器 Local Storage 获取正确的私钥
3. **账户未激活**：确保在 Nado 网站上至少存入过资金
4. **Linked Signer 未启用**：账户需要至少有 5 USDT 价值的资产才能使用 Linked Signer

### 问题 4：下单失败，提示精度错误

**原因**：价格或数量精度不符合交易所要求

**解决方案**：
```bash
# BTC-PERP 的标准精度
PRICE_TICK=0.1    # 价格精度 0.1 USD
QTY_STEP=0.001    # 数量精度 0.001 BTC
```

### 问题 5：时间同步错误

**原因**：本地时间与服务器时间相差太大

**解决方案**：
- macOS/Linux：`sudo ntpdate -u time.apple.com`
- Windows：设置 → 时间和语言 → 同步时间

### 问题 6：Gas 费用不足

**原因**：Ink 网络上的 ETH 余额不足

**解决方案**：
1. 通过跨链桥向 Ink 网络转入少量 ETH（0.01-0.05 ETH）
2. 推荐使用 Superbridge 或 Relay 进行跨链

### 问题 7：找不到 Local Storage 中的私钥

**可能原因**：
1. 尚未在 Nado 完成首次连接/操作
2. 浏览器清除了缓存

**解决方案**：
1. 重新访问 https://app.nado.xyz
2. 连接钱包并进行一次操作（如查看账户）
3. 再次检查 Local Storage

---

## 安全提示

1. **永远不要分享你的私钥**：`NADO_SIGNER_PRIVATE_KEY` 虽然不是主钱包私钥，但仍可用于在 Nado 上进行交易

2. **使用专用交易账户**：建议创建一个专门用于交易的新钱包，不要放置大量资产

3. **定期检查授权**：在钱包中定期检查并撤销不需要的 DApp 授权

4. **小额测试**：首次运行时使用小额资金测试，确认一切正常后再增加资金

5. **保护 .env 文件**：
   - 不要将 `.env` 文件提交到 Git
   - 不要分享给他人
   - 定期更换凭证

---

## 社区与支持

- **Telegram 交流群**：https://t.me/+4fdo0quY87o4Mjhh
- **GitHub Issues**：https://github.com/discountry/ritmex-bot/issues
- **Nado 官方文档**：https://docs.nado.xyz

---

## 风险提示

量化交易具备风险。请注意：

- 市场波动可能导致亏损
- 技术故障可能导致订单执行异常
- 请勿投入无法承受损失的资金
- 建议先在测试网或小额账户中验证策略

祝交易顺利！
