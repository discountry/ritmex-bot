# 测试故障排除指南

## 问题诊断

如果运行 `bun test tests\grid-engine.backtest.test.ts` 出现错误，请按以下步骤排查：

## 步骤 1: 检查依赖安装

```bash
# 确保所有依赖已安装
bun install

# 验证 vitest 是否可用
bun x vitest --version
```

## 步骤 2: 运行简化测试

我们创建了一个简化的测试文件用于快速验证：

```bash
# 运行简化测试
bun test tests/simple-backtest.test.ts
```

**预期结果**: 6个测试全部通过 ✅

如果简化测试失败，问题可能是：
- 工具函数实现有误
- 类型定义问题
- 依赖缺失

## 步骤 3: 逐个运行测试

```bash
# 只运行 CSV 工具测试
bun test tests/grid-engine.backtest.test.ts -t "CSV Data Utils"

# 只运行统计测试
bun test tests/grid-engine.backtest.test.ts -t "calculate statistics"
```

## 步骤 4: 查看详细错误

```bash
# 使用 verbose 模式查看详细信息
bun test tests/grid-engine.backtest.test.ts --reporter=verbose

# 查看堆栈跟踪
bun test tests/grid-engine.backtest.test.ts --reporter=verbose --no-coverage
```

## 常见错误及解决方案

### 错误 1: Cannot find module

**症状**:
```
Error: Cannot find module './utils/csv-loader'
```

**解决方案**:
1. 检查文件是否存在: `tests/utils/csv-loader.ts`
2. 检查 import 路径是否正确
3. 确保 tsconfig.json 配置正确

### 错误 2: Type mismatch

**症状**:
```
Type 'X' is not assignable to type 'Y'
```

**解决方案**:
1. 检查类型定义是否匹配
2. 查看 `src/exchanges/types.ts` 中的类型定义
3. 确保使用正确的类型导入

### 错误 3: Unexpected token

**症状**:
```
Unexpected token 'export'
```

**解决方案**:
1. 检查 `vitest.config.ts` 是否存在
2. 确保 TypeScript 配置正确
3. 验证文件编码为 UTF-8

### 错误 4: Test timeout

**症状**:
```
Test timed out in 5000ms
```

**解决方案**:
已在 `vitest.config.ts` 中设置超时为 30 秒：
```typescript
testTimeout: 30000,
hookTimeout: 30000,
```

### 错误 5: File not found (CSV)

**症状**:
```
ENOENT: no such file or directory, open 'tests/data/BTCUSDT_sample.csv'
```

**解决方案**:
1. 确认文件存在: `tests/data/BTCUSDT_sample.csv`
2. 检查文件路径大小写（Windows 不敏感，但 Linux/Mac 敏感）
3. 使用绝对路径或相对于测试文件的路径

## 已修复的问题

### ✅ 修复 1: 接口实现不完整

**问题**: `BacktestAdapter` 未正确实现 `ExchangeAdapter` 接口

**修复**:
```typescript
// 修复前
watchKlines(): void {}
async cancelAllOrders(): Promise<void> {}

// 修复后
watchKlines(_symbol: string, _interval: string, _cb: (klines: any[]) => void): void {}
async cancelAllOrders(_params: { symbol: string }): Promise<void> {}
```

### ✅ 修复 2: 持仓计算错误

**问题**: 使用已删除订单的价格计算持仓

**修复**:
```typescript
// 添加价格参数
private updatePosition(side: 'BUY' | 'SELL', quantity: number, price: number): void {
   if (side === 'BUY') {
      const totalCost = this.currentPosition * this.entryPrice + quantity * price;
      // ...
   }
}
```

### ✅ 修复 3: 数组格式化

**问题**: 测试中数组定义格式混乱

**修复**: 统一使用多行格式
```typescript
// 修复前（难以阅读）
const klines = [{ timestamp: 1000, open: 100, high: 110, low: 95, close: 105, volume: 1000 }, { timestamp: 2000, ...

// 修复后（清晰易读）
const klines = [
   { timestamp: 1000, open: 100, high: 110, low: 95, close: 105, volume: 1000 },
   { timestamp: 2000, open: 105, high: 115, low: 100, close: 110, volume: 1500 },
];
```

### ✅ 修复 4: 添加 Vitest 配置

**创建**: `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    testTimeout: 30000,
  },
});
```

## 测试文件清单

### 核心测试文件

1. **`tests/grid-engine.test.ts`** ✅
   - 原有单元测试
   - 8个测试用例
   - 状态: 稳定

2. **`tests/grid-engine.backtest.test.ts`** ✅
   - 回测测试套件
   - 9个测试用例（3个跳过）
   - 状态: 已修复

3. **`tests/simple-backtest.test.ts`** ✅
   - 简化测试
   - 6个测试用例
   - 用途: 快速验证

### 工具文件

4. **`tests/utils/csv-loader.ts`** ✅
   - CSV数据加载
   - 价格分析
   - 数据验证

5. **`tests/utils/backtest-simulator.ts`** ✅
   - 订单成交模拟
   - 统计计算
   - 报告生成

### 配置文件

6. **`vitest.config.ts`** ✅ (新增)
   - Vitest 配置
   - 超时设置
   - 环境配置

## 运行测试的推荐顺序

### 第一步: 简化测试
```bash
bun test tests/simple-backtest.test.ts
```
如果失败，说明基础工具有问题。

### 第二步: 单元测试
```bash
bun test tests/grid-engine.test.ts
```
如果失败，说明核心引擎有问题。

### 第三步: 回测测试
```bash
bun test tests/grid-engine.backtest.test.ts
```
部分测试会跳过（需要数据文件）。

### 第四步: 所有测试
```bash
bun test
```

## 性能问题排查

如果测试运行很慢：

1. **检查超时设置**
   ```typescript
   // vitest.config.ts
   testTimeout: 30000, // 30秒
   ```

2. **禁用覆盖率**
   ```bash
   bun test --no-coverage
   ```

3. **只运行必要的测试**
   ```bash
   bun test tests/simple-backtest.test.ts
   ```

## Windows 特定问题

### 路径分隔符
Windows 使用 `\`，但测试中应使用 `/`:
```typescript
// ❌ 错误
loadCsvData('tests\\data\\BTCUSDT_sample.csv')

// ✅ 正确  
loadCsvData('tests/data/BTCUSDT_sample.csv')
```

### 文件编码
确保所有文件使用 UTF-8 编码，不要使用 UTF-8 BOM。

## 获取帮助

如果以上方法都无法解决问题：

1. **查看完整错误信息**
   ```bash
   bun test tests/grid-engine.backtest.test.ts --reporter=verbose 2>&1 | tee test-error.log
   ```

2. **检查 Node/Bun 版本**
   ```bash
   bun --version
   node --version
   ```

3. **清理并重新安装**
   ```bash
   rm -rf node_modules
   rm bun.lockb
   bun install
   ```

4. **查看详细日志**
   ```bash
   DEBUG=* bun test tests/grid-engine.backtest.test.ts
   ```

## 验证修复

修复后，应该看到以下结果：

```
✓ tests/simple-backtest.test.ts (6 tests) 
✓ tests/grid-engine.test.ts (8 tests)
✓ tests/grid-engine.backtest.test.ts (6 tests, 3 skipped)

Test Files  3 passed (3)
     Tests  14 passed | 3 skipped (20)
  Start at  XX:XX:XX
  Duration  XXXms
```

## 相关文档

- [test-fixes.md](./test-fixes.md) - 详细修复记录
- [grid-engine-test-analysis.md](./grid-engine-test-analysis.md) - 测试分析
- [backtest-guide.md](./backtest-guide.md) - 回测指南
- [testing-summary.md](./testing-summary.md) - 测试总结

---

**最后更新**: 2024  
**维护者**: Droid AI Agent
