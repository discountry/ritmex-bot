import type { ExchangeAdapter } from "./adapter";
import type { AsterOrder } from "./types";
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

type ExchangeKey = "aster" | "backpack" | "grvt" | "lighter" | "paradex" | "nado" | "standx";

interface ExchangeOrderHandlers {
  limit(intent: LimitOrderIntent): Promise<AsterOrder>;
  market(intent: MarketOrderIntent): Promise<AsterOrder>;
  stop(intent: StopOrderIntent): Promise<AsterOrder>;
  trailingStop?: (intent: TrailingStopOrderIntent) => Promise<AsterOrder>;
  close(intent: ClosePositionIntent): Promise<AsterOrder>;
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
};

const knownExchanges: ExchangeKey[] = [
  "aster",
  "backpack",
  "grvt",
  "lighter",
  "paradex",
  "nado",
  "standx",
];

function normalizeExchangeId(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  return value.trim().toLowerCase();
}

function resolveExchangeKey(adapter: ExchangeAdapter): ExchangeKey {
  const fromEnv = normalizeExchangeId(process.env.TRADE_EXCHANGE ?? process.env.EXCHANGE);
  const candidates = [fromEnv, normalizeExchangeId(adapter.id)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if ((knownExchanges as string[]).includes(candidate)) {
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

export function routeLimitOrder(intent: LimitOrderIntent): Promise<AsterOrder> {
  return getHandlers(intent).limit(intent);
}

export function routeMarketOrder(intent: MarketOrderIntent): Promise<AsterOrder> {
  return getHandlers(intent).market(intent);
}

export function routeStopOrder(intent: StopOrderIntent): Promise<AsterOrder> {
  return getHandlers(intent).stop(intent);
}

export function routeTrailingStopOrder(intent: TrailingStopOrderIntent): Promise<AsterOrder> {
  const handlers = getHandlers(intent);
  if (!handlers.trailingStop) {
    throw new Error("Trailing stop orders are not supported by the current exchange");
  }
  return handlers.trailingStop(intent);
}

export function routeCloseOrder(intent: ClosePositionIntent): Promise<AsterOrder> {
  return getHandlers(intent).close(intent);
}
