# API 参考文档

## 核心接口

### ExchangeAdapter 接口

所有交易所适配器都必须实现的核心接口：

```typescript
interface ExchangeAdapter {
  // 基础信息
  readonly id: string;
  readonly name: string;
  
  // 连接管理
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  
  // 账户信息
  getAccountInfo(): Promise<AccountInfo>;
  getPositions(symbol?: string): Promise<Position[]>;
  getOpenOrders(symbol?: string): Promise<Order[]>;
  
  // 市场数据
  getTicker(symbol: string): Promise<Ticker>;
  getOrderBook(symbol: string, limit?: number): Promise<OrderBook>;
  getKlines(symbol: string, interval: string, limit?: number): Promise<Kline[]>;
  
  // 交易操作
  createOrder(request: CreateOrderRequest): Promise<Order>;
  cancelOrder(orderId: string, symbol?: string): Promise<void>;
  cancelAllOrders(symbol?: string): Promise<void>;
  
  // 实时数据订阅
  subscribeToTicker(symbol: string, callback: (ticker: Ticker) => void): void;
  subscribeToOrderBook(symbol: string, callback: (orderbook: OrderBook) => void): void;
  subscribeToTrades(symbol: string, callback: (trade: Trade) => void): void;
  subscribeToOrders(callback: (order: Order) => void): void;
  subscribeToPositions(callback: (positions: Position[]) => void): void;
}
```

### 数据类型定义

#### AccountInfo
```typescript
interface AccountInfo {
  totalBalance: number;        // 总余额 (USDT)
  availableBalance: number;    // 可用余额 (USDT)
  marginBalance: number;       // 保证金余额 (USDT)
  unrealizedPnl: number;      // 未实现盈亏 (USDT)
  marginRatio?: number;       // 保证金比率
  positions: Position[];       // 持仓列表
}
```

#### Position
```typescript
interface Position {
  symbol: string;             // 交易对
  side: 'long' | 'short';     // 持仓方向
  size: number;               // 持仓数量
  entryPrice: number;         // 开仓价格
  markPrice: number;          // 标记价格
  unrealizedPnl: number;      // 未实现盈亏
  percentage: number;         // 收益率百分比
  leverage?: number;          // 杠杆倍数
  marginType?: 'cross' | 'isolated'; // 保证金模式
}
```

#### Order
```typescript
interface Order {
  id: string;                 // 订单ID
  clientOrderId?: string;     // 客户端订单ID
  symbol: string;             // 交易对
  side: 'buy' | 'sell';       // 买卖方向
  type: OrderType;            // 订单类型
  amount: number;             // 订单数量
  price?: number;             // 订单价格 (限价单)
  status: OrderStatus;        // 订单状态
  filled: number;             // 已成交数量
  remaining: number;          // 剩余数量
  average?: number;           // 平均成交价
  cost: number;               // 成交金额
  fee: number;                // 手续费
  timestamp: number;          // 创建时间
  lastTradeTimestamp?: number; // 最后成交时间
  reduceOnly?: boolean;       // 只减仓标志
}

type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit';
type OrderStatus = 'open' | 'closed' | 'canceled' | 'expired' | 'rejected' | 'pending';
```

#### Ticker
```typescript
interface Ticker {
  symbol: string;             // 交易对
  last: number;               // 最新价格
  bid: number;                // 买一价
  ask: number;                // 卖一价
  high: number;               // 24h最高价
  low: number;                // 24h最低价
  volume: number;             // 24h成交量
  quoteVolume: number;        // 24h成交额
  change: number;             // 24h涨跌额
  percentage: number;         // 24h涨跌幅
  timestamp: number;          // 时间戳
}
```

#### OrderBook
```typescript
interface OrderBook {
  symbol: string;             // 交易对
  bids: [number, number][];   // 买单 [价格, 数量]
  asks: [number, number][];   // 卖单 [价格, 数量]
  timestamp: number;          // 时间戳
}
```

#### CreateOrderRequest
```typescript
interface CreateOrderRequest {
  symbol: string;             // 交易对
  side: 'buy' | 'sell';       // 买卖方向
  type: OrderType;            // 订单类型
  amount: number;             // 数量
  price?: number;             // 价格 (限价单必需)
  stopPrice?: number;         // 触发价 (止损单)
  clientOrderId?: string;     // 客户端订单ID
  reduceOnly?: boolean;       // 只减仓
  timeInForce?: 'GTC' | 'IOC' | 'FOK'; // 时效性
  params?: Record<string, any>; // 交易所特定参数
}
```

## 策略引擎接口

### StrategyEngine 基类

```typescript
abstract class StrategyEngine {
  protected config: TradingConfig;
  protected adapter: ExchangeAdapter;
  protected eventEmitter: EventEmitter;
  
  constructor(adapter: ExchangeAdapter, config: TradingConfig);
  
  // 生命周期方法
  abstract start(): Promise<void>;
  abstract stop(): Promise<void>;
  
  // 策略逻辑
  protected abstract onTick(ticker: Ticker): Promise<void>;
  protected abstract onOrderUpdate(order: Order): Promise<void>;
  protected abstract onPositionUpdate(positions: Position[]): Promise<void>;
  
  // 工具方法
  protected createOrder(request: CreateOrderRequest): Promise<Order>;
  protected cancelAllOrders(): Promise<void>;
  protected closePosition(symbol: string): Promise<void>;
  protected calculatePnL(): number;
}
```

### 趋势策略特有方法

```typescript
class TrendEngine extends StrategyEngine {
  // SMA 计算
  calculateSMA(prices: number[], period: number): number;
  
  // 布林带计算
  calculateBollingerBands(prices: number[], period: number, stdDev: number): {
    upper: number;
    middle: number;
    lower: number;
    bandwidth: number;
  };
  
  // 信号判断
  shouldEnterLong(price: number, sma: number, bandwidth: number): boolean;
  shouldEnterShort(price: number, sma: number, bandwidth: number): boolean;
  shouldExit(position: Position, currentPrice: number): boolean;
}
```

### 做市策略特有方法

```typescript
class MakerEngine extends StrategyEngine {
  // 报价计算
  calculateBidAskPrices(ticker: Ticker): { bidPrice: number; askPrice: number };
  
  // 订单管理
  refreshOrders(): Promise<void>;
  adjustSpread(volatility: number): void;
  
  // 风险管理
  checkInventoryRisk(): boolean;
  calculateMaxOrderSize(): number;
}
```

### 网格策略特有方法

```typescript
class GridEngine extends StrategyEngine {
  // 网格计算
  calculateGridLevels(): number[];
  getOptimalOrderSizes(): number[];
  
  // 网格管理
  setupGrid(): Promise<void>;
  rebalanceGrid(): Promise<void>;
  
  // 风险控制
  checkStopLoss(currentPrice: number): boolean;
  shouldRestartGrid(currentPrice: number): boolean;
}
```

## 配置接口

### TradingConfig
```typescript
interface TradingConfig {
  symbol: string;                    // 交易对
  tradeAmount: number;              // 交易数量
  lossLimit: number;                // 止损限额
  trailingProfit: number;           // 移动止盈触发
  trailingCallbackRate: number;     // 回撤百分比
  profitLockTriggerUsd: number;     // 盈利锁定触发
  profitLockOffsetUsd: number;      // 盈利锁定偏移
  pollIntervalMs: number;           // 轮询间隔
  maxLogEntries: number;            // 最大日志条数
  klineInterval: string;            // K线周期
  maxCloseSlippagePct: number;      // 最大平仓滑点
  priceTick: number;                // 价格最小变动
  qtyStep: number;                  // 数量最小变动
  bollingerLength: number;          // 布林带周期
  bollingerStdMultiplier: number;   // 布林带标准差倍数
  minBollingerBandwidth: number;    // 最小布林带宽度
}
```

### MakerConfig
```typescript
interface MakerConfig {
  symbol: string;                   // 交易对
  tradeAmount: number;             // 交易数量
  lossLimit: number;               // 止损限额
  bidOffset: number;               // 买单偏移
  askOffset: number;               // 卖单偏移
  refreshIntervalMs: number;       // 刷新间隔
  maxLogEntries: number;           // 最大日志条数
  maxCloseSlippagePct: number;     // 最大平仓滑点
  priceTick: number;               // 价格最小变动
}
```

### GridConfig
```typescript
interface GridConfig {
  symbol: string;                   // 交易对
  lowerPrice: number;              // 网格下界
  upperPrice: number;              // 网格上界
  gridLevels: number;              // 网格层数
  orderSize: number;               // 单笔订单大小
  maxPositionSize: number;         // 最大持仓
  refreshIntervalMs: number;       // 刷新间隔
  maxLogEntries: number;           // 最大日志条数
  priceTick: number;               // 价格最小变动
  qtyStep: number;                 // 数量最小变动
  direction: 'both' | 'long' | 'short'; // 交易方向
  stopLossPct: number;             // 止损百分比
  restartTriggerPct: number;       // 重启触发百分比
  autoRestart: boolean;            // 自动重启
  gridMode: 'geometric';           // 网格模式
  maxCloseSlippagePct: number;     // 最大平仓滑点
}
```

## 事件系统

### EventEmitter 接口

```typescript
interface StrategyEventEmitter {
  // 事件发布
  emit(event: string, data: any): void;
  
  // 事件订阅
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
  
  // 一次性事件
  once(event: string, callback: (data: any) => void): void;
}
```

### 标准事件

```typescript
// 交易事件
interface TradeEvent {
  type: 'order_created' | 'order_filled' | 'order_canceled';
  order: Order;
  timestamp: number;
}

// 风险事件
interface RiskEvent {
  type: 'stop_loss_triggered' | 'position_limit_reached' | 'margin_call';
  details: string;
  timestamp: number;
}

// 系统事件
interface SystemEvent {
  type: 'connection_lost' | 'connection_restored' | 'error';
  message: string;
  timestamp: number;
}
```

## 工具函数 API

### 数学工具 (src/utils/math.ts)
```typescript
// 精度处理
function roundToTick(value: number, tick: number): number;
function floorToTick(value: number, tick: number): number;
function ceilToTick(value: number, tick: number): number;

// 百分比计算
function calculatePercentageChange(oldValue: number, newValue: number): number;
function applyPercentageChange(value: number, percentage: number): number;

// 统计函数
function mean(values: number[]): number;
function standardDeviation(values: number[]): number;
function correlation(x: number[], y: number[]): number;
```

### 价格工具 (src/utils/price.ts)
```typescript
// 价格验证
function isValidPrice(price: number, tick: number): boolean;
function isValidQuantity(quantity: number, step: number): boolean;

// 价格调整
function adjustPriceToTick(price: number, tick: number): number;
function adjustQuantityToStep(quantity: number, step: number): number;

// 滑点计算
function calculateSlippage(executedPrice: number, expectedPrice: number): number;
function isWithinSlippageTolerance(slippage: number, maxSlippage: number): boolean;
```

### 风险工具 (src/utils/risk.ts)
```typescript
// 风险计算
function calculatePositionValue(position: Position): number;
function calculateMarginRequired(position: Position, leverage: number): number;
function calculateLiquidationPrice(position: Position, marginRatio: number): number;

// 风险检查
function isPositionSizeValid(size: number, maxSize: number): boolean;
function isLossWithinLimit(currentLoss: number, lossLimit: number): boolean;
function shouldTriggerStopLoss(position: Position, config: TradingConfig): boolean;
```

### PnL 工具 (src/utils/pnl.ts)
```typescript
// 盈亏计算
function calculateUnrealizedPnL(position: Position, currentPrice: number): number;
function calculateRealizedPnL(trades: Trade[]): number;
function calculateTotalPnL(positions: Position[], trades: Trade[]): number;

// 收益率计算
function calculateROI(initialValue: number, currentValue: number): number;
function calculateSharpeRatio(returns: number[], riskFreeRate: number): number;
function calculateMaxDrawdown(values: number[]): number;
```

## 错误处理

### 错误类型

```typescript
// 基础错误类
class TradingError extends Error {
  constructor(message: string, public code: string, public details?: any);
}

// 具体错误类
class ExchangeError extends TradingError {}        // 交易所错误
class NetworkError extends TradingError {}         // 网络错误
class ConfigurationError extends TradingError {}   // 配置错误
class ValidationError extends TradingError {}      // 验证错误
class RiskError extends TradingError {}           // 风险错误
```

### 错误码

```typescript
const ErrorCodes = {
  // 网络相关
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
  CONNECTION_LOST: 'CONNECTION_LOST',
  
  // 交易相关
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  INVALID_ORDER_SIZE: 'INVALID_ORDER_SIZE',
  MARKET_CLOSED: 'MARKET_CLOSED',
  
  // 风险相关
  POSITION_LIMIT_EXCEEDED: 'POSITION_LIMIT_EXCEEDED',
  STOP_LOSS_TRIGGERED: 'STOP_LOSS_TRIGGERED',
  
  // 配置相关
  MISSING_API_KEY: 'MISSING_API_KEY',
  INVALID_SYMBOL: 'INVALID_SYMBOL',
} as const;
```

---

*此 API 文档涵盖了 ritmex-bot 的核心接口。如需更详细的实现示例，请参考源代码或其他文档。*