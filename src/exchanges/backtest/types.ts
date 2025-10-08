import type { AsterOrder, OrderSide } from '../types';

/**
 * Configuration for backtest adapter
 */
export interface BacktestConfig {
   /** Initial balance in quote currency (e.g., USDT) */
   initialBalance: number;
   /** Trading fee rate (e.g., 0.0005 = 0.05%) */
   feeRate: number;
   /** Trading symbol (e.g., 'BTCUSDT') */
   symbol: string;
   /** Optional slippage simulation */
   slippage?: number;
}

/**
 * Internal order record with execution details
 */
export interface OrderRecord {
   /** The order object */
   order: AsterOrder;
   /** Order creation timestamp */
   createTime: number;
   /** Order fill timestamp (if filled) */
   fillTime?: number;
   /** Actual fill price */
   fillPrice?: number;
   /** Trading fee paid */
   fee?: number;
   /** Order status */
   status: 'PENDING' | 'FILLED' | 'CANCELLED';
   /** Realized PnL for this order (if closing position) */
   pnl?: number;
}

/**
 * Trade record for statistics
 */
export interface TradeRecord {
   /** Order ID */
   orderId: string;
   /** Buy or sell */
   side: OrderSide;
   /** Execution price */
   price: number;
   /** Execution quantity */
   quantity: number;
   /** Realized profit/loss */
   pnl: number;
   /** Trading fee */
   fee: number;
   /** Execution timestamp */
   timestamp: number;
}

/**
 * Backtest statistics report
 */
export interface BacktestStatistics {
   // Basic metrics
   /** Total number of trades */
   totalTrades: number;
   /** Number of winning trades */
   winningTrades: number;
   /** Number of losing trades */
   losingTrades: number;
   /** Win rate (winning trades / total trades) */
   winRate: number;

   // PnL metrics
   /** Total profit/loss */
   totalPnl: number;
   /** Total return percentage */
   totalReturn: number;
   /** Realized profit/loss */
   realizedPnl: number;
   /** Unrealized profit/loss */
   unrealizedPnl: number;

   // Risk metrics
   /** Maximum drawdown amount */
   maxDrawdown: number;
   /** Maximum drawdown percentage */
   maxDrawdownPct: number;
   /** Peak balance in history */
   peakBalance: number;

   // Trade quality
   /** Best trade (highest profit) */
   bestTrade: TradeRecord | null;
   /** Worst trade (highest loss) */
   worstTrade: TradeRecord | null;
   /** Average winning trade */
   avgWin: number;
   /** Average losing trade */
   avgLoss: number;
   /** Profit factor (avg win / avg loss) */
   profitFactor: number;

   // Fees
   /** Total fees paid */
   totalFees: number;
}
