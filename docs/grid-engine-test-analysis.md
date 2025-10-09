# Grid Engine 测试用例详细分析

## 一、测试文件概览

**文件路径**: `tests/grid-engine.test.ts`  
**测试框架**: Vitest  
**被测试模块**: `src/strategy/grid-engine.ts`

## 二、测试架构分析

### 2.1 测试桩 (StubAdapter)

测试使用了 `StubAdapter` 来模拟交易所适配器，这是一个完整的 Mock 实现：

```typescript
class StubAdapter implements ExchangeAdapter {
   id = 'aster';
   
   // 关键监控数据
   public createdOrders: CreateOrderParams[] = [];      // 记录所有创建的订单
   public marketOrders: CreateOrderParams[] = [];       // 记录市价单
   public cancelAllCount = 0;                           // 撤单计数
   public cancelledOrders: Array<number | string> = []; // 被撤销的订单ID
   
   // 模拟数据流推送
   emitAccount(snapshot: AsterAccountSnapshot): void;
   emitOrders(orders: AsterOrder[]): void;
   emitDepth(depth: AsterDepth): void;
   emitTicker(ticker: AsterTicker): void;
}
```

**设计优点**:
- ✅ 完全隔离外部依赖，无需真实交易所连接
- ✅ 可精确控制市场数据和订单状态变化
- ✅ 记录所有交互，便于断言验证

### 2.2 测试配置

```typescript
const baseConfig: GridConfig = {
   symbol: 'BTCUSDT',
   lowerPrice: 100,          // 网格下边界
   upperPrice: 200,          // 网格上边界
   gridLevels: 3,            // 网格档位数
   orderSize: 0.1,           // 每档订单大小
   maxPositionSize: 0.2,     // 最大持仓限制
   refreshIntervalMs: 10,    // 刷新间隔
   maxLogEntries: 50,
   priceTick: 0.1,           // 价格最小变动单位
   qtyStep: 0.01,            // 数量最小变动单位
   direction: 'both',        // 网格方向：双向
   stopLossPct: 0.01,        // 止损比例 1%
   restartTriggerPct: 0.01,  // 重启触发比例
   autoRestart: true,
   gridMode: 'geometric',    // 几何网格模式
   maxCloseSlippagePct: 0.05
};
```

## 三、测试用例详细分析

### 3.1 几何网格订单生成测试 ✅

**测试名称**: `creates geometric desired orders when running in both directions`

**测试目的**: 验证几何模式下网格价格计算的正确性

**测试步骤**:
1. 创建价格范围 100-200 的 3 档网格
2. 当前价格设为 150（中间位置）
3. 调用内部方法 `computeDesiredOrders(150)`

**预期结果**:
- 总共生成 3 个订单
- 2 个买单（价格低于 150）
  - 买单1: 约 141.4（距离当前价格最近）
  - 买单2: 约 100（下边界）
- 1 个卖单（价格高于 150）
  - 卖单: 约 200（上边界）

**关键断言**:
```typescript
expect(desired).toHaveLength(3);
expect(buyOrders).toHaveLength(2);
expect(sellOrders).toHaveLength(1);
expect(Number(buyOrders[0]?.price)).toBeCloseTo(141.4, 1);
expect(Number(buyOrders[1]?.price)).toBeCloseTo(100, 6);
expect(Number(sellOrders[0]?.price)).toBeCloseTo(200, 6);
```

**几何网格计算公式**:
```
ratio = (upperPrice / lowerPrice)^(1 / (gridLevels - 1))
price[i] = lowerPrice × ratio^i
```

对于 100-200 的 3 档网格:
- ratio = (200/100)^(1/2) = 1.414
- Level 0: 100 × 1.414^0 = 100
- Level 1: 100 × 1.414^1 ≈ 141.4
- Level 2: 100 × 1.414^2 = 200

---

### 3.2 单向网格限制测试 ✅

**测试名称**: `limits sell orders for long-only direction when no position is available`

**测试目的**: 验证单向做多模式下的卖单限制

**测试逻辑**:
- 配置 `direction: 'long'`（仅做多）
- 当前无持仓（positionAmt = 0）
- 应该只生成买单，不生成卖单（因为没有仓位可平）

**预期结果**:
```typescript
expect(buys.length).toBeGreaterThan(0);
expect(sells).toHaveLength(0);
```

**业务意义**: 防止空仓时开空头仓位，符合单向交易策略

---

### 3.3 仓位暴露管理测试 ✅

**测试名称**: `does not repopulate the same buy level until exposure is released`

**测试目的**: 验证网格档位的仓位锁定机制

**测试场景**:
1. **初始状态**: 生成买单订单列表，获取最近的买单档位
2. **模拟成交**: 设置该档位已持有 0.1 仓位（`longExposure.set(targetLevel, 0.1)`）
3. **验证锁定**: 再次计算订单时，该档位不再生成买单
4. **模拟平仓**: 清空仓位（positionAmt = 0）
5. **验证解锁**: 该档位重新出现在买单列表中

**关键断言**:
```typescript
// 成交后，该档位不应再出现买单
expect(desiredAfterFill.some(order => 
   order.level === targetLevel && order.side === 'BUY'
)).toBe(false);

// 平仓后，该档位恢复买单
expect(desiredAfterExit.some(order => 
   order.level === targetLevel && order.side === 'BUY'
)).toBe(true);
```

**防止问题**: 避免同一价格档位重复开仓，造成仓位超限

---

### 3.4 档位侧分配稳定性测试 ✅

**测试名称**: `keeps level side assignments stable regardless of price`

**测试目的**: 验证网格档位买卖侧分配不会因价格波动而改变

**测试逻辑**:
- 在不同价格下（2.45 和 1.55）计算订单
- 验证档位的买卖侧始终由档位索引决定，而非当前价格

**规则验证**:
```typescript
const isBuyLevel = order.level <= Math.floor((baseConfig.gridLevels - 1) / 2);
return isBuyLevel ? order.side === 'BUY' : order.side === 'SELL';
```

**意义**: 确保网格结构稳定，不会因价格剧烈波动导致策略混乱

---

### 3.5 仓位容量限制测试 ✅

**测试名称**: `limits active sell orders by remaining short headroom`

**测试目的**: 验证最大持仓限制对挂单数量的约束

**测试场景**:
1. **正常配置**: maxPositionSize 允许多个卖单
2. **受限配置**: 
   - maxPositionSize = orderSize × 2
   - shortExposure 已占用 orderSize × 2
   - 剩余容量为 0

**预期结果**:
```typescript
expect(sellCountFull).toBeGreaterThan(0);    // 正常时有多个卖单
expect(sellCountLimited).toBeLessThanOrEqual(1); // 容量受限时≤1个
```

**风险控制**: 防止持仓超过配置的最大值

---

### 3.6 平仓订单生成测试 ✅

**测试名称**: `places reduce-only orders to close existing exposures`

**测试目的**: 验证减仓单（平仓单）的生成逻辑

**测试步骤**:
1. 设置持仓 0.1 BTC（longExposure）
2. 标记某个买单档位已持有仓位
3. 计算订单时应生成对应的平仓卖单

**关键特性**:
```typescript
const closeOrder = desired.find(order => 
   order.reduceOnly && 
   order.side === 'SELL'
);
expect(closeOrder!.amount).toBeCloseTo(baseConfig.orderSize);
```

**reduce-only 特性**: 该订单只能平仓，不会开新仓

---

### 3.7 持仓恢复测试 ✅

**测试名称**: `restores exposures from existing reduce-only orders on restart`

**测试目的**: 验证重启后能从现有订单恢复持仓信息

**测试场景**:
- 账户持仓: 0.2 BTC
- 挂单状态: 有一个 0.2 BTC 的平仓卖单（reduce-only）

**恢复逻辑**:
1. 从 reduce-only 订单反推持仓分布
2. 分配到对应的买单档位（longExposure）
3. 保留现有平仓单，不重复下单

**关键验证**:
```typescript
expect(totalExposure).toBeCloseTo(0.2, 6);
expect(adapter.cancelledOrders).toHaveLength(0); // 不撤销现有平仓单
```

**意义**: 程序重启后能无缝继续运行，不会重复开平仓

---

### 3.8 止损与平仓测试 ✅

**测试名称**: `halts the grid and closes positions when stop loss triggers`

**测试目的**: 验证止损触发后的完整流程

**测试步骤**:
1. 设置持仓 0.2 BTC
2. 手动触发止损（设置 stopReason）
3. 调用 `haltGrid(90)` 模拟止损

**预期行为**:
```typescript
expect(adapter.cancelAllCount).toBe(1);        // 撤销所有挂单
expect(adapter.marketOrders).toHaveLength(1);  // 市价平仓
expect(engine.getSnapshot().running).toBe(false); // 策略停止
```

**完整流程**: 撤单 → 市价平仓 → 停止策略

---

## 四、测试覆盖率分析

### 4.1 已覆盖功能 ✅

| 功能模块 | 覆盖状态 | 测试用例 |
|---------|---------|---------|
| 几何网格计算 | ✅ 已覆盖 | 测试 3.1 |
| 单向网格限制 | ✅ 已覆盖 | 测试 3.2 |
| 仓位暴露锁定 | ✅ 已覆盖 | 测试 3.3 |
| 档位分配稳定性 | ✅ 已覆盖 | 测试 3.4 |
| 最大仓位限制 | ✅ 已覆盖 | 测试 3.5 |
| 平仓单生成 | ✅ 已覆盖 | 测试 3.6 |
| 持仓状态恢复 | ✅ 已覆盖 | 测试 3.7 |
| 止损与平仓 | ✅ 已覆盖 | 测试 3.8 |

### 4.2 未覆盖功能（待补充）⚠️

| 功能模块 | 风险等级 | 建议补充 |
|---------|---------|---------|
| **算术网格模式** | 🔴 高 | 当前只测试了几何模式 |
| **WebSocket 数据流** | 🟡 中 | 实时价格/订单变化场景 |
| **网络异常处理** | 🟡 中 | 下单失败、超时等 |
| **极端价格波动** | 🟡 中 | 价格跳空、瞬间突破 |
| **并发订单协调** | 🟡 中 | 多档位同时成交 |
| **自动重启机制** | 🟢 低 | tryRestart 逻辑 |
| **历史数据回测** | 🔴 高 | **使用真实K线数据** |

---

## 五、使用历史K线数据辅助测试

### 5.1 历史数据的价值

使用 `tests/data/*.csv` 历史K线数据可以：

1. **真实市场环境模拟**: 复现实际价格波动
2. **压力测试**: 测试极端行情（暴涨暴跌、横盘震荡）
3. **性能验证**: 长时间运行的稳定性
4. **盈亏分析**: 统计策略在历史数据上的表现

### 5.2 CSV 数据格式假设

典型的K线数据格式：

```csv
timestamp,open,high,low,close,volume
1609459200000,29000.5,29500.0,28800.0,29200.0,1234.56
1609545600000,29200.0,30100.0,29000.0,29800.0,2345.67
...
```

### 5.3 测试用例设计建议

#### 5.3.1 回测框架测试

```typescript
describe('GridEngine Historical Backtest', () => {
   it('should handle real market data from CSV', async () => {
      // 1. 加载历史数据
      const klines = loadCsvData('tests/data/BTCUSDT_1h.csv');
      
      // 2. 配置网格参数（基于数据范围）
      const priceRange = calculatePriceRange(klines);
      const config: GridConfig = {
         symbol: 'BTCUSDT',
         lowerPrice: priceRange.low * 0.95,  // 比最低价低 5%
         upperPrice: priceRange.high * 1.05, // 比最高价高 5%
         gridLevels: 10,
         orderSize: 0.01,
         maxPositionSize: 0.1,
         // ...
      };
      
      // 3. 初始化引擎和桩
      const adapter = new StubAdapter();
      const engine = new GridEngine(config, adapter);
      
      // 4. 逐条推送K线数据
      for (const kline of klines) {
         adapter.emitTicker({
            symbol: 'BTCUSDT',
            lastPrice: kline.close.toString(),
            openPrice: kline.open.toString(),
            highPrice: kline.high.toString(),
            lowPrice: kline.low.toString(),
            volume: kline.volume.toString(),
            quoteVolume: '0'
         });
         
         // 模拟订单成交逻辑
         simulateOrderExecution(adapter, kline);
         
         // 等待策略响应
         await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // 5. 验证结果
      const snapshot = engine.getSnapshot();
      expect(snapshot.position.positionAmt).toBeDefined();
      
      // 统计交易数据
      const stats = calculateBacktestStats(adapter.createdOrders);
      console.log('总交易次数:', stats.totalTrades);
      console.log('盈利交易:', stats.profitTrades);
      console.log('亏损交易:', stats.lossTrades);
      
      engine.stop();
   });
});
```

#### 5.3.2 极端行情测试

```typescript
it('should survive flash crash scenario', async () => {
   // 加载包含闪崩的历史数据
   const crashData = loadCsvData('tests/data/BTCUSDT_crash.csv');
   
   const adapter = new StubAdapter();
   const engine = new GridEngine(baseConfig, adapter);
   
   // 推送暴跌行情
   for (const kline of crashData) {
      adapter.emitTicker({
         symbol: 'BTCUSDT',
         lastPrice: kline.close.toString(),
         // ...
      });
      
      await new Promise(resolve => setTimeout(resolve, 10));
   }
   
   // 验证止损是否触发
   const snapshot = engine.getSnapshot();
   if (shouldTriggerStopLoss(crashData)) {
      expect(snapshot.running).toBe(false);
      expect(snapshot.stopReason).toContain('止损');
   }
});
```

#### 5.3.3 震荡市场测试

```typescript
it('should profit in ranging market', async () => {
   // 加载横盘震荡数据
   const rangingData = loadCsvData('tests/data/BTCUSDT_ranging.csv');
   
   const adapter = new StubAdapter();
   const engine = new GridEngine({
      ...baseConfig,
      lowerPrice: 28000,
      upperPrice: 32000,
      gridLevels: 20,
   }, adapter);
   
   let totalProfit = 0;
   
   for (const kline of rangingData) {
      adapter.emitTicker({
         symbol: 'BTCUSDT',
         lastPrice: kline.close.toString(),
         // ...
      });
      
      // 统计已实现盈亏
      totalProfit += calculateRealizedPnL(adapter.createdOrders);
      
      await new Promise(resolve => setTimeout(resolve, 10));
   }
   
   // 震荡市场应该盈利
   expect(totalProfit).toBeGreaterThan(0);
});
```

### 5.4 数据加载工具函数

```typescript
// tests/utils/csv-loader.ts
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

interface Kline {
   timestamp: number;
   open: number;
   high: number;
   low: number;
   close: number;
   volume: number;
}

export function loadCsvData(filePath: string): Kline[] {
   const fileContent = readFileSync(filePath, 'utf-8');
   const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
   });
   
   return records.map((row: any) => ({
      timestamp: parseInt(row.timestamp),
      open: parseFloat(row.open),
      high: parseFloat(row.high),
      low: parseFloat(row.low),
      close: parseFloat(row.close),
      volume: parseFloat(row.volume)
   }));
}

export function calculatePriceRange(klines: Kline[]): { low: number; high: number } {
   const lows = klines.map(k => k.low);
   const highs = klines.map(k => k.high);
   return {
      low: Math.min(...lows),
      high: Math.max(...highs)
   };
}

export function simulateOrderExecution(
   adapter: StubAdapter,
   kline: Kline
): void {
   // 检查挂单是否在K线范围内成交
   const orders = adapter['currentOrders'] || [];
   
   for (const order of orders) {
      const price = parseFloat(order.price);
      
      // 买单：K线最低价触及
      if (order.side === 'BUY' && kline.low <= price) {
         // 触发成交回调
         adapter.emitOrders([
            { ...order, status: 'FILLED', executedQty: order.origQty }
         ]);
      }
      
      // 卖单：K线最高价触及
      if (order.side === 'SELL' && kline.high >= price) {
         adapter.emitOrders([
            { ...order, status: 'FILLED', executedQty: order.origQty }
         ]);
      }
   }
}

export function calculateBacktestStats(orders: CreateOrderParams[]) {
   let profitTrades = 0;
   let lossTrades = 0;
   let totalPnL = 0;
   
   // 简化的盈亏计算（需要根据实际成交价改进）
   const buyOrders = orders.filter(o => o.side === 'BUY');
   const sellOrders = orders.filter(o => o.side === 'SELL');
   
   const pairs = Math.min(buyOrders.length, sellOrders.length);
   
   for (let i = 0; i < pairs; i++) {
      const buy = parseFloat(buyOrders[i]!.price!);
      const sell = parseFloat(sellOrders[i]!.price!);
      const pnl = (sell - buy) * parseFloat(buyOrders[i]!.quantity!);
      
      totalPnL += pnl;
      if (pnl > 0) profitTrades++;
      else if (pnl < 0) lossTrades++;
   }
   
   return {
      totalTrades: pairs,
      profitTrades,
      lossTrades,
      totalPnL,
      winRate: profitTrades / pairs
   };
}
```

---

## 六、改进建议

### 6.1 立即可执行

1. ✅ **添加 CSV 数据加载器**: 实现上述工具函数
2. ✅ **创建回测测试套件**: 新建 `grid-engine.backtest.test.ts`
3. ✅ **收集测试数据**: 准备不同市场状态的 CSV 文件
   - 上涨趋势数据
   - 下跌趋势数据
   - 横盘震荡数据
   - 极端行情数据（闪崩、暴涨）

### 6.2 中期优化

1. **时间模拟**: 控制测试执行时间（快进/慢放）
2. **订单簿模拟**: 更真实的成交价格滑点
3. **手续费计算**: 加入交易成本
4. **资金管理**: 测试保证金和爆仓场景

### 6.3 长期目标

1. **可视化**: 生成网格运行图表（价格曲线 + 网格线 + 成交点）
2. **参数优化**: 自动测试不同参数组合
3. **对比测试**: 与其他策略的收益对比

---

## 七、运行测试

### 7.1 运行现有测试

```bash
# 运行所有测试
bun x vitest run

# 运行网格引擎测试
bun x vitest run tests/grid-engine.test.ts

# 监视模式
bun x vitest --watch tests/grid-engine.test.ts
```

### 7.2 运行回测测试（待实现）

```bash
# 运行回测套件
bun x vitest run tests/grid-engine.backtest.test.ts

# 生成覆盖率报告
bun x vitest run --coverage
```

---

## 八、总结

### 当前测试优势

- ✅ **结构清晰**: StubAdapter 设计优秀
- ✅ **核心覆盖**: 关键业务逻辑已测试
- ✅ **断言精准**: 使用了合理的浮点数比较

### 待改进方向

- ⚠️ **历史数据缺失**: 需要集成真实 K 线数据
- ⚠️ **边界测试不足**: 极端行情、网络异常等
- ⚠️ **性能测试缺失**: 长时间运行的稳定性

### 下一步行动

1. 准备测试数据：收集或生成 `tests/data/*.csv` 文件
2. 实现加载器：创建 `tests/utils/csv-loader.ts`
3. 编写回测用例：创建 `tests/grid-engine.backtest.test.ts`
4. 运行验证：确保新测试通过
5. 持续迭代：根据实际运行情况调整参数

---

**文档生成时间**: 2024  
**作者**: Droid AI Agent  
**版本**: v1.0
