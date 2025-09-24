# Ritmex-Bot 项目总结

## 项目概述

**ritmex-bot** 是一个基于 Bun 运行时的加密货币永续合约自动交易机器人，专门针对 Aster 交易所开发。该项目提供了完整的交易策略框架，包括趋势跟随策略和做市策略，具有实时行情监控、风险管理和自动化执行功能。

## 技术架构

### 核心技术栈
- **运行时**: Bun ≥ 1.2
- **语言**: TypeScript (ES模块)
- **UI框架**: React + Ink (命令行界面)
- **数据通信**: WebSocket (实时行情) + REST API (订单操作)
- **外部依赖**: 
  - `ccxt` - 交易所连接器
  - `ws` - WebSocket客户端
  - `react` - UI组件
  - `ink` - 终端界面渲染
  - `dotenv` - 环境变量管理

### 项目结构
```
ritmex-bot/
├── index.ts                    # 入口文件
├── package.json               # 项目配置
├── src/                       # 核心源码
│   ├── index.tsx             # React应用入口
│   ├── config.ts             # 配置管理
│   ├── core/                 # 核心引擎
│   │   ├── trend-engine.ts   # 趋势跟随引擎
│   │   ├── maker-engine.ts   # 做市引擎
│   │   ├── offset-maker-engine.ts # 偏移做市引擎
│   │   └── order-coordinator.ts   # 订单协调器
│   ├── exchanges/            # 交易所适配器
│   │   ├── adapter.ts        # 交易所接口定义
│   │   ├── aster-adapter.ts  # Aster交易所适配器
│   │   └── aster/
│   │       └── client.ts     # Aster API客户端
│   ├── ui/                   # 用户界面
│   │   ├── App.tsx          # 主应用组件
│   │   ├── TrendApp.tsx     # 趋势策略界面
│   │   ├── MakerApp.tsx     # 做市策略界面
│   │   └── components/      # 通用组件
│   ├── state/               # 状态管理
│   │   └── trade-log.ts     # 交易日志
│   └── utils/               # 工具函数
└── tests/                   # 测试文件
```

## 主要功能模块

### 1. 策略引擎

#### 趋势跟随策略 (TrendEngine)
- **技术指标**: SMA30 (30周期简单移动平均线)
- **进场信号**: 价格突破SMA30时产生买入/卖出信号
- **风险管理**: 
  - 固定止损 (`lossLimit`)
  - 追踪止盈 (`trailingProfit` + `trailingCallbackRate`)
  - 盈利保护 (`profitLockTriggerUsd` + `profitLockOffsetUsd`)
- **订单管理**: 市价单进场，止损单/追踪止损单管理

#### 做市策略 (MakerEngine)
- **双边挂单**: 同时在买盘和卖盘挂限价单
- **动态定价**: 根据盘口价格和配置的偏移量自动调整报价
- **追价机制**: 当市场价格变动超过阈值时自动调整挂单价格
- **风险控制**: 持仓止损保护

#### 偏移做市策略 (OffsetMakerEngine)  
- **深度分析**: 根据订单簿深度动态调整挂单偏移
- **不平衡检测**: 监控市场失衡并及时撤退
- **自适应调整**: 基于市场流动性状况优化报价策略

### 2. 交易所适配器

#### Aster交易所集成
- **REST API**: 订单创建、取消、账户查询
- **WebSocket**: 实时行情数据流
  - 账户变动推送
  - 订单状态更新
  - 深度行情 (Order Book)
  - 价格行情 (Ticker)
  - K线数据 (Kline)
- **认证机制**: API Key/Secret签名认证
- **连接管理**: 自动重连、心跳保持

### 3. 用户界面

#### 命令行界面 (基于Ink)
- **策略选择**: 交互式策略选择菜单
- **实时监控**: 
  - 持仓信息显示
  - 损益统计
  - 订单状态监控
  - 交易日志展示
- **操作控制**: 键盘快捷键控制 (↑/↓选择, Enter确认, Esc返回, Ctrl+C退出)

### 4. 风险管理系统

#### 订单协调器 (OrderCoordinator)
- **订单锁机制**: 防止重复下单
- **异步订单处理**: 支持并发订单操作
- **错误恢复**: 订单失败自动重试和错误处理
- **止损保护**: 自动止损单管理

#### 风险控制工具
- **滑点控制**: 最大成交滑点限制
- **持仓监控**: 实时持仓盈亏计算
- **资金管理**: 单笔交易金额限制

## 配置系统

### 环境变量配置
```typescript
interface TradingConfig {
  symbol: string;                    // 交易对 (如 BTCUSDT)
  tradeAmount: number;              // 单次交易数量
  lossLimit: number;                // 最大亏损限制
  trailingProfit: number;           // 追踪止盈触发值
  trailingCallbackRate: number;     // 追踪止盈回撤率
  profitLockTriggerUsd: number;     // 盈利保护触发值
  profitLockOffsetUsd: number;      // 盈利保护偏移值
  priceTick: number;               // 最小价格单位
  qtyStep: number;                 // 最小数量单位
}
```

### 做市策略配置
```typescript
interface MakerConfig {
  priceChaseThreshold: number;      // 追价阈值
  bidOffset: number;               // 买单偏移
  askOffset: number;               // 卖单偏移  
  refreshIntervalMs: number;       // 刷新间隔
}
```

## 部署和使用

### 安装要求
- Bun ≥ 1.2
- Node.js (可选，作为Bun的备选)
- Aster交易所API密钥

### 快速启动
1. **一键安装脚本** (macOS/Linux):
   ```bash
   curl -fsSL https://github.com/discountry/ritmex-bot/raw/refs/heads/main/setup.sh | bash
   ```

2. **手动安装**:
   ```bash
   git clone https://github.com/discountry/ritmex-bot.git
   cd ritmex-bot
   bun install
   cp .env.example .env  # 配置API密钥
   bun run index.ts
   ```

### Windows支持
- 推荐使用WSL (Windows Subsystem for Linux)
- 或使用PowerShell安装Bun

## 核心特性

### 1. 实时性能
- WebSocket实时数据流
- 低延迟订单执行
- 自动断线重连

### 2. 策略灵活性  
- 模块化策略设计
- 可配置参数系统
- 易于扩展新策略

### 3. 风险控制
- 多层风险保护机制
- 实时损益监控
- 自动止损执行

### 4. 用户体验
- 直观的命令行界面
- 详细的交易日志
- 实时状态反馈

## 社区和支持

- **GitHub仓库**: https://github.com/discountry/ritmex-bot
- **Telegram群组**: https://t.me/+4fdo0quY87o4Mjhh
- **推荐码**: 注册Aster可获得30%手续费折扣
- **文档**: 提供详细的使用教程和API文档

## 技术亮点

1. **现代技术栈**: 基于Bun和TypeScript的高性能架构
2. **模块化设计**: 交易所适配器、策略引擎、UI层完全解耦
3. **企业级风控**: 完善的订单管理和风险控制机制  
4. **开发者友好**: 完整的类型定义、测试覆盖和代码文档
5. **生产就绪**: 支持自动重连、错误恢复和状态持久化

该项目为加密货币量化交易提供了一个完整、可靠的解决方案，特别适合需要在Aster交易所进行自动化交易的用户。
