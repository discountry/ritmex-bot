import type { ExchangeAdapter } from "./adapter";
import type { Order } from "./types";
import { SUPPORTED_EXCHANGE_IDS, type SupportedExchangeId } from "./create-adapter";
import type {
  BaseOrderIntent,
  ClosePositionIntent,
  LimitOrderIntent,
  MarketOrderIntent,
  StopOrderIntent,
  TrailingStopOrderIntent,
} from "./order-schema";
import * as asterOrders from "./aster/order";
import * as backpackOrders from "./backpack/order";
import * as grvtOrders from "./grvt/order";
import * as lighterOrders from "./lighter/order";
import * as paradexOrders from "./paradex/order";
import * as nadoOrders from "./nado/order";
import * as standxOrders from "./standx/order";
import * as binanceOrders from "./binance/order";
import * as ondoperpsOrders from "./ondoperps/order";

type ExchangeKey = SupportedExchangeId;

interface ExchangeOrderHandlers {
  limit(intent: LimitOrderIntent): Promise<Order>;
  market(intent: MarketOrderIntent): Promise<Order>;
  stop(intent: StopOrderIntent): Promise<Order>;
  trailingStop?: (intent: TrailingStopOrderIntent) => Promise<Order>;
  close(intent: ClosePositionIntent): Promise<Order>;
}

const handlerMap: Record<ExchangeKey, ExchangeOrderHandlers> = {
  aster: {
    limit: asterOrders.createLimitOrder,
    market: asterOrders.createMarketOrder,
    stop: asterOrders.createStopOrder,
    trailingStop: asterOrders.createTrailingStopOrder,
    close: asterOrders.createClosePositionOrder,
  },
  backpack: {
    limit: backpackOrders.createLimitOrder,
    market: backpackOrders.createMarketOrder,
    stop: backpackOrders.createStopOrder,
    trailingStop: backpackOrders.createTrailingStopOrder,
    close: backpackOrders.createClosePositionOrder,
  },
  grvt: {
    limit: grvtOrders.createLimitOrder,
    market: grvtOrders.createMarketOrder,
    stop: grvtOrders.createStopOrder,
    trailingStop: grvtOrders.createTrailingStopOrder,
    close: grvtOrders.createClosePositionOrder,
  },
  lighter: {
    limit: lighterOrders.createLimitOrder,
    market: lighterOrders.createMarketOrder,
    stop: lighterOrders.createStopOrder,
    trailingStop: lighterOrders.createTrailingStopOrder,
    close: lighterOrders.createClosePositionOrder,
  },
  paradex: {
    limit: paradexOrders.createLimitOrder,
    market: paradexOrders.createMarketOrder,
    stop: paradexOrders.createStopOrder,
    trailingStop: paradexOrders.createTrailingStopOrder,
    close: paradexOrders.createClosePositionOrder,
  },
  nado: {
    limit: nadoOrders.createLimitOrder,
    market: nadoOrders.createMarketOrder,
    stop: nadoOrders.createStopOrder,
    trailingStop: nadoOrders.createTrailingStopOrder,
    close: nadoOrders.createClosePositionOrder,
  },
  standx: {
    limit: standxOrders.createLimitOrder,
    market: standxOrders.createMarketOrder,
    stop: standxOrders.createStopOrder,
    trailingStop: standxOrders.createTrailingStopOrder,
    close: standxOrders.createClosePositionOrder,
  },
  binance: {
    limit: binanceOrders.createLimitOrder,
    market: binanceOrders.createMarketOrder,
    stop: binanceOrders.createStopOrder,
    trailingStop: binanceOrders.createTrailingStopOrder,
    close: binanceOrders.createClosePositionOrder,
  },
  ondoperps: {
    limit: ondoperpsOrders.createLimitOrder,
    market: ondoperpsOrders.createMarketOrder,
    stop: ondoperpsOrders.createStopOrder,
    trailingStop: ondoperpsOrders.createTrailingStopOrder,
    close: ondoperpsOrders.createClosePositionOrder,
  },
};

const knownExchanges: ExchangeKey[] = [...SUPPORTED_EXCHANGE_IDS];

function normalizeExchangeId(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return normalized === "ondoperp" ? "ondoperps" : normalized;
}

function resolveExchangeKey(adapter: ExchangeAdapter): ExchangeKey {
  const fromEnv = normalizeExchangeId(process.env.TRADE_EXCHANGE ?? process.env.EXCHANGE);
  const candidates = [fromEnv, normalizeExchangeId(adapter.id)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (knownExchanges.includes(candidate as ExchangeKey)) {
      return candidate as ExchangeKey;
    }
  }
  throw new Error(
    `Unsupported exchange for order routing: ${candidates.filter(Boolean).join(", ") || "unknown"}`
  );
}

function getHandlers(intent: BaseOrderIntent): ExchangeOrderHandlers {
  const exchangeKey = resolveExchangeKey(intent.adapter);
  const handlers = handlerMap[exchangeKey];
  if (!handlers) {
    throw new Error(`Order handlers not implemented for exchange: ${exchangeKey}`);
  }
  return handlers;
}

export function routeLimitOrder(intent: LimitOrderIntent): Promise<Order> {
  return getHandlers(intent).limit(intent);
}

export function routeMarketOrder(intent: MarketOrderIntent): Promise<Order> {
  return getHandlers(intent).market(intent);
}

export function routeStopOrder(intent: StopOrderIntent): Promise<Order> {
  return getHandlers(intent).stop(intent);
}

export function routeTrailingStopOrder(intent: TrailingStopOrderIntent): Promise<Order> {
  const handlers = getHandlers(intent);
  if (!handlers.trailingStop) {
    throw new Error("Trailing stop orders are not supported by the current exchange");
  }
  return handlers.trailingStop(intent);
}

export function routeCloseOrder(intent: ClosePositionIntent): Promise<Order> {
  return getHandlers(intent).close(intent);
}
