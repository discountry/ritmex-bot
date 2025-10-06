# 区间收割机(Range Capture Grid Market-Making) 策略内核分析

---

## 1. 核心特性与设计

### 1.1 Core Features

- 统一交易所抽象(BaseExchangeClient)与工厂创建
- 做市型开仓/平仓与 post_only 重试机制
- BBO 驱动的价格计算与 tick 量化
- 网格步长约束与最大活跃订单+冷却控制
- 止停/暂停阈值风控与仓位-平仓单一致性校验
- WS 订单事件+REST 兜底查询、优雅关闭与告警

### 1.2 Tech Stack

{
"Web": {
"arch": "react",
"component": null
},
"iOS": null,
"Android": null
}

### 1.3 Design

- 保持 docs/perp-dex-tools 现有包结构与接口，作为策略内核复用
- 通过 .env 配置交易所与凭证
- 日志归档至模块下 logs
- 定制：交易所=aster，合约=HYPE-USDT；其余参数使用默认；无需额外日志设置

### 1.4 Plan

- 阶段0 参数与交易所定制：done
- 阶段1 基线确认：done
- 阶段2 打包与依赖：holding
- 阶段3 内核对接：doing
- 阶段4 风控核验：doing
- 阶段5 小额实盘：holding
- 阶段6 文档交付：done

---

## 2. 策略执行逻辑详解

### 2.1 核心交易信号生成机制

- 非预测型做市/网格增强，单边方向持续尝试开仓，成交即布置反向止盈单
- BBO 驱动的价差控制（基于 fetch_bbo_prices）
- stop/pause 价格阈值门控
- 产能节流：active_close_orders 占比 + wait_time 自适应冷却；max_orders 硬上限
- 事件驱动：WS 回报+REST 兜底

### 2.2 入场与出场条件/参数

- 入场链：未触发 stop/pause → 仓位与平仓一致性校验通过 → 冷却=0 且未达 max_orders → 通过 grid_step 稀疏度判断
- 开仓执行：place_open_order → 等待成交/轮询 → 价格关系与状态判断 → 撤单重挂/处理部分成交
- 出场：
  - boost_mode=True → 市价平风险
  - 否则限价止盈：多=filled*(1+TP%)；空=filled*(1-TP%)
- 核心参数：quantity、take_profit%、grid_step%、wait_time、max_orders、stop_price、pause_price、direction、boost_mode、tick_size

### 2.3 风险管理规则

- 硬阈值：stop_price 停止、pause_price 暂缓
- 敞口/节流：max_orders 上限 + 自适应冷却
- 一致性校验：|position - active_close_amount| ≤ 2*quantity，否则告警并准备停机
- 成交鲁棒：WS 优先、REST 兜底；撤单/部分成交分支齐全
- 止损说明：无逐笔止损，依靠 stop/pause 与 boost_mode 应对尾部风险

### 2.4 资金管理方法

- 定额下单（quantity 固定），并发受 max_orders 与冷却约束
- 节奏调度：wait_time + 自适应节流
- 精度：tick_size 由合约属性获取并在适配层处理
- 杠杆/保证金：在交易所/适配层配置安全参数

### 2.5 市场环境适应性

- 震荡：最匹配
- 单边逆势：风险高；依赖 stop/pause/冷却/max_orders；必要时 boost_mode
- 高波动/稀薄流动性：撤单与部分成交增多；增大 grid_step
- 同向顺势：止盈更易达成；pause/stop 需适度

### 2.6 执行流程（完整步骤）

1. 初始化 TradingConfig（ticker、direction、quantity、take_profit、grid_step、wait_time、max_orders、stop_price、pause_price、boost_mode、exchange）
2. 创建交易所客户端并注册 WS 订单回调（OPEN/FILLED/PARTIALLY_FILLED/CANCELED）
3. connect() → get_contract_attributes()：设置 contract_id、tick_size
4. 主循环：拉取活跃订单 → 日志与一致性校验 → 检查 stop/pause → 计算冷却 → grid_step 判断 → place_open_order → 撤单/部分成交流程 → 设置止盈单
5. 异常/关停：graceful_shutdown 与 disconnect

### 2.7 理论依据

- 做市/网格：零预测、靠区间波动反复兑现；grid_step 控制簇拥与相关性
- 价格阈值与节流：过滤极端行情与集中风险
- 事件一致性：WS 实时回报 + REST 兜底

---

## 3. 参数建议表

- quantity：最小下单量的 2–5 倍起步；逐步放大
- take_profit(%)：0.10–0.30%；越大成交越难但利润高
- grid_step(%)：≥ take_profit 的 0.5×，反稀疏避免簇拥
- wait_time(s)：配合自适应节流控制节奏
- max_orders：硬控总敞口
- stop_price/pause_price：-1 关闭；上线后按波动设阈
- direction：buy/sell
- boost_mode：异常时快速降风险
- tick_size：从合约属性读取

账户规模建议与默认起步配置同上文（保持一致）

---

## 4. 市场情景配置示例

说明

- YAML 字段与 TradingConfig 一致；contract_id、tick_size 运行时自动填充
- 百分数字段单位为百分比，例如 "0.18" 表示 0.18%

### 4.1 做多（buy）

#### 情景一：震荡区间（最匹配）

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 5
take_profit: "0.18"
tick_size: 0
direction: buy
max_orders: 12
wait_time: 2
exchange: aster
grid_step: "0.12"
stop_price: -1
pause_price: -1
boost_mode: false
```

#### 情景二：单边上行（做多同向）

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 6
take_profit: "0.15"
tick_size: 0
direction: buy
max_orders: 10
wait_time: 1
exchange: aster
grid_step: "0.10"
stop_price: -1
pause_price: -1
boost_mode: false
```

#### 情景三：单边下行（逆势做多，高风险）

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 4
take_profit: "0.25"
tick_size: 0
direction: buy
max_orders: 5
wait_time: 4
exchange: aster
grid_step: "0.18"
stop_price: 0.85
pause_price: 0.88
boost_mode: true
```

#### 情景四：高波动/流动性稀薄

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 3
take_profit: "0.30"
tick_size: 0
direction: buy
max_orders: 4
wait_time: 5
exchange: aster
grid_step: "0.22"
stop_price: -1
pause_price: -1
boost_mode: true
```

### 4.2 做空（sell）

#### 情景一：震荡区间（做空）

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 5
take_profit: "0.18"
tick_size: 0
direction: sell
max_orders: 12
wait_time: 2
exchange: aster
grid_step: "0.12"
stop_price: -1
pause_price: -1
boost_mode: false
```

#### 情景二：单边下行（顺势做空）

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 6
take_profit: "0.15"
tick_size: 0
direction: sell
max_orders: 10
wait_time: 1
exchange: aster
grid_step: "0.10"
stop_price: -1
pause_price: -1
boost_mode: false
```

#### 情景三：单边上行（逆势做空，高风险）

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 4
take_profit: "0.25"
tick_size: 0
direction: sell
max_orders: 5
wait_time: 4
exchange: aster
grid_step: "0.18"
stop_price: 1.15
pause_price: 1.12
boost_mode: true
```

#### 情景四：高波动/流动性稀薄（做空）

```yaml
ticker: HYPE-USDT
contract_id: ""
quantity: 3
take_profit: "0.30"
tick_size: 0
direction: sell
max_orders: 4
wait_time: 5
exchange: aster
grid_step: "0.22"
stop_price: -1
pause_price: -1
boost_mode: true
```

---

## 5. 运行与环境说明

- 合约属性：运行时 get_contract_attributes() 自动填充 contract_id 与 tick_size
- 环境变量：
  - LARK_TOKEN：启用飞书通知
  - TELEGRAM_BOT_TOKEN、TELEGRAM_CHAT_ID：启用 Telegram 通知
- 日志：TradingLogger 输出控制台与归档 logs
- 交易所适配：ExchangeFactory.create_exchange(config.exchange, config) 创建；不同交易所对 tick/精度/撤单回报可能差异，均在适配层处理
