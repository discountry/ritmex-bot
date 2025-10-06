# 趋势交易回测 CLI 使用说明

本工具支持：历史数据解析、多时间框架重采样、SMA交叉+布林带宽度过滤策略、撮合模拟（手续费/滑点/止损/移动止盈）、绩效指标（收益/最大回撤/夏普/胜率/平均盈亏/年化/波动/暴露度）、报告导出（JSON/CSV 与终端表格）、批量多TF回测、网格参数实验与快照归档，以及最佳组合HTML报告导出。

## 数据要求

- CSV列名：time,open,close,low,high,volume
- 时间戳推荐为ISO或可被 `new Date(...)` 解析的格式
- 示例路径：`tests/data/HYPE-15m.csv`、`tests/data/HYPE-30m.csv`、`tests/data/HYPE-1h.csv`、`tests/data/HYPE-4h.csv`

## 基本用法（单TF）

```
node dist/cli/backtest.js ^
  --base-tf 15m --target-tf 1h --symbol HYPE ^
  --sma 30 --bb-len 20 --bb-std 2 --min-bw 0.02 ^
  --qty 1 --fee 0.001 --slip 0.0005 --stop 0.01 --trail 0.02 ^
  --out out --json hype-1h.json --csv hype.csv ^
  --log run.log --snapshot run-snapshot.json
```

说明：

- base-tf 为数据基础TF（通常与CSV一致），target-tf 为回测TF
- out 为输出目录（默认 out）
- json/csv/html 分别导出结构化结果、权益/交易CSV与HTML图表（含参数与指标展示）

## 批量多TF回测

```
node dist/cli/backtest.js ^
  --base-tf 15m --batch-tf 15m,30m,1h,4h ^
  --symbol HYPE ^
  --sma 30 --bb-len 20 --bb-std 2 --qty 1 --fee 0.001 --slip 0.0005 ^
  --out out --json hype.json --csv hype.csv ^
  --log run.log --snapshot run-snapshot.json
```

- 每个TF会生成带TF后缀的导出文件，例如 hype-4h-equity.csv 等；终端以 console.table 输出摘要

## 多时间框架联动过滤（辅TF全一致）

```
... --aux-tf 30m,1h,4h --aux-sma 30 --aux-agree all
```

- 主TF的买卖信号仅在所有辅TF趋势一致时生效（BUY: 价格>辅TF SMA；SELL: 价格<辅TF SMA）

## 网格参数批量实验与汇总导出

```
node dist/cli/backtest.js ^
  --base-tf 15m --batch-tf 15m,30m,1h,4h ^
  --symbol HYPE ^
  --fee 0.001 --slip 0.0005 ^
  --grid-sma 20,30,50 --grid-stop 0.005,0.01 --grid-minbw 0.01,0.02 ^
  --grid-bb-len 20,30 --grid-bb-std 1.5,2 --grid-qty 0.5,1 ^
  --grid-fee 0.0005,0.001 --grid-slip 0.0002,0.0005 --grid-trail 0.01,0.02 ^
  --summary summary --best-crit sharpe --snapshot run-snapshot.json
```

- 每个TF生成 `out/summary-<tf>.csv`，包含各参数组合与指标（收益、夏普、回撤、胜率、平均盈亏等）
- `--best-crit` 可选 `sharpe|maxRet|minDD`；将挑选最佳组合写入快照
- 网格模式下将以 console.table 输出各参数组合的核心指标（每行包含参数与收益、回撤、夏普、胜率、平均盈亏、交易数等）

## 日志与快照

- `--log run.log`：运行日志写入 `out/run.log`
- `--snapshot run-snapshot.json`：运行结束写入快照，包含 meta/参数/各TF摘要与最佳组合（不再支持 --start/--end；默认全量数据）

## 导出文件说明

- JSON：策略运行结果（包含 trades、equityCurve、metrics）
- CSV：equity/trades（带TF后缀），以及 summary-<tf>.csv（网格汇总）
- Console：以 console.table 输出回测结果（单组合与网格模式），便于在终端快速对比参数与核心指标

## 常见问题

- CSV列顺序需与示例一致：time,open,close,low,high,volume
- 数据文件名按 symbol/base-tf 推断：tests/data/<SYMBOL>-<baseTf>.csv（默认 HYPE）；若文件不存在将提示错误，请确认 tests/data 目录中对应 CSV 已存在
- 如参数组合较多，建议限制网格维度以避免组合爆炸（每维≤3值）

---

## 参数对照表

| Flag | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |

| --base-tf | 15m/30m/1h/4h | 15m | 基础数据时间框架 |
| --target-tf | 15m/30m/1h/4h | base-tf | 回测目标时间框架（单TF模式） |
| --batch-tf | comma list | 无 | 批量回测TF列表（多TF模式） |
| --symbol | string | UNKNOWN | 标的符号（用于报告/日志） |

| --sma | number | 30 | 主TF SMA周期 |
| --bb-len | number | 20 | 布林带长度 |
| --bb-std | number | 2 | 布林带标准差倍数 |
| --min-bw | number | 无 | 最小布林带带宽过滤（小于该值不触发） |
| --qty | number | 1 | 每笔交易数量 |
| --fee | number | 0.001 | 手续费比例（如 0.001=0.1%） |
| --slip | number | 0.0005 | 滑点比例 |
| --stop | number | 无 | 止损比例（如 0.01=1%） |
| --trail | number | 无 | 移动止盈比例 |
| --aux-tf | comma list | 无 | 辅TF列表（联动过滤） |
| --aux-sma | number | 30 | 辅TF SMA周期 |
| --aux-agree | all/any | all | 辅TF一致性策略 |
| --out | string | out | 输出目录 |
| --json | string | 无 | JSON结果文件名（按TF后缀导出） |
| --csv | string | 无 | CSV基名（导出 equity/trades，按TF后缀） |

| --log | string | 无 | 运行日志文件名（写入 out/） |
| --snapshot | string | run-snapshot.json | 运行快照文件名（写入 out/） |
| --grid-sma | comma list | 无 | 网格SMA周期 |
| --grid-stop | comma list | 无 | 网格止损比例 |
| --grid-minbw | comma list | 无 | 网格最小带宽 |
| --grid-bb-len | comma list | 无 | 网格布林长度 |
| --grid-bb-std | comma list | 无 | 网格布林标准差倍数 |
| --grid-qty | comma list | 无 | 网格交易数量 |
| --grid-fee | comma list | 无 | 网格手续费比例 |
| --grid-slip | comma list | 无 | 网格滑点比例 |
| --grid-trail | comma list | 无 | 网格移动止盈比例 |
| --summary | string | 无 | 每TF的网格汇总CSV基名（生成 summary-<tf>.csv） |
| --best-crit | sharpe/maxRet/minDD | sharpe | 最佳组合选择指标 |
| --help | flag | - | 显示帮助并退出 |

---

## 更多使用示例

### 1) 不同 symbol/base-tf 的单TF示例

```
node dist/cli/backtest.js ^
  --base-tf 30m --target-tf 1h --symbol BTC ^
  --sma 50 --bb-len 20 --bb-std 2 ^
  --qty 1 --fee 0.001 --slip 0.0005 ^
  --out out --json btc-1h.json --csv btc.csv ^
  --log run.log --snapshot run-snapshot.json
```

- 需要存在 `tests/data/BTC-30m.csv`

### 2) 辅TF联动过滤（all一致）示例

```
node dist/cli/backtest.js ^
  --base-tf 15m --target-tf 1h --symbol HYPE ^
  --sma 30 --bb-len 20 --bb-std 2 ^
  --aux-tf 30m,1h,4h --aux-sma 30 --aux-agree all ^
  --qty 1 --fee 0.001 --slip 0.0005 ^
  --out out --json hype-1h.json --csv hype.csv ^
  --log run.log --snapshot run-snapshot.json
```

### 3) 最小网格示例（两维×两值）

```
node dist/cli/backtest.js ^
  --base-tf 15m --batch-tf 1h ^
  --symbol HYPE ^
  --fee 0.001 --slip 0.0005 ^
  --grid-sma 20,30 --grid-stop 0.005,0.01 ^
  --summary summary --best-crit sharpe --snapshot run-snapshot.json
```

- 将生成 `out/summary-1h.csv`，并在终端以 console.table 展示各参数组合核心指标

## FAQ：路径与错误提示补充

- 推断路径规则：`tests/data/<SYMBOL>-<baseTf>.csv`（例：HYPE-15m.csv）。缺失时CLI会提示错误，请确认 tests/data 目录存在对应CSV。
- 批量TF时每个目标TF都会按后缀导出；网格模式下在终端输出 console.table 汇总。
- 建议先用单TF小样本验证数据格式与路径，再进行多维网格以避免组合爆炸。

## FAQ：指标与撮合模型

- 收益率与累计收益
  - 单笔收益率 r_i = (退出价格 - 进入价格) / 进入价格，考虑费用与滑点
  - 区间总收益为权益曲线最后值相对初始资金的增幅；累计收益曲线基于逐笔交易结算与持仓期间价格变动

- 年化收益与波动率
  - 年化收益 ≈ (1 + 总收益)^(一年bars数/样本bars数) - 1
  - 波动率使用权益曲线的对数收益标准差 × sqrt(一年bars数)

- 最大回撤
  - 基于权益曲线的历史峰值与当前值计算：DD_t = (Peak_t - Equity_t) / Peak_t，取最大值

- 夏普比率
  - Sharpe = (平均周期收益 - 风险自由收益/周期) / 周期收益标准差
  - 风险自由收益默认0，可在后续版本提供参数扩展

- 胜率与平均盈亏
  - 胜率 = 盈利交易数 / 总交易数
  - 平均盈亏 = 全部交易的平均收益（含费用与滑点）；并单独展示平均盈利与平均亏损

- 暴露度（仓位时间占比）
  - 持仓bar数 / 总bar数，用于衡量策略在市场中的参与程度

- 撮合模型与成交假设
  - 以bar级近似：信号在当前bar收盘或下一bar开盘成交（实现时使用一致的模型）
  - 止损/移动止盈使用bar内最高/最低价触发，价格滑点按百分比近似
  - 费用按成交金额的百分比扣减；不考虑资金利息与保证金要求
  - 该模型适合快速研究与参数筛选，不适合高频或深度依赖盘口细节的策略

- 多时间框架联动过滤
  - BUY需满足：主TF信号成立且所有辅TF价格 > 其SMA；SELL相反
  - 可通过 --aux-agree 配置“all/any”，当前默认 all（全一致）

- 数据与时间戳
  - time列需可被`new Date`解析；建议ISO字符串或毫秒时间戳
  ## 数据格式与时区 / 缺失Bar处理说明（详解）

- 时间戳与时区
  - 解析：CLI使用 `new Date(...)` 解析 CSV 的 `time` 字段；未显式标注时区的字符串会按系统本地时区解析。
  - 建议：使用 UTC ISO 格式（例如 `2024-01-01T00:00:00Z`）或毫秒时间戳（Number，如 `1704067200000`）。保持数据与筛选时间范围同一时区，避免跨时区造成边界偏移。
  - 毫秒/秒区别：若 `time` 为数字字符串，请确保单位为毫秒；如为秒需在预处理阶段乘以 1000。

- 数据排序与唯一性
  - 要求：按时间升序，时间戳唯一（不重复、不乱序）。重复或乱序会影响重采样与指标计算的准确性。
  - 建议：在导入前进行去重与排序；移除明显异常行（如价格为0或缺列）。

- 重采样与缺失Base Bar
  - 行为：当前重采样按目标TF聚合已有Base Bar；不会自动“补齐”缺失的Bar（不做前向填充/插值）。
  - 影响：缺失Bar会降低目标TF覆盖度，并改变指标的窗口统计（例如SMA的有效样本数），可能导致趋势判定偏差。
  - 建议：
    - 若数据因非交易时段产生空洞，可选择前向填充价格（close）与零成交量的方式补齐（研究场景谨慎使用）。
    - 或在研究中只选取完整交易日/时段，先过滤掉不完整的区间。
    - 保持基础TF（如15m）连续性，可显著提升多TF对齐与过滤的稳定性。

- 多时间框架对齐
  - 辅TF取值：对每根主TF的bar，使用“同时间或更早时间”的最近辅TF bar进行趋势过滤（SMA方向一致性）。
  - 覆盖建议：确保辅TF在全区间内有稳定覆盖，否则主TF信号可能被过度过滤或误判。

- 数据清理建议（预处理清单）
  1. 统一时区到UTC（ISO字符串带 `Z`）或毫秒时间戳
  2. 去重与按时间升序排序
  3. 处理缺失Bar：决定是否补齐（前向填充close、volume=0），或剔除不完整时段
  4. 校验列完整性与类型（time/open/high/low/close/volume）
  5. 统一小数精度与异常值（负价、极端跳变）

- 未来参数规划（可扩展）
  - `--tz`：显式选择解析时区（UTC/local），避免 `new Date` 的系统依赖
  - `--fill-missing`：缺失Bar处理策略（none/ffill/zero-volume）
  - `--strict`：严格校验并拒绝乱序/重复/缺列数据

以上建议有助于减少因时区与数据空洞导致的评估偏差，使回测结果更可复现、更稳定。
