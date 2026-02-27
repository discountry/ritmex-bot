import NodeWebSocket from "ws";
import BigNumber from "bignumber.js";
import { IndexerClient } from "@nadohq/indexer-client";
import { TriggerClient, type PriceTriggerRequirementType } from "@nadohq/trigger-client";
import { ENGINE_WS_CLIENT_ENDPOINTS, ENGINE_WS_SUBSCRIPTION_CLIENT_ENDPOINTS } from "@nadohq/engine-client";
import type { ChainEnv, WalletClientWithAccount } from "@nadohq/shared";
import {
  getNadoEIP712Values,
  getNadoEIP712Domain,
  getSignedTransactionRequest,
  getOrderNonce,
  getOrderVerifyingAddress,
  packOrderAppendix,
} from "@nadohq/shared";
import { createWalletClient, custom, type Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type {
  AccountListener,
  DepthListener,
  FundingRateListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import type {
  AsterAccountAsset,
  AsterAccountPosition,
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
  TimeInForce,
} from "../types";
import type {
  NadoBestBidOfferEvent,
  NadoContractsResponse,
  NadoFundingRateEvent,
  NadoLatestCandlestickEvent,
  NadoOrderUpdateEvent,
  NadoPositionChangeEvent,
  NadoSubaccountInfoResponse,
  NadoSubaccountOrdersResponse,
  NadoSubscriptionAck,
  NadoSymbolsResponse,
  NadoTradeEvent,
} from "./types";

const WebSocketCtor: typeof NodeWebSocket = NodeWebSocket as unknown as typeof NodeWebSocket;

const X18 = new BigNumber("1e18");

type NadoOrderExecution = "default" | "ioc" | "fok" | "post_only";
type NadoTriggerPriceSource = "oracle" | "last" | "mid";

const DEFAULT_ACCOUNT_POLL_MS = 5_000;
const DEFAULT_ORDERS_POLL_MS = 2_000;
const DEFAULT_TRIGGER_ORDERS_POLL_MS = 5_000;
const DEFAULT_KLINES_LIMIT = 200;
const WS_PING_INTERVAL_MS = 30_000;
const WS_STALE_TIMEOUT_MS = 75_000;

const DEFAULT_MARKET_SLIPPAGE_PCT = 0.01;
const X18_BIGINT = 1_000_000_000_000_000_000n;

type MinSizePolicy = "adjust" | "reject";

export interface NadoGatewayOptions {
  env?: ChainEnv;
  symbol: string;
  subaccountOwner: Address;
  subaccountName?: string;
  signerPrivateKey: string;
  gatewayWsUrl?: string;
  subscriptionsWsUrl?: string;
  archiveUrl?: string;
  triggerUrl?: string;
  pollIntervals?: {
    account?: number;
    orders?: number;
    triggerOrders?: number;
  };
  marketSlippagePct?: number;
  stopTriggerSource?: NadoTriggerPriceSource;
  minSizePolicy?: MinSizePolicy;
  logger?: (context: string, error: unknown) => void;
}

type SymbolMeta = {
  productId: number;
  symbol: string;
  type: "spot" | "perp";
  priceIncrementX18: string;
  sizeIncrementX18: string;
  minSizeX18: string;
};

type BestBidOffer = {
  bidX18: string;
  askX18: string;
  bidQtyX18: string;
  askQtyX18: string;
  timestampNs: string;
};

type LocalOrder = {
  digest: string;
  productId: number;
  priceX18: string;
  amountX18: string;
  unfilledAmountX18: string;
  appendix?: string;
  orderType?: string;
  placedAtSec?: number;
  clientId?: number | null;
};

type TriggerOrder = {
  digest: string;
  productId: number;
  priceX18: string;
  amountX18: string;
  appendix?: string;
  trigger: { stopPriceX18: string };
  status: string;
  updatedAtMs: number;
};

type PollIntervals = {
  account: number;
  orders: number;
  triggerOrders: number;
};

function parseEnvChainEnv(value?: string | null): ChainEnv | undefined {
  const normalized = (value ?? "").trim();
  if (!normalized) return undefined;
  if (normalized === "inkMainnet" || normalized === "inkTestnet" || normalized === "local") {
    return normalized;
  }
  const lowered = normalized.toLowerCase();
  if (["mainnet", "prod", "production", "ink", "ink-mainnet"].includes(lowered)) return "inkMainnet";
  if (["testnet", "test", "sepolia", "ink-sepolia", "ink-testnet"].includes(lowered)) return "inkTestnet";
  return undefined;
}

function normalizeSymbolInput(value: string): string {
  const raw = (value ?? "").trim();
  const upper = raw.toUpperCase();
  if (!upper) return upper;
  if (/^[A-Z0-9]+USDT0$/.test(upper) && !upper.includes("-") && !upper.includes("/")) {
    const base = upper.replace(/USDT0$/, "");
    if (base) return `${base}-PERP`;
  }
  if (/^[A-Z0-9]+PERP$/.test(upper) && !upper.includes("-")) {
    const base = upper.replace(/PERP$/, "");
    if (base) return `${base}-PERP`;
  }
  return upper.replace("/", "-");
}

function toX18BigInt(value: BigNumber.Value): bigint {
  const scaled = new BigNumber(value).multipliedBy(X18).integerValue(BigNumber.ROUND_DOWN);
  return BigInt(scaled.toFixed(0));
}

function fromX18(valueX18: BigNumber.Value): BigNumber {
  return new BigNumber(valueX18).div(X18);
}

function toBigNumberFromDecimalish(value: unknown): BigNumber | null {
  if (value == null) return null;
  if (BigNumber.isBigNumber(value)) return value as BigNumber;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new BigNumber(value);
    return parsed.isFinite() ? parsed : null;
  }
  if (typeof (value as any).toFixed === "function") {
    try {
      const text = (value as any).toFixed();
      const parsed = new BigNumber(text);
      return parsed.isFinite() ? parsed : null;
    } catch {
      return null;
    }
  }
  if (typeof (value as any).toString === "function") {
    try {
      const parsed = new BigNumber(String(value));
      return parsed.isFinite() ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

function safeToNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function nowMs(): number {
  return Date.now();
}

function absBigInt(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function ceilDiv(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) {
    throw new Error("Division by zero");
  }
  const quotient = numerator / denominator;
  return numerator % denominator === 0n ? quotient : quotient + 1n;
}

function roundDownToIncrement(value: bigint, increment: bigint): bigint {
  if (increment <= 0n) return value;
  return (value / increment) * increment;
}

function roundUpToIncrement(value: bigint, increment: bigint): bigint {
  if (increment <= 0n) return value;
  const remainder = value % increment;
  if (remainder === 0n) return value;
  return value + (increment - remainder);
}

function alignPriceX18(
  priceX18: bigint,
  incrementX18: bigint,
  side: "BUY" | "SELL",
  mode: "aggressive" | "passive"
): bigint {
  if (incrementX18 <= 0n) return priceX18;
  if (mode === "aggressive") {
    return side === "BUY"
      ? roundUpToIncrement(priceX18, incrementX18)
      : roundDownToIncrement(priceX18, incrementX18);
  }
  return side === "BUY"
    ? roundDownToIncrement(priceX18, incrementX18)
    : roundUpToIncrement(priceX18, incrementX18);
}

function nsToMs(ns: string): number {
  try {
    const nanos = BigInt(ns);
    return Number(nanos / 1_000_000n);
  } catch {
    return nowMs();
  }
}

function mapTimeInForceToExecution(timeInForce: TimeInForce | undefined): NadoOrderExecution {
  switch (timeInForce) {
    case "IOC":
      return "ioc";
    case "FOK":
      return "fok";
    case "GTX":
      return "post_only";
    default:
      return "default";
  }
}

function mapExecutionToOrderType(type: NadoOrderExecution | undefined): "LIMIT" | "MARKET" {
  if (type === "ioc" || type === "fok") return "MARKET";
  return "LIMIT";
}

function parseNadoErrorCode(value: unknown): number | null {
  const code = Number(value);
  return Number.isFinite(code) ? code : null;
}

function createWalletClientFromPrivateKey(privateKey: string): WalletClientWithAccount {
  const trimmed = privateKey.trim();
  if (!/^0x[0-9a-fA-F]{64}$/.test(trimmed)) {
    throw new Error("NADO_SIGNER_PRIVATE_KEY must be a 0x-prefixed 32-byte hex string");
  }
  const account = privateKeyToAccount(trimmed as `0x${string}`);
  return createWalletClient({
    account,
    transport: custom({
      request: async () => {
        throw new Error("RPC transport is not configured for Nado signing");
      },
    }),
  });
}

export class NadoGateway {
  private readonly env: ChainEnv;
  private readonly gatewayWsUrl: string;
  private readonly subscriptionsWsUrl: string;
  private readonly archiveUrl: string;
  private readonly triggerUrl: string;
  private readonly logger: (context: string, error: unknown) => void;

  private readonly walletClient: WalletClientWithAccount;
  private readonly indexer: IndexerClient;
  private readonly trigger: TriggerClient;

  private readonly subaccountOwner: Address;
  private readonly subaccountName: string;

  private chainId: number | null = null;
  private endpointAddr: Address | null = null;

  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private readonly pollIntervals: PollIntervals;
  private readonly marketSlippagePct: number;
  private readonly stopTriggerSource: NadoTriggerPriceSource;
  private readonly minSizePolicy: MinSizePolicy;

  private readonly symbolMetaBySymbol = new Map<string, SymbolMeta>();
  private readonly symbolMetaByProductId = new Map<number, SymbolMeta>();
  private readonly displaySymbolByCanonical = new Map<string, string>();

  private readonly bestBidOfferByProductId = new Map<number, BestBidOffer>();
  private readonly lastTradePriceByProductId = new Map<number, { priceX18: string; timestampNs: string }>();
  private readonly fundingRateByProductId = new Map<number, { rateX18: string; updateTimeSec: string; timestampNs: string }>();

  private readonly openOrdersByDigest = new Map<string, LocalOrder>();
  private readonly triggerOrdersByDigest = new Map<string, TriggerOrder>();

  private accountSnapshot: AsterAccountSnapshot | null = null;
  private lastAccountSyncAt = 0;

  private gatewayWs: NodeWebSocket | null = null;
  private subscriptionWs: NodeWebSocket | null = null;
  private gatewayPingTimer: ReturnType<typeof setInterval> | null = null;
  private subscriptionPingTimer: ReturnType<typeof setInterval> | null = null;
  private gatewayLastMessageAt = 0;
  private subscriptionLastMessageAt = 0;
  private subscriptionConnectPromise: Promise<void> | null = null;
  private subscriptionReconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private subscriptionReconnectDelayMs = 1_000;

  private gatewayQueue: Promise<unknown> = Promise.resolve();

  private readonly accountListeners = new Set<AccountListener>();
  private readonly orderListeners = new Set<OrderListener>();
  private readonly depthListeners = new Map<string, Set<DepthListener>>();
  private readonly tickerListeners = new Map<string, Set<TickerListener>>();
  private readonly fundingRateListeners = new Map<string, Set<FundingRateListener>>();
  private readonly klineListeners = new Map<string, Set<KlineListener>>();

  private accountPollTimer: ReturnType<typeof setInterval> | null = null;
  private ordersPollTimer: ReturnType<typeof setInterval> | null = null;
  private triggerOrdersPollTimer: ReturnType<typeof setInterval> | null = null;
  private klinesState = new Map<string, { productId: number; periodSec: number; klines: AsterKline[] }>();

  private subscriptionRequestId = 1;
  private subscriptionAuthComplete = false;
  private readonly subscriptionStreams = new Set<string>();

  private primarySymbol: string;

  constructor(options: NadoGatewayOptions) {
    this.env = options.env ?? parseEnvChainEnv(process.env.NADO_ENV) ?? "inkMainnet";
    this.gatewayWsUrl = options.gatewayWsUrl ?? ENGINE_WS_CLIENT_ENDPOINTS[this.env];
    this.subscriptionsWsUrl =
      options.subscriptionsWsUrl ?? ENGINE_WS_SUBSCRIPTION_CLIENT_ENDPOINTS[this.env];
    this.archiveUrl =
      options.archiveUrl ??
      (process.env.NADO_ARCHIVE_URL ?? (this.env === "inkMainnet"
        ? "https://archive.prod.nado.xyz/v1"
        : "https://archive.test.nado.xyz/v1"));
    this.triggerUrl =
      options.triggerUrl ??
      (process.env.NADO_TRIGGER_URL ?? (this.env === "inkMainnet"
        ? "https://trigger.prod.nado.xyz/v1"
        : "https://trigger.test.nado.xyz/v1"));

    this.logger = options.logger ?? ((context, error) => console.error(`[NadoGateway] ${context}:`, error));
    this.walletClient = createWalletClientFromPrivateKey(options.signerPrivateKey);
    this.indexer = new IndexerClient({ url: this.archiveUrl, walletClient: this.walletClient });
    this.trigger = new TriggerClient({ url: this.triggerUrl, walletClient: this.walletClient });

    this.subaccountOwner = options.subaccountOwner;
    this.subaccountName = options.subaccountName ?? "default";

    this.pollIntervals = {
      account: options.pollIntervals?.account ?? DEFAULT_ACCOUNT_POLL_MS,
      orders: options.pollIntervals?.orders ?? DEFAULT_ORDERS_POLL_MS,
      triggerOrders: options.pollIntervals?.triggerOrders ?? DEFAULT_TRIGGER_ORDERS_POLL_MS,
    };

    const slippage = options.marketSlippagePct ?? safeToNumber(process.env.NADO_MARKET_SLIPPAGE_PCT ?? "");
    this.marketSlippagePct = Number.isFinite(slippage) && slippage > 0 ? slippage : DEFAULT_MARKET_SLIPPAGE_PCT;
    this.stopTriggerSource = options.stopTriggerSource ?? (process.env.NADO_STOP_TRIGGER_SOURCE as NadoTriggerPriceSource) ?? "oracle";
    this.minSizePolicy = options.minSizePolicy ?? ((process.env.NADO_MIN_SIZE_POLICY ?? "").trim().toLowerCase() === "reject" ? "reject" : "adjust");

    this.primarySymbol = options.symbol;
    this.rememberDisplaySymbol(this.primarySymbol);
  }

  async ensureInitialized(symbol?: string): Promise<void> {
    if (symbol) {
      this.primarySymbol = symbol;
      this.rememberDisplaySymbol(symbol);
    }
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.doInitialize().then(
      () => {
        this.initialized = true;
      },
      (error) => {
        this.initPromise = null;
        throw error;
      }
    );
    return this.initPromise;
  }

  onAccount(listener: AccountListener): () => void {
    this.accountListeners.add(listener);
    if (this.accountSnapshot) {
      listener(this.accountSnapshot);
    }

    void this.ensureInitialized()
      .then(() => this.ensureSubscriptionConnected())
      .then(() => this.ensureAccountStreamsForListeners())
      .catch((error) => this.logger("account:subscribe", error));

    return () => {
      this.accountListeners.delete(listener);
    };
  }

  onOrders(listener: OrderListener): () => void {
    this.orderListeners.add(listener);
    // Emit current view if we have one.
    if (this.openOrdersByDigest.size > 0 || this.triggerOrdersByDigest.size > 0) {
      listener(this.buildAsterOrdersSnapshot());
    }

    void this.ensureInitialized()
      .then(() => this.ensureSubscriptionConnected())
      .then(() => this.ensureAccountStreamsForListeners())
      .catch((error) => this.logger("orders:subscribe", error));

    return () => {
      this.orderListeners.delete(listener);
    };
  }

  onDepth(symbol: string, listener: DepthListener): () => void {
    const key = this.rememberDisplaySymbol(symbol);
    const set = this.depthListeners.get(key) ?? new Set();
    set.add(listener);
    this.depthListeners.set(key, set);
    const meta = this.symbolMetaBySymbol.get(key);
    if (meta) {
      const snapshot = this.buildDepthSnapshot(meta.productId, this.resolveDisplaySymbol(key, meta.symbol));
      if (snapshot) listener(snapshot);
    }

    void this.ensureInitialized()
      .then(() => this.ensureSubscriptionConnected())
      .then(() => this.ensureMarketStreamsForListeners())
      .catch((error) => this.logger("depth:subscribe", error));

    return () => {
      const listeners = this.depthListeners.get(key);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) this.depthListeners.delete(key);
      }
    };
  }

  onTicker(symbol: string, listener: TickerListener): () => void {
    const key = this.rememberDisplaySymbol(symbol);
    const set = this.tickerListeners.get(key) ?? new Set();
    set.add(listener);
    this.tickerListeners.set(key, set);
    const meta = this.symbolMetaBySymbol.get(key);
    if (meta) {
      const snapshot = this.buildTickerSnapshot(meta.productId, this.resolveDisplaySymbol(key, meta.symbol));
      if (snapshot) listener(snapshot);
    }

    void this.ensureInitialized()
      .then(() => this.ensureSubscriptionConnected())
      .then(() => this.ensureMarketStreamsForListeners())
      .catch((error) => this.logger("ticker:subscribe", error));

    return () => {
      const listeners = this.tickerListeners.get(key);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) this.tickerListeners.delete(key);
      }
    };
  }

  onFundingRate(symbol: string, listener: FundingRateListener): () => void {
    const key = this.rememberDisplaySymbol(symbol);
    const set = this.fundingRateListeners.get(key) ?? new Set();
    set.add(listener);
    this.fundingRateListeners.set(key, set);

    const meta = this.symbolMetaBySymbol.get(key);
    if (meta) {
      const cached = this.fundingRateByProductId.get(meta.productId);
      if (cached) {
        const updateSec = Number(cached.updateTimeSec);
        const updateTime = Number.isFinite(updateSec) ? updateSec * 1000 : nsToMs(cached.timestampNs);
        const fundingRate = fromX18(cached.rateX18).toNumber();
        if (Number.isFinite(fundingRate)) {
          listener({
            symbol: this.resolveDisplaySymbol(key, meta.symbol),
            fundingRate,
            updateTime,
          });
        }
      }
    }

    void this.ensureInitialized()
      .then(() => this.ensureSubscriptionConnected())
      .then(() => this.ensureFundingStreamsForListeners())
      .catch((error) => this.logger("funding_rate:subscribe", error));

    return () => {
      const listeners = this.fundingRateListeners.get(key);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) this.fundingRateListeners.delete(key);
      }
    };
  }

  onKlines(symbol: string, interval: string, listener: KlineListener): () => void {
    const keySymbol = this.rememberDisplaySymbol(symbol);
    const key = `${keySymbol}:${interval}`;
    const set = this.klineListeners.get(key) ?? new Set();
    set.add(listener);
    this.klineListeners.set(key, set);
    const state = this.klinesState.get(key);
    if (state?.klines?.length) {
      listener(state.klines);
    }

    void this.ensureInitialized()
      .then(() => this.ensureSubscriptionConnected())
      .then(() => this.ensureKlinesStream(key))
      .catch((error) => this.logger("klines:subscribe", error));

    return () => {
      const listeners = this.klineListeners.get(key);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) this.klineListeners.delete(key);
      }
    };
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized(params.symbol);
    const meta = this.getSymbolMetaOrThrow(params.symbol);
    if (params.type === "STOP_MARKET") {
      return this.createStopOrder(meta, params);
    }
    if (params.type === "TRAILING_STOP_MARKET") {
      throw new Error("Nado does not support trailing stop orders");
    }
    if (params.type === "MARKET") {
      return this.createMarketOrder(meta, params);
    }
    return this.createLimitOrder(meta, params);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.cancelOrders({ symbol: params.symbol, orderIdList: [params.orderId] });
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.ensureInitialized(params.symbol);
    const meta = this.getSymbolMetaOrThrow(params.symbol);
    const digests = params.orderIdList.map((value) => String(value));
    const triggerDigests = digests.filter((digest) => this.triggerOrdersByDigest.has(digest));
    const engineDigests = digests.filter((digest) => !this.triggerOrdersByDigest.has(digest));

    if (engineDigests.length > 0) {
      try {
        await this.sendCancelOrders(meta.productId, engineDigests);
        for (const digest of engineDigests) {
          this.openOrdersByDigest.delete(digest);
        }
      } catch (error) {
        // If engine cancellation fails due to unknown order, we still try trigger cancellation.
        if (!triggerDigests.length) {
          throw error;
        }
      }
    }

    if (triggerDigests.length > 0) {
      await this.cancelTriggerOrders(meta.productId, triggerDigests);
      for (const digest of triggerDigests) {
        this.triggerOrdersByDigest.delete(digest);
      }
    }

    this.emitOrders();
  }

  async cancelAllOrders(params: { symbol: string }): Promise<void> {
    await this.ensureInitialized(params.symbol);
    const meta = this.getSymbolMetaOrThrow(params.symbol);
    await Promise.all([
      this.sendCancelProductOrders([meta.productId]).catch((error) => {
        // Best-effort; trigger cancellations still apply.
        this.logger("cancelAllOrders:engine", error);
      }),
      this.cancelTriggerProductOrders([meta.productId]).catch((error) => {
        this.logger("cancelAllOrders:trigger", error);
      }),
    ]);
    // Reset local caches for the product.
    for (const [digest, order] of Array.from(this.openOrdersByDigest.entries())) {
      if (order.productId === meta.productId) this.openOrdersByDigest.delete(digest);
    }
    for (const [digest, order] of Array.from(this.triggerOrdersByDigest.entries())) {
      if (order.productId === meta.productId) this.triggerOrdersByDigest.delete(digest);
    }
    this.emitOrders();
  }

  async getPrecision(symbol: string): Promise<{
    priceTick: number;
    qtyStep: number;
    priceDecimals?: number;
    sizeDecimals?: number;
    marketId?: number;
    minBaseAmount?: number;
    minQuoteAmount?: number;
  } | null> {
    await this.ensureInitialized(symbol);
    const symbolKey = this.rememberDisplaySymbol(symbol);
    const meta = this.symbolMetaBySymbol.get(symbolKey);
    if (!meta) return null;
    const priceTick = fromX18(meta.priceIncrementX18).toNumber();
    const qtyStep = fromX18(meta.sizeIncrementX18).toNumber();
    const minQuoteAmount = fromX18(meta.minSizeX18).toNumber();
    return {
      priceTick,
      qtyStep,
      marketId: meta.productId,
      minQuoteAmount,
    };
  }

  private async doInitialize(): Promise<void> {
    await this.openGatewayWebsocket();
    const contracts = await this.queryContracts();
    this.chainId = Number(contracts.chain_id);
    this.endpointAddr = contracts.endpoint_addr as Address;
    await this.queryAndCacheSymbols();

    await this.ensureSubscriptionConnected();

    await Promise.all([
      this.refreshAccountSnapshot(),
      this.refreshOrdersSnapshot(),
      this.refreshTriggerOrdersSnapshot(),
      this.bootstrapKlinesForActiveListeners(),
    ]);

    this.startPolling();
    this.initialized = true;
  }

  private getSymbolMetaOrThrow(symbol: string): SymbolMeta {
    const normalized = this.rememberDisplaySymbol(symbol);
    const meta = this.symbolMetaBySymbol.get(normalized);
    if (meta) return meta;
    const available = Array.from(this.symbolMetaBySymbol.keys())
      .slice(0, 15)
      .join(", ");
    throw new Error(`Unknown Nado symbol: ${symbol}. Available examples: ${available}${this.symbolMetaBySymbol.size > 15 ? ", ..." : ""}`);
  }

  private async openGatewayWebsocket(): Promise<void> {
    if (this.gatewayWs && this.gatewayWs.readyState === WebSocketCtor.OPEN) return;
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocketCtor(this.gatewayWsUrl);
      this.gatewayWs = ws;
      this.gatewayLastMessageAt = nowMs();

      const cleanup = () => {
        ws.removeAllListeners();
      };

      ws.on("open", () => {
        this.gatewayLastMessageAt = nowMs();
        this.startGatewayPing();
        resolve();
      });
      ws.on("message", () => {
        this.gatewayLastMessageAt = nowMs();
      });
      ws.on("error", (err) => {
        cleanup();
        reject(err);
      });
      ws.on("close", () => {
        cleanup();
        this.stopGatewayPing();
      });
    });
  }

  private hasActiveSubscriptionListeners(): boolean {
    if (this.accountListeners.size > 0) return true;
    if (this.orderListeners.size > 0) return true;
    if (this.depthListeners.size > 0) return true;
    if (this.tickerListeners.size > 0) return true;
    if (this.fundingRateListeners.size > 0) return true;
    if (this.klineListeners.size > 0) return true;
    return false;
  }

  private resetSubscriptionReconnect(): void {
    if (this.subscriptionReconnectTimer) {
      clearTimeout(this.subscriptionReconnectTimer);
      this.subscriptionReconnectTimer = null;
    }
    this.subscriptionReconnectDelayMs = 1_000;
  }

  private scheduleSubscriptionReconnect(reason: string): void {
    if (this.subscriptionReconnectTimer) return;
    if (!this.hasActiveSubscriptionListeners()) return;
    const delay = this.subscriptionReconnectDelayMs;
    this.subscriptionReconnectTimer = setTimeout(() => {
      this.subscriptionReconnectTimer = null;
      void this.ensureSubscriptionConnected().catch((error) => {
        this.logger(`subscriptionReconnect:${reason}`, error);
        this.scheduleSubscriptionReconnect("retry");
      });
    }, delay);
    this.subscriptionReconnectDelayMs = Math.min(this.subscriptionReconnectDelayMs * 2, 60_000);
  }

  private async ensureSubscriptionConnected(): Promise<void> {
    if (this.subscriptionWs && this.subscriptionWs.readyState === WebSocketCtor.OPEN && this.subscriptionAuthComplete) {
      return;
    }
    if (this.subscriptionConnectPromise) {
      return this.subscriptionConnectPromise;
    }
    this.subscriptionConnectPromise = this.openSubscriptionWebsocket()
      .then(() => {
        this.resetSubscriptionReconnect();
      })
      .finally(() => {
        this.subscriptionConnectPromise = null;
      });
    return this.subscriptionConnectPromise;
  }

  private async openSubscriptionWebsocket(): Promise<void> {
    const existing = this.subscriptionWs;
    if (existing && existing.readyState === WebSocketCtor.OPEN) {
      if (!this.subscriptionAuthComplete) {
        await this.authenticateSubscription();
        await this.resubscribeAllStreams();
      }
      return;
    }

    this.subscriptionAuthComplete = false;
    this.subscriptionStreams.clear();

    const ws = new WebSocketCtor(this.subscriptionsWsUrl, { perMessageDeflate: true });
    this.subscriptionWs = ws;
    this.subscriptionLastMessageAt = nowMs();

    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        ws.off("open", handleOpen);
        ws.off("error", handleError);
        ws.off("close", handleClose);
      };
      const handleOpen = () => {
        cleanup();
        this.subscriptionLastMessageAt = nowMs();
        this.startSubscriptionPing();
        resolve();
      };
      const handleError = (error: unknown) => {
        cleanup();
        reject(error);
      };
      const handleClose = () => {
        cleanup();
        reject(new Error("Subscription websocket closed before open"));
      };

      ws.once("open", handleOpen);
      ws.once("error", handleError);
      ws.once("close", handleClose);
    }).catch((error) => {
      try {
        ws.removeAllListeners();
      } catch {
        // ignore
      }
      if (this.subscriptionWs === ws) {
        this.subscriptionWs = null;
      }
      throw error;
    });

    ws.on("message", (data) => {
      this.subscriptionLastMessageAt = nowMs();
      this.handleSubscriptionMessage(data);
    });

    ws.on("close", () => {
      ws.removeAllListeners();
      this.stopSubscriptionPing();
      this.subscriptionAuthComplete = false;
      this.subscriptionStreams.clear();
      if (this.subscriptionWs === ws) {
        this.subscriptionWs = null;
      }
      this.scheduleSubscriptionReconnect("close");
    });

    ws.on("error", (error) => {
      this.logger("subscriptionWs:error", error);
    });

    await this.authenticateSubscription();
    await this.resubscribeAllStreams();
  }

  private startGatewayPing(): void {
    if (this.gatewayPingTimer) return;
    this.gatewayPingTimer = setInterval(() => {
      const ws = this.gatewayWs;
      if (!ws || ws.readyState !== WebSocketCtor.OPEN) return;
      const now = nowMs();
      if (now - this.gatewayLastMessageAt > WS_STALE_TIMEOUT_MS) {
        try {
          ws.terminate();
        } catch (error) {
          this.logger("gatewayWs:terminate", error);
        }
        return;
      }
      try {
        ws.ping();
      } catch (error) {
        this.logger("gatewayWs:ping", error);
      }
    }, WS_PING_INTERVAL_MS);
  }

  private stopGatewayPing(): void {
    if (this.gatewayPingTimer) {
      clearInterval(this.gatewayPingTimer);
      this.gatewayPingTimer = null;
    }
  }

  private startSubscriptionPing(): void {
    if (this.subscriptionPingTimer) return;
    this.subscriptionPingTimer = setInterval(() => {
      const ws = this.subscriptionWs;
      if (!ws || ws.readyState !== WebSocketCtor.OPEN) return;
      const now = nowMs();
      if (now - this.subscriptionLastMessageAt > WS_STALE_TIMEOUT_MS) {
        try {
          ws.terminate();
        } catch (error) {
          this.logger("subscriptionWs:terminate", error);
        }
        return;
      }
      try {
        ws.ping();
      } catch (error) {
        this.logger("subscriptionWs:ping", error);
      }
    }, WS_PING_INTERVAL_MS);
  }

  private stopSubscriptionPing(): void {
    if (this.subscriptionPingTimer) {
      clearInterval(this.subscriptionPingTimer);
      this.subscriptionPingTimer = null;
    }
  }

  private enqueueGateway<T>(task: () => Promise<T>): Promise<T> {
    const queued = this.gatewayQueue.then(task, task) as Promise<T>;
    this.gatewayQueue = queued.then(
      () => undefined,
      () => undefined
    );
    return queued;
  }

  private async sendGatewayRequest<T>(payload: unknown): Promise<T> {
    return this.enqueueGateway(async () => {
      await this.openGatewayWebsocket();
      const ws = this.gatewayWs;
      if (!ws || ws.readyState !== WebSocketCtor.OPEN) {
        throw new Error("Nado gateway websocket not connected");
      }
      return await new Promise<T>((resolve, reject) => {
        const handle = (data: NodeWebSocket.RawData) => {
          try {
            const text = typeof data === "string" ? data : data.toString("utf8");
            const parsed = JSON.parse(text) as T;
            ws.off("message", handle);
            resolve(parsed);
          } catch (error) {
            ws.off("message", handle);
            reject(error);
          }
        };
        ws.on("message", handle);
        try {
          ws.send(JSON.stringify(payload));
        } catch (error) {
          ws.off("message", handle);
          reject(error);
        }
      });
    });
  }

  private async queryContracts(): Promise<{ chain_id: string; endpoint_addr: string }> {
    const response = (await this.sendGatewayRequest<NadoContractsResponse>({ type: "contracts" })) as NadoContractsResponse;
    if (response.status !== "success" || !response.data) {
      const code = parseNadoErrorCode(response.error_code);
      const msg = response.error ?? "contracts query failed";
      throw this.decorateNadoError(msg, code);
    }
    return response.data;
  }

  private async queryAndCacheSymbols(): Promise<void> {
    const response = (await this.sendGatewayRequest<NadoSymbolsResponse>({ type: "symbols" })) as NadoSymbolsResponse;
    if (response.status !== "success" || !response.data?.symbols) {
      const code = parseNadoErrorCode(response.error_code);
      const msg = response.error ?? "symbols query failed";
      throw this.decorateNadoError(msg, code);
    }
    this.symbolMetaBySymbol.clear();
    this.symbolMetaByProductId.clear();
    for (const entry of Object.values(response.data.symbols)) {
      const meta: SymbolMeta = {
        productId: entry.product_id,
        symbol: entry.symbol,
        type: entry.type,
        priceIncrementX18: entry.price_increment_x18,
        sizeIncrementX18: entry.size_increment,
        minSizeX18: entry.min_size,
      };
      const key = normalizeSymbolInput(entry.symbol);
      this.symbolMetaBySymbol.set(key, meta);
      this.symbolMetaByProductId.set(entry.product_id, meta);
    }
  }

  private async querySubaccountInfo(): Promise<NonNullable<NadoSubaccountInfoResponse["data"]>> {
    const subaccountHex = this.getSubaccountHex();
    const response = (await this.sendGatewayRequest<NadoSubaccountInfoResponse>({
      type: "subaccount_info",
      subaccount: subaccountHex,
    })) as NadoSubaccountInfoResponse;
    if (response.status !== "success" || !response.data) {
      const code = parseNadoErrorCode(response.error_code);
      const msg = response.error ?? "subaccount_info query failed";
      throw this.decorateNadoError(msg, code);
    }
    return response.data;
  }

  private async querySubaccountOrders(productId: number): Promise<NonNullable<NadoSubaccountOrdersResponse["data"]>> {
    const sender = this.getSubaccountHex() as `0x${string}`;
    const response = (await this.sendGatewayRequest<NadoSubaccountOrdersResponse>({
      type: "subaccount_orders",
      sender,
      product_id: productId,
    })) as NadoSubaccountOrdersResponse;
    if (response.status !== "success" || !response.data) {
      const code = parseNadoErrorCode(response.error_code);
      const msg = response.error ?? "subaccount_orders query failed";
      throw this.decorateNadoError(msg, code);
    }
    return response.data;
  }

  private startPolling(): void {
    if (!this.accountPollTimer) {
      this.accountPollTimer = setInterval(() => {
        void this.refreshAccountSnapshot();
      }, this.pollIntervals.account);
    }
    if (!this.ordersPollTimer) {
      this.ordersPollTimer = setInterval(() => {
        void this.refreshOrdersSnapshot();
      }, this.pollIntervals.orders);
    }
    if (!this.triggerOrdersPollTimer) {
      this.triggerOrdersPollTimer = setInterval(() => {
        void this.refreshTriggerOrdersSnapshot();
      }, this.pollIntervals.triggerOrders);
    }
  }

  private async refreshAccountSnapshot(): Promise<void> {
    try {
      const data = await this.querySubaccountInfo();
      this.lastAccountSyncAt = nowMs();
      this.accountSnapshot = this.mapSubaccountInfoToAsterSnapshot(data);
      this.emitAccount();
    } catch (error) {
      this.logger("accountPoll", error);
    }
  }

  private async refreshOrdersSnapshot(): Promise<void> {
    try {
      const primaryMeta = this.getSymbolMetaOrThrow(this.primarySymbol);
      const data = await this.querySubaccountOrders(primaryMeta.productId);
      this.openOrdersByDigest.clear();
      for (const order of data.orders ?? []) {
        this.openOrdersByDigest.set(order.digest, {
          digest: order.digest,
          productId: order.product_id,
          priceX18: order.price_x18,
          amountX18: order.amount,
          unfilledAmountX18: order.unfilled_amount,
          appendix: order.appendix,
          orderType: order.order_type,
          placedAtSec: order.placed_at,
        });
      }
      this.emitOrders();
    } catch (error) {
      this.logger("ordersPoll", error);
    }
  }

  private async refreshTriggerOrdersSnapshot(): Promise<void> {
    if (!this.chainId || !this.endpointAddr) return;
    try {
      const primaryMeta = this.getSymbolMetaOrThrow(this.primarySymbol);
      const response = await this.trigger.listOrders({
        chainId: this.chainId,
        verifyingAddr: this.endpointAddr,
        subaccountOwner: this.subaccountOwner,
        subaccountName: this.subaccountName,
        productIds: [primaryMeta.productId],
        limit: 200,
      });
      this.triggerOrdersByDigest.clear();
      for (const orderInfo of response.orders) {
        const order = orderInfo.order;
        if (!order?.digest || !order?.productId) continue;
        if (order.triggerCriteria?.type !== "price") continue;
        const stopDecimal = order.triggerCriteria.criteria?.triggerPrice;
        const stopPrice = toBigNumberFromDecimalish(stopDecimal);
        const price = toBigNumberFromDecimalish(order.price);
        const amount = toBigNumberFromDecimalish(order.amount);
        if (!stopPrice || !price || !amount) continue;
        const stopPriceX18 = toX18BigInt(stopPrice);
        const priceX18 = toX18BigInt(price);
        const amountX18 = amount.toFixed(0);
        this.triggerOrdersByDigest.set(order.digest, {
          digest: order.digest,
          productId: order.productId,
          priceX18: String(priceX18),
          amountX18,
          appendix: undefined,
          trigger: { stopPriceX18: String(stopPriceX18) },
          status: orderInfo.status.type,
          updatedAtMs: orderInfo.updatedAt,
        });
      }
      this.emitOrders();
    } catch (error) {
      this.logger("triggerOrdersPoll", error);
    }
  }

  private async bootstrapKlinesForActiveListeners(): Promise<void> {
    for (const key of Array.from(this.klineListeners.keys())) {
      await this.ensureKlinesStream(key);
    }
  }

  private async ensureKlinesStream(key: string): Promise<void> {
    const [symbol, interval] = key.split(":", 2);
    if (!symbol || !interval) return;
    const meta = this.getSymbolMetaOrThrow(symbol);
    const existing = this.klinesState.get(key);
    const periodSec = existing?.periodSec ?? this.mapIntervalToSeconds(interval);

    if (!existing) {
      const initial = await this.fetchCandlesticks(meta.productId, periodSec, DEFAULT_KLINES_LIMIT);
      this.klinesState.set(key, { productId: meta.productId, periodSec, klines: initial });
      this.emitKlines(key);
    }

    await this.subscribeLatestCandlestick(meta.productId, periodSec);
  }

  private mapIntervalToSeconds(interval: string): number {
    const normalized = (interval ?? "").trim().toLowerCase();
    if (normalized === "1m") return 60;
    if (normalized === "5m") return 300;
    if (normalized === "15m") return 900;
    if (normalized === "1h") return 3600;
    if (normalized === "2h") return 7200;
    if (normalized === "4h") return 14400;
    if (normalized === "1d") return 86400;
    if (normalized === "1w") return 604800;
    const asNumber = Number(normalized);
    return Number.isFinite(asNumber) && asNumber > 0 ? Math.floor(asNumber) : 60;
  }

  private async fetchCandlesticks(productId: number, periodSec: number, limit: number): Promise<AsterKline[]> {
    try {
      const result = await this.indexer.getCandlesticks({ productId, period: periodSec, limit });
      const reversed = Array.from(result).reverse();
      return reversed.map((candle) => {
        const timestampSec = Number(candle.time.toFixed(0));
        const openTime = Number.isFinite(timestampSec) ? timestampSec * 1000 : nowMs();
        const closeTime = openTime + periodSec * 1000 - 1;
        return {
          openTime,
          closeTime,
          open: candle.open.toFixed(),
          high: candle.high.toFixed(),
          low: candle.low.toFixed(),
          close: candle.close.toFixed(),
          volume: candle.volume.toFixed(),
          numberOfTrades: 0,
        };
      });
    } catch (error) {
      this.logger("klines:fetch", error);
      return [];
    }
  }

  private emitAccount(): void {
    if (!this.accountSnapshot) return;
    for (const listener of Array.from(this.accountListeners)) {
      try {
        listener(this.accountSnapshot);
      } catch (error) {
        this.logger("accountListener", error);
      }
    }
  }

  private emitOrders(): void {
    const snapshot = this.buildAsterOrdersSnapshot();
    for (const listener of Array.from(this.orderListeners)) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logger("orderListener", error);
      }
    }
  }

  private emitDepth(productId: number): void {
    const meta = this.symbolMetaByProductId.get(productId);
    if (!meta) return;
    const key = normalizeSymbolInput(meta.symbol);
    const listeners = this.depthListeners.get(key);
    if (!listeners?.size) return;
    const snapshot = this.buildDepthSnapshot(productId, this.resolveDisplaySymbol(key, meta.symbol));
    if (!snapshot) return;
    for (const listener of Array.from(listeners)) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logger("depthListener", error);
      }
    }
  }

  private emitTicker(productId: number): void {
    const meta = this.symbolMetaByProductId.get(productId);
    if (!meta) return;
    const key = normalizeSymbolInput(meta.symbol);
    const listeners = this.tickerListeners.get(key);
    if (!listeners?.size) return;
    const snapshot = this.buildTickerSnapshot(productId, this.resolveDisplaySymbol(key, meta.symbol));
    if (!snapshot) return;
    for (const listener of Array.from(listeners)) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logger("tickerListener", error);
      }
    }
  }

  private emitFundingRate(productId: number): void {
    const meta = this.symbolMetaByProductId.get(productId);
    if (!meta) return;
    const key = normalizeSymbolInput(meta.symbol);
    const listeners = this.fundingRateListeners.get(key);
    if (!listeners?.size) return;
    const cached = this.fundingRateByProductId.get(productId);
    if (!cached) return;
    const updateSec = Number(cached.updateTimeSec);
    const updateTime = Number.isFinite(updateSec) ? updateSec * 1000 : nsToMs(cached.timestampNs);
    const fundingRate = fromX18(cached.rateX18).toNumber();
    if (!Number.isFinite(fundingRate)) return;

    const snapshot = {
      symbol: this.resolveDisplaySymbol(key, meta.symbol),
      fundingRate,
      updateTime,
    };

    for (const listener of Array.from(listeners)) {
      try {
        listener(snapshot);
      } catch (error) {
        this.logger("fundingRateListener", error);
      }
    }
  }

  private emitKlines(key: string): void {
    const state = this.klinesState.get(key);
    if (!state) return;
    const listeners = this.klineListeners.get(key);
    if (!listeners?.size) return;
    for (const listener of Array.from(listeners)) {
      try {
        listener(state.klines);
      } catch (error) {
        this.logger("klineListener", error);
      }
    }
  }

  private buildAsterOrdersSnapshot(): AsterOrder[] {
    const orders: AsterOrder[] = [];
    for (const order of this.openOrdersByDigest.values()) {
      const meta = this.symbolMetaByProductId.get(order.productId);
      if (!meta) continue;
      const canonical = normalizeSymbolInput(meta.symbol);
      const displaySymbol = this.resolveDisplaySymbol(canonical, meta.symbol);
      const side = new BigNumber(order.amountX18).isNegative() ? "SELL" : "BUY";
      const execType = (order.orderType ?? "").toLowerCase() as NadoOrderExecution | "";
      const type = mapExecutionToOrderType(execType === "" ? undefined : execType);
      const origQty = fromX18(new BigNumber(order.amountX18).abs()).toFixed();
      const remaining = fromX18(new BigNumber(order.unfilledAmountX18).abs()).toFixed();
      const executed = new BigNumber(origQty).minus(remaining);
      const status = executed.isFinite() && executed.gt(0) ? "PARTIALLY_FILLED" : "NEW";
      orders.push({
        orderId: order.digest,
        clientOrderId: order.clientId != null ? String(order.clientId) : order.digest,
        symbol: displaySymbol,
        side,
        type,
        status,
        price: fromX18(order.priceX18).toFixed(),
        origQty,
        executedQty: executed.isFinite() ? executed.toFixed() : "0",
        stopPrice: "0",
        time: order.placedAtSec ? order.placedAtSec * 1000 : this.lastAccountSyncAt || nowMs(),
        updateTime: nowMs(),
        reduceOnly: false,
        closePosition: false,
      });
    }

    for (const trigger of this.triggerOrdersByDigest.values()) {
      const meta = this.symbolMetaByProductId.get(trigger.productId);
      if (!meta) continue;
      const canonical = normalizeSymbolInput(meta.symbol);
      const displaySymbol = this.resolveDisplaySymbol(canonical, meta.symbol);
      const side = new BigNumber(trigger.amountX18).isNegative() ? "SELL" : "BUY";
      const origQty = fromX18(new BigNumber(trigger.amountX18).abs()).toFixed();
      orders.push({
        orderId: trigger.digest,
        clientOrderId: trigger.digest,
        symbol: displaySymbol,
        side,
        type: "STOP_MARKET",
        status: trigger.status?.toUpperCase() || "NEW",
        price: fromX18(trigger.priceX18).toFixed(),
        origQty,
        executedQty: "0",
        stopPrice: fromX18(trigger.trigger.stopPriceX18).toFixed(),
        time: trigger.updatedAtMs,
        updateTime: trigger.updatedAtMs,
        reduceOnly: true,
        closePosition: true,
      });
    }

    return orders;
  }

  private buildDepthSnapshot(productId: number, symbol: string): AsterDepth | null {
    const bbo = this.bestBidOfferByProductId.get(productId);
    if (!bbo) return null;
    const bids: [string, string][] = [[fromX18(bbo.bidX18).toFixed(), fromX18(bbo.bidQtyX18).toFixed()]];
    const asks: [string, string][] = [[fromX18(bbo.askX18).toFixed(), fromX18(bbo.askQtyX18).toFixed()]];
    return {
      lastUpdateId: productId,
      bids,
      asks,
      eventTime: nsToMs(bbo.timestampNs),
      symbol,
    };
  }

  private buildTickerSnapshot(productId: number, symbol: string): AsterTicker | null {
    const bbo = this.bestBidOfferByProductId.get(productId);
    if (!bbo) return null;
    const trade = this.lastTradePriceByProductId.get(productId);
    const bid = fromX18(bbo.bidX18);
    const ask = fromX18(bbo.askX18);
    const mid = bid.plus(ask).div(2);
    const last = trade ? fromX18(trade.priceX18) : mid;
    const lastPrice = last.toFixed();
    return {
      symbol,
      lastPrice,
      openPrice: lastPrice,
      highPrice: lastPrice,
      lowPrice: lastPrice,
      volume: "0",
      quoteVolume: "0",
      eventTime: trade ? nsToMs(trade.timestampNs) : nsToMs(bbo.timestampNs),
      bidPrice: bid.toFixed(),
      askPrice: ask.toFixed(),
      markPrice: mid.toFixed(),
    };
  }

  private mapSubaccountInfoToAsterSnapshot(data: NonNullable<NadoSubaccountInfoResponse["data"]>): AsterAccountSnapshot {
    const now = nowMs();
    const assets: AsterAccountAsset[] = [];
    const positions: AsterAccountPosition[] = [];

    const spotBalanceByProductId = new Map<number, string>();
    for (const entry of data.spot_balances ?? []) {
      spotBalanceByProductId.set(entry.product_id, entry.balance.amount);
    }
    for (const [productId, amountX18] of Array.from(spotBalanceByProductId.entries())) {
      const meta = this.symbolMetaByProductId.get(productId);
      const assetName = meta?.symbol ?? `PRODUCT_${productId}`;
      const amount = fromX18(amountX18).toFixed();
      assets.push({
        asset: assetName,
        walletBalance: amount,
        availableBalance: amount,
        updateTime: now,
        assetId: productId,
      });
    }

    const perpOracleByProductId = new Map<number, string>();
    for (const product of data.perp_products ?? []) {
      perpOracleByProductId.set(product.product_id, product.oracle_price_x18);
    }

    for (const entry of data.perp_balances ?? []) {
      const meta = this.symbolMetaByProductId.get(entry.product_id);
      if (!meta) continue;
      const amountX18 = entry.balance.amount;
      if (!amountX18 || amountX18 === "0") continue;
      const canonical = normalizeSymbolInput(meta.symbol);
      const displaySymbol = this.resolveDisplaySymbol(canonical, meta.symbol);
      const vQuoteX18 = entry.balance.v_quote_balance ?? "0";
      const oracleX18 = perpOracleByProductId.get(entry.product_id) ?? "0";

      const amountAbs = new BigNumber(amountX18).abs();
      const positionAmt = fromX18(amountX18).toFixed();
      const markPrice = fromX18(oracleX18).toFixed();

      const entryPrice = (() => {
        if (amountAbs.isZero()) return "0";
        const value = new BigNumber(vQuoteX18).negated().div(amountX18);
        return value.isFinite() ? value.abs().toFixed() : "0";
      })();

      const unrealizedProfit = (() => {
        if (amountAbs.isZero()) return "0";
        const pnlX18 = new BigNumber(amountX18)
          .multipliedBy(oracleX18)
          .div(X18)
          .plus(vQuoteX18);
        return fromX18(pnlX18).toFixed();
      })();

      positions.push({
        symbol: displaySymbol,
        positionAmt,
        entryPrice,
        unrealizedProfit,
        positionSide: "BOTH",
        updateTime: now,
        markPrice,
      });
    }

    const totalUnrealized = positions.reduce((sum, p) => sum.plus(p.unrealizedProfit ?? "0"), new BigNumber(0));

    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: now,
      totalWalletBalance: "0",
      totalUnrealizedProfit: totalUnrealized.toFixed(),
      positions,
      assets,
      marketType: this.getPrimaryMarketType(),
    };
  }

  private getPrimaryMarketType(): "perp" | "spot" {
    const primary = this.symbolMetaBySymbol.get(normalizeSymbolInput(this.primarySymbol));
    return primary?.type === "spot" ? "spot" : "perp";
  }

  private getSubaccountHex(): string {
    // SDK helper used inside @nadohq/shared when signing; for API we just need the 32-byte hex
    // Sender = bytes20(owner) + bytes12(subaccountName padded)
    const owner = this.subaccountOwner.replace(/^0x/, "").toLowerCase();
    const name = Buffer.from(this.subaccountName, "utf8").toString("hex");
    const padded = (name + "0".repeat(24)).slice(0, 24);
    return `0x${owner}${padded}`;
  }

  private decorateNadoError(message: string, errorCode: number | null): Error & { code?: number; status?: number } {
    const error = new Error(message) as Error & { code?: number; status?: number };
    if (errorCode != null) {
      (error as any).code = errorCode;
      if (errorCode === 1000 || errorCode === 1015) {
        (error as any).status = 429;
      }
    }
    return error;
  }

  private async authenticateSubscription(): Promise<void> {
    if (!this.subscriptionWs || this.subscriptionWs.readyState !== WebSocketCtor.OPEN) {
      throw new Error("Subscription websocket not connected");
    }
    if (!this.chainId || !this.endpointAddr) {
      throw new Error("Nado contracts not loaded");
    }
    const sender = this.getSubaccountHex();
    const expirationMs = nowMs() + 90_000;

    const signature = await this.walletClient.signTypedData({
      domain: getNadoEIP712Domain(this.endpointAddr, this.chainId),
      types: {
        StreamAuthentication: [
          { name: "sender", type: "bytes32" },
          { name: "expiration", type: "uint64" },
        ],
      },
      primaryType: "StreamAuthentication",
      message: {
        sender: sender as `0x${string}`,
        expiration: BigInt(expirationMs),
      },
    });

    const id = this.nextSubscriptionRequestId();
    const response = await this.sendSubscriptionRequest<NadoSubscriptionAck>({
      method: "authenticate",
      id,
      tx: {
        sender,
        expiration: String(expirationMs),
      },
      signature,
    });
    if (response?.id !== id) {
      throw new Error("Unexpected subscription authenticate response");
    }
    this.subscriptionAuthComplete = true;
  }

  private async resubscribeAllStreams(): Promise<void> {
    // Ensure basic public streams always follow active listeners.
    await this.ensureMarketStreamsForListeners();
    await this.ensureFundingStreamsForListeners();
    await this.ensureAccountStreamsForListeners();
    await this.ensureKlineStreamsForListeners();
  }

  private async ensureMarketStreamsForListeners(): Promise<void> {
    const wantedProductIds = new Set<number>();
    for (const symbol of Array.from(this.depthListeners.keys())) {
      const meta = this.symbolMetaBySymbol.get(symbol);
      if (meta) wantedProductIds.add(meta.productId);
    }
    for (const symbol of Array.from(this.tickerListeners.keys())) {
      const meta = this.symbolMetaBySymbol.get(symbol);
      if (meta) wantedProductIds.add(meta.productId);
    }

    if (wantedProductIds.size === 0) {
      const primaryMeta = this.symbolMetaBySymbol.get(normalizeSymbolInput(this.primarySymbol));
      if (primaryMeta) wantedProductIds.add(primaryMeta.productId);
    }

    for (const productId of Array.from(wantedProductIds)) {
      await this.subscribeBestBidOffer(productId);
      await this.subscribeTrades(productId);
    }
  }

  private async ensureFundingStreamsForListeners(): Promise<void> {
    const wantedProductIds = new Set<number>();
    for (const symbol of Array.from(this.fundingRateListeners.keys())) {
      const meta = this.symbolMetaBySymbol.get(symbol);
      if (!meta) continue;
      if (meta.type !== "perp") continue;
      wantedProductIds.add(meta.productId);
    }

    for (const productId of Array.from(wantedProductIds)) {
      await this.subscribeFundingRate(productId);
    }
  }

  private async ensureAccountStreamsForListeners(): Promise<void> {
    if (!this.subscriptionAuthComplete) return;
    if (this.accountListeners.size === 0 && this.orderListeners.size === 0) return;
    const subaccount = this.getSubaccountHex();
    // Subscribe across all products for this subaccount.
    await this.subscribeOrderUpdates(subaccount, null);
    await this.subscribePositionChanges(subaccount, null);
  }

  private async ensureKlineStreamsForListeners(): Promise<void> {
    for (const key of Array.from(this.klineListeners.keys())) {
      await this.ensureKlinesStream(key);
    }
  }

  private async subscribeBestBidOffer(productId: number): Promise<void> {
    const streamKey = `best_bid_offer:${productId}`;
    if (this.subscriptionStreams.has(streamKey)) return;
    await this.sendSubscriptionRequest({
      method: "subscribe",
      id: this.nextSubscriptionRequestId(),
      stream: { type: "best_bid_offer", product_id: productId },
    });
    this.subscriptionStreams.add(streamKey);
  }

  private async subscribeTrades(productId: number): Promise<void> {
    const streamKey = `trade:${productId}`;
    if (this.subscriptionStreams.has(streamKey)) return;
    await this.sendSubscriptionRequest({
      method: "subscribe",
      id: this.nextSubscriptionRequestId(),
      stream: { type: "trade", product_id: productId },
    });
    this.subscriptionStreams.add(streamKey);
  }

  private async subscribeOrderUpdates(subaccount: string, productId: number | null): Promise<void> {
    const streamKey = `order_update:${subaccount}:${productId ?? "all"}`;
    if (this.subscriptionStreams.has(streamKey)) return;
    await this.sendSubscriptionRequest({
      method: "subscribe",
      id: this.nextSubscriptionRequestId(),
      stream: { type: "order_update", subaccount, product_id: productId },
    });
    this.subscriptionStreams.add(streamKey);
  }

  private async subscribePositionChanges(subaccount: string, productId: number | null): Promise<void> {
    const streamKey = `position_change:${subaccount}:${productId ?? "all"}`;
    if (this.subscriptionStreams.has(streamKey)) return;
    await this.sendSubscriptionRequest({
      method: "subscribe",
      id: this.nextSubscriptionRequestId(),
      stream: { type: "position_change", subaccount, product_id: productId },
    });
    this.subscriptionStreams.add(streamKey);
  }

  private async subscribeLatestCandlestick(productId: number, periodSec: number): Promise<void> {
    const streamKey = `latest_candlestick:${productId}:${periodSec}`;
    if (this.subscriptionStreams.has(streamKey)) return;
    await this.sendSubscriptionRequest({
      method: "subscribe",
      id: this.nextSubscriptionRequestId(),
      stream: { type: "latest_candlestick", product_id: productId, granularity: periodSec },
    });
    this.subscriptionStreams.add(streamKey);
  }

  private async subscribeFundingRate(productId: number): Promise<void> {
    const streamKey = `funding_rate:${productId}`;
    if (this.subscriptionStreams.has(streamKey)) return;
    await this.sendSubscriptionRequest({
      method: "subscribe",
      id: this.nextSubscriptionRequestId(),
      stream: { type: "funding_rate", product_id: productId },
    });
    this.subscriptionStreams.add(streamKey);
  }

  private nextSubscriptionRequestId(): number {
    this.subscriptionRequestId += 1;
    return this.subscriptionRequestId;
  }

  private async sendSubscriptionRequest<T = unknown>(payload: any): Promise<T> {
    const ws = this.subscriptionWs;
    if (!ws || ws.readyState !== WebSocketCtor.OPEN) {
      throw new Error("Subscription websocket not connected");
    }
    return await new Promise<T>((resolve, reject) => {
      const id = payload?.id;
      let timeout: ReturnType<typeof setTimeout> | null = null;
      const handle = (data: NodeWebSocket.RawData) => {
        try {
          const text = typeof data === "string" ? data : data.toString("utf8");
          const parsed = JSON.parse(text);
          // Only resolve for an ack.
          if (id != null && parsed && typeof parsed === "object" && parsed.id === id) {
            ws.off("message", handle);
            if (timeout) clearTimeout(timeout);
            resolve(parsed as T);
          }
        } catch (error) {
          ws.off("message", handle);
          if (timeout) clearTimeout(timeout);
          reject(error);
        }
      };
      ws.on("message", handle);
      try {
        ws.send(JSON.stringify(payload));
      } catch (error) {
        ws.off("message", handle);
        if (timeout) clearTimeout(timeout);
        reject(error);
      }
      // Safety timeout in case we never get an ack.
      timeout = setTimeout(() => {
        timeout = null;
        ws.off("message", handle);
        reject(new Error("Subscription request timed out"));
      }, 10_000);
    });
  }

  private handleSubscriptionMessage(data: NodeWebSocket.RawData): void {
    let message: any;
    try {
      const text = typeof data === "string" ? data : data.toString("utf8");
      message = JSON.parse(text);
    } catch (_error) {
      return;
    }
    if (!message || typeof message !== "object") return;
    // Acks are handled by request promises.
    if ("id" in message && "result" in message) return;

    const type = message.type;
    if (type === "best_bid_offer") {
      this.handleBestBidOffer(message as NadoBestBidOfferEvent);
      return;
    }
    if (type === "trade") {
      this.handleTrade(message as NadoTradeEvent);
      return;
    }
    if (type === "order_update") {
      this.handleOrderUpdate(message as NadoOrderUpdateEvent);
      return;
    }
    if (type === "position_change") {
      this.handlePositionChange(message as NadoPositionChangeEvent);
      return;
    }
    if (type === "funding_rate") {
      this.handleFundingRate(message as NadoFundingRateEvent);
      return;
    }
    if (type === "latest_candlestick") {
      this.handleLatestCandlestick(message as NadoLatestCandlestickEvent);
      return;
    }
  }

  private handleBestBidOffer(event: NadoBestBidOfferEvent): void {
    this.bestBidOfferByProductId.set(event.product_id, {
      bidX18: event.bid_price,
      askX18: event.ask_price,
      bidQtyX18: event.bid_qty,
      askQtyX18: event.ask_qty,
      timestampNs: event.timestamp,
    });
    this.emitDepth(event.product_id);
    this.emitTicker(event.product_id);
  }

  private handleTrade(event: NadoTradeEvent): void {
    this.lastTradePriceByProductId.set(event.product_id, { priceX18: event.price, timestampNs: event.timestamp });
    this.emitTicker(event.product_id);
  }

  private handleOrderUpdate(event: NadoOrderUpdateEvent): void {
    const existing = this.openOrdersByDigest.get(event.digest);
    if (!existing) {
      // We'll refresh via poll loop; avoid spamming queries here.
      return;
    }
    existing.unfilledAmountX18 = event.amount;
    if (event.reason === "cancelled" || (event.reason === "filled" && event.amount === "0")) {
      this.openOrdersByDigest.delete(event.digest);
    }
    this.emitOrders();
  }

  private handlePositionChange(_event: NadoPositionChangeEvent): void {
    // Position change events do not contain enough context to rebuild a full snapshot reliably (oracle prices, etc).
    // We rely on subaccount_info polling for correctness.
    if (nowMs() - this.lastAccountSyncAt > Math.min(this.pollIntervals.account, 5_000)) {
      void this.refreshAccountSnapshot();
    }
  }

  private handleFundingRate(event: NadoFundingRateEvent): void {
    this.fundingRateByProductId.set(event.product_id, {
      rateX18: event.funding_rate_x18,
      updateTimeSec: event.update_time,
      timestampNs: event.timestamp,
    });
    this.emitFundingRate(event.product_id);
  }

  private handleLatestCandlestick(event: NadoLatestCandlestickEvent): void {
    for (const [key, state] of Array.from(this.klinesState.entries())) {
      if (state.productId !== event.product_id) continue;
      if (state.periodSec !== event.granularity) continue;
      const openTime = event.timestamp * 1000;
      const closeTime = openTime + state.periodSec * 1000 - 1;
      const next: AsterKline = {
        openTime,
        closeTime,
        open: fromX18(event.open_x18).toFixed(),
        high: fromX18(event.high_x18).toFixed(),
        low: fromX18(event.low_x18).toFixed(),
        close: fromX18(event.close_x18).toFixed(),
        volume: fromX18(event.volume).toFixed(),
        numberOfTrades: 0,
      };
      const existingIdx = state.klines.findIndex((k) => k.openTime === openTime);
      if (existingIdx >= 0) {
        state.klines[existingIdx] = next;
      } else {
        state.klines.push(next);
        if (state.klines.length > 500) {
          state.klines = state.klines.slice(-500);
        }
      }
      this.klinesState.set(key, state);
      this.emitKlines(key);
    }
  }

  private async createLimitOrder(meta: SymbolMeta, params: CreateOrderParams): Promise<AsterOrder> {
    if (!this.chainId) throw new Error("Nado not initialized (chainId missing)");
    const side = params.side;
    const qty = params.quantity ?? 0;
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("Invalid order quantity");
    }
    const price = params.price;
    if (price == null || !Number.isFinite(price) || price <= 0) {
      throw new Error("Invalid order price");
    }

    const amountX18Raw = toX18BigInt(qty);
    const priceX18 = toX18BigInt(price);
    const minSizeX18 = BigInt(meta.minSizeX18);
    const sizeIncrementX18 = BigInt(meta.sizeIncrementX18);
    const notionalX18 = (absBigInt(amountX18Raw) * priceX18) / X18_BIGINT;

    const amountX18 = (() => {
      if (notionalX18 >= minSizeX18) return absBigInt(amountX18Raw);
      const required = roundUpToIncrement(ceilDiv(minSizeX18 * X18_BIGINT, priceX18), sizeIncrementX18);
      if (this.minSizePolicy === "reject") {
        const current = fromX18(notionalX18.toString()).toFixed();
        const minimum = fromX18(minSizeX18.toString()).toFixed();
        const requiredQty = fromX18(required.toString()).toFixed();
        throw new Error(
          `Order size too small: notional ${current} < min_size ${minimum} (USDT0). ` +
            `At price ${new BigNumber(price).toFixed()} you need qty >= ${requiredQty}.`
        );
      }
      return required;
    })();

    const signedAmount = side === "SELL" ? -amountX18 : amountX18;

    const appendix = packOrderAppendix({
      orderExecutionType: mapTimeInForceToExecution(params.timeInForce),
      reduceOnly: params.reduceOnly === "true",
    });

    const orderParams = {
      subaccountOwner: this.subaccountOwner,
      subaccountName: this.subaccountName,
      price: new BigNumber(price).toFixed(),
      amount: signedAmount,
      expiration: 4294967295,
      nonce: getOrderNonce(),
      appendix,
    } as const;

    const signature = await getSignedTransactionRequest({
      requestType: "place_order",
      requestParams: orderParams,
      chainId: this.chainId,
      verifyingContract: getOrderVerifyingAddress(meta.productId),
      walletClient: this.walletClient,
    });

    const order = getNadoEIP712Values("place_order", orderParams) as any;

    const payload = {
      place_order: {
        product_id: meta.productId,
        order,
        signature,
        id: null,
      },
    };

    const response = await this.sendGatewayRequest<any>(payload);
    if (response?.status !== "success") {
      const code = parseNadoErrorCode(response?.error_code);
      throw this.decorateNadoError(response?.error ?? "place_order failed", code);
    }

    const digest = response?.data?.digest;
    const orderId = typeof digest === "string" && digest.startsWith("0x") ? digest : String(digest ?? "unknown");

    this.openOrdersByDigest.set(orderId, {
      digest: orderId,
      productId: meta.productId,
      priceX18: order.priceX18,
      amountX18: order.amount,
      unfilledAmountX18: order.amount,
      appendix: order.appendix,
      orderType: mapTimeInForceToExecution(params.timeInForce),
      placedAtSec: Math.floor(nowMs() / 1000),
    });
    this.emitOrders();

    const canonical = normalizeSymbolInput(meta.symbol);
    const displaySymbol = this.resolveDisplaySymbol(canonical, meta.symbol);
    return {
      orderId,
      clientOrderId: orderId,
      symbol: displaySymbol,
      side,
      type: "LIMIT",
      status: "NEW",
      price: String(price),
      origQty: fromX18(amountX18.toString()).toFixed(),
      executedQty: "0",
      stopPrice: "0",
      time: nowMs(),
      updateTime: nowMs(),
      reduceOnly: params.reduceOnly === "true",
      closePosition: params.closePosition === "true",
    };
  }

  private async createMarketOrder(meta: SymbolMeta, params: CreateOrderParams): Promise<AsterOrder> {
    if (!this.chainId) throw new Error("Nado not initialized (chainId missing)");
    const side = params.side;
    const qty = params.quantity ?? 0;
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("Invalid order quantity");
    }
    const priceIncrementX18 = BigInt(meta.priceIncrementX18);
    const bbo = this.bestBidOfferByProductId.get(meta.productId);
    const reference = (() => {
      if (bbo) {
        const best = side === "BUY" ? bbo.askX18 : bbo.bidX18;
        return fromX18(best);
      }
      const trade = this.lastTradePriceByProductId.get(meta.productId);
      if (trade) return fromX18(trade.priceX18);
      return null;
    })();
    if (!reference) {
      throw new Error("Market order rejected: missing best bid/offer");
    }
    const limitPriceRaw = side === "BUY"
      ? reference.multipliedBy(1 + this.marketSlippagePct)
      : reference.multipliedBy(1 - this.marketSlippagePct);
    const limitPriceX18 = alignPriceX18(toX18BigInt(limitPriceRaw), priceIncrementX18, side, "aggressive");
    const limitPrice = fromX18(limitPriceX18.toString());

    const amountX18Raw = toX18BigInt(qty);
    const priceX18 = limitPriceX18;
    const minSizeX18 = BigInt(meta.minSizeX18);
    const sizeIncrementX18 = BigInt(meta.sizeIncrementX18);
    const notionalX18 = (absBigInt(amountX18Raw) * priceX18) / X18_BIGINT;

    const amountX18 = (() => {
      if (notionalX18 >= minSizeX18) return absBigInt(amountX18Raw);
      const required = roundUpToIncrement(ceilDiv(minSizeX18 * X18_BIGINT, priceX18), sizeIncrementX18);
      if (this.minSizePolicy === "reject") {
        const current = fromX18(notionalX18.toString()).toFixed();
        const minimum = fromX18(minSizeX18.toString()).toFixed();
        const requiredQty = fromX18(required.toString()).toFixed();
        throw new Error(
          `Order size too small: notional ${current} < min_size ${minimum} (USDT0). ` +
            `At price ${limitPrice.toFixed()} you need qty >= ${requiredQty}.`
        );
      }
      return required;
    })();

    const signedAmount = side === "SELL" ? -amountX18 : amountX18;

    const appendix = packOrderAppendix({
      orderExecutionType: "ioc",
      reduceOnly: params.reduceOnly === "true",
    });

    const orderParams = {
      subaccountOwner: this.subaccountOwner,
      subaccountName: this.subaccountName,
      price: limitPrice.toFixed(),
      amount: signedAmount,
      expiration: 4294967295,
      nonce: getOrderNonce(),
      appendix,
    } as const;

    const signature = await getSignedTransactionRequest({
      requestType: "place_order",
      requestParams: orderParams,
      chainId: this.chainId,
      verifyingContract: getOrderVerifyingAddress(meta.productId),
      walletClient: this.walletClient,
    });

    const order = getNadoEIP712Values("place_order", orderParams) as any;

    const payload = {
      place_order: {
        product_id: meta.productId,
        order,
        signature,
        id: null,
      },
    };

    const response = await this.sendGatewayRequest<any>(payload);
    if (response?.status !== "success") {
      const code = parseNadoErrorCode(response?.error_code);
      throw this.decorateNadoError(response?.error ?? "place_order failed", code);
    }
    const digest = response?.data?.digest;
    const orderId = typeof digest === "string" && digest.startsWith("0x") ? digest : String(digest ?? "unknown");

    const canonical = normalizeSymbolInput(meta.symbol);
    const displaySymbol = this.resolveDisplaySymbol(canonical, meta.symbol);
    return {
      orderId,
      clientOrderId: orderId,
      symbol: displaySymbol,
      side,
      type: "MARKET",
      status: "NEW",
      price: limitPrice.toFixed(),
      origQty: fromX18(amountX18.toString()).toFixed(),
      executedQty: "0",
      stopPrice: "0",
      time: nowMs(),
      updateTime: nowMs(),
      reduceOnly: params.reduceOnly === "true",
      closePosition: params.closePosition === "true",
    };
  }

  private async createStopOrder(meta: SymbolMeta, params: CreateOrderParams): Promise<AsterOrder> {
    if (!this.chainId || !this.endpointAddr) throw new Error("Nado not initialized (contracts missing)");
    const side = params.side;
    const qty = params.quantity ?? 0;
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error("Invalid order quantity");
    }
    const priceIncrementX18 = BigInt(meta.priceIncrementX18);
    const stopPrice = params.stopPrice ?? 0;
    if (!Number.isFinite(stopPrice) || stopPrice <= 0) {
      throw new Error("Invalid stop price");
    }

    const stopPriceX18 = alignPriceX18(toX18BigInt(stopPrice), priceIncrementX18, side, "passive");
    const limitFromStopRaw = side === "BUY"
      ? fromX18(stopPriceX18.toString()).multipliedBy(1 + this.marketSlippagePct)
      : fromX18(stopPriceX18.toString()).multipliedBy(1 - this.marketSlippagePct);
    const limitFromStopX18 = alignPriceX18(toX18BigInt(limitFromStopRaw), priceIncrementX18, side, "aggressive");
    const limitFromStop = fromX18(limitFromStopX18.toString());

    const amountX18Raw = toX18BigInt(qty);
    const priceX18 = limitFromStopX18;
    const minSizeX18 = BigInt(meta.minSizeX18);
    const sizeIncrementX18 = BigInt(meta.sizeIncrementX18);
    const notionalX18 = (absBigInt(amountX18Raw) * priceX18) / X18_BIGINT;

    const amountX18 = (() => {
      if (notionalX18 >= minSizeX18) return absBigInt(amountX18Raw);
      const required = roundUpToIncrement(ceilDiv(minSizeX18 * X18_BIGINT, priceX18), sizeIncrementX18);
      if (this.minSizePolicy === "reject") {
        const current = fromX18(notionalX18.toString()).toFixed();
        const minimum = fromX18(minSizeX18.toString()).toFixed();
        const requiredQty = fromX18(required.toString()).toFixed();
        throw new Error(
          `Order size too small: notional ${current} < min_size ${minimum} (USDT0). ` +
            `At price ${limitFromStop.toFixed()} you need qty >= ${requiredQty}.`
        );
      }
      return required;
    })();

    const signedAmount = side === "SELL" ? -amountX18 : amountX18;

    const appendix = packOrderAppendix({
      orderExecutionType: "ioc",
      reduceOnly: true,
      triggerType: "price",
    });

    const requirementType: PriceTriggerRequirementType = (() => {
      const source = this.stopTriggerSource;
      if (source === "last") {
        return side === "BUY" ? "last_price_above" : "last_price_below";
      }
      if (source === "mid") {
        return side === "BUY" ? "mid_price_above" : "mid_price_below";
      }
      return side === "BUY" ? "oracle_price_above" : "oracle_price_below";
    })();

    const nonce = getOrderNonce();
    const executeResponse = await this.trigger.placeTriggerOrder({
      chainId: this.chainId,
      verifyingAddr: getOrderVerifyingAddress(meta.productId),
      productId: meta.productId,
      nonce,
      order: {
        subaccountOwner: this.subaccountOwner,
        subaccountName: this.subaccountName,
        price: limitFromStop.toFixed(),
        amount: signedAmount,
        expiration: 4294967295,
        appendix,
      },
      triggerCriteria: {
        type: "price",
        criteria: {
          type: requirementType,
          triggerPrice: fromX18(stopPriceX18.toString()).toFixed(),
        },
      } as any,
    } as any);

    const digest = executeResponse?.data?.digest ?? null;
    const orderId = typeof digest === "string" && digest.startsWith("0x") ? digest : String(digest ?? "unknown");

    this.triggerOrdersByDigest.set(orderId, {
      digest: orderId,
      productId: meta.productId,
      priceX18: String(toX18BigInt(limitFromStop.toFixed())),
      amountX18: String(signedAmount),
      appendix: String(appendix),
      trigger: { stopPriceX18: String(stopPriceX18) },
      status: "waiting_price",
      updatedAtMs: nowMs(),
    });
    this.emitOrders();

    const canonical = normalizeSymbolInput(meta.symbol);
    const displaySymbol = this.resolveDisplaySymbol(canonical, meta.symbol);
    return {
      orderId,
      clientOrderId: orderId,
      symbol: displaySymbol,
      side,
      type: "STOP_MARKET",
      status: "NEW",
      price: limitFromStop.toFixed(),
      origQty: fromX18(amountX18.toString()).toFixed(),
      executedQty: "0",
      stopPrice: fromX18(stopPriceX18.toString()).toFixed(),
      time: nowMs(),
      updateTime: nowMs(),
      reduceOnly: true,
      closePosition: true,
    };
  }

  private async sendCancelOrders(productId: number, digests: string[]): Promise<void> {
    if (!this.chainId || !this.endpointAddr) throw new Error("Nado not initialized (contracts missing)");
    const nonce = getOrderNonce();
    const cancelParams = {
      subaccountOwner: this.subaccountOwner,
      subaccountName: this.subaccountName,
      productIds: digests.map(() => productId),
      digests,
      nonce,
    } as const;
    const signature = await getSignedTransactionRequest({
      requestType: "cancel_orders",
      requestParams: cancelParams,
      chainId: this.chainId,
      verifyingContract: this.endpointAddr,
      walletClient: this.walletClient,
    });
    const tx = getNadoEIP712Values("cancel_orders", cancelParams) as any;
    const payload = { cancel_orders: { tx, signature } };
    const response = await this.sendGatewayRequest<any>(payload);
    if (response?.status !== "success") {
      const code = parseNadoErrorCode(response?.error_code);
      throw this.decorateNadoError(response?.error ?? "cancel_orders failed", code);
    }
  }

  private async sendCancelProductOrders(productIds: number[]): Promise<void> {
    if (!this.chainId || !this.endpointAddr) throw new Error("Nado not initialized (contracts missing)");
    const nonce = getOrderNonce();
    const cancelParams = {
      subaccountOwner: this.subaccountOwner,
      subaccountName: this.subaccountName,
      productIds,
      nonce,
    } as const;
    const signature = await getSignedTransactionRequest({
      requestType: "cancel_product_orders",
      requestParams: cancelParams,
      chainId: this.chainId,
      verifyingContract: this.endpointAddr,
      walletClient: this.walletClient,
    });
    const tx = getNadoEIP712Values("cancel_product_orders", cancelParams) as any;
    const payload = { cancel_product_orders: { tx, signature, digest: null } };
    const response = await this.sendGatewayRequest<any>(payload);
    if (response?.status !== "success") {
      const code = parseNadoErrorCode(response?.error_code);
      throw this.decorateNadoError(response?.error ?? "cancel_product_orders failed", code);
    }
  }

  private async cancelTriggerOrders(productId: number, digests: string[]): Promise<void> {
    if (!this.chainId || !this.endpointAddr) throw new Error("Nado not initialized (contracts missing)");
    await this.trigger.cancelTriggerOrders({
      chainId: this.chainId,
      verifyingAddr: this.endpointAddr,
      subaccountOwner: this.subaccountOwner,
      subaccountName: this.subaccountName,
      productIds: digests.map(() => productId),
      digests,
    });
  }

  private async cancelTriggerProductOrders(productIds: number[]): Promise<void> {
    if (!this.chainId || !this.endpointAddr) throw new Error("Nado not initialized (contracts missing)");
    await this.trigger.cancelProductOrders({
      chainId: this.chainId,
      verifyingAddr: this.endpointAddr,
      subaccountOwner: this.subaccountOwner,
      subaccountName: this.subaccountName,
      productIds,
    });
  }

  private rememberDisplaySymbol(rawSymbol: string): string {
    const trimmed = (rawSymbol ?? "").trim();
    const canonical = normalizeSymbolInput(trimmed);
    if (trimmed && !this.displaySymbolByCanonical.has(canonical)) {
      this.displaySymbolByCanonical.set(canonical, trimmed);
    }
    return canonical;
  }

  private resolveDisplaySymbol(canonical: string, fallback: string): string {
    return this.displaySymbolByCanonical.get(canonical) ?? fallback;
  }
}
