# 贡献指南

欢迎参与 ritmex-bot 项目！我们非常欢迎任何形式的贡献，包括但不限于：代码改进、文档完善、bug 报告、功能建议等。

## 贡献方式

### 🐛 报告 Bug
- 使用 [GitHub Issues](https://github.com/discountry/ritmex-bot/issues) 报告问题
- 搜索现有 issues，避免重复报告
- 提供详细的复现步骤和环境信息

### 💡 功能建议
- 通过 GitHub Issues 提交功能请求
- 清楚描述功能需求和使用场景
- 说明预期的实现方式

### 📝 改进文档
- 修正错误信息或过时内容
- 添加缺失的文档
- 改进代码注释和示例

### 🔧 代码贡献
- 修复 bug
- 实现新功能
- 性能优化
- 代码重构

## 开发环境搭建

### 1. Fork 仓库
1. 访问 [ritmex-bot GitHub 页面](https://github.com/discountry/ritmex-bot)
2. 点击右上角 "Fork" 按钮
3. 克隆你的 fork 到本地：
```bash
git clone https://github.com/your-username/ritmex-bot.git
cd ritmex-bot
```

### 2. 设置上游仓库
```bash
git remote add upstream https://github.com/discountry/ritmex-bot.git
git remote -v
```

### 3. 安装依赖
```bash
# 安装 Bun (如果尚未安装)
curl -fsSL https://bun.sh/install | bash

# 安装项目依赖
bun install
```

### 4. 配置开发环境
```bash
# 复制环境配置模板
cp .env.example .env

# 编辑 .env 文件，填入测试账户的 API 密钥
# 建议使用测试网络，避免真实资金风险
```

### 5. 验证环境
```bash
# 运行测试
bun test

# 启动应用
bun run index.ts
```

## 开发流程

### 1. 创建功能分支
```bash
# 同步最新代码
git checkout main
git pull upstream main

# 创建新的功能分支
git checkout -b feature/your-feature-name
# 或者修复分支
git checkout -b fix/issue-description
```

### 2. 开发阶段

#### 代码风格
- 使用 TypeScript 严格模式
- 遵循 2 空格缩进
- 使用 camelCase 命名变量和函数
- 使用 PascalCase 命名类和接口
- 导入顺序：外部库 → 内部模块

#### 示例代码风格：
```typescript
import { EventEmitter } from 'events';
import axios from 'axios';

import { ExchangeAdapter } from '../adapter';
import { Order, Position } from '../types';

interface TradingConfig {
  symbol: string;
  amount: number;
}

class TrendEngine extends EventEmitter {
  private config: TradingConfig;
  private isRunning = false;

  constructor(config: TradingConfig) {
    super();
    this.config = config;
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Engine is already running');
    }
    
    this.isRunning = true;
    this.emit('started');
  }

  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) {
      throw new Error(`Insufficient data: need ${period}, got ${prices.length}`);
    }
    
    const sum = prices.slice(-period).reduce((acc, price) => acc + price, 0);
    return sum / period;
  }
}
```

#### 错误处理
```typescript
// 使用特定的错误类型
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 函数中的错误处理
async function createOrder(request: OrderRequest): Promise<Order> {
  if (!request.symbol) {
    throw new ValidationError('Symbol is required', 'symbol');
  }
  
  if (request.amount <= 0) {
    throw new ValidationError('Amount must be positive', 'amount');
  }

  try {
    return await adapter.createOrder(request);
  } catch (error) {
    // 记录错误日志
    console.error('Failed to create order:', error);
    throw error;
  }
}
```

#### 日志记录
```typescript
// 使用结构化日志
import { logger } from '../logging/trade-log';

class MakerEngine {
  private async refreshOrders(): Promise<void> {
    logger.info('Refreshing maker orders', {
      symbol: this.config.symbol,
      timestamp: Date.now(),
    });

    try {
      // 订单逻辑
      logger.info('Orders refreshed successfully', {
        ordersCreated: 2,
        totalValue: 1000,
      });
    } catch (error) {
      logger.error('Failed to refresh orders', {
        error: error.message,
        symbol: this.config.symbol,
      });
      throw error;
    }
  }
}
```

### 3. 测试

#### 运行现有测试
```bash
# 运行所有测试
bun test

# 运行特定测试文件
bun test tests/grid-engine.test.ts

# 监视模式
bun test --watch
```

#### 编写新测试
为新功能编写测试：

```typescript
// tests/trend-engine.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TrendEngine } from '../src/strategy/trend-engine';

describe('TrendEngine', () => {
  let engine: TrendEngine;

  beforeEach(() => {
    engine = new TrendEngine({
      symbol: 'BTCUSDT',
      tradeAmount: 0.001,
      lossLimit: 0.05,
    });
  });

  afterEach(async () => {
    if (engine.isRunning) {
      await engine.stop();
    }
  });

  describe('calculateSMA', () => {
    it('should calculate correct SMA for valid data', () => {
      const prices = [100, 110, 120, 130, 140];
      const sma = engine.calculateSMA(prices, 5);
      expect(sma).toBe(120);
    });

    it('should throw error for insufficient data', () => {
      const prices = [100, 110];
      expect(() => engine.calculateSMA(prices, 5))
        .toThrow('Insufficient data');
    });
  });

  describe('start/stop lifecycle', () => {
    it('should start successfully', async () => {
      await expect(engine.start()).resolves.not.toThrow();
      expect(engine.isRunning).toBe(true);
    });

    it('should throw error when starting already running engine', async () => {
      await engine.start();
      await expect(engine.start()).rejects.toThrow('already running');
    });
  });
});
```

#### 测试交易所适配器
```typescript
// tests/adapters/mock-adapter.ts
export class MockExchangeAdapter implements ExchangeAdapter {
  private orders: Order[] = [];
  private positions: Position[] = [];

  async createOrder(request: OrderRequest): Promise<Order> {
    const order: Order = {
      id: `mock_${Date.now()}`,
      symbol: request.symbol,
      side: request.side,
      type: request.type,
      amount: request.amount,
      price: request.price,
      status: 'open',
      filled: 0,
      remaining: request.amount,
      cost: 0,
      fee: 0,
      timestamp: Date.now(),
    };
    
    this.orders.push(order);
    return order;
  }

  async getPositions(): Promise<Position[]> {
    return [...this.positions];
  }

  // 模拟订单成交
  simulateFill(orderId: string, fillAmount: number): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.filled += fillAmount;
      order.remaining -= fillAmount;
      if (order.remaining <= 0) {
        order.status = 'closed';
      }
    }
  }
}
```

### 4. 提交代码

#### 提交信息格式
遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 功能添加
git commit -m "feat: add grid strategy auto-restart feature"

# Bug 修复
git commit -m "fix: resolve websocket reconnection issue"

# 文档更新
git commit -m "docs: update API reference for new adapter interface"

# 性能优化
git commit -m "perf: optimize order book processing for high-frequency updates"

# 重构
git commit -m "refactor: extract common trading logic to base class"

# 测试
git commit -m "test: add integration tests for GRVT adapter"

# 构建/CI
git commit -m "build: update Bun to version 1.2"
```

#### 提交最佳实践
- 每次提交只包含一个逻辑变更
- 提交信息要清晰描述变更内容
- 避免提交调试代码或临时文件
- 确保每次提交都能通过测试

### 5. 推送和创建 PR

```bash
# 推送到你的 fork
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

## Pull Request 指南

### PR 标题和描述
- 标题简洁明了，说明主要变更
- 描述中包含：
  - 变更的目的和背景
  - 主要改动点
  - 测试情况
  - 破坏性变更说明（如有）

### PR 模板
```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 性能优化
- [ ] 重构
- [ ] 其他

## 变更说明
简要描述本次变更的内容和目的。

## 详细变更
- 添加了 XXX 功能
- 修复了 XXX 问题
- 优化了 XXX 性能

## 测试
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 手动测试验证

## 相关 Issue
Closes #123

## 截图（如适用）

## 其他说明
```

### Code Review 流程
1. **自检清单**：
   - [ ] 代码符合项目风格规范
   - [ ] 添加了必要的测试
   - [ ] 文档已更新
   - [ ] 没有遗留调试代码
   - [ ] 测试全部通过

2. **Review 等待**：
   - 维护者会在 1-3 个工作日内进行 review
   - 可能需要多轮修改
   - 保持耐心和积极配合

3. **合并要求**：
   - 至少一个维护者的批准
   - 所有 CI 检查通过
   - 解决所有 review 意见

## 添加新交易所

### 1. 创建适配器结构
```bash
mkdir src/exchanges/newexchange
touch src/exchanges/newexchange/adapter.ts
touch src/exchanges/newexchange/gateway.ts
touch src/exchanges/newexchange/types.ts
```

### 2. 实现适配器接口
```typescript
// src/exchanges/newexchange/adapter.ts
import { ExchangeAdapter } from '../adapter';
import { NewExchangeGateway } from './gateway';

export class NewExchangeAdapter implements ExchangeAdapter {
  public readonly id = 'newexchange';
  public readonly name = 'New Exchange';
  
  private gateway: NewExchangeGateway;

  constructor(config: NewExchangeConfig) {
    this.gateway = new NewExchangeGateway(config);
  }

  async connect(): Promise<void> {
    await this.gateway.connect();
  }

  async disconnect(): Promise<void> {
    await this.gateway.disconnect();
  }

  // 实现其他必需方法...
}
```

### 3. 更新配置
```typescript
// src/config.ts
export type SupportedExchangeId = 'aster' | 'grvt' | 'lighter' | 'backpack' | 'paradex' | 'newexchange';

const SYMBOL_PRIORITY_BY_EXCHANGE: Record<SupportedExchangeId, { envKeys: string[]; fallback: string }> = {
  // 现有配置...
  newexchange: { envKeys: ['NEWEXCHANGE_SYMBOL', 'TRADE_SYMBOL'], fallback: 'BTCUSDT' },
};
```

### 4. 添加环境变量
```bash
# .env.example
# New Exchange 配置
NEWEXCHANGE_API_KEY=
NEWEXCHANGE_API_SECRET=
NEWEXCHANGE_SYMBOL=BTCUSDT
```

### 5. 添加测试
```typescript
// tests/newexchange-adapter.test.ts
import { describe, it, expect } from 'vitest';
import { NewExchangeAdapter } from '../src/exchanges/newexchange/adapter';

describe('NewExchangeAdapter', () => {
  // 测试用例...
});
```

### 6. 更新文档
- 在 README.md 中添加交易所信息
- 更新 API_REFERENCE.md
- 添加配置示例

## 添加新策略

### 1. 创建策略引擎
```typescript
// src/strategy/new-strategy-engine.ts
import { EventEmitter } from 'events';
import { ExchangeAdapter } from '../exchanges/adapter';

export class NewStrategyEngine extends EventEmitter {
  private adapter: ExchangeAdapter;
  private config: NewStrategyConfig;
  private isRunning = false;

  constructor(adapter: ExchangeAdapter, config: NewStrategyConfig) {
    super();
    this.adapter = adapter;
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    // 订阅数据源
    this.adapter.subscribeToTicker(this.config.symbol, this.onTicker.bind(this));
    
    this.emit('started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    // 清理资源
    this.emit('stopped');
  }

  private async onTicker(ticker: Ticker): Promise<void> {
    // 策略逻辑
  }
}
```

### 2. 创建 UI 组件
```tsx
// src/ui/NewStrategyApp.tsx
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { DataTable } from './components/DataTable';

interface NewStrategyAppProps {
  adapter: ExchangeAdapter;
  config: NewStrategyConfig;
}

export function NewStrategyApp({ adapter, config }: NewStrategyAppProps) {
  const [engine] = useState(() => new NewStrategyEngine(adapter, config));
  
  useEffect(() => {
    engine.start();
    return () => engine.stop();
  }, [engine]);

  return (
    <Box flexDirection="column">
      <Text>🔥 新策略运行中</Text>
      {/* 更多 UI 组件 */}
    </Box>
  );
}
```

### 3. 集成到主应用
```tsx
// src/ui/App.tsx
const strategies = [
  // 现有策略...
  { name: '新策略', component: 'NewStrategyApp' },
];
```

### 4. 添加配置接口
```typescript
// src/config.ts
export interface NewStrategyConfig {
  symbol: string;
  // 策略特定配置...
}

export const newStrategyConfig: NewStrategyConfig = {
  symbol: resolveSymbolFromEnv(),
  // 默认值...
};
```

## 开发工具

### 代码检查
```bash
# 类型检查
bun run tsc --noEmit

# 代码格式化 (如果配置了)
bun run prettier --write .

# 代码检查 (如果配置了)
bun run eslint src/
```

### 调试
```bash
# 启用调试日志
DEBUG=1 bun run index.ts

# 启用特定模块调试
GRID_DEBUG=1 bun run index.ts --strategy grid
```

### 性能分析
```bash
# 内存使用分析
bun --inspect run index.ts

# 启用性能监控
PERFORMANCE_MONITORING=1 bun run index.ts
```

## 文档贡献

### 文档结构
```
docs/
├── ARCHITECTURE.md      # 系统架构
├── API_REFERENCE.md     # API 参考
├── CONTRIBUTING.md      # 贡献指南
├── DEPLOYMENT.md        # 部署指南
├── grid-trading.md      # 网格策略指南
├── portfolio-viewer.md  # 组合查看器
└── strategy/           # 策略相关文档
```

### 文档编写规范
- 使用清晰的标题层次
- 提供可运行的代码示例
- 包含常见问题和解决方案
- 保持信息的时效性

### 文档更新流程
1. 发现过时或错误的文档
2. 创建文档修复分支
3. 更新相关文档
4. 提交 PR 并说明修改原因

## 社区参与

### 讨论渠道
- GitHub Issues: 问题报告和功能讨论
- GitHub Discussions: 一般性讨论和问答
- Telegram 群组: 实时交流

### 行为准则
- 尊重他人，友善交流
- 提供建设性的反馈
- 遵守开源社区准则
- 保持专业和耐心

## 发布流程

### 版本号规范
遵循 [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- `1.0.0`: 主要版本，可能包含破坏性变更
- `1.1.0`: 次要版本，新功能，向后兼容
- `1.1.1`: 补丁版本，Bug 修复

### 发布清单
- [ ] 更新 CHANGELOG.md
- [ ] 更新版本号
- [ ] 标记 Git tag
- [ ] 发布 Release notes

---

感谢你对 ritmex-bot 项目的贡献！如有任何问题，欢迎通过 GitHub Issues 或 Telegram 群组联系我们。