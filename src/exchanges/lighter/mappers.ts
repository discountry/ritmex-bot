import type {
  AsterAccountAsset,
  AsterAccountPosition,
  AsterAccountSnapshot,
  AsterDepth,
  AsterDepthLevel,
  AsterKline,
  AsterOrder,
  AsterTicker,
  OrderSide,
  OrderType,
} from "../types";
import type {
  LighterAccountDetails,
  LighterKline,
  LighterMarketStats,
  LighterOrder,
  LighterOrderBookLevel,
  LighterOrderBookSnapshot,
  LighterPosition,
} from "./types";
import { coerceBooleanFlag, normalizeBooleanFlag } from "./flags";
import { normalizeOrderIdentity } from "./order-identity";
import { normalizeOrderStatus } from "./status";

export function toDepth(symbol: string, snapshot: LighterOrderBookSnapshot): AsterDepth {
  const toLevels = (levels: LighterOrderBookLevel[]): AsterDepthLevel[] =>
    levels.map((level) => [level.price, level.size]);
  return {
    symbol,
    lastUpdateId: snapshot.offset ?? Date.now(),
    bids: toLevels(snapshot.bids ?? []),
    asks: toLevels(snapshot.asks ?? []),
    eventTime: Date.now(),
    eventType: "lighterDepth",
  };
}

export function toTicker(symbol: string, stats: LighterMarketStats): AsterTicker {
  return {
    symbol,
    eventType: "lighterTicker",
    eventTime: Date.now(),
    lastPrice: stats.last_trade_price,
    openPrice: stats.daily_price_low != null ? String(stats.daily_price_low) : stats.last_trade_price,
    highPrice: stats.daily_price_high != null ? String(stats.daily_price_high) : stats.last_trade_price,
    lowPrice: stats.daily_price_low != null ? String(stats.daily_price_low) : stats.last_trade_price,
    volume: stats.daily_base_token_volume != null ? String(stats.daily_base_token_volume) : "0",
    quoteVolume: stats.daily_quote_token_volume != null ? String(stats.daily_quote_token_volume) : "0",
    priceChange: stats.daily_price_change != null ? String(stats.daily_price_change) : undefined,
    markPrice: stats.mid_price ?? stats.mark_price ?? stats.index_price,
    weightedAvgPrice: undefined,
  } as AsterTicker;
}

export function toKlines(symbol: string, interval: string, klines: LighterKline[]): AsterKline[] {
  return klines.map((entry) => ({
    symbol,
    eventType: "lighterKline",
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
  const booleanIsAsk = normalizeBooleanFlag(order.is_ask);
  const normalizedSide = order.side?.toLowerCase();
  const side: OrderSide =
    booleanIsAsk != null
      ? booleanIsAsk
        ? "SELL"
        : "BUY"
      : normalizedSide === "sell" || normalizedSide === "ask"
        ? "SELL"
        : "BUY";
  const reduceOnly = coerceBooleanFlag(order.reduce_only, false);
  const orderIndex =
    normalizeOrderIdentity(order.order_id) ??
    normalizeOrderIdentity(order.order_index) ??
    normalizeOrderIdentity(order.client_order_index) ??
    normalizeOrderIdentity(order.client_order_id) ??
    "";
  const clientIndex =
    normalizeOrderIdentity(order.client_order_id) ??
    normalizeOrderIdentity(order.client_order_index) ??
    "";
  return {
    // Use string order id to avoid precision loss; prefer on-chain order_index for cancellation
    orderId: orderIndex,
    clientOrderId: clientIndex || orderIndex,
    symbol,
    side,
    type: mapOrderType(order.type),
    status: normalizeOrderStatus(order.status ?? order.trigger_status ?? "UNKNOWN"),
    price: order.price ?? "0",
    origQty: order.initial_base_amount ?? "0",
    executedQty: computeExecutedQty(order),
    stopPrice: order.trigger_price ?? "0",
    time: order.created_at ?? Date.now(),
    updateTime: order.updated_at ?? Date.now(),
    reduceOnly,
    closePosition: reduceOnly,
    workingType: "MARK_PRICE",
    activationPrice: order.trigger_price,
  };
}

function computeExecutedQty(order: LighterOrder): string {
  if (order.filled_base_amount) return order.filled_base_amount;
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
  return "0";
}

function mapOrderType(value?: string): OrderType {
  if (!value) return "LIMIT";
  const normalized = value.toLowerCase();
  switch (normalized) {
    case "limit":
      return "LIMIT";
    case "market":
      return "MARKET";
    case "stop_loss":
    case "stop_loss_market":
      return "STOP_MARKET";
    case "stop_loss_limit":
      return "LIMIT";
    case "take_profit":
    case "take_profit_market":
      return "STOP_MARKET";
    case "take_profit_limit":
      return "LIMIT";
    default:
      return "LIMIT";
  }
}

export function toAccountSnapshot(
  symbol: string,
  details: LighterAccountDetails,
  positions: LighterPosition[] = [],
  assets: AsterAccountAsset[] = [],
  options?: {
    marketSymbol?: string | null;
    marketId?: number | null;
    marketType?: string | null;
    baseAssetSymbol?: string | null;
    quoteAssetSymbol?: string | null;
    baseAssetId?: number | null;
    quoteAssetId?: number | null;
  }
): AsterAccountSnapshot {
  const targetSymbol = options?.marketSymbol ?? null;
  const targetMarketId =
    options?.marketId != null && Number.isFinite(Number(options.marketId))
      ? Number(options.marketId)
      : null;
  const filteredPositions = positions.filter((position) => {
    if (targetMarketId != null) {
      const positionMarketId = Number(position.market_id);
      if (Number.isFinite(positionMarketId)) {
        return positionMarketId === targetMarketId;
      }
      return targetSymbol ? symbolsMatch(position.symbol, targetSymbol) : false;
    }
    if (targetSymbol) {
      return symbolsMatch(position.symbol, targetSymbol);
    }
    return true;
  });
  const transformedPositions = filteredPositions.map((position) => lighterPositionToAster(symbol, position));
  if (!transformedPositions.length && normalizeMarketType(options?.marketType) === "spot") {
    const baseSymbol = options?.baseAssetSymbol ?? options?.marketSymbol ?? symbol;
    const baseAsset = findAsset(assets, baseSymbol);
    const baseSize = Number(baseAsset?.walletBalance ?? 0);
    if (Number.isFinite(baseSize) && baseSize > 0) {
      transformedPositions.push({
        symbol,
        positionAmt: baseSize.toString(),
        entryPrice: "0",
        unrealizedProfit: "0",
        positionSide: "BOTH",
        updateTime: Date.now(),
      });
    }
  }
  const aggregateUnrealized = transformedPositions.reduce((acc, pos) => acc + Number(pos.unrealizedProfit ?? 0), 0);
  const assetList = assets.length ? assets : defaultAsset(details, options?.quoteAssetSymbol ?? "USDC");
  const totalWallet = computeTotalWalletBalance(assetList, details);
  return {
    canTrade: details.status !== 0,
    canDeposit: true,
    canWithdraw: true,
    updateTime: Date.now(),
    totalWalletBalance: totalWallet,
    availableBalance: details.available_balance ?? undefined,
    totalUnrealizedProfit: aggregateUnrealized.toFixed(8),
    positions: transformedPositions,
    assets: assetList,
    marketType: normalizeMarketType(options?.marketType),
    baseAsset: options?.baseAssetSymbol ?? undefined,
    quoteAsset: options?.quoteAssetSymbol ?? undefined,
    baseAssetId: options?.baseAssetId ?? undefined,
    quoteAssetId: options?.quoteAssetId ?? undefined,
  };
}

function defaultAsset(details: LighterAccountDetails, quoteAsset: string): AsterAccountAsset[] {
  return [
    {
      asset: quoteAsset || "USDC",
      walletBalance: details.collateral ?? "0",
      availableBalance: details.available_balance ?? details.collateral ?? "0",
      updateTime: Date.now(),
    },
  ];
}

function computeTotalWalletBalance(assets: AsterAccountAsset[], details: LighterAccountDetails): string {
  const sum = assets.reduce((acc, asset) => acc + Number(asset.walletBalance ?? 0), 0);
  if (Number.isFinite(sum) && sum > 0) {
    return sum.toString();
  }
  return details.total_asset_value ?? details.collateral ?? "0";
}

function findAsset(assets: AsterAccountAsset[], target: string | undefined | null): AsterAccountAsset | undefined {
  if (!target) return undefined;
  const normalizedTarget = target.toUpperCase().split(/[-:/]/)[0];
  return assets.find((asset) => asset.asset.toUpperCase().split(/[-:/]/)[0] === normalizedTarget);
}

function normalizeMarketType(value: string | null | undefined): "perp" | "spot" | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (normalized === "spot") return "spot";
  if (normalized === "perp" || normalized === "perpetual" || normalized === "futures") return "perp";
  return undefined;
}

function lighterPositionToAster(symbol: string, position: LighterPosition): AsterAccountPosition {
  const sign = position.sign ?? 0;
  const positionSide = sign > 0 ? "LONG" : sign < 0 ? "SHORT" : "BOTH";
  const magnitude = Number(position.position ?? 0);
  // Normalize: when sign is 0, treat as flat regardless of reported magnitude
  const signed = sign === 0 ? 0 : sign < 0 ? -Math.abs(magnitude) : Math.abs(magnitude);
  return {
    symbol,
    positionAmt: Number.isFinite(signed) ? signed.toString() : position.position ?? "0",
    entryPrice: position.avg_entry_price ?? "0",
    unrealizedProfit: position.unrealized_pnl ?? "0",
    positionSide,
    updateTime: Date.now(),
    liquidationPrice: position.liquidation_price,
    maintMargin: undefined,
    initialMargin: position.allocated_margin,
    marginType: position.margin_mode === 1 ? "ISOLATED" : "CROSS",
    markPrice: undefined,
  };
}

function symbolsMatch(source: string | null | undefined, target: string | null | undefined): boolean {
  if (!source || !target) return false;
  const sourceForms = normalizeSymbolForms(source);
  const targetForms = normalizeSymbolForms(target);
  if (!sourceForms.length || !targetForms.length) return false;
  return sourceForms.some((value) => targetForms.includes(value));
}

function normalizeSymbolForms(value: string): string[] {
  const upper = value.toUpperCase();
  const sanitized = upper.replace(/[^A-Z0-9]/g, "");
  const parts = upper.split(/[-:/]/).filter(Boolean);
  const base = parts.length ? parts[0] : "";
  const forms = new Set<string>();
  if (upper) forms.add(upper);
  if (sanitized) forms.add(sanitized);
  if (base) forms.add(base);
  return Array.from(forms);
}
