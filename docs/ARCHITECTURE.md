# 系统架构文档

## 概览

ritmex-bot 是一个基于 Bun 的多交易所量化交易平台，采用模块化架构设计，支持多种交易策略和交易所。

## 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        ritmex-bot                               │
├─────────────────┬───────────────────┬───────────────────────────┤
│   CLI Interface │    Web Interface  │     Configuration         │
│   (Ink.js)      │    (React)        │     (.env, config.ts)     │
├─────────────────┼───────────────────┼───────────────────────────┤
│                 │   Strategy Layer                              │
│   ┌─────────────┼───────────────────┼─────────────────────────┐ │
│   │ Trend       │ Maker             │ Grid        │ Basis Arb │ │
│   │ Engine      │ Engine            │ Engine      │ Engine    │ │
│   └─────────────┴───────────────────┴─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                    Core Services                                │
│   ┌─────────────────┬───────────────┬───────────────────────┐   │
│   │ Order           │ Event         │ Risk Management       │   │
│   │ Coordinator     │ Emitter       │ & Position Tracking   │   │
│   └─────────────────┴───────────────┴───────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                   Exchange Adapters                             │
│   ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐ │
│   │ Aster   │ GRVT    │ Lighter │Backpack │ Paradex │ Future  │ │
│   │ Adapter │ Adapter │ Adapter │ Adapter │ Adapter │ Adapters│ │
│   └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                     Network Layer                               │
│   ┌─────────────────────────┬───────────────────────────────┐   │
│   │ REST API Clients        │ WebSocket Connections         │   │
│   │ (HTTP/HTTPS)            │ (Real-time data feeds)        │   │
│   └─────────────────────────┴───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 核心模块详解

### 1. 入口层 (Entry Layer)

#### CLI 接口 (`index.ts`, `src/index.tsx`)
- **职责**: 命令行参数解析、策略选择、错误处理
- **关键文件**:
  - `index.ts`: 项目入口点
  - `src/index.tsx`: React/Ink 应用入口
  - `src/cli/args.ts`: CLI 参数解析

#### 用户界面 (`src/ui/`)
- **职责**: 提供交互式界面显示实时数据
- **技术栈**: React + Ink.js
- **组件**:
  - `App.tsx`: 主应用组件
  - `GridApp.tsx`: 网格策略界面
  - `MakerApp.tsx`: 做市策略界面
  - `TrendApp.tsx`: 趋势策略界面

### 2. 策略层 (Strategy Layer)

#### 策略引擎 (`src/strategy/`)
每个策略都是独立的引擎，实现特定的交易逻辑：

##### 趋势策略 (`trend-engine.ts`)
- **原理**: 基于 SMA30 均线突破
- **特性**: 止损、移动止盈、布林带过滤
- **风控**: 固定止损、动态止盈、仓位管理

##### 做市策略 (`maker-engine.ts`)
- **原理**: 双边报价，赚取买卖差价
- **特性**: 自动追价、风险控制
- **风控**: 损失上限、滑点保护

##### 网格策略 (`grid-engine.ts`)
- **原理**: 在价格区间内等比分布买卖单
- **特性**: 几何等比网格、自动重启
- **风控**: 区间止损、仓位限制

##### 基差套利 (`basis-arb-engine.ts`)
- **原理**: 现货与期货价差套利
- **特性**: 双边对冲
- **风控**: 价差监控、风险敞口控制

#### 策略公共模块 (`src/strategy/common/`)
- `event-emitter.ts`: 策略间事件通信
- `grid-storage.ts`: 网格状态持久化
- `session-volume.ts`: 交易量统计
- `subscriptions.ts`: 市场数据订阅管理

### 3. 核心服务层 (Core Services)

#### 订单协调器 (`src/core/order-coordinator.ts`)
- **职责**: 统一的订单管理和执行
- **功能**:
  - 订单生命周期管理
  - 批量订单处理
  - 订单状态同步
  - 风险检查

#### 核心库 (`src/core/lib/`)
- `order-plan.ts`: 订单计划和策略
- `orders.ts`: 订单数据结构和工具
- `rate-limit.ts`: API 限流控制

### 4. 交易所适配层 (Exchange Adapters)

#### 适配器架构 (`src/exchanges/`)
每个交易所都有独立的适配器，实现统一的接口：

```typescript
interface ExchangeAdapter {
  // 账户信息
  getAccountInfo(): Promise<AccountInfo>;
  getPositions(): Promise<Position[]>;
  
  // 市场数据
  getTicker(symbol: string): Promise<Ticker>;
  getOrderBook(symbol: string): Promise<OrderBook>;
  
  // 交易操作
  createOrder(order: OrderRequest): Promise<Order>;
  cancelOrder(orderId: string): Promise<void>;
  
  // 实时数据
  subscribeToTicker(symbol: string, callback: TickerCallback): void;
  subscribeToOrderBook(symbol: string, callback: OrderBookCallback): void;
}
```

#### 支持的交易所
- **Aster** (`aster-adapter.ts`): 主要交易所，默认支持
- **GRVT** (`grvt/adapter.ts`): 高频交易支持
- **Lighter** (`lighter/adapter.ts`): zkLighter 生态
- **Backpack** (`backpack/adapter.ts`): USDC 永续合约
- **Paradex** (`paradex/adapter.ts`): StarkEx 架构

### 5. 配置管理 (`src/config.ts`)

#### 配置层次结构
1. **环境变量** (`.env`): 主要配置来源
2. **命令行参数**: 运行时覆盖
3. **默认值**: 代码中的后备配置

#### 配置分类
- `TradingConfig`: 通用交易配置
- `MakerConfig`: 做市策略特有配置
- `GridConfig`: 网格策略特有配置
- `BasisArbConfig`: 基差套利配置

### 6. 工具层 (Utilities)

#### 指标计算 (`src/indicators/`)
- `sma.ts`: 简单移动平均
- `ema.ts`: 指数移动平均
- `bbands.ts`: 布林带指标
- `atr.ts`: 平均真实波幅

#### 通用工具 (`src/utils/`)
- `format.ts`: 数据格式化
- `math.ts`: 数学计算工具
- `price.ts`: 价格处理工具
- `risk.ts`: 风险管理工具
- `pnl.ts`: 盈亏计算

### 7. 数据层

#### 回测支持 (`src/backtest/`)
- `engine.ts`: 回测引擎
- `simulator.ts`: 市场模拟器
- `metrics.ts`: 性能指标计算

#### 日志记录 (`src/logging/`)
- `trade-log.ts`: 交易日志记录和分析

## 数据流

### 1. 启动流程
```
CLI 参数解析 → 环境变量加载 → 交易所适配器初始化 → 策略引擎启动 → UI 渲染
```

### 2. 交易流程
```
市场数据获取 → 策略信号生成 → 订单创建 → 风险检查 → 订单发送 → 状态更新 → UI 刷新
```

### 3. 风控流程
```
持仓监控 → 风险计算 → 阈值检查 → 风控动作 → 日志记录
```

## 设计原则

### 1. 模块化
- 每个策略都是独立的模块
- 交易所适配器可插拔
- 配置与逻辑分离

### 2. 可扩展性
- 新交易所可轻松接入
- 新策略可快速开发
- 配置参数灵活调整

### 3. 容错性
- 全局错误处理
- 网络断线重连
- 状态恢复机制

### 4. 性能优化
- WebSocket 实时数据
- 批量订单处理
- 智能限流控制

## 部署架构

### 开发环境
```
本地开发 → Bun 运行时 → 本地 .env 配置 → 测试网交易所
```

### 生产环境
```
服务器部署 → PM2 进程管理 → 环境变量注入 → 主网交易所 → 监控告警
```

## 安全考虑

### 1. API 密钥管理
- 环境变量存储
- 最小权限原则
- 定期轮换

### 2. 网络安全
- HTTPS/WSS 加密通信
- IP 白名单
- 签名验证

### 3. 风险控制
- 多层风控检查
- 实时监控
- 自动熔断

## 扩展指南

### 添加新交易所
1. 创建适配器: `src/exchanges/newexchange/adapter.ts`
2. 实现接口: `ExchangeAdapter`
3. 添加配置: 更新 `config.ts`
4. 更新文档: 添加使用说明

### 添加新策略
1. 创建引擎: `src/strategy/new-strategy-engine.ts`
2. 实现策略逻辑
3. 创建 UI: `src/ui/NewStrategyApp.tsx`
4. 更新 CLI: 添加选项到主菜单

---

*此文档会随着代码变更持续更新。如有疑问，请参考源代码或提交 Issue。*