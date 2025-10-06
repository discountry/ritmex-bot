import type { AsterAccountAsset, AsterAccountPosition, AsterAccountSnapshot, AsterDepth, AsterDepthLevel, AsterKline, AsterOrder, AsterTicker, OrderSide, OrderType } from '../types';
import type { LighterAccountDetails, LighterKline, LighterMarketStats, LighterOrder, LighterOrderBookLevel, LighterOrderBookSnapshot, LighterPosition } from './types';

export function toDepth(symbol: string, snapshot: LighterOrderBookSnapshot): AsterDepth {
   const toLevels = (levels: LighterOrderBookLevel[]): AsterDepthLevel[] => levels.map((level) => [level.price, level.size]);
   return { symbol, lastUpdateId: snapshot.offset ?? Date.now(), bids: toLevels(snapshot.bids ?? []), asks: toLevels(snapshot.asks ?? []), eventTime: Date.now(), eventType: 'lighterDepth' };
}

export function toTicker(symbol: string, stats: LighterMarketStats): AsterTicker {
   return {
      symbol,
      eventType: 'lighterTicker',
      eventTime: Date.now(),
      lastPrice: stats.last_trade_price,
      openPrice: stats.daily_price_low !== null ? String(stats.daily_price_low) : stats.last_trade_price,
      highPrice: stats.daily_price_high !== null ? String(stats.daily_price_high) : stats.last_trade_price,
      lowPrice: stats.daily_price_low !== null ? String(stats.daily_price_low) : stats.last_trade_price,
      volume: stats.daily_base_token_volume !== null ? String(stats.daily_base_token_volume) : '0',
      quoteVolume: stats.daily_quote_token_volume !== null ? String(stats.daily_quote_token_volume) : '0',
      priceChange: stats.daily_price_change !== null ? String(stats.daily_price_change) : undefined,
      markPrice: undefined,
      weightedAvgPrice: undefined,
   } as AsterTicker;
}

export function toKlines(symbol: string, interval: string, klines: LighterKline[]): AsterKline[] {
   return klines.map((entry) => ({
      symbol,
      eventType: 'lighterKline',
      eventTime: Date.now(),
      interval,
      openTime: entry.start_timestamp,
      closeTime: entry.end_timestamp,
      open: entry.open,
      high: entry.high,
      low: entry.low,
      close: entry.close,
      volume: entry.base_token_volume,
      quoteAssetVolume: entry.quote_token_volume,
      numberOfTrades: entry.trades ?? 0,
      isClosed: true,
   }));
}

export function toOrders(symbol: string, orders: LighterOrder[]): AsterOrder[] {
   return orders.map((order) => lighterOrderToAster(symbol, order));
}

export function lighterOrderToAster(symbol: string, order: LighterOrder): AsterOrder {
   const side: OrderSide = order.is_ask || order.side?.toLowerCase() === 'sell' || order.side?.toLowerCase() === 'ask' ? 'SELL' : 'BUY';
   return {
      orderId: order.order_index,
      clientOrderId: String(order.client_order_index ?? order.order_index ?? ''),
      symbol,
      side,
      type: mapOrderType(order.type),
      status: order.status ?? order.trigger_status ?? 'UNKNOWN',
      price: order.price ?? '0',
      origQty: order.initial_base_amount ?? '0',
      executedQty: computeExecutedQty(order),
      stopPrice: order.trigger_price ?? '0',
      time: order.created_at ?? Date.now(),
      updateTime: order.updated_at ?? Date.now(),
      reduceOnly: Boolean(order.reduce_only),
      closePosition: Boolean(order.reduce_only ?? order.owner_account_index === undefined ? false : order.is_ask),
      workingType: 'MARK_PRICE',
      activationPrice: order.trigger_price,
   };
}

function computeExecutedQty(order: LighterOrder): string {
   if (order.filled_base_amount) { return order.filled_base_amount; }
   if (order.initial_base_amount && order.remaining_base_amount) {
      try {
         const initial = Number(order.initial_base_amount);
         const remaining = Number(order.remaining_base_amount);
         if (Number.isFinite(initial) && Number.isFinite(remaining)) {
            return (initial - remaining).toString();
         }
      } catch (_) {
         // fall through
      }
   }
   return '0';
}

function mapOrderType(value?: string): OrderType {
   if (!value) { return 'LIMIT'; }
   const normalized = value.toLowerCase();
   switch (normalized) {
      case 'limit':
         return 'LIMIT';
      case 'market':
         return 'MARKET';
      case 'stop_loss':
      case 'stop_loss_market':
         return 'STOP_MARKET';
      case 'stop_loss_limit':
         return 'LIMIT';
      case 'take_profit':
      case 'take_profit_market':
         return 'STOP_MARKET';
      case 'take_profit_limit':
         return 'LIMIT';
      default:
         return 'LIMIT';
   }
}

export function toAccountSnapshot(symbol: string, details: LighterAccountDetails, positions: LighterPosition[] = [], assets: AsterAccountAsset[] = []): AsterAccountSnapshot {
   const transformedPositions = positions.map((position) => lighterPositionToAster(symbol, position));
   const aggregateUnrealized = transformedPositions.reduce((acc, pos) => acc + Number(pos.unrealizedProfit ?? 0), 0);
   const assetList = assets.length ? assets : defaultAsset(details);
   return {
      canTrade: details.status !== 0,
      canDeposit: true,
      canWithdraw: true,
      updateTime: Date.now(),
      totalWalletBalance: details.collateral ?? '0',
      totalUnrealizedProfit: aggregateUnrealized.toFixed(8),
      positions: transformedPositions,
      assets: assetList,
   };
}

function defaultAsset(details: LighterAccountDetails): AsterAccountAsset[] {
   return [{ asset: 'USDC', walletBalance: details.collateral ?? '0', availableBalance: details.available_balance ?? details.collateral ?? '0', updateTime: Date.now() }];
}

function lighterPositionToAster(symbol: string, position: LighterPosition): AsterAccountPosition {
   const sign = position.sign ?? 0;
   const positionSide = sign > 0 ? 'LONG' : sign < 0 ? 'SHORT' : 'BOTH';
   const magnitude = Number(position.position ?? 0);
   // Normalize: when sign is 0, treat as flat regardless of reported magnitude
   const signed = sign === 0 ? 0 : sign < 0 ? -Math.abs(magnitude) : Math.abs(magnitude);
   return {
      symbol,
      positionAmt: Number.isFinite(signed) ? signed.toString() : position.position ?? '0',
      entryPrice: position.avg_entry_price ?? '0',
      unrealizedProfit: position.unrealized_pnl ?? '0',
      positionSide,
      updateTime: Date.now(),
      liquidationPrice: position.liquidation_price,
      maintMargin: undefined,
      initialMargin: position.allocated_margin,
      marginType: position.margin_mode === 1 ? 'ISOLATED' : 'CROSS',
      markPrice: undefined,
   };
}
