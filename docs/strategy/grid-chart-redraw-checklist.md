# 网格图表重绘执行Checklist（按真实数据）

目标
- 使用真实实盘/回测数据，重绘“盈亏分布直方图”和“参数敏感性雷达图”并纳入文档。

准备阶段
- [ ] 参数表已填写：docs/strategy/grid-chart-params.md
- [ ] 数据文件就绪：按模板 docs/strategy/grid-chart-data-template.csv 导出或填充
- [ ] 数据口径统一：费用/滑点/PnL计算方式一致；异常记录已剔除
- [ ] 时间窗与分箱数（bins）确定：如30d与30 bins
- [ ] 维度选择：雷达图建议6维（步长/费率/滑点/格数/净敞口/ROI目标）

直方图重绘（PnL分布）
- [ ] 读取数据，选取样本时间窗
- [ ] 将PnL值映射到分箱区间，统计频数，区分正/负分箱
- [ ] 输出SVG至 docs/strategy/charts/pnl-histogram.svg
- [ ] 在 docs/strategy/grid-trading.md 图例附录中引用/预览

雷达图重绘（参数敏感性）
- [ ] 按维度在合理区间内做参数变动测试（单变量或网格化）
- [ ] 记录绩效变化（如ROI、夏普或净收益）
- [ ] 对敏感性数值做归一化（0—1或0—100）
- [ ] 绘制雷达图SVG至 docs/strategy/charts/radar-sensitivity.svg
- [ ] 在 docs/strategy/grid-trading.md 图例附录中引用/预览

一致性与风控核验
- [ ] 与策略日志对账：触发、成交、撤单、重试与风控动作一致
- [ ] 监控指标复核：滑点、费用、净敞口、回撤与面板一致
- [ ] 趋势/事件窗口标注：在图例或备注中标识异常时段影响

交付物清单
- [ ] 参数文件：docs/strategy/grid-chart-params.md
- [ ] 数据CSV：docs/strategy/grid-chart-data-template.csv（或实际数据文件）
- [ ] SVG图：radar-sensitivity.svg、pnl-histogram.svg
- [ ] 文档更新：图例附录引用与备注说明

建议
- 从小样本开始验证分箱与敏感性维度，确认后扩展至完整数据窗
- 对不同市场阶段分别重绘（平稳/高波动），支持对比分析