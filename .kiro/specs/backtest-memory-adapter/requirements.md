# Requirements Document

## Introduction

本需求文档定义了一个内存版本的ExchangeAdapter实现，用于执行交易策略的回测任务。该适配器将模拟真实交易所的行为，包括账户管理、订单执行、持仓跟踪和性能统计，使开发者能够在历史数据上测试交易策略而无需连接真实交易所。

## Requirements

### Requirement 1: 账户余额管理

**User Story:** 作为策略开发者，我希望回测适配器能够管理虚拟账户余额，以便我能够模拟真实的资金管理场景。

#### Acceptance Criteria

1. WHEN 适配器初始化时 THEN 系统 SHALL 创建一个包含初始余额的虚拟账户
2. WHEN 创建订单时 THEN 系统 SHALL 根据订单类型和手续费率计算并扣除相应的资金
3. WHEN 订单成交时 THEN 系统 SHALL 更新账户余额以反映交易结果
4. WHEN 查询账户信息时 THEN 系统 SHALL 返回当前余额、可用余额和未实现盈亏
5. IF 账户余额不足 THEN 系统 SHALL 拒绝创建新订单

### Requirement 2: 订单管理与执行

**User Story:** 作为策略开发者，我希望回测适配器能够管理限价订单并根据市场价格自动执行，以便准确模拟真实交易场景。

#### Acceptance Criteria

1. WHEN 创建限价订单时 THEN 系统 SHALL 将订单添加到待执行订单列表
2. WHEN 接收到新的K线数据时 THEN 系统 SHALL 检查所有待执行订单
3. IF 买单价格 >= 当前最低价 THEN 系统 SHALL 执行该买单
4. IF 卖单价格 <= 当前最高价 THEN 系统 SHALL 执行该卖单
5. WHEN 订单执行时 THEN 系统 SHALL 计算并扣除手续费（默认0.05%，可配置）
6. WHEN 订单执行时 THEN 系统 SHALL 触发订单更新回调通知策略引擎
7. WHEN 取消订单时 THEN 系统 SHALL 从待执行列表中移除该订单
8. WHEN 取消所有订单时 THEN 系统 SHALL 清空指定交易对的所有待执行订单

### Requirement 3: 持仓管理

**User Story:** 作为策略开发者，我希望回测适配器能够跟踪和更新持仓信息，以便我能够了解策略的仓位状态。

#### Acceptance Criteria

1. WHEN 买单成交时 THEN 系统 SHALL 增加对应交易对的持仓数量
2. WHEN 卖单成交时 THEN 系统 SHALL 减少对应交易对的持仓数量
3. WHEN 持仓数量变化时 THEN 系统 SHALL 更新平均持仓成本
4. WHEN 查询持仓时 THEN 系统 SHALL 返回持仓数量、入场价格和未实现盈亏
5. WHEN 市场价格更新时 THEN 系统 SHALL 重新计算未实现盈亏
6. IF 持仓为零 THEN 系统 SHALL 将该交易对的持仓标记为空

### Requirement 4: 交易历史记录

**User Story:** 作为策略开发者，我希望回测适配器能够记录所有交易历史，以便我能够分析策略的交易行为。

#### Acceptance Criteria

1. WHEN 订单创建时 THEN 系统 SHALL 记录订单的创建时间和参数
2. WHEN 订单成交时 THEN 系统 SHALL 记录成交时间、价格、数量和手续费
3. WHEN 订单取消时 THEN 系统 SHALL 记录取消时间和原因
4. WHEN 查询交易历史时 THEN 系统 SHALL 返回按时间排序的所有交易记录
5. WHEN 查询交易历史时 THEN 系统 SHALL 支持按交易对、时间范围筛选

### Requirement 5: 回测统计指标

**User Story:** 作为策略开发者，我希望回测适配器能够计算关键的回测指标，以便我能够评估策略的性能表现。

#### Acceptance Criteria

1. WHEN 回测运行时 THEN 系统 SHALL 实时计算总盈亏金额
2. WHEN 回测运行时 THEN 系统 SHALL 实时计算收益率（相对于初始资金）
3. WHEN 回测运行时 THEN 系统 SHALL 跟踪并记录最大回撤金额和百分比
4. WHEN 回测运行时 THEN 系统 SHALL 记录最大盈利订单和最大亏损订单
5. WHEN 回测结束时 THEN 系统 SHALL 提供完整的统计报告
6. WHEN 查询统计信息时 THEN 系统 SHALL 返回总交易次数、胜率、平均盈利和平均亏损
7. WHEN 查询统计信息时 THEN 系统 SHALL 返回盈亏比和夏普比率（如适用）

### Requirement 6: 手续费配置

**User Story:** 作为策略开发者，我希望能够配置手续费率，以便模拟不同交易所的费用结构。

#### Acceptance Criteria

1. WHEN 初始化适配器时 THEN 系统 SHALL 接受手续费率配置参数
2. IF 未提供手续费率 THEN 系统 SHALL 使用默认值0.05%
3. WHEN 计算订单成本时 THEN 系统 SHALL 使用配置的手续费率
4. WHEN 手续费率变化时 THEN 系统 SHALL 应用新费率到后续交易

### Requirement 7: 市场数据处理

**User Story:** 作为策略开发者，我希望回测适配器能够接收和处理历史市场数据，以便驱动订单执行逻辑。

#### Acceptance Criteria

1. WHEN 接收到Ticker数据时 THEN 系统 SHALL 更新当前市场价格
2. WHEN 接收到K线数据时 THEN 系统 SHALL 使用OHLC数据检查订单执行条件
3. WHEN 市场价格更新时 THEN 系统 SHALL 触发账户快照更新
4. WHEN 市场价格更新时 THEN 系统 SHALL 重新计算未实现盈亏
5. IF 没有市场数据 THEN 系统 SHALL 不执行任何订单

### Requirement 8: ExchangeAdapter接口兼容性

**User Story:** 作为策略开发者，我希望回测适配器完全实现ExchangeAdapter接口，以便可以无缝替换真实交易所适配器。

#### Acceptance Criteria

1. WHEN 实现适配器时 THEN 系统 SHALL 实现所有ExchangeAdapter接口方法
2. WHEN 调用watchAccount时 THEN 系统 SHALL 注册账户更新回调
3. WHEN 调用watchOrders时 THEN 系统 SHALL 注册订单更新回调
4. WHEN 调用watchTicker时 THEN 系统 SHALL 注册价格更新回调
5. WHEN 调用watchKlines时 THEN 系统 SHALL 注册K线更新回调
6. WHEN 调用createOrder时 THEN 系统 SHALL 返回符合AsterOrder格式的订单对象
7. WHEN 调用cancelOrder/cancelOrders/cancelAllOrders时 THEN 系统 SHALL 正确处理订单取消逻辑
