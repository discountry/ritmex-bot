import type { AsterOrder, CreateOrderParams } from '../../src/exchanges/types';
import type { Kline } from './csv-loader';

/**
 * 模拟订单成交逻辑
 *
 * 规则:
 * - 买单: 当 K线最低价 <= 挂单价格时成交
 * - 卖单: 当 K线最高价 >= 挂单价格时成交
 */
export function simulateOrderExecution(currentOrders: AsterOrder[], kline: Kline, onFilled: (order: AsterOrder) => void): void {
   for (const order of currentOrders) {
      if (order.status !== 'NEW') { continue; }

      const price = Number(order.price);
      let filled = false;

      // 买单: K线最低价触及
      if (order.side === 'BUY' && kline.low <= price) {
         filled = true;
      }

      // 卖单: K线最高价触及
      if (order.side === 'SELL' && kline.high >= price) {
         filled = true;
      }

      if (filled) {
         const filledOrder: AsterOrder = { ...order, status: 'FILLED', executedQty: order.origQty, updateTime: kline.timestamp };
         onFilled(filledOrder);
      }
   }
}

/**
 * 回测统计数据
 */
export interface BacktestStats {
   totalTrades: number;
   profitTrades: number;
   lossTrades: number;
   breakEvenTrades: number;
   totalPnL: number;
   winRate: number;
   avgProfit: number;
   avgLoss: number;
   profitFactor: number;
   maxDrawdown: number;
   trades: TradeRecord[];
}

export interface TradeRecord {
   type: 'LONG' | 'SHORT';
   entryPrice: number;
   exitPrice: number;
   quantity: number;
   pnl: number;
   pnlPercent: number;
   entryTime?: number;
   exitTime?: number;
}

/**
 * 从订单历史计算回测统计
 */
export function calculateBacktestStats(orders: CreateOrderParams[]): BacktestStats {
   const trades: TradeRecord[] = [];
   const buyOrders = orders.filter(o => o.side === 'BUY');
   const sellOrders = orders.filter(o => o.side === 'SELL');

   // 配对成交记录（简化版本：按顺序配对）
   const pairs = Math.min(buyOrders.length, sellOrders.length);

   for (let i = 0; i < pairs; i++) {
      const buy = buyOrders[i]!;
      const sell = sellOrders[i]!;

      if (!buy.price || !sell.price || !buy.quantity) { continue; }

      const entryPrice = Number(buy.price);
      const exitPrice = Number(sell.price);
      const quantity = Number(buy.quantity);
      const pnl = (exitPrice - entryPrice) * quantity;
      const pnlPercent = (exitPrice - entryPrice) / entryPrice;

      trades.push({ type: 'LONG', entryPrice, exitPrice, quantity, pnl, pnlPercent });
   }

   // 统计指标
   const profitTrades = trades.filter(t => t.pnl > 0);
   const lossTrades = trades.filter(t => t.pnl < 0);
   const breakEvenTrades = trades.filter(t => t.pnl === 0);

   const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
   const winRate = trades.length > 0 ? profitTrades.length / trades.length : 0;

   const avgProfit = profitTrades.length > 0 ? profitTrades.reduce((sum, t) => sum + t.pnl, 0) / profitTrades.length : 0;
   const avgLoss = lossTrades.length > 0 ? Math.abs(lossTrades.reduce((sum, t) => sum + t.pnl, 0) / lossTrades.length) : 0;

   const profitFactor = avgLoss > 0 ? avgProfit / avgLoss : 0;

   // 计算最大回撤
   let peak = 0;
   let maxDrawdown = 0;
   let cumPnL = 0;

   for (const trade of trades) {
      cumPnL += trade.pnl;
      if (cumPnL > peak) {
         peak = cumPnL;
      }
      const drawdown = peak - cumPnL;
      if (drawdown > maxDrawdown) {
         maxDrawdown = drawdown;
      }
   }

   return { totalTrades: trades.length, profitTrades: profitTrades.length, lossTrades: lossTrades.length, breakEvenTrades: breakEvenTrades.length, totalPnL, winRate, avgProfit, avgLoss, profitFactor, maxDrawdown, trades };
}

/**
 * 格式化回测统计报告
 */
export function formatBacktestReport(stats: BacktestStats): string {
   const lines = [
      '=== 回测统计报告 ===',
      '',
      `总交易次数: ${stats.totalTrades}`,
      `盈利交易: ${stats.profitTrades} (${(stats.winRate * 100).toFixed(2)}%)`,
      `亏损交易: ${stats.lossTrades}`,
      `持平交易: ${stats.breakEvenTrades}`,
      '',
      `总盈亏: ${stats.totalPnL.toFixed(4)}`,
      `平均盈利: ${stats.avgProfit.toFixed(4)}`,
      `平均亏损: ${stats.avgLoss.toFixed(4)}`,
      `盈亏比: ${stats.profitFactor.toFixed(2)}`,
      `最大回撤: ${stats.maxDrawdown.toFixed(4)}`,
   ];

   if (stats.trades.length > 0 && stats.trades.length <= 10) {
      lines.push('', '=== 交易明细 ===');
      for (const [i, trade] of stats.trades.entries()) {
         lines.push(`Trade ${i + 1}: ${trade.type} ${trade.quantity} @ ${trade.entryPrice} → ${trade.exitPrice} | PnL: ${trade.pnl.toFixed(4)} (${(trade.pnlPercent * 100).toFixed(2)}%)`);
      }
   }

   return lines.join('\n');
}

/**
 * 检测是否应该触发止损
 */
export function shouldTriggerStopLoss(klines: Kline[], lowerPrice: number, upperPrice: number, stopLossPct: number): boolean {
   if (klines.length === 0) { return false; }

   const latestPrice = klines[klines.length - 1]!.close;
   const lowerTrigger = lowerPrice * (1 - stopLossPct);
   const upperTrigger = upperPrice * (1 + stopLossPct);

   return latestPrice <= lowerTrigger || latestPrice >= upperTrigger;
}
