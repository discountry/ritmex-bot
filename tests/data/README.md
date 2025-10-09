# 历史K线数据目录

此目录用于存放历史K线数据，供回测测试使用。

## CSV 数据格式

K线数据应使用以下CSV格式：

```csv
timestamp,open,high,low,close,volume
1609459200000,29000.5,29500.0,28800.0,29200.0,1234.56
1609545600000,29200.0,30100.0,29000.0,29800.0,2345.67
1609632000000,29800.0,30500.0,29500.0,30200.0,3456.78
```

### 字段说明

- `timestamp`: Unix 时间戳（毫秒）
- `open`: 开盘价
- `high`: 最高价
- `low`: 最低价
- `close`: 收盘价
- `volume`: 成交量（可选）

## 推荐的测试数据集

准备以下几类数据集以覆盖不同市场状态：

### 1. 震荡市场数据 (推荐)
- 文件名: `BTCUSDT_ranging.csv`
- 特征: 价格在一定范围内反复波动
- 用途: 测试网格策略的盈利能力

### 2. 趋势市场数据
- 文件名: `BTCUSDT_trending.csv`
- 特征: 价格持续上涨或下跌
- 用途: 测试止损和网格适应性

### 3. 闪崩场景数据
- 文件名: `BTCUSDT_crash.csv`
- 特征: 价格突然大幅下跌
- 用途: 测试止损触发和风险控制

### 4. 综合数据
- 文件名: `BTCUSDT_sample.csv`
- 特征: 包含多种市场状态
- 用途: 综合测试策略表现

## 数据来源

可以从以下来源获取历史K线数据：

### 1. 交易所API
- Binance: https://api.binance.com/api/v3/klines
- OKX: https://www.okx.com/api/v5/market/candles
- Bybit: https://api.bybit.com/v5/market/kline

### 2. 数据下载脚本示例

```bash
# Binance BTC/USDT 1小时K线（最近1000根）
curl "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1000" \
  | jq -r '.[] | [.[0], .[1], .[2], .[3], .[4], .[5]] | @csv' \
  > BTCUSDT_1h.csv

# 添加标题行
echo "timestamp,open,high,low,close,volume" | cat - BTCUSDT_1h.csv > temp && mv temp BTCUSDT_1h.csv
```

### 3. Python 下载脚本

```python
import requests
import csv
from datetime import datetime

def download_binance_klines(symbol='BTCUSDT', interval='1h', limit=1000):
    url = 'https://api.binance.com/api/v3/klines'
    params = {
        'symbol': symbol,
        'interval': interval,
        'limit': limit
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    with open(f'{symbol}_{interval}.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        
        for kline in data:
            writer.writerow([
                kline[0],  # timestamp
                kline[1],  # open
                kline[2],  # high
                kline[3],  # low
                kline[4],  # close
                kline[5],  # volume
            ])
    
    print(f'Downloaded {len(data)} klines to {symbol}_{interval}.csv')

if __name__ == '__main__':
    download_binance_klines('BTCUSDT', '1h', 1000)
```

## 示例数据

项目提供了一个小型示例数据集供快速测试：

```csv
timestamp,open,high,low,close,volume
1704067200000,42000.0,42500.0,41800.0,42200.0,1000.0
1704070800000,42200.0,42600.0,42000.0,42400.0,1100.0
1704074400000,42400.0,42800.0,42300.0,42600.0,1200.0
```

## 使用测试数据

### 运行回测测试

```bash
# 运行所有回测测试
bun x vitest run tests/grid-engine.backtest.test.ts

# 运行特定测试
bun x vitest run tests/grid-engine.backtest.test.ts -t "ranging market"
```

### 在测试中使用数据

```typescript
import { loadCsvData, calculatePriceRange } from './utils/csv-loader';

// 加载数据
const klines = loadCsvData('tests/data/BTCUSDT_ranging.csv');

// 分析数据
const range = calculatePriceRange(klines);
console.log(`Price range: ${range.low} - ${range.high}`);

// 配置网格参数
const config: GridConfig = {
  symbol: 'BTCUSDT',
  lowerPrice: range.low * 0.95,
  upperPrice: range.high * 1.05,
  gridLevels: 10,
  // ...
};
```

## 数据质量检查

使用提供的工具函数验证数据质量：

```typescript
import { validateKlines } from './utils/csv-loader';

const klines = loadCsvData('tests/data/BTCUSDT_sample.csv');
const validation = validateKlines(klines);

if (!validation.valid) {
  console.error('Data validation errors:', validation.errors);
}
```

## 注意事项

1. **文件大小**: 建议每个CSV文件不超过10MB，以保持测试速度
2. **数据时间跨度**: 
   - 短期测试: 24-72小时数据（24-72根1小时K线）
   - 中期测试: 1-2周数据
   - 长期测试: 1-3个月数据
3. **数据完整性**: 确保没有缺失的时间戳
4. **价格合理性**: high >= low, close在[low, high]范围内

## 故障排除

### 测试跳过（.skip）

如果CSV文件不存在，回测测试会自动跳过。要启用测试：

1. 准备对应的CSV数据文件
2. 移除测试中的 `.skip` 标记
3. 重新运行测试

### 数据加载失败

常见问题：
- 文件路径错误：确保相对路径正确
- CSV格式错误：检查字段分隔符和数据类型
- 文件编码：使用UTF-8编码

## 贡献数据

如果你有高质量的测试数据，欢迎通过PR贡献：

1. 确保数据格式正确
2. 添加数据描述（时间范围、市场特征）
3. 验证数据质量通过检查
4. 文件命名遵循规范
