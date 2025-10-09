# Implementation Plan

- [x] 1. 创建项目结构和核心接口




  - 创建`src/exchanges/backtest/`目录
  - 定义`BacktestConfig`配置接口
  - 定义`OrderRecord`和`TradeRecord`内部数据结构
  - 定义`BacktestStatistics`统计接口
  - _Requirements: 8.1_

- [ ] 2. 实现AccountManager账户管理器
  - [ ] 2.1 实现AccountManager类基础结构
    - 初始化账户余额和资产
    - 实现`getSnapshot()`方法返回`AsterAccountSnapshot`
    - _Requirements: 1.1, 1.4_
  
  - [ ] 2.2 实现资金管理方法
    - 实现`reserveFunds()`预留资金
    - 实现`releaseFunds()`释放资金
    - 实现`updateBalance()`更新余额
    - 实现`updateUnrealizedProfit()`更新未实现盈亏
    - _Requirements: 1.2, 1.3, 1.5_

- [ ] 3. 实现PositionManager持仓管理器
  - [ ] 3.1 实现PositionManager类基础结构
    - 使用Map存储`AsterAccountPosition`
    - 实现`getPosition()`获取持仓
    - 实现`getPositions()`获取所有持仓
    - _Requirements: 3.4_
  
  - [ ] 3.2 实现持仓更新逻辑
    - 实现`updatePosition()`处理买入/卖出
    - 计算平均入场价格
    - 计算已实现盈亏
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 3.3 实现盈亏计算
    - 实现`calculateUnrealizedPnl()`计算未实现盈亏
    - 实现`getRealizedPnl()`获取已实现盈亏
    - _Requirements: 3.5_

- [ ] 4. 实现OrderManager订单管理器
  - [ ] 4.1 实现OrderManager类基础结构
    - 使用Map存储待执行订单
    - 使用数组存储订单历史
    - 实现`getOpenOrders()`获取待执行订单
    - 实现`getOrderHistory()`获取历史订单
    - _Requirements: 4.4_
  
  - [ ] 4.2 实现订单创建逻辑
    - 实现`createOrder()`创建限价单
    - 生成唯一订单ID
    - 验证订单参数有效性
    - 调用AccountManager预留资金
    - 返回符合`AsterOrder`格式的订单对象
    - _Requirements: 2.1, 4.1, 4.2, 8.6_
  
  - [ ] 4.3 实现订单执行逻辑
    - 实现`checkAndExecuteOrders()`检查并执行订单
    - 根据K线OHLC数据判断执行条件
    - 买单执行条件：`orderPrice >= kline.low`
    - 卖单执行条件：`orderPrice <= kline.high`
    - 计算并扣除手续费
    - 更新订单状态为'FILLED'
    - 返回已执行订单列表
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ] 4.4 实现订单取消逻辑
    - 实现`cancelOrder()`取消单个订单
    - 实现`cancelAllOrders()`取消所有订单
    - 释放预留资金
    - 更新订单状态为'CANCELLED'
    - _Requirements: 2.7, 2.8, 4.3, 8.7_

- [ ] 5. 实现StatisticsManager统计管理器
  - [ ] 5.1 实现StatisticsManager类基础结构
    - 初始化统计数据结构
    - 存储交易记录数组
    - 存储余额历史
    - _Requirements: 5.5_
  
  - [ ] 5.2 实现交易记录和基础统计
    - 实现`recordTrade()`记录交易
    - 计算总交易次数
    - 计算胜率（盈利交易/总交易）
    - 识别最大盈利和最大亏损订单
    - _Requirements: 5.4, 5.6_
  
  - [ ] 5.3 实现盈亏统计
    - 计算总盈亏金额
    - 计算收益率（相对初始资金）
    - 计算平均盈利和平均亏损
    - 计算盈亏比（平均盈利/平均亏损）
    - 累计手续费统计
    - _Requirements: 5.1, 5.2, 5.6_
  
  - [ ] 5.4 实现最大回撤计算
    - 实现`updateBalance()`记录余额变化
    - 跟踪历史最高余额
    - 计算最大回撤金额
    - 计算最大回撤百分比
    - _Requirements: 5.3_
  
  - [ ] 5.5 实现统计查询接口
    - 实现`getStatistics()`返回完整统计报告
    - 返回`BacktestStatistics`对象
    - _Requirements: 5.5, 5.6, 5.7_

- [ ] 6. 实现MarketDataProcessor市场数据处理器
  - [ ] 6.1 实现MarketDataProcessor类
    - 存储当前价格
    - 存储最新Ticker和Kline
    - 实现`processTicker()`处理价格更新
    - 实现`processKline()`处理K线数据
    - 实现`getCurrentPrice()`获取当前价格
    - _Requirements: 7.1, 7.2_

- [ ] 7. 实现BacktestMemoryAdapter主类
  - [ ] 7.1 实现适配器基础结构
    - 初始化所有Manager组件
    - 存储配置信息
    - 实现`id`属性和`supportsTrailingStops()`方法
    - _Requirements: 8.1_
  
  - [ ] 7.2 实现回调注册方法
    - 实现`watchAccount()`注册账户回调
    - 实现`watchOrders()`注册订单回调
    - 实现`watchTicker()`注册价格回调
    - 实现`watchKlines()`注册K线回调
    - 实现`watchDepth()`（空实现，回测不需要）
    - _Requirements: 8.2, 8.3, 8.4, 8.5_
  
  - [ ] 7.3 实现订单操作方法
    - 实现`createOrder()`委托给OrderManager
    - 实现`cancelOrder()`委托给OrderManager
    - 实现`cancelOrders()`委托给OrderManager
    - 实现`cancelAllOrders()`委托给OrderManager
    - 触发相应的回调通知
    - _Requirements: 8.6, 8.7_
  
  - [ ] 7.4 实现市场数据处理流程
    - 处理Ticker更新
    - 处理Kline更新并触发订单执行
    - 订单执行后更新持仓
    - 更新账户余额和统计信息
    - 触发账户和订单回调
    - _Requirements: 7.3, 7.4, 7.5_
  
  - [ ] 7.5 实现统计查询方法
    - 添加`getStatistics()`公开方法
    - 返回完整的回测统计报告
    - _Requirements: 5.5_

- [ ] 8. 创建导出文件
  - 创建`src/exchanges/backtest/index.ts`导出所有公共接口
  - 导出`BacktestMemoryAdapter`类
  - 导出`BacktestConfig`和`BacktestStatistics`接口
  - _Requirements: 8.1_

- [ ] 9. 编写单元测试
  - [ ] 9.1 测试AccountManager
    - 测试初始化和余额管理
    - 测试资金预留和释放
    - 测试快照生成
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ] 9.2 测试PositionManager
    - 测试持仓更新（买入/卖出）
    - 测试平均成本计算
    - 测试盈亏计算
    - _Requirements: 3.1, 3.2, 3.3, 3.5_
  
  - [ ] 9.3 测试OrderManager
    - 测试订单创建
    - 测试订单执行逻辑
    - 测试订单取消
    - 测试手续费计算
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.7_
  
  - [ ] 9.4 测试StatisticsManager
    - 测试交易记录
    - 测试最大回撤计算
    - 测试胜率和盈亏比计算
    - _Requirements: 5.1, 5.2, 5.3, 5.6_

- [ ] 10. 编写集成测试
  - [ ] 10.1 创建基础回测测试
    - 初始化BacktestMemoryAdapter
    - 创建订单并验证
    - 模拟市场数据更新
    - 验证订单自动执行
    - 验证账户和持仓更新
    - _Requirements: 1.1, 2.1, 2.2, 3.1, 7.1, 7.2_
  
  - [ ] 10.2 更新grid-backtest.test.ts
    - 替换StubAdapter为BacktestMemoryAdapter
    - 配置初始余额和手续费率
    - 运行完整回测流程
    - 验证统计结果
    - 输出回测报告
    - _Requirements: 5.5, 8.1_
  
  - [ ] 10.3 测试边界条件
    - 测试余额不足场景
    - 测试大量订单场景
    - 测试价格剧烈波动场景
    - _Requirements: 1.5, 2.2_

- [ ] 11. 文档和示例
  - 在README或docs中添加使用示例
  - 说明如何配置BacktestMemoryAdapter
  - 说明如何解读统计报告
  - 提供完整的回测示例代码
  - _Requirements: 8.1_
