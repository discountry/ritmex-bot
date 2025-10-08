# 网格交易策略使用教程

本文介绍如何在 Ritmex Bot 中使用全新的网格交易策略。我们将以 ASTERUSDT 永续合约为例，演示从环境配置到运行监控的完整流程，并对关键参数、风控机制、常见问题做出说明。

## 环境配置

1. 复制 `.env.example` 到 `.env`
   ```bash
   cp .env.example .env
   ```
2. 配置 Aster 交易所 API：
   ```env
   EXCHANGE=aster
   ASTER_API_KEY=你的API密钥
   ASTER_API_SECRET=你的API密钥
   TRADE_SYMBOL=ASTERUSDT
   ```
3. 设置基础精度与网格参数（示例使用 1.50 ~ 2.50 区间，20 条网格，单笔 5 手，最大仓位 50 手）：
   ```env
   PRICE_TICK=0.0001
   QTY_STEP=0.01

   GRID_LOWER_PRICE=1.50
   GRID_UPPER_PRICE=2.50
   GRID_LEVELS=20
   GRID_ORDER_SIZE=5
   GRID_MAX_POSITION_SIZE=50
   GRID_REFRESH_INTERVAL_MS=1000
   GRID_MAX_LOG_ENTRIES=200
   GRID_DIRECTION=both
   GRID_STOP_LOSS_PCT=0.02
   GRID_RESTART_TRIGGER_PCT=0.02
   GRID_AUTO_RESTART_ENABLED=true
GRID_MAX_CLOSE_SLIPPAGE_PCT=0.05
   ```

- `GRID_ORDER_SIZE` 与 `GRID_MAX_POSITION_SIZE` 需遵循「最大仓位 ÷ 单笔数量 ≥ 网格数」的原则，这样策略才能补齐全部挂单。本例 50 ÷ 5 = 10，但网格数为 20，意味着策略只会在离现价最近的上下各 10 个位置挂单，与仓位上限保持一致。

## 网格机制概览

- **几何等比网格**：所有网格价格基于上下边界按等比方式分布。
- **基于现价的挂单排序**：重启或行情驱动时，会优先在现价附近补挂，避免远端挂单未成交。
- **双向模式**：`GRID_DIRECTION=both` 表示买卖两侧都开仓；设置为 `long` 或 `short` 则只在对应方向发起新仓，反方向挂单会自动带上 `reduceOnly`。
- **风控**：
  - 跌破下界 * (1 - STOP_LOSS_PCT) 或突破上界 * (1 + STOP_LOSS_PCT) 时，策略撤销所有限价单并用市价平仓。
  - 若 `GRID_AUTO_RESTART_ENABLED=true`，当价格回到边界内 `RESTART_TRIGGER_PCT` 范围时会自动重启网格。
- **持仓限制**：`GRID_MAX_POSITION_SIZE` 是总持仓上限，用于控制网格在极端走势中不会累积过量仓位。

## 运行命令

安装依赖后，使用 CLI 直接启动网格策略：
```bash
bun install
bun run index.ts --strategy grid --exchange aster
```

若要在 Ink Dashboard 中运行并交互，直接执行：
```bash
bun start
```
然后在菜单中选择 “基础网格策略”。

## 监控与调优

界面主要包括：
- 当前买一/卖一、开仓方向、挂单/持仓概况。
- 最近日志（订单状态、风控触发等）。
- 触发止损后会清空网格并记录原因。

调参建议：
1. **缩短区间**：想拉高单格盈利，可缩小上下边界并减少网格数。
2. **更精细挂单**：适当提高 `GRID_LEVELS` 并降低 `GRID_ORDER_SIZE`，但同时记得调大 `GRID_MAX_POSITION_SIZE`。
3. **调节平仓容忍度**：`GRID_MAX_CLOSE_SLIPPAGE_PCT` 控制平仓单相对标记价的最大偏移，确保 reduce-only 订单不会被交易所拒绝。
4. **只做单边**：若只想高抛低吸不反手，可设 `GRID_DIRECTION=long`，卖单会变成 `reduceOnly`。

## 中断恢复行为

策略重启后会：
- 重新订阅账户、订单、深度、ticker；
- 基于当前持仓和开放订单重新计算网格，只补挂缺失部分；
- 在仓位额度允许的情况下持续追踪价位。

因此就算进程断掉，只要交易所回放的账号/订单快照完整，网格会从中断前的状态继续运行。若停机前手动撤过单，新启动时系统会把不在网格计划中的挂单一并清理。

## 常见问题

### Q: 为什么只有靠近现价的几个网格有订单？
A: 每笔网格单都会占用一定仓位上限。当 `GRID_MAX_POSITION_SIZE / GRID_ORDER_SIZE < GRID_LEVELS` 时，只会展示足以满足仓位限制的那几条网格。调整任一参数即可扩大覆盖面。

### Q: 价格突破上界后为何立即平仓？
A: 这是止损保护触发，避免庄外行情继续拉扯，默认 2% 触发后网格会全部撤单，并用市价平掉现有仓位。

### Q: 想要手动调仓怎么办？
A: 暂停策略（Ctrl+C 或 dashboard 退出）后手动操作，完成后再启动，策略会以新的仓位/挂单为基准重新布网。

## 小结

通过上述配置，你就可以在 ASTERUSDT 合约上运行一个自动化的等比网格策略。请务必先在沙盒或小仓位测试，确保参数适应当前波动性和手续费结构，再逐步提升资金规模。

祝交易顺利！
