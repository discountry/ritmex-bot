# Portfolio Viewer CLI 使用指南

Portfolio Viewer 是一个强大的命令行工具，可以同时显示多个交易所的持仓信息和委托订单。

## 功能特性

- 🔄 **多交易所支持**: 同时连接 Aster、GRVT、Lighter、Backpack、Paradex
- 📊 **持仓信息**: 显示开仓价格、持仓数量、当前价格、未实现盈亏及收益率
- 📋 **委托订单**: 显示所有交易所的活跃订单信息
- 🎨 **彩色输出**: 盈亏用绿色/红色标识，买卖方向用不同颜色
- ⚡ **实时数据**: 通过WebSocket获取最新的市场数据

## 快速开始

### 1. 配置交易所API密钥

首先运行配置向导来设置您的API密钥：

```bash
bun run portfolio:setup
```

这个交互式工具会引导您：
- 选择要配置的交易所
- 输入各交易所的API凭证
- 设置交易对符号
- 生成 `.env` 文件

### 2. 查看持仓信息

配置完成后，运行以下命令查看所有交易所的持仓和订单：

```bash
bun run portfolio
```

## 手动配置

如果您更喜欢手动配置，可以直接编辑 `.env` 文件：

### Aster Exchange
```bash
ASTER_API_KEY=your_api_key
ASTER_API_SECRET=your_api_secret
ASTER_SYMBOL=BTCUSDT
```

### GRVT Exchange
```bash
GRVT_API_KEY=your_api_key
GRVT_API_SECRET=your_api_secret
GRVT_SUB_ACCOUNT_ID=your_sub_account_id
GRVT_INSTRUMENT=BTC_USDT_Perp
GRVT_SYMBOL=BTCUSDT
GRVT_ENV=prod
```

### Lighter Exchange
```bash
LIGHTER_ACCOUNT_INDEX=0
LIGHTER_API_PRIVATE_KEY=0x...
LIGHTER_API_KEY_INDEX=0
LIGHTER_ENV=testnet
LIGHTER_SYMBOL=BTCUSDT
```

### Backpack Exchange
```bash
BACKPACK_API_KEY=your_api_key
BACKPACK_API_SECRET=your_api_secret
BACKPACK_PASSWORD=your_password
BACKPACK_SUBACCOUNT=your_subaccount
BACKPACK_SANDBOX=false
BACKPACK_SYMBOL=BTC_USD_PERP
```

### Paradex Exchange
```bash
PARADEX_PRIVATE_KEY=0x...
PARADEX_WALLET_ADDRESS=0x...
PARADEX_SANDBOX=false
PARADEX_SYMBOL=BTC-USD-PERP
```

## 输出示例

### 持仓信息表格
```
================================================================================
📊 持仓信息汇总
================================================================================
交易所        交易对           开仓价格      持仓数量         当前价格      未实现盈亏       收益率(%)
--------------------------------------------------------------------------------
ASTER        BTCUSDT         43250.00     0.001000        43500.00     2.50            0.58%
GRVT         BTCUSDT         43200.00     0.002000        43500.00     6.00            0.69%
LIGHTER      BTCUSDT         43300.00    -0.001500        43500.00    -3.00           -0.46%
```

### 委托订单表格
```
================================================================================
📋 委托订单汇总
================================================================================
交易所        交易对           价格          数量             方向      类型        状态
--------------------------------------------------------------------------------
ASTER        BTCUSDT         43000.00     0.001000        BUY       LIMIT       NEW
GRVT         BTCUSDT         44000.00     0.001000        SELL      LIMIT       NEW
BACKPACK     BTC_USD_PERP    43100.00     0.002000        BUY       LIMIT       NEW
```

## 命令行选项

```bash
# 显示帮助信息
bun run portfolio -- --help

# 静默模式（减少输出）
bun run portfolio -- --silent
```

## 故障排除

### 常见问题

1. **连接超时**
   - 检查网络连接
   - 确认API密钥正确
   - 某些交易所可能需要IP白名单

2. **API密钥错误**
   - 重新运行 `bun run portfolio:setup` 检查配置
   - 确认API密钥有足够的权限（读取账户、订单）

3. **数据不显示**
   - 确认账户中有持仓或订单
   - 检查交易对符号是否正确

### 调试模式

设置环境变量启用详细日志：

```bash
# 启用特定交易所的调试日志
LIGHTER_DEBUG=true bun run portfolio
BACKPACK_DEBUG=true bun run portfolio
PARADEX_DEBUG=true bun run portfolio
```

## 安全注意事项

- 🔒 **API权限**: 建议只给予读取权限，不要给予交易权限
- 🔐 **密钥保护**: 不要将 `.env` 文件提交到版本控制
- 🌐 **网络安全**: 在安全的网络环境中运行
- 📱 **IP白名单**: 某些交易所需要设置IP白名单

## 支持的交易所

| 交易所 | 状态 | 持仓 | 订单 | 实时数据 |
|--------|------|------|------|----------|
| Aster  | ✅   | ✅   | ✅   | ✅       |
| GRVT   | ✅   | ✅   | ✅   | ✅       |
| Lighter| ✅   | ✅   | ✅   | ✅       |
| Backpack| ✅  | ✅   | ✅   | ✅       |
| Paradex| ✅   | ✅   | ✅   | ✅       |

## 更新日志

### v1.0.0
- 初始版本发布
- 支持5个主要交易所
- 交互式配置向导
- 彩色表格输出
- 实时数据获取

---

如有问题或建议，请查看项目的其他文档或提交Issue。