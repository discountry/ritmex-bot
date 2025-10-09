# Grid Engine 回测指南

## 概述

本指南介绍如何使用历史K线数据对 Grid Engine 网格策略进行回测测试。

## 文件结构

```
ritmex-bot/
├── tests/
│   ├── grid-engine.test.ts              # 原有单元测试
│   ├── grid-engine.backtest.test.ts     # 新增回测测试 ✨
│   ├── utils/
│   │   ├── csv-loader.ts                # CSV数据加载工具 ✨
│   │   └── backtest-simulator.ts        # 回测模拟器 ✨
│   └── data/
│       ├── README.md                     # 数据目录说明 ✨
│       └── BTCUSDT_sample.csv           # 示例数据 ✨
├── docs/
│   ├── grid-engine-test-analysis.md     # 测试分析报告 ✨
│   └── backtest-guide.md                # 本指南 ✨
└── src/
    └── strategy/
        └── grid-engine.ts                # 被测试的网格引擎
```

## 快速开始

### 1. 准备测试数据

#### 方法A: 使用示例数据（最快）

项目已包含示例数据 `tests/data/BTCUSDT_sample.csv`，可直接运行测试。

#### 方法B: 下载真实历史数据

```bash
# 使用 curl 下载 Binance 数据
curl "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=500" \
  | node -e "
    const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
    console.log('timestamp,open,high,low,close,volume');
    data.forEach(k => console.log([k[0],k[1],k[2],k[3],k[4],k[5]].join(',')));
  " > tests/data/BTCUSDT_1h.csv
```

#### 方法C: 使用 Python 脚本

```python
# scripts/download_klines.py
import requests
import csv

def download_klines(symbol='BTCUSDT', interval='1h', limit=500):
    url = 'https://api.binance.com/api/v3/klines'
    params = {'symbol': symbol, 'interval': interval, 'limit': limit}
    
    response = requests.get(url, params=params)
    data = response.json()
    
    filename = f'tests/data/{symbol}_{interval}.csv'
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        for kline in data:
            writer.writerow(kline[:6])
    
    print(f'Downloaded {len(data)} klines to {filename}')

if __name__ == '__main__':
    download_klines('BTCUSDT', '1h', 500)
```

### 2. 运行回测测试

```bash
# 运行所有回测测试（包括跳过的）
bun x vitest run tests/grid-engine.backtest.test.ts

# 运行单个测试
bun x vitest run tests/grid-engine.backtest.test.ts -t "load and validate CSV"

# 监视模式（开发时使用）
bun x vitest --watch tests/grid-engine.backtest.test.ts
```

### 3. 启用回测测试

默认情况下，回测测试被标记为 `.skip`，需要手动启用：

```typescript
// tests/grid-engine.backtest.test.ts

// 移除 .skip 启用测试
it('should load and validate CSV data', () => {  // 原来是 it.skip
  const klines = loadCsvData('tests/data/BTCUSDT_sample.csv');
  // ...
});
```

## 核心工具函数

### CSV 数据加载器 (`csv-loader.ts`)

```typescript
import { loadCsvData, calculatePriceRange, validateKlines } from './utils/csv-loader';

// 加载K线数据
const klines = loadCsvData('tests/data/BTCUSDT_sample.csv');
// 返回: Kline[] = [{ timestamp, open, high, low, close, volume }, ...]

// 计算价格范围
const range = calculatePriceRange(klines);
// 返回: { low: 41800, high: 43500, mean: 42650 }

// 验证数据质量
const validation = validateKlines(klines);
// 返回: { valid: true, errors: [] }

// 计算波动率
const volatility = calculateVolatility(klines);
// 返回: 0.015 (1.5%)

// 检测市场状态
const state = detectMarketState(klines);
// 返回: 'ranging' | 'trending' | 'unknown'
```

### 回测模拟器 (`backtest-simulator.ts`)

```typescript
import { simulateOrderExecution, calculateBacktestStats } from './utils/backtest-simulator';

// 模拟订单成交
simulateOrderExecution(currentOrders, kline, (filledOrder) => {
  console.log(`Order filled: ${filledOrder.side} @ ${filledOrder.price}`);
});

// 计算回测统计
const stats = calculateBacktestStats(adapter.createdOrders);
console.log(`Win rate: ${(stats.winRate * 100).toFixed(2)}%`);
console.log(`Total PnL: ${stats.totalPnL.toFixed(4)}`);

// 生成报告
const report = formatBacktestReport(stats);
console.log(report);
```

## 编写回测测试

### 基础模板

```typescript
import { describe, it, expect } from 'vitest';
import { loadCsvData, calculatePriceRange } from './utils/csv-loader';
import { calculateBacktestStats, formatBacktestReport } from './utils/backtest-simulator';
import { GridEngine } from '../src/strategy/grid-engine';
import { BacktestAdapter } from './grid-engine.backtest.test';

describe('My Grid Backtest', () => {
  it('should test grid on my data', async () => {
    // 1. 加载数据
    const klines = loadCsvData('tests/data/my_data.csv');
    const range = calculatePriceRange(klines);
    
    // 2. 配置网格
    const config = {
      symbol: 'BTCUSDT',
      lowerPrice: range.low * 0.98,
      upperPrice: range.high * 1.02,
      gridLevels: 10,
      orderSize: 0.01,
      maxPositionSize: 0.1,
      // ... 其他配置
    };
    
    // 3. 初始化引擎
    const adapter = new BacktestAdapter();
    const engine = new GridEngine(config, adapter);
    
    adapter.emitAccount(adapter['createAccountSnapshot']());
    adapter.emitOrders([]);
    
    // 4. 推送K线数据
    for (const kline of klines) {
      adapter.emitTicker({
        symbol: 'BTCUSDT',
        lastPrice: kline.close.toString(),
        // ...
      });
      
      adapter.processKline(kline);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    // 5. 验证结果
    const stats = calculateBacktestStats(adapter.createdOrders);
    console.log(formatBacktestReport(stats));
    
    expect(stats.totalTrades).toBeGreaterThan(0);
    expect(stats.winRate).toBeGreaterThan(0.3);
    
    engine.stop();
  });
});
```

### 测试不同市场状态

#### 震荡市场（网格最佳场景）

```typescript
it('should profit in ranging market', async () => {
  const klines = loadCsvData('tests/data/BTCUSDT_ranging.csv');
  const range = calculatePriceRange(klines);
  
  const config = {
    // 紧贴价格范围
    lowerPrice: range.low,
    upperPrice: range.high,
    gridLevels: 20, // 更多档位捕捉小波动
    // ...
  };
  
  // ... 运行回测
  
  // 震荡市场应该有较高胜率和正收益
  expect(stats.winRate).toBeGreaterThan(0.5);
  expect(stats.totalPnL).toBeGreaterThan(0);
});
```

#### 趋势市场（测试止损）

```typescript
it('should limit losses in trending market', async () => {
  const klines = loadCsvData('tests/data/BTCUSDT_trending.csv');
  
  const config = {
    // 设置较大的价格范围
    lowerPrice: klines[0].close * 0.8,
    upperPrice: klines[0].close * 1.2,
    gridLevels: 10,
    stopLossPct: 0.1, // 10% 止损
    // ...
  };
  
  // ... 运行回测
  
  // 验证止损触发
  const snapshot = engine.getSnapshot();
  if (priceBreaksRange(klines, config)) {
    expect(snapshot.running).toBe(false);
    expect(snapshot.stopReason).toContain('止损');
  }
});
```

#### 极端行情（测试风控）

```typescript
it('should survive flash crash', async () => {
  const klines = loadCsvData('tests/data/BTCUSDT_crash.csv');
  
  const config = {
    // 严格风控
    maxPositionSize: 0.05, // 低仓位
    stopLossPct: 0.05,     // 紧止损
    // ...
  };
  
  // ... 运行回测
  
  // 验证最大回撤在可控范围
  expect(stats.maxDrawdown).toBeLessThan(initialCapital * 0.1);
});
```

## 回测报告示例

运行回测后会生成如下报告：

```
=== 回测统计报告 ===

总交易次数: 15
盈利交易: 10 (66.67%)
亏损交易: 4
持平交易: 1

总盈亏: 234.5678
平均盈利: 28.4567
平均亏损: 12.3456
盈亏比: 2.30
最大回撤: 45.6789

=== 交易明细 ===
Trade 1: LONG 0.01 @ 42000.0 → 42500.0 | PnL: 5.0000 (1.19%)
Trade 2: LONG 0.01 @ 42200.0 → 42600.0 | PnL: 4.0000 (0.95%)
...
```

## 高级用法

### 参数优化

测试多组参数找最佳配置：

```typescript
const gridLevelOptions = [5, 10, 15, 20];
const results = [];

for (const levels of gridLevelOptions) {
  const config = { ...baseConfig, gridLevels: levels };
  const stats = runBacktest(klines, config);
  results.push({ levels, stats });
}

// 按收益排序
results.sort((a, b) => b.stats.totalPnL - a.stats.totalPnL);
console.log('Best config:', results[0]);
```

### 滑点模拟

```typescript
function simulateSlippage(price: number, side: 'BUY' | 'SELL', slippagePct: number): number {
  const slippage = price * slippagePct;
  return side === 'BUY' ? price + slippage : price - slippage;
}

// 在 processKline 中使用
const executionPrice = simulateSlippage(orderPrice, order.side, 0.001);
```

### 手续费计算

```typescript
function calculateFee(quantity: number, price: number, feeRate: number): number {
  return quantity * price * feeRate;
}

// 统计时扣除手续费
const fee = calculateFee(trade.quantity, trade.entryPrice, 0.0004); // 0.04%
const netPnL = trade.pnl - fee * 2; // 开仓+平仓
```

## 性能优化

### 加速回测

```typescript
// 减少等待时间
await new Promise(resolve => setTimeout(resolve, 1)); // 1ms instead of 10ms

// 批量处理K线
const batchSize = 10;
for (let i = 0; i < klines.length; i += batchSize) {
  const batch = klines.slice(i, i + batchSize);
  await processBatch(batch);
}
```

### 内存优化

```typescript
// 限制历史记录
const MAX_HISTORY = 1000;
if (adapter.createdOrders.length > MAX_HISTORY) {
  adapter.createdOrders = adapter.createdOrders.slice(-MAX_HISTORY);
}
```

## 常见问题

### Q: 回测结果与实盘差异大？

A: 可能原因：
- 滑点未考虑：添加滑点模拟
- 手续费遗漏：计算交易成本
- 成交假设过于理想：K线触及≠必然成交

### Q: 测试运行很慢？

A: 优化方法：
- 减少 setTimeout 等待时间
- 使用更大的K线周期（1h → 4h）
- 批量处理数据

### Q: 如何测试实时数据？

A: 可以使用 WebSocket 实时推送：

```typescript
// 需要修改 BacktestAdapter 支持实时模式
adapter.startLiveMode('wss://stream.binance.com/ws/btcusdt@kline_1h');
```

## 下一步

- ✅ 收集更多测试数据（不同币种、时间段）
- ✅ 添加可视化（价格图表 + 网格线 + 交易点）
- ✅ 实现多策略对比测试
- ✅ 集成到 CI/CD 流程

## 参考资料

- [测试分析报告](./grid-engine-test-analysis.md)
- [CSV数据格式](../tests/data/README.md)
- [Grid Engine 源码](../src/strategy/grid-engine.ts)

---

**最后更新**: 2024  
**维护者**: Droid AI Agent
