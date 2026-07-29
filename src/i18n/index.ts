export type Language = "zh" | "en";

const normalizeLanguage = (value: string | undefined): Language => {
  if (!value) return "zh";
  const normalized = value.trim().toLowerCase();
  if (normalized === "en" || normalized.startsWith("en-") || normalized.startsWith("en_")) return "en";
  if (normalized === "zh" || normalized.startsWith("zh")) return "zh";
  if (normalized === "english") return "en";
  if (normalized === "chinese") return "zh";
  return "zh";
};

export const language: Language = normalizeLanguage(process.env.LANG);

type TranslationValue = string | ((params: Record<string, unknown>, lang: Language) => string);

type TranslationEntry = {
  zh: TranslationValue;
  en: TranslationValue;
};

const translations: Record<string, TranslationEntry> = {
  "app.strategy.trend.label": { zh: "趋势跟随策略 (SMA30)", en: "Trend Following (SMA30)" },
  "app.strategy.trend.desc": {
    zh: "监控均线信号，自动进出场并维护止损/止盈",
    en: "Monitors SMA signals, automates entries/exits, maintains stops.",
  },
  "app.strategy.swing.label": { zh: "Swing 策略 (RSI14/4h)", en: "Swing (RSI14/4h)" },
  "app.strategy.swing.desc": {
    zh: "使用 Binance ETHBTC 4h RSI 信号，主动开平仓并维护止损",
    en: "Uses Binance ETHBTC 4h RSI signals to actively trade and maintain stops.",
  },
  "app.strategy.guardian.label": { zh: "Guardian 防守策略", en: "Guardian Protection" },
  "app.strategy.guardian.desc": {
    zh: "不主动开仓，只为现有仓位补挂/移动止损，防止裸奔",
    en: "Does not open positions; only manages stops for existing positions.",
  },
  "app.strategy.maker.label": { zh: "做市刷单策略", en: "Maker Market Making" },
  "app.strategy.maker.desc": {
    zh: "双边挂单提供流动性，自动追价与风控止损",
    en: "Places two-sided quotes, auto-chases and risk-manages stops.",
  },
  "app.strategy.makerPoints.label": { zh: "StandX 积分做市策略", en: "StandX Maker Points" },
  "app.strategy.makerPoints.desc": {
    zh: "基于标记价/盘口挂单赚取 StandX Maker Points",
    en: "Quotes by mark-price bands to farm StandX maker points.",
  },
  "app.strategy.grid.label": { zh: "基础网格策略", en: "Grid Strategy" },
  "app.strategy.grid.desc": {
    zh: "在上下边界之间布设等比网格，自动加仓与减仓",
    en: "Places geometric grids between bounds, auto scale-in/out.",
  },
  "app.strategy.offset.label": { zh: "偏移做市策略", en: "Offset Maker Strategy" },
  "app.strategy.offset.desc": {
    zh: "根据盘口深度自动偏移挂单并在极端不平衡时撤退",
    en: "Offsets quotes by depth, retreats on extreme imbalance.",
  },
  "app.strategy.basis.label": { zh: "期现套利策略", en: "Basis Arbitrage" },
  "app.strategy.basis.desc": {
    zh: "监控期货与现货盘口差价，辅助发现套利机会",
    en: "Monitors futures/spot spread to surface arbitrage windows.",
  },
  "app.strategy.liquidityMaker.label": { zh: "流动性做市商", en: "Liquidity Maker" },
  "app.strategy.liquidityMaker.desc": {
    zh: "成交后在更优价位挂单平仓，更敏感的深度偏移判断",
    en: "Places close orders at better prices after fills, with sensitive depth imbalance detection.",
  },
  "liquidityMaker.title": { zh: "流动性做市商 (Liquidity Maker)", en: "Liquidity Maker" },
  "liquidityMaker.initializing": { zh: "流动性做市商初始化中...", en: "Initializing Liquidity Maker..." },
  "liquidityMaker.lastFill": { zh: "最近成交: {info}", en: "Last fill: {info}" },
  "liquidityMaker.noFill": { zh: "无", en: "None" },
  "app.integrity.warning": {
    zh: "警告: 版权校验失败，当前版本可能被篡改。",
    en: "Warning: Copyright integrity check failed; build may be tampered.",
  },
  "app.pickStrategy": { zh: "请选择要运行的策略", en: "Select a strategy to run" },
  "app.pickHint": {
    zh: "使用 ↑/↓ 选择，回车开始，Ctrl+C 退出。",
    en: "Use ↑/↓ to choose, Enter to start, Ctrl+C to exit.",
  },
  "common.waiting": { zh: "等待", en: "Waiting" },
  "common.startFailed": { zh: "启动失败: {message}", en: "Failed to start: {message}" },
  "common.checkEnv": {
    zh: "请检查环境变量和网络连通性。",
    en: "Please check environment variables and network connectivity.",
  },
  "common.initializing": { zh: "正在初始化{target}…", en: "Initializing {target}..." },
  "common.statusWithBack": {
    zh: "状态: {status} ｜ 按 Esc 返回策略选择",
    en: "Status: {status} | Press Esc to return to menu.",
  },
  "common.backHint": { zh: "按 Esc 返回策略选择", en: "Press Esc to return to menu." },
  "common.section.position": { zh: "持仓", en: "Position" },
  "common.section.performance": { zh: "绩效", en: "Performance" },
  "common.section.orders": { zh: "当前挂单", en: "Open Orders" },
  "common.section.recent": { zh: "最近事件", en: "Recent Events" },
  "common.section.recentTrades": { zh: "最近交易与事件", en: "Recent Trades & Events" },
  "common.noPosition": { zh: "当前无持仓", en: "No open position" },
  "common.noOrders": { zh: "暂无挂单", en: "No open orders" },
  "common.noLogs": { zh: "暂无日志", en: "No logs yet" },
  "common.direction.long": { zh: "多", en: "Long" },
  "common.direction.short": { zh: "空", en: "Short" },
  "common.enabled": { zh: "启用", en: "Enabled" },
  "common.disabled": { zh: "关闭", en: "Disabled" },
  "status.live": { zh: "实时运行", en: "Live" },
  "status.running": { zh: "运行中", en: "Running" },
  "status.paused": { zh: "暂停", en: "Paused" },
  "status.waitingData": { zh: "等待市场数据", en: "Waiting for market data" },
  "trend.name": { zh: "趋势策略", en: "trend strategy" },
  "trend.title": { zh: "趋势策略仪表盘", en: "Trend Strategy Dashboard" },
  "trend.headerLine": {
    zh: "交易所: {exchange} ｜ 交易对: {symbol} ｜ 最近价格: {lastPrice} ｜ SMA30: {sma} ｜ 趋势: {trend}",
    en: "Exchange: {exchange} | Symbol: {symbol} | Last: {lastPrice} | SMA30: {sma} | Trend: {trend}",
  },
  "trend.statusLine": {
    zh: "状态: {status} ｜ 按 Esc 返回策略选择",
    en: "Status: {status} | Press Esc to return to menu.",
  },
  "trend.positionLine": {
    zh: "方向: {direction} ｜ 数量: {qty} ｜ 开仓价: {entry}",
    en: "Direction: {direction} | Size: {qty} | Entry: {entry}",
  },
  "trend.pnlLine": {
    zh: "浮动盈亏: {pnl} USDT ｜ 账户未实现盈亏: {unrealized} USDT",
    en: "Floating PnL: {pnl} USDT | Account Unrealized: {unrealized} USDT",
  },
  "trend.performanceLine": {
    zh: "累计交易次数: {trades} ｜ 累计收益: {profit} USDT",
    en: "Total trades: {trades} | Total profit: {profit} USDT",
  },
  "trend.volumeLine": { zh: "累计成交量: {volume} USDT", en: "Total volume: {volume} USDT" },
  "trend.lastSignal": {
    zh: "最近开仓信号: {side} @ {price}",
    en: "Last entry signal: {side} @ {price}",
  },
  "trend.readyMessage": { zh: "正在等待交易所推送数据…", en: "Waiting for exchange feeds..." },
  "trend.label.long": { zh: "做多", en: "Long" },
  "trend.label.short": { zh: "做空", en: "Short" },
  "trend.label.none": { zh: "无信号", en: "No signal" },
  "swing.name": { zh: "Swing 策略", en: "swing strategy" },
  "swing.title": { zh: "Swing 策略仪表盘", en: "Swing Strategy Dashboard" },
  "swing.readyMessage": { zh: "正在等待交易所/RSI 信号…", en: "Waiting for exchange feeds / RSI signal..." },
  "swing.headerLine": {
    zh: "交易所: {exchange} ｜ 交易对: {symbol} ｜ 方向: {direction} ｜ 最近价格: {lastPrice} ｜ 状态: {phase}",
    en: "Exchange: {exchange} | Symbol: {symbol} | Mode: {direction} | Last: {lastPrice} | Phase: {phase}",
  },
  "swing.signalLine": {
    zh: "信号源: Binance {binanceSymbol} ｜ 价格: {binancePrice} ｜ RSI: {rsi} ({zone}) ｜ 连接: {connection}",
    en: "Signal: Binance {binanceSymbol} | Price: {binancePrice} | RSI: {rsi} ({zone}) | Conn: {connection}",
  },
  "swing.statusLine": {
    zh: "状态: {status} ｜ 按 Esc 返回策略选择",
    en: "Status: {status} | Press Esc to return to menu.",
  },
  "swing.zone.overbought": { zh: "超买", en: "Overbought" },
  "swing.zone.oversold": { zh: "超卖", en: "Oversold" },
  "swing.zone.neutral": { zh: "正常区间", en: "Neutral" },
  "swing.zone.unknown": { zh: "未知", en: "Unknown" },
  "swing.phase.disabled": { zh: "已禁用", en: "Disabled" },
  "swing.phase.initializing": { zh: "初始化/同步中", en: "Initializing" },
  "swing.phase.observing": { zh: "观察", en: "Observing" },
  "swing.phase.waitingOpenShort": { zh: "等待开空", en: "Waiting to open short" },
  "swing.phase.waitingCloseShort": { zh: "等待平空", en: "Waiting to close short" },
  "swing.phase.waitingOpenLong": { zh: "等待开多", en: "Waiting to open long" },
  "swing.phase.waitingCloseLong": { zh: "等待平多", en: "Waiting to close long" },
  "swing.positionLine": {
    zh: "方向: {direction} ｜ 数量: {qty} ｜ 开仓价: {entry}",
    en: "Direction: {direction} | Size: {qty} | Entry: {entry}",
  },
  "swing.pnlLine": {
    zh: "浮动盈亏: {pnl} USDT ｜ 账户未实现盈亏: {unrealized} USDT",
    en: "Floating PnL: {pnl} USDT | Account Unrealized: {unrealized} USDT",
  },
  "swing.stopLine": {
    zh: "止损目标价: {stop}",
    en: "Stop target: {stop}",
  },
  "swing.stateTitle": { zh: "策略状态", en: "Strategy State" },
  "swing.armedLine": {
    zh: "Armed: SE={se} SX={sx} ｜ LE={le} LX={lx}",
    en: "Armed: SE={se} SX={sx} | LE={le} LX={lx}",
  },
  "swing.volumeLine": { zh: "累计成交量: {volume} USDT", en: "Total volume: {volume} USDT" },
  "guardian.name": { zh: "Guardian 策略", en: "Guardian strategy" },
  "guardian.title": { zh: "Guardian 策略仪表盘", en: "Guardian Strategy Dashboard" },
  "guardian.readyMessage": { zh: "正在等待行情/账户推送…", en: "Waiting for market/account feeds..." },
  "guardian.startFailed": {
    zh: "Guardian 策略启动失败: {message}",
    en: "Guardian strategy failed to start: {message}",
  },
  "guardian.initializing": { zh: "正在初始化 Guardian 策略…", en: "Initializing Guardian strategy..." },
  "guardian.headerLine": {
    zh: "交易所: {exchange} ｜ 交易对: {symbol} ｜ 最近价格: {lastPrice} ｜ 状态: {status}",
    en: "Exchange: {exchange} | Symbol: {symbol} | Last: {lastPrice} | Status: {status}",
  },
  "guardian.hint": {
    zh: "策略只会维护止损/止盈，不会主动开仓。按 Esc 返回菜单。",
    en: "Maintains stops/take-profit only; does not open positions. Press Esc to return.",
  },
  "guardian.positionTitle": { zh: "当前仓位与风控", en: "Position & Protection" },
  "guardian.positionLine": {
    zh: "方向: {direction} ｜ 数量: {qty} ｜ 开仓价: {entry} ｜ 浮动盈亏: {pnl} USDT",
    en: "Direction: {direction} | Size: {qty} | Entry: {entry} | Floating PnL: {pnl} USDT",
  },
  "guardian.stopLine": {
    zh: "目标止损价: {targetStop} ｜ 当前止损单: {stopOrder} ｜ 动态止盈触发: {trailingTrigger} ｜ 动态止盈单: {trailingOrder}",
    en: "Target stop: {targetStop} | Active stop: {stopOrder} | Trailing trigger: {trailingTrigger} | Trailing order: {trailingOrder}",
  },
  "guardian.status.protecting": { zh: "已挂止损", en: "Stop placed" },
  "guardian.status.pending": { zh: "缺少止损，正在同步", en: "Missing stop, syncing" },
  "guardian.status.listening": { zh: "监听中", en: "Listening" },
  "guardian.stateLabel": { zh: "Guardian 状态: {state}", en: "Guardian status: {state}" },
  "guardian.noPosition": {
    zh: "当前无持仓，Guardian 正在监听新的仓位变化。",
    en: "No open position; Guardian is listening for new positions.",
  },
  "guardian.noProtectiveOrders": { zh: "暂无保护类挂单", en: "No protective orders" },
  "maker.name": { zh: "做市策略", en: "market-making strategy" },
  "maker.title": { zh: "做市策略仪表盘", en: "Maker Strategy Dashboard" },
  "maker.initializing": { zh: "正在初始化做市策略…", en: "Initializing maker strategy..." },
  "maker.headerLine": {
    zh: "交易所: {exchange} ｜ 交易对: {symbol} ｜ 买一价: {bid} ｜ 卖一价: {ask} ｜ 点差: {spread}",
    en: "Exchange: {exchange} | Symbol: {symbol} | Best Bid: {bid} | Best Ask: {ask} | Spread: {spread}",
  },
  "maker.dataStatus": { zh: "数据状态:", en: "Data status:" },
  "maker.feed.account": { zh: "账户", en: "Account" },
  "maker.feed.orders": { zh: "订单", en: "Orders" },
  "maker.feed.depth": { zh: "深度", en: "Depth" },
  "maker.feed.ticker": { zh: "Ticker", en: "Ticker" },
  "maker.positionLine": {
    zh: "方向: {direction} ｜ 数量: {qty} ｜ 开仓价: {entry}",
    en: "Direction: {direction} | Size: {qty} | Entry: {entry}",
  },
  "maker.pnlLine": {
    zh: "浮动盈亏: {pnl} USDT ｜ 账户未实现盈亏: {accountPnl} USDT",
    en: "Floating PnL: {pnl} USDT | Account Unrealized: {accountPnl} USDT",
  },
  "maker.targetOrders": { zh: "目标挂单", en: "Target Orders" },
  "maker.noTargetOrders": { zh: "暂无目标挂单", en: "No target orders" },
  "makerPoints.title": { zh: "Maker Points 策略仪表盘", en: "Maker Points Dashboard" },
  "makerPoints.initializing": { zh: "正在初始化 Maker Points 策略…", en: "Initializing Maker Points strategy..." },
  "makerPoints.headerLine": {
    zh: "交易所: {exchange} ｜ 交易对: {symbol} ｜ 买一价: {bid} ｜ 卖一价: {ask} ｜ 点差: {spread}",
    en: "Exchange: {exchange} | Symbol: {symbol} | Best Bid: {bid} | Best Ask: {ask} | Spread: {spread}",
  },
  "makerPoints.quoteLine": {
    zh: "挂单模式: {mode} ｜ BUY {buy} ｜ SELL {sell}",
    en: "Quote mode: {mode} | BUY {buy} | SELL {sell}",
  },
  "makerPoints.binanceLine": {
    zh: "Binance 深度(±{windowBps}bps): 买 {buy} ｜ 卖 {sell} ｜ 状态: {status}",
    en: "Binance depth (±{windowBps}bps): bid {buy} | ask {sell} | Status: {status}",
  },
  "makerPoints.bandDepthLine": {
    zh: "StandX 档位 {band}bps 深度: 买 {buy} ｜ 卖 {sell}",
    en: "StandX band {band}bps depth: buy {buy} | sell {sell}",
  },
  "makerPoints.mode.closeOnly": { zh: "平仓", en: "Close only" },
  "makerPoints.mode.normal": { zh: "正常", en: "Normal" },
  "makerPoints.feed.binance": { zh: "Binance", en: "Binance" },
  "offset.name": { zh: "偏移做市策略", en: "offset maker strategy" },
  "offset.title": { zh: "偏移做市策略仪表盘", en: "Offset Maker Strategy Dashboard" },
  "offset.initializing": { zh: "正在初始化偏移做市策略…", en: "Initializing offset maker strategy..." },
  "offset.headerLine": {
    zh: "交易所: {exchange} ｜ 交易对: {symbol} ｜ 买一价: {bid} ｜ 卖一价: {ask} ｜ 点差: {spread}",
    en: "Exchange: {exchange} | Symbol: {symbol} | Best Bid: {bid} | Best Ask: {ask} | Spread: {spread}",
  },
  "offset.depthLine": {
    zh: "买10档累计: {buy} ｜ 卖10档累计: {sell} ｜ 状态: {status}",
    en: "Top 10 bid sum: {buy} | Top 10 ask sum: {sell} | Status: {status}",
  },
  "offset.strategyStatus": {
    zh: "当前挂单策略: BUY {buyStatus} ｜ SELL {sellStatus} ｜ 按 Esc 返回策略选择",
    en: "Quote status: BUY {buyStatus} | SELL {sellStatus} | Press Esc to return to menu",
  },
  "offset.imbalance.balanced": { zh: "均衡", en: "Balanced" },
  "offset.imbalance.buy": { zh: "买盘占优", en: "Bid dominant" },
  "offset.imbalance.sell": { zh: "卖盘占优", en: "Ask dominant" },
  "grid.name": { zh: "网格策略", en: "grid strategy" },
  "grid.title": { zh: "网格策略仪表盘", en: "Grid Strategy Dashboard" },
  "grid.initializing": { zh: "正在初始化网格策略…", en: "Initializing grid strategy..." },
  "grid.headerLine": {
    zh: "交易所: {exchange} ｜ 交易对: {symbol} ｜ 状态: {status} ｜ 方向: {direction}",
    en: "Exchange: {exchange} | Symbol: {symbol} | Status: {status} | Direction: {direction}",
  },
  "grid.priceLine": {
    zh: "实时价格: {lastPrice} ｜ 下界: {lower} ｜ 上界: {upper} ｜ 网格数量: {count}",
    en: "Last price: {lastPrice} | Lower: {lower} | Upper: {upper} | Grid count: {count}",
  },
  "grid.dataStatus": { zh: "数据状态:", en: "Data status:" },
  "grid.anchorLine": {
    zh: "锚定价: {anchor} ｜ 网格版本: v{version}",
    en: "Anchor: {anchor} | Grid version: v{version}",
  },
  "grid.shiftState": { zh: "移格进行中: {phase}", en: "Shifting: {phase}" },
  "grid.stopProtection": {
    zh: "止损防护: 未覆盖 {uncovered} ｜ 兜底止损单: {stop}",
    en: "Stop protection: uncovered {uncovered} | exchange stop: {stop}",
  },
  "grid.stopProtection.none": { zh: "无", en: "none" },
  "grid.stopReason": { zh: "暂停原因: {reason}", en: "Pause reason: {reason}" },
  "grid.configTitle": { zh: "网格配置", en: "Grid Config" },
  "grid.configSize": {
    zh: "单笔数量: {orderSize} ｜ 最大仓位: {maxPosition}",
    en: "Order size: {orderSize} | Max position: {maxPosition}",
  },
  "grid.configRisk": {
    zh: "止损阈值: {stopLoss}% ｜ 重启阈值: {restart}% ｜ 自动重启: {autoRestart}",
    en: "Stop loss: {stopLoss}% | Restart trigger: {restart}% | Auto restart: {autoRestart}",
  },
  "grid.refreshInterval": { zh: "刷新间隔: {interval} ms", en: "Refresh interval: {interval} ms" },
  "grid.positionLine": {
    zh: "当前持仓: {direction} ｜ 数量: {qty} ｜ 均价: {avgPrice}",
    en: "Position: {direction} | Size: {qty} | Avg price: {avgPrice}",
  },
  "grid.unrealizedLine": {
    zh: "未实现盈亏: {pnl} ｜ 标记价: {mark}",
    en: "Unrealized PnL: {pnl} | Mark: {mark}",
  },
  "grid.linesTitle": { zh: "网格线", en: "Grid Lines" },
  "grid.noLines": { zh: "暂无网格线", en: "No grid lines" },
  "grid.direction.both": { zh: "双向", en: "Both" },
  "grid.direction.long": { zh: "多", en: "Long" },
  "grid.direction.short": { zh: "空", en: "Short" },
  "basis.onlyAster": {
    zh: "期现套利策略目前仅支持 Aster / Nado / StandX / Binance。请设置 EXCHANGE=aster、EXCHANGE=nado、EXCHANGE=standx 或 EXCHANGE=binance 后重试。",
    en: "Basis arbitrage currently supports Aster, Nado, StandX, and Binance. Set EXCHANGE=aster, EXCHANGE=nado, EXCHANGE=standx, or EXCHANGE=binance and retry.",
  },
  "basis.startFailed": {
    zh: "无法启动期现套利策略: {message}",
    en: "Unable to start basis arbitrage: {message}",
  },
  "basis.initializing": { zh: "正在初始化期现套利监控…", en: "Initializing basis arbitrage monitor..." },
  "basis.title": { zh: "期现套利仪表盘", en: "Basis Arbitrage Dashboard" },
  "basis.headerLine": {
    zh: "交易所: {exchange} ｜ 期货合约: {futures} ｜ 现货交易对: {spot}",
    en: "Exchange: {exchange} | Futures: {futures} | Spot: {spot}",
  },
  "basis.statusLine": {
    zh: "按 Esc 返回策略选择 ｜ 数据状态: 期货({futuresStatus}) 现货({spotStatus}) 资金费率({fundingStatus})",
    en: "Press Esc to return | Feeds: Futures({futuresStatus}) Spot({spotStatus}) Funding({fundingStatus})",
  },
  "basis.lastUpdated": { zh: "最近更新时间: {time}", en: "Last updated: {time}" },
  "basis.section.futures": { zh: "期货盘口", en: "Futures Book" },
  "basis.section.spot": { zh: "现货盘口", en: "Spot Book" },
  "basis.bookLine": { zh: "买一: {bid} ｜ 卖一: {ask}", en: "Best bid: {bid} | Best ask: {ask}" },
  "basis.updatedAt": { zh: "更新时间: {time}", en: "Updated: {time}" },
  "basis.section.funding": { zh: "资金费率", en: "Funding" },
  "basis.fundingRate": { zh: "当前资金费率: {rate}", en: "Current funding rate: {rate}" },
  "basis.fundingTimes": {
    zh: "资金费率更新时间: {updated} ｜ 下次结算时间: {next}",
    en: "Funding updated: {updated} | Next settlement: {next}",
  },
  "basis.fundingIncome": {
    zh: "单次资金费率收益(估): {per} ｜ 日收益(估): {perDay}",
    en: "Est. income per funding: {per} | Est. daily income: {perDay}",
  },
  "basis.takerFees": {
    zh: "双边吃单手续费(估): {fees} ｜ 回本所需资金费率次数: {count}",
    en: "Est. taker fees (round trip): {fees} | Funding counts to breakeven: {count}",
  },
  "basis.spotBalanceTitle": { zh: "现货账户余额（非0）", en: "Spot balances (non-zero)" },
  "basis.futuresBalanceTitle": { zh: "合约账户余额（非0）", en: "Futures balances (non-zero)" },
  "basis.balanceLine": { zh: "{asset}: 可用 {free} ｜ 冻结 {locked}", en: "{asset}: Free {free} | Locked {locked}" },
  "basis.futuresBalanceLine": {
    zh: "{asset}: 钱包 {wallet} ｜ 可用 {available}",
    en: "{asset}: Wallet {wallet} | Available {available}",
  },
  "basis.none": { zh: "无", en: "None" },
  "basis.spreadTitle": { zh: "套利差价（卖期货 / 买现货）", en: "Arb spread (sell futures / buy spot)" },
  "basis.spreadLine": { zh: "毛价差: {spread} USDT ｜ {bps} bp", en: "Gross spread: {spread} USDT | {bps} bp" },
  "basis.netSpreadLine": {
    zh: "扣除 taker 手续费 ({feePct}% × 双边): {net} USDT ｜ {netBps} bp",
    en: "Net after taker fee ({feePct}% x round trip): {net} USDT | {netBps} bp",
  },
  "rate.limit.suppress": {
    zh: "{source}限频期间暂停新开仓",
    en: "{source}Rate limit active, pausing new entries",
  },
  "rate.limit.resumeEntries": { zh: "限频恢复，允许重新开仓", en: "Rate limit cleared, resuming entries" },
  "rate.limit.pausedEnd": { zh: "限频暂停结束，继续以降频模式运行", en: "Pause ended; running in degraded mode" },
  "rate.limit.hit": {
    zh: "{source}触发 429，降频至 {interval}s",
    en: "{source}429 detected, slowing to {interval}s",
  },
  "rate.limit.consecutive": {
    zh: "{source}连续 429，暂停请求 {seconds}s",
    en: "{source}Consecutive 429s, pausing requests for {seconds}s",
  },
  "rate.limit.still": {
    zh: "{source}限频仍在持续，延长暂停 {seconds}s",
    en: "{source}Rate limit persists, extending pause {seconds}s",
  },
  "rate.limit.reset": { zh: "限频恢复，重置为正常请求频率", en: "Rate limit cleared, reset to normal cadence" },
  "env.missingAster": {
    zh: "缺少 ASTER_API_KEY 或 ASTER_API_SECRET 环境变量",
    en: "Missing ASTER_API_KEY or ASTER_API_SECRET",
  },
  "env.missingLighter": {
    zh: "缺少 LIGHTER_ACCOUNT_INDEX 或 LIGHTER_API_PRIVATE_KEY 环境变量",
    en: "Missing LIGHTER_ACCOUNT_INDEX or LIGHTER_API_PRIVATE_KEY",
  },
  "env.lighterIndexInteger": {
    zh: "LIGHTER_ACCOUNT_INDEX 必须是整数",
    en: "LIGHTER_ACCOUNT_INDEX must be an integer",
  },
  "env.missingBackpack": {
    zh: "缺少 BACKPACK_API_KEY 或 BACKPACK_API_SECRET 环境变量",
    en: "Missing BACKPACK_API_KEY or BACKPACK_API_SECRET",
  },
  "env.missingParadex": {
    zh: "Paradex 需要配置 PARADEX_PRIVATE_KEY 与 PARADEX_WALLET_ADDRESS",
    en: "Paradex requires PARADEX_PRIVATE_KEY and PARADEX_WALLET_ADDRESS",
  },
  "env.invalidParadexPrivateKey": {
    zh: "PARADEX_PRIVATE_KEY 必须是 0x 开头的 32 字节十六进制字符串",
    en: "PARADEX_PRIVATE_KEY must be a 0x-prefixed 32-byte hex string",
  },
  "env.invalidParadexAddress": {
    zh: "PARADEX_WALLET_ADDRESS 必须是有效的 0x 开头 40 字节十六进制地址",
    en: "PARADEX_WALLET_ADDRESS must be a valid 0x-prefixed 40-byte hex address",
  },
  "env.missingNado": {
    zh: "Nado 需要配置 NADO_SIGNER_PRIVATE_KEY 与 NADO_SUBACCOUNT_OWNER (或 NADO_EVM_ADDRESS)",
    en: "Nado requires NADO_SIGNER_PRIVATE_KEY and NADO_SUBACCOUNT_OWNER (or NADO_EVM_ADDRESS)",
  },
  "env.invalidNadoPrivateKey": {
    zh: "NADO_SIGNER_PRIVATE_KEY 必须是 0x 开头的 32 字节十六进制字符串",
    en: "NADO_SIGNER_PRIVATE_KEY must be a 0x-prefixed 32-byte hex string",
  },
  "env.invalidNadoAddress": {
    zh: "NADO_SUBACCOUNT_OWNER / NADO_EVM_ADDRESS 必须是有效的 0x 开头 40 字节十六进制地址",
    en: "NADO_SUBACCOUNT_OWNER / NADO_EVM_ADDRESS must be a valid 0x-prefixed 40-byte hex address",
  },
  "env.missingStandx": {
    zh: "StandX 需要配置 STANDX_TOKEN",
    en: "StandX requires STANDX_TOKEN",
  },
  "env.missingOndoperps": {
    zh: "Ondo Perps 需要配置 ONDOPERPS_API_KEY_ID 与 ONDOPERPS_API_SECRET（兼容旧 ONDOPERP_ 前缀）",
    en: "Ondo Perps requires ONDOPERPS_API_KEY_ID and ONDOPERPS_API_SECRET (legacy ONDOPERP_ prefix is supported)",
  },
  "log.subscribe.accountFail": {
    zh: "订阅账户失败: {error}",
    en: "Failed to subscribe account: {error}",
  },
  "log.process.accountError": {
    zh: "账户推送处理异常: {error}",
    en: "Account stream processing error: {error}",
  },
  "log.subscribe.orderFail": {
    zh: "订阅订单失败: {error}",
    en: "Failed to subscribe orders: {error}",
  },
  "log.process.orderError": {
    zh: "订单推送处理异常: {error}",
    en: "Order stream processing error: {error}",
  },
  "log.subscribe.tickerFail": {
    zh: "订阅Ticker失败: {error}",
    en: "Failed to subscribe ticker: {error}",
  },
  "log.process.tickerError": {
    zh: "价格推送处理异常: {error}",
    en: "Price stream processing error: {error}",
  },
  "log.guardian.executeError": {
    zh: "Guardian 执行异常: {error}",
    en: "Guardian runtime error: {error}",
  },
  "log.guardian.entryPricePending": {
    zh: "持仓均价尚未同步，等待交易所账户快照更新后再补挂止损",
    en: "Entry price not synced yet; waiting for account snapshot before placing stop.",
  },
  "log.guardian.pricePending": {
    zh: "行情尚未就绪，等待最新价格以同步止损",
    en: "Market data not ready; waiting for latest price to sync stop.",
  },
  "log.guardian.placeStopFail": {
    zh: "挂止损单失败: {error}",
    en: "Failed to place stop order: {error}",
  },
  "log.guardian.stopMissingSkip": {
    zh: "原止损单已不存在，跳过撤销",
    en: "Existing stop missing, skipping cancel.",
  },
  "log.guardian.cancelStopFail": {
    zh: "取消原止损单失败: {error}",
    en: "Failed to cancel existing stop: {error}",
  },
  "log.guardian.moveStop": {
    zh: "移动止损到 {price}",
    en: "Moved stop to {price}",
  },
  "log.guardian.moveStopFail": {
    zh: "移动止损失败: {error}",
    en: "Failed to move stop: {error}",
  },
  "log.guardian.restoreStop": {
    zh: "恢复原止损 @ {price}",
    en: "Restored original stop @ {price}",
  },
  "log.guardian.restoreStopFail": {
    zh: "恢复原止损失败: {error}",
    en: "Failed to restore original stop: {error}",
  },
  "log.guardian.trailingFail": {
    zh: "挂动态止盈失败: {error}",
    en: "Failed to place trailing stop: {error}",
  },
  "log.guardian.cleanupOrders": {
    zh: "清理遗留保护单: {ids}",
    en: "Cleaning leftover protective orders: {ids}",
  },
  "log.guardian.protectiveMissing": {
    zh: "保护单已不存在，跳过清理",
    en: "Protective orders already gone; skipping cleanup.",
  },
  "log.guardian.cleanupFail": {
    zh: "清理保护单失败: {error}",
    en: "Failed to clean protective orders: {error}",
  },
  "log.guardian.dispatchError": {
    zh: "更新分发异常: {error}",
    en: "Update dispatch error: {error}",
  },
  "log.guardian.snapshotFail": {
    zh: "构建快照失败: {error}",
    en: "Failed to build snapshot: {error}",
  },
  "log.basis.subscribeFuturesDepthFail": {
    zh: "订阅期货深度失败: {error}",
    en: "Failed to subscribe futures depth: {error}",
  },
  "log.basis.processFuturesDepthError": {
    zh: "处理期货深度异常: {error}",
    en: "Error processing futures depth: {error}",
  },
  "log.basis.subscribeSpotDepthFail": {
    zh: "订阅现货深度失败: {error}",
    en: "Failed to subscribe spot depth: {error}",
  },
  "log.basis.processSpotDepthError": {
    zh: "处理现货深度异常: {error}",
    en: "Error processing spot depth: {error}",
  },
  "log.basis.futuresReady": {
    zh: "期货深度已就绪 ({symbol})",
    en: "Futures depth ready ({symbol})",
  },
  "log.basis.spotDepthError": {
    zh: "获取现货盘口失败: {error}",
    en: "Failed to fetch spot orderbook: {error}",
  },
  "log.basis.subscribeFundingRateFail": {
    zh: "订阅资金费率失败: {error}",
    en: "Failed to subscribe funding rate: {error}",
  },
  "log.basis.processFundingRateError": {
    zh: "处理资金费率异常: {error}",
    en: "Error processing funding rate: {error}",
  },
  "log.basis.fundingReady": {
    zh: "资金费率已就绪 ({symbol})",
    en: "Funding rate ready ({symbol})",
  },
  "log.basis.fundingError": {
    zh: "获取资金费率失败: {error}",
    en: "Failed to fetch funding rate: {error}",
  },
  "log.basis.subscribeAccountFail": {
    zh: "订阅账户快照失败: {error}",
    en: "Failed to subscribe account snapshot: {error}",
  },
  "log.basis.processAccountError": {
    zh: "处理账户快照异常: {error}",
    en: "Error processing account snapshot: {error}",
  },
  "log.basis.spotBalanceError": {
    zh: "获取现货余额失败: {error}",
    en: "Failed to fetch spot balance: {error}",
  },
  "log.basis.futuresBalanceError": {
    zh: "获取合约余额失败: {error}",
    en: "Failed to fetch futures balance: {error}",
  },
  "log.basis.spotReady": { zh: "现货盘口已就绪 ({symbol})", en: "Spot orderbook ready ({symbol})" },
  "log.basis.pushError": { zh: "推送订阅失败: {error}", en: "Subscription push failed: {error}" },
  "log.basis.entryOpportunity": {
    zh: "入场机会: 扣费后价差 {bp} bp ｜ 距下次资金费约 {minutes} 分钟",
    en: "Entry opportunity: net spread {bp} bp | ~{minutes} mins to next funding",
  },
  "log.basis.exitOpportunity": {
    zh: "出场机会: 资金费率为负 ｜ 距收取约 {minutes} 分钟",
    en: "Exit opportunity: funding negative | ~{minutes} mins to settlement",
  },
  "log.account.snapshotSynced": { zh: "账户快照已同步", en: "Account snapshot synced" },
  "log.order.snapshotReturned": { zh: "订单快照已返回", en: "Order snapshot received" },
  "log.depth.ready": { zh: "获得最新深度行情", en: "Latest depth ready" },
  "log.ticker.ready": { zh: "Ticker 已就绪", en: "Ticker ready" },
  "log.subscribe.depthFail": { zh: "订阅深度失败: {error}", en: "Failed to subscribe depth: {error}" },
  "log.process.depthError": {
    zh: "深度推送处理异常: {error}",
    en: "Depth stream processing error: {error}",
  },
  "log.maker.loopError": { zh: "做市循环异常: {error}", en: "Maker loop error: {error}" },
  "log.maker.cleanOrdersStart": { zh: "启动时清理历史挂单", en: "Cleaning legacy orders at startup" },
  "log.maker.cleanOrdersMissing": {
    zh: "历史挂单已消失，跳过启动清理",
    en: "Legacy orders already gone, skipping startup cleanup",
  },
  "log.maker.cleanOrdersFail": { zh: "启动撤单失败: {error}", en: "Failed to cancel at startup: {error}" },
  "log.maker.cancelMismatched": {
    zh: "撤销不匹配订单 {side} @ {price} reduceOnly={reduceOnly}",
    en: "Cancel unmatched order {side} @ {price} reduceOnly={reduceOnly}",
  },
  "log.maker.cancelMissing": {
    zh: "撤销时发现订单已被成交/取消，忽略",
    en: "Order already filled/canceled, ignoring cancel",
  },
  "log.maker.cancelFail": { zh: "撤销订单失败: {error}", en: "Failed to cancel order: {error}" },
  "log.maker.placeFail": {
    zh: "挂单失败({side} {price}): {error}",
    en: "Failed to place order ({side} {price}): {error}",
  },
  "log.maker.avgPending": {
    zh: "做市持仓均价未同步，等待账户快照刷新后再执行止损判断",
    en: "Maker entry price not synced; waiting for account snapshot before stop check",
  },
  "log.maker.stopTriggered": {
    zh: "触发止损，方向={direction} 当前亏损={pnl} USDT",
    en: "Stop triggered direction={direction} current loss={pnl} USDT",
  },
  "log.maker.stopOrderMissing": { zh: "止损平仓时订单已不存在", en: "Stop close order missing" },
  "log.maker.stopCloseFail": { zh: "止损平仓失败: {error}", en: "Failed to close on stop: {error}" },
  "log.maker.orderMissing": { zh: "订单已不存在，撤销跳过", en: "Order already gone, skipping cancel" },
  "log.common.precisionSynced": {
    zh: "已同步交易精度: priceTick={priceTick} qtyStep={qtyStep}",
    en: "Synced precision: priceTick={priceTick} qtyStep={qtyStep}",
  },
  "log.common.precisionFailed": { zh: "同步精度失败: {error}", en: "Failed to sync precision: {error}" },
  "log.maker.updateHandlerError": { zh: "更新回调处理异常: {error}", en: "Update handler error: {error}" },
  "log.maker.snapshotDispatchError": {
    zh: "快照或更新分发异常: {error}",
    en: "Snapshot/update dispatch error: {error}",
  },
  "log.maker.waitAccount": { zh: "等待账户快照同步，尚未开始做市", en: "Waiting for account snapshot before quoting" },
  "log.maker.waitDepth": { zh: "等待深度行情推送，尚未开始做市", en: "Waiting for depth stream before quoting" },
  "log.maker.waitTicker": { zh: "等待Ticker推送，尚未开始做市", en: "Waiting for ticker stream before quoting" },
  "log.maker.waitOrders": {
    zh: "等待订单快照返回，尚未执行初始化撤单",
    en: "Waiting for order snapshot before startup cancels",
  },
  "log.maker.noTargets": { zh: "当前无目标挂单，等待下一次刷新", en: "No target orders; waiting for next refresh" },
  "log.maker.targetsSummary": { zh: "目标挂单: {summary}", en: "Target orders: {summary}" },
  "log.maker.balanceThrottle": {
    zh: "余额不足，暂停新挂单 {seconds}s: {detail}",
    en: "Insufficient balance, pausing new orders for {seconds}s: {detail}",
  },
  "log.maker.balanceResumed": {
    zh: "余额检测恢复，重新尝试挂单",
    en: "Balance check recovered, retrying orders",
  },
  "log.maker.rateLimit429": { zh: "MakerEngine 429: {error}", en: "MakerEngine 429: {error}" },
  "log.kline.subscribeFail": { zh: "订阅K线失败: {error}", en: "Failed to subscribe klines: {error}" },
  "log.kline.processError": { zh: "K线推送处理异常: {error}", en: "Kline stream processing error: {error}" },
  "log.trend.klineInsufficient": {
    zh: "K线不足 {count}/{min}，最近收盘({recentCount}): {recent}",
    en: "Insufficient klines {count}/{min}, recent closes ({recentCount}): {recent}",
  },
  "log.trend.klineReady": {
    zh: "K线就绪 {count} 根，可计算 SMA30。最近收盘: {recent}",
    en: "Klines ready {count} bars; SMA30 available. Recent closes: {recent}",
  },
  "log.trend.rateLimit429": { zh: "TrendEngine 429: {error}", en: "TrendEngine 429: {error}" },
  "log.trend.loopError": { zh: "策略循环异常: {error}", en: "Strategy loop error: {error}" },
  "log.trend.rateLimitUpdateError": {
    zh: "限频控制器状态更新失败: {error}",
    en: "Rate limit controller update failed: {error}",
  },
  "log.trend.detectPosition": {
    zh: "检测到已有持仓: {direction} {amount} @ {price}",
    en: "Detected existing position: {direction} {amount} @ {price}",
  },
  "log.trend.detectOrders": {
    zh: "检测到已有挂单 {count} 笔，将按策略规则接管",
    en: "Detected {count} existing orders; taking over per strategy rules",
  },
  "log.trend.stopCooldown": {
    zh: "止损后冷却中 {seconds}s，忽略入场信号",
    en: "Post-stop cooldown {seconds}s; ignoring entry signals",
  },
  "log.trend.alreadyEntered": {
    zh: "本分钟已入场，忽略新的 SMA 入场信号",
    en: "Entry already executed this minute; ignoring new SMA signal",
  },
  "log.trend.bandwidthBlocked": {
    zh: "布林带宽度不足：{bandwidth} < {minBandwidth}，忽略入场信号",
    en: "Bollinger bandwidth too low: {bandwidth} < {minBandwidth}, ignoring entry",
  },
  "log.trend.cancelMissing": { zh: "撤单时部分订单已不存在，忽略", en: "Some orders missing during cancel; ignore" },
  "log.trend.cancelFail": { zh: "撤销挂单失败: {error}", en: "Failed to cancel orders: {error}" },
  "log.trend.crossDown": { zh: "下穿SMA30，市价开空", en: "Crossed below SMA30, market sell" },
  "log.trend.crossUp": { zh: "上穿SMA30，市价开多", en: "Crossed above SMA30, market buy" },
  "log.trend.marketOrderFail": { zh: "市价下单失败: {error}", en: "Market order failed: {error}" },
  "log.trend.entryPricePending": {
    zh: "持仓均价尚未同步，等待交易所账户快照更新后再执行风控",
    en: "Entry price not synced; waiting for account snapshot before risk checks",
  },
  "log.trend.stopPreCancelMissing": { zh: "止损前撤单发现订单已不存在", en: "Stop pre-close cancel found missing order" },
  "log.trend.marketCloseGuard": {
    zh: "市价平仓保护触发：closePx={closePx} mark={mark} 偏离 {pctDiff}% > {limitPct}%",
    en: "Market close guard triggered: closePx={closePx} mark={mark} deviation {pctDiff}% > {limitPct}%",
  },
  "log.trend.stopClose": { zh: "止损平仓: {side}", en: "Stop close: {side}" },
  "log.trend.targetStopMissing": { zh: "止损平仓时目标订单已不存在", en: "Target order missing during stop close" },
  "log.trend.stopCloseFail": { zh: "止损平仓失败: {error}", en: "Failed to close position on stop: {error}" },
  "log.trend.placeStopFail": { zh: "挂止损单失败: {error}", en: "Failed to place stop order: {error}" },
  "log.trend.stopMissingSkip": { zh: "原止损单已不存在，跳过撤销", en: "Existing stop missing, skipping cancel" },
  "log.trend.cancelStopFail": { zh: "取消原止损单失败: {error}", en: "Failed to cancel existing stop: {error}" },
  "log.trend.moveStop": { zh: "移动止损到 {price}", en: "Moved stop to {price}" },
  "log.trend.moveStopFail": { zh: "移动止损失败: {error}", en: "Failed to move stop: {error}" },
  "log.trend.restoreStop": { zh: "恢复原止损 @ {price}", en: "Restored original stop @ {price}" },
  "log.trend.restoreStopFail": { zh: "恢复原止损失败: {error}", en: "Failed to restore original stop: {error}" },
  "log.trend.trailingFail": { zh: "挂动态止盈失败: {error}", en: "Failed to place trailing stop: {error}" },
  "log.trend.updateHandlerError": { zh: "更新回调处理异常: {error}", en: "Update handler error: {error}" },
  "log.trend.snapshotDispatchError": { zh: "快照或更新分发异常: {error}", en: "Snapshot/update dispatch error: {error}" },
  // --- core/order-coordinator ---
  "order.kind.limit": { zh: "限价单", en: "Limit order" },
  "order.kind.market": { zh: "市价单", en: "Market order" },
  "order.kind.stop": { zh: "止损单", en: "Stop order" },
  "order.kind.trailing": { zh: "动态止盈单", en: "Trailing stop order" },
  "order.kind.close": { zh: "市价平仓", en: "Market close" },
  "log.order.markGuardBlocked": {
    zh: "{kind} 保护触发：side={side} price={price} mark={mark} 超过 {pct}%",
    en: "{kind} blocked by mark-price guard: side={side} price={price} mark={mark} exceeds {pct}%",
  },
  "log.order.lockTimeout": {
    zh: "{type} 操作超时自动解锁",
    en: "{type} operation timed out; lock released",
  },
  "log.order.dedupeCancelled": {
    zh: "去重撤销重复 {type} 单: {ids}",
    en: "Cancelled duplicate {type} orders: {ids}",
  },
  "log.order.dedupeGone": {
    zh: "去重时发现订单已不存在，跳过删除",
    en: "Order already gone while deduplicating; skipping cancel",
  },
  "log.order.dedupeFailed": {
    zh: "去重撤单失败: {error}",
    en: "Failed to cancel duplicates: {error}",
  },
  "log.order.invalidQuantity": {
    zh: "{kind}数量无效，跳过下单",
    en: "{kind} quantity is invalid; skipping",
  },
  "log.order.limitPlaced": {
    zh: "挂限价单: {side} @ {price} 数量 {quantity} reduceOnly={reduceOnly}{sl}",
    en: "Placed limit order: {side} @ {price} qty {quantity} reduceOnly={reduceOnly}{sl}",
  },
  "log.order.limitGone": {
    zh: "订单已成交或被撤销，跳过新单",
    en: "Order already filled or cancelled; skipping new order",
  },
  "log.order.marketPlaced": {
    zh: "市价单: {side} 数量 {quantity} reduceOnly={reduceOnly}",
    en: "Market order: {side} qty {quantity} reduceOnly={reduceOnly}",
  },
  "log.order.marketGone": {
    zh: "市价单失败但订单已不存在，忽略",
    en: "Market order failed but the order is already gone; ignoring",
  },
  "log.order.stopAboveLast": {
    zh: "止损价 {stopPrice} 高于或等于当前价 {lastPrice}，取消挂单",
    en: "Stop price {stopPrice} is at or above the last price {lastPrice}; not placing",
  },
  "log.order.stopBelowLast": {
    zh: "止损价 {stopPrice} 低于或等于当前价 {lastPrice}，取消挂单",
    en: "Stop price {stopPrice} is at or below the last price {lastPrice}; not placing",
  },
  "log.order.stopPlaced": {
    zh: "挂止损单: {side} STOP_MARKET @ {stopPrice}",
    en: "Placed stop order: {side} STOP_MARKET @ {stopPrice}",
  },
  "log.order.stopGone": { zh: "止损单已失效，跳过", en: "Stop order no longer valid; skipping" },
  "log.order.trailingUnsupported": {
    zh: "当前交易所不支持动态止盈单",
    en: "This exchange does not support trailing stop orders",
  },
  "log.order.trailingPlaced": {
    zh: "挂动态止盈单: {side} activation={activation} callbackRate={callbackRate}",
    en: "Placed trailing stop: {side} activation={activation} callbackRate={callbackRate}",
  },
  "log.order.trailingGone": {
    zh: "动态止盈单已失效，跳过",
    en: "Trailing stop no longer valid; skipping",
  },
  "log.order.closePlaced": { zh: "市价平仓: {side}", en: "Market close: {side}" },
  "log.order.closeGone": {
    zh: "市场平仓时订单已不存在",
    en: "Order already gone while closing at market",
  },
  // --- utils/standx-token-expiry ---
  "token.expiringSoon": {
    zh: "StandX Token 将在 {minutes} 分钟后过期",
    en: "StandX token expires in {minutes} minutes",
  },
  "token.expiredCancelling": {
    zh: "StandX Token 已过期，正在取消所有挂单",
    en: "StandX token expired; cancelling all open orders",
  },
  "token.expiredWithPosition": {
    zh: "StandX Token 已过期，仅保留平仓/止损逻辑",
    en: "StandX token expired; only close/stop logic remains active",
  },
  "token.expiredSilent": {
    zh: "StandX Token 已过期，进入静默数据接收模式",
    en: "StandX token expired; entering silent data-only mode",
  },
  "log.token.closeOnlyForced": {
    zh: "Token 过期，强制进入平仓模式，仅允许 reduce-only 订单",
    en: "Token expired; forcing close-only mode, reduce-only orders only",
  },
  "log.token.silentEntered": {
    zh: "进入静默数据接收模式，不再进行任何交易操作",
    en: "Entered silent data-only mode; no further trading actions",
  },
  "log.token.ordersCancelled": {
    zh: "Token 过期，已撤销所有挂单",
    en: "Token expired; cancelled all open orders",
  },
  "log.token.cancelOrderMissing": {
    zh: "Token 过期撤单时订单已不存在",
    en: "Order already gone while cancelling after token expiry",
  },
  "log.token.cancelFailed": {
    zh: "Token 过期撤单失败: {error}",
    en: "Failed to cancel orders after token expiry: {error}",
  },
  "notify.token.title": { zh: "Token 已过期", en: "Token expired" },
  "notify.token.closeOnly": {
    zh: "Token 已过期，进入平仓模式，不再开新仓",
    en: "Token expired; entering close-only mode, no new positions",
  },
  "notify.token.silent": {
    zh: "Token 已过期，策略进入静默模式",
    en: "Token expired; strategy entering silent mode",
  },
  // --- strategy/common/isolated-margin-guard ---
  "log.margin.switched": {
    zh: "已切换为逐仓模式 (isolated)，恢复策略运行",
    en: "Switched to isolated margin; resuming strategy",
  },
  "log.margin.switchUnconfirmed": {
    zh: "逐仓模式切换未确认，当前模式: {mode}",
    en: "Isolated margin switch unconfirmed; current mode: {mode}",
  },
  "log.margin.switchFailed": {
    zh: "切换逐仓模式失败: {error}",
    en: "Failed to switch to isolated margin: {error}",
  },
  // --- strategy/grid-logic ---
  "log.grid.entryFilled": {
    zh: "ENTRY 成交: {side} @ {price} (线 {level})",
    en: "ENTRY filled: {side} @ {price} (level {level})",
  },
  "log.grid.orphanExitFilled": {
    zh: "孤儿 EXIT 成交: {side} @ {price}",
    en: "Orphan EXIT filled: {side} @ {price}",
  },
  "log.grid.exitFilled": {
    zh: "EXIT 成交: {side} @ {price} (释放线 {level})",
    en: "EXIT filled: {side} @ {price} (level {level} released)",
  },
  "log.grid.entryCancelled": {
    zh: "ENTRY 撤销: {side} @ {price} (线 {level})",
    en: "ENTRY cancelled: {side} @ {price} (level {level})",
  },
  "log.grid.exitCancelled": {
    zh: "EXIT 撤销: {side} @ {price} (线 {level})",
    en: "EXIT cancelled: {side} @ {price} (level {level})",
  },
  "log.grid.orderVanished": {
    zh: "订单消失待判定: {intent} {side} @ {price}",
    en: "Order vanished, outcome unknown: {intent} {side} @ {price}",
  },
  "log.grid.belowLowerBound": {
    zh: "价格跌破网格下边界 {pct}%",
    en: "Price fell {pct}% below the grid's lower bound",
  },
  "log.grid.aboveUpperBound": {
    zh: "价格突破网格上边界 {pct}%",
    en: "Price rose {pct}% above the grid's upper bound",
  },
  "log.grid.coverageAuditClose": {
    zh: "覆盖审计: 未覆盖 {qty} 且{cause}，市价平仓",
    en: "Coverage audit: {qty} uncovered and {cause}; closing at market",
  },
  "log.grid.causeOutOfRange": { zh: "价格已出区间", en: "price left the range" },
  "log.grid.causeLossExceeded": { zh: "浮亏超限", en: "unrealised loss exceeded the limit" },
  "log.grid.coverageAuditReason": { zh: "覆盖审计止损", en: "Coverage audit stop" },
  "log.grid.coverageAuditRepost": {
    zh: "覆盖审计: 未覆盖 {qty}，补挂平仓单 @ {price}",
    en: "Coverage audit: {qty} uncovered; reposting exit @ {price}",
  },
  "log.grid.shiftOutOfRange": {
    zh: "价格越界，启动移格: {reason}",
    en: "Price out of range; starting grid shift: {reason}",
  },
  "log.grid.shiftAnchorDrift": {
    zh: "价格偏离锚定价超阈值，启动移格 (anchor={anchor} → {price})",
    en: "Price drifted past the anchor threshold; starting grid shift (anchor={anchor} → {price})",
  },
  "log.grid.adoptOrphanExit": {
    zh: "收编平仓方向挂单为孤儿 EXIT: {side} @ {price}",
    en: "Adopted an unattributed exit-side order as orphan EXIT: {side} @ {price}",
  },
  "log.grid.cancelUnattributable": {
    zh: "撤销无法归属的挂单: {side} @ {price}",
    en: "Cancelling unattributable order: {side} @ {price}",
  },
  "log.grid.inflightMatched": {
    zh: "inflight 归属确认: {intent} {side} @ {price}",
    en: "In-flight order matched: {intent} {side} @ {price}",
  },
  "log.grid.cancelStaleVersion": {
    zh: "撤销过期网格版本挂单: {clientOrderId}",
    en: "Cancelling order from a stale grid version: {clientOrderId}",
  },
  "log.grid.orphanResidual": {
    zh: "对账残余孤儿仓位: {qty}",
    en: "Reconciliation left an orphan position: {qty}",
  },
  // --- strategy/grid-engine ---
  "log.gridEngine.configInvalid": { zh: "配置无效，已暂停网格", en: "Invalid config; grid paused" },
  "log.gridEngine.wsDisconnected": {
    zh: "WebSocket 断连 ({symbol})，冻结网格下单",
    en: "WebSocket disconnected ({symbol}); freezing grid orders",
  },
  "log.gridEngine.wsReconnected": {
    zh: "WebSocket 重连成功 ({symbol})，下一轮执行对账",
    en: "WebSocket reconnected ({symbol}); reconciling next tick",
  },
  "log.gridEngine.loadStateFailed": {
    zh: "加载网格状态失败: {error}",
    en: "Failed to load grid state: {error}",
  },
  "log.gridEngine.stateRestored": {
    zh: "已从磁盘恢复网格状态: gridVersion={gridVersion} anchor={anchor} 区间=[{lower}, {upper}]{shift}",
    en: "Restored grid state from disk: gridVersion={gridVersion} anchor={anchor} range=[{lower}, {upper}]{shift}",
  },
  "log.gridEngine.stateRestoredShift": {
    zh: " 移格续跑({phase})",
    en: " resuming shift ({phase})",
  },
  "log.gridEngine.fingerprintMismatch": {
    zh: "磁盘网格状态与当前配置指纹不一致，全新建格并执行孤儿扫描",
    en: "Stored grid state does not match the current config; rebuilding and scanning for orphans",
  },
  "log.gridEngine.gridCreated": {
    zh: "以锚定价 {anchor} 建立网格 ({mode})",
    en: "Grid created at anchor {anchor} ({mode})",
  },
  "log.gridEngine.initFailed": { zh: "网格初始化失败: {error}", en: "Grid init failed: {error}" },
  "log.gridEngine.reconcileEvent": { zh: "[对账:{source}] {event}", en: "[reconcile:{source}] {event}" },
  "log.gridEngine.reconcileCancelled": {
    zh: "[对账:{source}] 撤销 {count} 个无法归属的挂单",
    en: "[reconcile:{source}] cancelled {count} unattributable orders",
  },
  "log.gridEngine.reconcileCancelFailed": {
    zh: "[对账:{source}] 撤单失败: {error}",
    en: "[reconcile:{source}] cancel failed: {error}",
  },
  "log.gridEngine.reconcileOrdersFailed": {
    zh: "[对账:{source}] REST 查询挂单失败: {error}",
    en: "[reconcile:{source}] REST open-order query failed: {error}",
  },
  "log.gridEngine.reconcileAccountFailed": {
    zh: "[对账:{source}] REST 查询账户失败: {error}",
    en: "[reconcile:{source}] REST account query failed: {error}",
  },
  "log.gridEngine.tickFailed": { zh: "网格轮询异常: {error}", en: "Grid tick failed: {error}" },
  "log.gridEngine.shiftStarting": {
    zh: "启动智能移格，目标锚定价 {anchor}",
    en: "Starting grid shift to anchor {anchor}",
  },
  "log.gridEngine.orderFeedStalled": {
    zh: "订单流疑似停滞（下单后长时间未反映），暂停新下单",
    en: "Order feed looks stalled (placements are not showing up); pausing new orders",
  },
  "log.gridEngine.placeFailed": {
    zh: "挂单失败 ({side} @ {price}): {error}",
    en: "Failed to place order ({side} @ {price}): {error}",
  },
  "log.gridEngine.closeSlippageBlocked": {
    zh: "市价平仓滑点守卫触发 ({reason}): close={close} mark={mark} 偏离 {pct}% > {limit}%，暂缓",
    en: "Market close blocked by slippage guard ({reason}): close={close} mark={mark} deviates {pct}% > {limit}%; holding off",
  },
  "log.gridEngine.closed": { zh: "市价平仓 {side} {qty} ({reason})", en: "Market close {side} {qty} ({reason})" },
  "log.gridEngine.closeFailed": {
    zh: "市价平仓失败 ({reason}): {error}",
    en: "Market close failed ({reason}): {error}",
  },
  "log.gridEngine.shiftCancelRequested": {
    zh: "移格: 已请求撤销全部挂单",
    en: "Shift: requested cancellation of all orders",
  },
  "log.gridEngine.shiftCancelFailed": { zh: "移格撤单失败: {error}", en: "Shift cancel failed: {error}" },
  "log.gridEngine.shiftCloseReason": { zh: "移格平仓", en: "Grid shift close" },
  "log.gridEngine.shiftCloseDeferred": {
    zh: "移格: 平仓被滑点守卫暂缓，下轮重试",
    en: "Shift: close deferred by the slippage guard; retrying next tick",
  },
  "log.gridEngine.shiftDone": {
    zh: "移格完成: 新锚定价 {anchor}，区间 [{lower}, {upper}]，gridVersion={gridVersion}",
    en: "Shift complete: anchor {anchor}, range [{lower}, {upper}], gridVersion={gridVersion}",
  },
  "log.gridEngine.stopCancelledFlat": {
    zh: "已撤销交易所兜底止损单（仓位归零）",
    en: "Cancelled the exchange stop order (position is flat)",
  },
  "log.gridEngine.stopCancelFailed": {
    zh: "撤销兜底止损单失败: {error}",
    en: "Failed to cancel the exchange stop: {error}",
  },
  "log.gridEngine.stopCancelStaleFailed": {
    zh: "撤销旧兜底止损单失败: {error}",
    en: "Failed to cancel the previous exchange stop: {error}",
  },
  "log.gridEngine.stopPlaceFailed": {
    zh: "挂兜底止损单失败: {error}",
    en: "Failed to place the exchange stop: {error}",
  },
  "log.gridEngine.haltStarting": {
    zh: "{reason}，开始执行撤单与平仓",
    en: "{reason}; cancelling orders and closing out",
  },
  "log.gridEngine.allCancelled": { zh: "已撤销全部网格挂单", en: "Cancelled all grid orders" },
  "log.gridEngine.cancelAllFailed": {
    zh: "撤销网格挂单失败: {error}",
    en: "Failed to cancel grid orders: {error}",
  },
  "log.gridEngine.stopCloseDeferred": {
    zh: "止损平仓被滑点守卫暂缓，下轮重试",
    en: "Stop close deferred by the slippage guard; retrying next tick",
  },
  "log.gridEngine.resumed": {
    zh: "价格重新回到网格区间，恢复网格运行 (gridVersion={gridVersion})",
    en: "Price re-entered the grid range; resuming (gridVersion={gridVersion})",
  },
  "log.gridEngine.saveStateFailed": {
    zh: "保存网格状态失败: {error}",
    en: "Failed to save grid state: {error}",
  },
  // --- offset-maker / liquidity-maker (shared wording) ---
  "log.subscribe.klineFail": { zh: "订阅K线失败: {error}", en: "Failed to subscribe klines: {error}" },
  "log.process.klineError": { zh: "K线推送处理异常: {error}", en: "Kline update handler error: {error}" },
  "log.spotMaker.belowMinSellHold": {
    zh: "现货持仓低于最小卖单量，暂不挂卖单",
    en: "Spot balance is below the minimum sell size; holding off on sell orders",
  },
  "log.spotMaker.belowMinSellSkip": {
    zh: "现货持仓低于最小卖单量，跳过卖单",
    en: "Spot balance is below the minimum sell size; skipping the sell order",
  },
  "log.spotMaker.buyOnlyOnGreenCandle": {
    zh: "现货买入仅在1m阳线，当前跳过买单",
    en: "Spot buys only on a green 1m candle; skipping the buy order",
  },
  "log.spotMaker.quoteBalanceShort": {
    zh: "现货可用报价资产不足，跳过买单",
    en: "Not enough quote asset available; skipping the buy order",
  },
  "log.spotMaker.baseBalanceShort": {
    zh: "现货可用基础资产不足，跳过卖单",
    en: "Not enough base asset available; skipping the sell order",
  },
  "log.spotMaker.spreadTooTightBuy": {
    zh: "跳过买单：价差不足以构造maker价格",
    en: "Skipping the buy order: the spread is too tight for a maker price",
  },
  "log.spotMaker.spreadTooTightSell": {
    zh: "跳过卖单：价差不足以构造maker价格",
    en: "Skipping the sell order: the spread is too tight for a maker price",
  },
  "log.spotMaker.sellBelowMinNotional": {
    zh: "现货卖单低于最小成交量，跳过挂单等待累积",
    en: "Sell size is below the venue minimum; waiting to accumulate",
  },
  "log.spotMaker.belowMinCloseSkipStop": {
    zh: "现货持仓低于最小平仓数量，跳过止损检查",
    en: "Spot position is below the minimum close size; skipping the stop check",
  },
  "log.spotMaker.rateLimitCloseMissing": {
    zh: "限频强制平仓时订单已不存在",
    en: "Order already gone during the rate-limit forced close",
  },
  "log.spotMaker.rateLimitCloseFailed": {
    zh: "限频强制平仓失败: {error}",
    en: "Rate-limit forced close failed: {error}",
  },
  "log.spotMaker.startupCleanup": { zh: "启动时清理历史挂单", en: "Cancelling stale orders on startup" },
  "log.spotMaker.startupCleanupGone": {
    zh: "历史挂单已消失，跳过启动清理",
    en: "Stale orders already gone; skipping startup cleanup",
  },
  "log.spotMaker.startupCancelFailed": {
    zh: "启动撤单失败: {error}",
    en: "Startup cancel failed: {error}",
  },
  "log.spotMaker.cancelMismatched": {
    zh: "撤销不匹配订单 {side} @ {price} reduceOnly={reduceOnly}",
    en: "Cancelling mismatched order {side} @ {price} reduceOnly={reduceOnly}",
  },
  "log.spotMaker.cancelAlreadySettled": {
    zh: "撤销时发现订单已被成交/取消，忽略",
    en: "Order was already filled or cancelled; ignoring",
  },
  "log.spotMaker.cancelFailed": { zh: "撤销订单失败: {error}", en: "Failed to cancel order: {error}" },
  "log.spotMaker.orderMissingOnCancel": {
    zh: "订单已不存在，撤销跳过",
    en: "Order no longer exists; skipping cancel",
  },
  "log.spotMaker.dustCloseFailed": {
    zh: "小额市价平仓失败: {error}",
    en: "Dust market close failed: {error}",
  },
  "log.spotMaker.dustClose": {
    zh: "小额仓位使用市价平仓 {side} 数量 {qty}",
    en: "Closing dust position at market: {side} qty {qty}",
  },
  "log.spotMaker.placeFailed": {
    zh: "挂单失败({side} {price}): {error}",
    en: "Failed to place order ({side} {price}): {error}",
  },
  "log.spotMaker.spotStop": {
    zh: "现货止损，当前仓位={qty} PnL={pnl} USDT",
    en: "Spot stop-loss: position={qty} PnL={pnl} USDT",
  },
  "log.spotMaker.spotStopFailed": { zh: "现货止损失败: {error}", en: "Spot stop-loss failed: {error}" },
  "log.spotMaker.stopCloseMissing": {
    zh: "止损平仓时订单已不存在",
    en: "Order already gone while closing on stop",
  },
  "log.spotMaker.stopCloseFailed": { zh: "止损平仓失败: {error}", en: "Stop close failed: {error}" },
  "log.spotMaker.entryPricePending": {
    zh: "做市持仓均价未同步，等待账户快照刷新后再执行止损判断",
    en: "Entry price not synced yet; waiting for an account refresh before evaluating the stop",
  },
  "log.spotMaker.stopTriggered": {
    zh: "触发止损，方向={direction} 当前亏损={pnl} USDT",
    en: "Stop-loss triggered: direction={direction} loss={pnl} USDT",
  },
  "log.spotMaker.updateHandlerError": {
    zh: "更新回调处理异常: {error}",
    en: "Update handler error: {error}",
  },
  "log.spotMaker.snapshotDispatchError": {
    zh: "快照或更新分发异常: {error}",
    en: "Snapshot/update dispatch error: {error}",
  },
  "log.offsetMaker.tickFailed": { zh: "偏移做市循环异常: {error}", en: "Offset maker tick failed: {error}" },
  "log.offsetMaker.imbalanceClose": {
    zh: "深度极端不平衡({buySum} vs {sellSum}), 市价平仓 {side}",
    en: "Extreme depth imbalance ({buySum} vs {sellSum}); closing {side} at market",
  },
  "log.offsetMaker.imbalanceCloseMissing": {
    zh: "深度不平衡平仓时订单已不存在",
    en: "Order already gone during the imbalance close",
  },
  "log.offsetMaker.imbalanceCloseFailed": {
    zh: "深度不平衡平仓失败: {error}",
    en: "Imbalance close failed: {error}",
  },
  "log.liquidityMaker.tickFailed": {
    zh: "流动性做市循环异常: {error}",
    en: "Liquidity maker tick failed: {error}",
  },
  "log.liquidityMaker.fillDetected": {
    zh: "检测到成交: {side} {qty} @ {price}",
    en: "Fill detected: {side} {qty} @ {price}",
  },
  "log.liquidityMaker.exitRaisedToBreakeven": {
    zh: "平仓价调整为入场价+1tick以确保不亏本: {price}",
    en: "Exit raised to entry+1 tick to stay at or above breakeven: {price}",
  },
  "log.liquidityMaker.exitLoweredToBreakeven": {
    zh: "平仓价调整为入场价-1tick以确保不亏本: {price}",
    en: "Exit lowered to entry-1 tick to stay at or above breakeven: {price}",
  },
  // --- strategy/maker-points-engine ---
  "log.mp.binanceError": { zh: "Binance {context} 异常: {error}", en: "Binance {context} error: {error}" },
  "log.mp.binanceDisconnected": { zh: "Binance 深度连接断开", en: "Binance depth feed disconnected" },
  "log.mp.binanceStale": { zh: "Binance 深度数据过时", en: "Binance depth data is stale" },
  "log.mp.binanceRecovered": { zh: "Binance 深度连接恢复", en: "Binance depth feed recovered" },
  "log.mp.wsDisconnected": {
    zh: "WebSocket 断连 ({symbol})，启动断连保护",
    en: "WebSocket disconnected ({symbol}); engaging disconnect protection",
  },
  "log.mp.wsReconnected": {
    zh: "WebSocket 重连成功 ({symbol})，开始重连保护流程",
    en: "WebSocket reconnected ({symbol}); running reconnect protection",
  },
  "log.mp.reconnectFoundOrders": {
    zh: "重连后查询到 {count} 个挂单",
    en: "Found {count} open orders after reconnecting",
  },
  "log.mp.reconnectCancelled": { zh: "重连保护：已取消所有挂单", en: "Reconnect protection: cancelled all orders" },
  "log.mp.reconnectCancelPartial": {
    zh: "重连保护：取消挂单未完全成功，将在下次循环重试",
    en: "Reconnect protection: cancellation incomplete; retrying next tick",
  },
  "log.mp.reconnectFailed": { zh: "重连保护流程失败: {error}", en: "Reconnect protection failed: {error}" },
  "log.mp.closeOnlyEntered": { zh: "进入平仓模式，仅挂 reduce-only", en: "Entered close-only mode; reduce-only quotes" },
  "log.mp.closeOnlyExited": { zh: "退出平仓模式", en: "Left close-only mode" },
  "log.mp.depthImbalancePause": {
    zh: "Binance 深度失衡，暂停 {summary} 挂单",
    en: "Binance depth imbalance; pausing {summary} quotes",
  },
  "log.mp.depthImbalanceResume": { zh: "Binance 深度恢复，继续挂单", en: "Binance depth recovered; resuming quotes" },
  "log.mp.rateLimited": { zh: "限频触发，暂停挂单: {error}", en: "Rate limited; pausing quotes: {error}" },
  "log.mp.tickFailed": { zh: "MakerPoints 主循环异常: {error}", en: "MakerPoints tick failed: {error}" },
  "log.mp.precisionErrorResync": {
    zh: "检测到精度错误，重新同步: {error}",
    en: "Precision error detected; resyncing: {error}",
  },
  "log.mp.placeFailed": { zh: "挂单失败 {side} @ {price}: {error}", en: "Failed to place {side} @ {price}: {error}" },
  "log.mp.unexpectedOrders": {
    zh: "发现 {count} 个未预期挂单，执行强制取消",
    en: "Found {count} unexpected orders; force-cancelling",
  },
  "log.mp.forceCancelled": {
    zh: "已强制取消所有挂单，重置本地状态",
    en: "Force-cancelled all orders and reset local state",
  },
  "log.mp.verifyOrdersFailed": { zh: "验证挂单状态失败: {error}", en: "Failed to verify order state: {error}" },
  "log.mp.stopTriggered": {
    zh: "触发止损: 实时未实现亏损 {pnl} USDT",
    en: "Stop-loss triggered: live unrealised loss {pnl} USDT",
  },
  "log.mp.stopSucceeded": { zh: "止损成功: 仓位已清零", en: "Stop-loss done: position is flat" },
  "log.mp.stopOrderMissing": {
    zh: "止损平仓时订单已不存在，继续检查仓位",
    en: "Order already gone during the stop close; rechecking the position",
  },
  "log.mp.stopPrecisionResync": {
    zh: "止损平仓精度错误，重新同步: {error}",
    en: "Precision error during the stop close; resyncing: {error}",
  },
  "log.mp.stopRetry": {
    zh: "止损平仓失败 (重试 {attempt}/{max}): {error}",
    en: "Stop close failed (retry {attempt}/{max}): {error}",
  },
  "log.mp.stopRetriesExhausted": {
    zh: "止损重试已达上限 ({max} 次)，请手动检查仓位",
    en: "Stop retries exhausted ({max}); check the position manually",
  },
  "log.mp.updateHandlerError": { zh: "更新监听异常: {error}", en: "Update listener error: {error}" },
  "log.mp.snapshotError": { zh: "快照生成异常: {error}", en: "Snapshot build error: {error}" },
  "log.mp.noTargets": { zh: "暂无目标挂单", en: "No target orders" },
  "log.mp.targets": { zh: "目标挂单: {summary}", en: "Target orders: {summary}" },
  "log.mp.skipThinDepth": {
    zh: "跳过 {side} {bps}bps 挂单: 深度 {depth} BTC < {min} BTC",
    en: "Skipping {side} {bps}bps quote: depth {depth} BTC < {min} BTC",
  },
  "log.mp.depthRecovered": {
    zh: "{side} {bps}bps 深度恢复，继续挂单",
    en: "{side} {bps}bps depth recovered; resuming quotes",
  },
  "log.mp.insufficientBalance": {
    zh: "余额不足，暂停挂单 {seconds}s: {detail}",
    en: "Insufficient balance; pausing quotes for {seconds}s: {detail}",
  },
  "log.mp.balanceRecovered": { zh: "余额恢复，继续挂单", en: "Balance recovered; resuming quotes" },
  "log.mp.defenseEntered": {
    zh: "数据过时检测: {summary}，进入防御模式",
    en: "Stale-data check: {summary}; entering defense mode",
  },
  "log.mp.defenseExited": {
    zh: "数据推送恢复正常，退出防御模式",
    en: "Data feeds recovered; leaving defense mode",
  },
  "log.mp.defenseForceCancelled": {
    zh: "防御模式: 已强制取消所有挂单",
    en: "Defense mode: force-cancelled all orders",
  },
  "log.mp.defenseCancelPartial": {
    zh: "防御模式: 取消挂单未完全成功，将继续重试",
    en: "Defense mode: cancellation incomplete; will retry",
  },
  "log.mp.defenseCancelled": { zh: "防御模式: 已取消所有挂单", en: "Defense mode: cancelled all orders" },
  "log.mp.defenseOrdersGone": { zh: "防御模式: 挂单已不存在", en: "Defense mode: orders already gone" },
  "log.mp.defenseCancelFailed": {
    zh: "防御模式取消挂单失败: {error}",
    en: "Defense mode cancel failed: {error}",
  },
  "log.mp.defensePollStarted": {
    zh: "防御模式: 启动 REST 数据轮询",
    en: "Defense mode: started REST polling",
  },
  "log.mp.defensePollStopped": {
    zh: "防御模式: 停止 REST 数据轮询",
    en: "Defense mode: stopped REST polling",
  },
  "log.mp.defensePositionStillBad": {
    zh: "防御模式: 仓位数据仍异常: {issues}",
    en: "Defense mode: position data still invalid: {issues}",
  },
  "log.mp.defenseEmptySnapshot": {
    zh: "防御模式: REST 获取账户快照为空",
    en: "Defense mode: REST returned an empty account snapshot",
  },
  "log.mp.defenseFoundOrders": {
    zh: "防御模式: 发现 {count} 个挂单，执行取消",
    en: "Defense mode: found {count} open orders; cancelling",
  },
  "log.mp.defenseQueryFailed": {
    zh: "防御模式查询挂单失败: {error}",
    en: "Defense mode open-order query failed: {error}",
  },
  "log.mp.defensePollFailed": {
    zh: "防御模式 REST 轮询失败: {error}",
    en: "Defense mode REST poll failed: {error}",
  },
  "notify.mp.disconnectTitle": { zh: "连接断开", en: "Disconnected" },
  "notify.mp.disconnectBody": {
    zh: "WebSocket 断连，正在尝试取消所有挂单",
    en: "WebSocket disconnected; cancelling all open orders",
  },
  "notify.mp.reconnectTitle": { zh: "重连完成", en: "Reconnected" },
  "notify.mp.reconnectBody": {
    zh: "WebSocket 重连成功，已清理挂单状态",
    en: "WebSocket reconnected; order state cleaned up",
  },
  "notify.mp.stopTitle": { zh: "止损触发", en: "Stop-loss triggered" },
  "notify.mp.stopBody": {
    zh: "实时未实现亏损 {pnl} USDT，强制平仓",
    en: "Live unrealised loss {pnl} USDT; forcing a close",
  },
  "notify.mp.defenseTitle": { zh: "防御模式", en: "Defense mode" },
  "notify.mp.defenseBody": {
    zh: "数据推送中断: {summary}，已取消所有挂单",
    en: "Data feed interrupted: {summary}; cancelled all open orders",
  },
  "notify.mp.defenseClearedTitle": { zh: "防御模式解除", en: "Defense mode cleared" },
  "notify.mp.defenseClearedBody": {
    zh: "数据推送恢复正常，恢复正常交易",
    en: "Data feeds are healthy again; resuming normal trading",
  },
  "notify.mp.openTitle": { zh: "开仓", en: "Position opened" },
  "notify.mp.closeTitle": { zh: "平仓", en: "Position closed" },
  "notify.mp.closeTitleTokenExpired": { zh: "Token过期平仓", en: "Token-expiry close" },
  "notify.mp.increaseTitle": { zh: "加仓", en: "Position increased" },
  "notify.mp.reduceTitle": { zh: "减仓", en: "Position reduced" },
  "notify.mp.reverseTitle": { zh: "反向开仓", en: "Position reversed" },
  "notify.mp.openBody": { zh: "{direction} {qty}", en: "{direction} {qty}" },
  "notify.mp.closeBody": { zh: "已平仓 {qty} ({direction})", en: "Closed {qty} ({direction})" },
  "notify.mp.increaseBody": {
    zh: "{direction} +{delta} → {qty}",
    en: "{direction} +{delta} → {qty}",
  },
  "notify.mp.reduceBody": { zh: "{direction} -{delta} → {qty}", en: "{direction} -{delta} → {qty}" },
  "notify.mp.reverseBody": { zh: "{transition} {qty}", en: "{transition} {qty}" },
  "common.direction.longToShort": { zh: "多→空", en: "long → short" },
  "common.direction.shortToLong": { zh: "空→多", en: "short → long" },
  // --- strategy/maker-points-defense (stale-reason summary) ---
  "defense.reason.depth": { zh: "StandX深度({seconds}s)", en: "StandX depth ({seconds}s)" },
  "defense.reason.account": { zh: "StandX账户({seconds}s)", en: "StandX account ({seconds}s)" },
  "defense.reason.accountInvalid": {
    zh: "StandX仓位数据异常({issues})",
    en: "StandX position data invalid ({issues})",
  },
  "defense.reason.rest": { zh: "StandX REST错误({count}次)", en: "StandX REST errors ({count})" },
  "defense.reason.marginMode": { zh: "保证金模式({mode})", en: "Margin mode ({mode})" },
  "defense.reason.binanceDepth": { zh: "Binance深度({seconds}s)", en: "Binance depth ({seconds}s)" },
  "defense.reason.binanceBook": {
    zh: "Binance簿记异常({reason})",
    en: "Binance order book unhealthy ({reason})",
  },
  "defense.reason.unknown": { zh: "unknown", en: "unknown" },
};

const formatTemplate = (template: string, params: Record<string, unknown>): string => {
  return template.replace(/\{(\w+)\}/g, (_match, key) => {
    const value = params[key];
    return value === undefined || value === null ? `{${key}}` : String(value);
  });
};

export type TranslationKey = keyof typeof translations | string;

export function t(key: TranslationKey, params: Record<string, unknown> = {}, lang: Language = language): string {
  const entry = translations[key as keyof typeof translations];
  const value = entry ? entry[lang] ?? entry.zh : null;
  if (typeof value === "function") {
    return value(params, lang);
  }
  if (typeof value === "string") {
    return Object.keys(params).length ? formatTemplate(value, params) : value;
  }
  // Fallback: return key to surface missing translations
  return String(key);
}

export function isEnglish(lang: Language = language): boolean {
  return lang === "en";
}
