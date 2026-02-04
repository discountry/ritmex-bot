import ccxt, {
  type Balances,
  type Order as CcxtOrder,
  type OrderBook as CcxtOrderBook,
  type OHLCV as CcxtOhlcv,
  type Ticker as CcxtTicker,
} from "ccxt";
import { createRequire } from "module";
import type {
  AsterAccountAsset,
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
  OrderType,
} from "../types";
import type {
  AccountListener,
  DepthListener,
  KlineListener,
  OrderListener,
  TickerListener,
} from "../adapter";
import { extractMessage } from "../../utils/errors";

const require = createRequire(import.meta.url);

function loadCcxtPro(): any | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("ccxt.pro");
    return mod?.default ?? mod;
  } catch (_error) {
    return null;
  }
}

export interface ParadexGatewayOptions {
  symbol: string;
  displaySymbol: string;
  privateKey?: string;
  walletAddress?: string;
  paradexAccount?: {
    privateKey: string;
    publicKey: string;
    address: string;
  };
  sandbox?: boolean;
  logger?: (context: string, error: unknown) => void;
  pollIntervals?: {
    account?: number;
    orders?: number;
    depth?: number;
    ticker?: number;
    klines?: number;
  };
  usePro?: boolean;
  watchReconnectDelayMs?: number;
}

interface ProLoopControl {
  running: boolean;
}

type ParadexPollingConfig = {
  account: number;
  orders: number;
  depth: number;
  ticker: number;
  klines: number;
};

export class ParadexGateway {
  private readonly exchange: any;
  private readonly hasPro: boolean;
  private readonly symbol: string;
  private marketSymbol: string;
  private readonly displaySymbol: string;
  private readonly logger: (context: string, error: unknown) => void;
  private readonly pollIntervals: ParadexPollingConfig;
  private readonly reconnectDelayMs: number;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private destroyed = false;
  private onboardingChecked = false;

  private accountListeners = new Set<AccountListener>();
  private orderListeners = new Set<OrderListener>();
  private depthListeners = new Set<DepthListener>();
  private tickerListeners = new Set<TickerListener>();
  private klineListeners = new Map<string, Set<KlineListener>>();
  private readonly localOrders = new Map<string, AsterOrder>();
  private lastBalanceSnapshot: AsterAccountSnapshot | null = null;

  private accountPollTimer: NodeJS.Timeout | null = null;
  private orderPollTimer: NodeJS.Timeout | null = null;
  private depthPollTimer: NodeJS.Timeout | null = null;
  private tickerPollTimer: NodeJS.Timeout | null = null;
  private klinePollTimers = new Map<string, NodeJS.Timeout>();

  private proLoops = new Map<string, ProLoopControl>();
  private klineProLoops = new Map<string, ProLoopControl>();

  constructor(options: ParadexGatewayOptions) {
    this.symbol = options.symbol;
    this.marketSymbol = this.symbol;
    this.displaySymbol = options.displaySymbol;
    this.logger = options.logger ?? ((context, error) => console.error(`[ParadexGateway] ${context}:`, error));
    this.pollIntervals = {
      account: options.pollIntervals?.account ?? 5000,
      orders: options.pollIntervals?.orders ?? 2000,
      depth: options.pollIntervals?.depth ?? 1000,
      ticker: options.pollIntervals?.ticker ?? 2000,
      klines: options.pollIntervals?.klines ?? 5000,
    };
    this.reconnectDelayMs = options.watchReconnectDelayMs ?? 2000;

    const ccxtProModule = options.usePro === false ? null : loadCcxtPro();
    this.hasPro = Boolean(ccxtProModule && ccxtProModule.paradex);

    const ExchangeCtor = this.hasPro ? ccxtProModule.paradex : (ccxt as any).paradex;

    const exchangeOptions: Record<string, unknown> = {
      enableRateLimit: true,
      timeout: 30000,
      sandboxMode: options.sandbox ?? false,
    };

    if (options.privateKey) {
      exchangeOptions.privateKey = options.privateKey;
    }
    exchangeOptions.walletAddress = options.walletAddress;

    this.exchange = new ExchangeCtor(exchangeOptions);
  }

  async ensureInitialized(symbol?: string): Promise<void> {
    if (this.destroyed) {
      throw new Error("Paradex gateway destroyed");
    }
    if (this.initialized) {
      if (symbol && symbol.toUpperCase() !== this.marketSymbol) {
        const resolved = this.resolveMarketSymbol(symbol.toUpperCase());
        if (!resolved) {
          throw new Error(`Symbol ${symbol} not found in Paradex markets`);
        }
        this.marketSymbol = resolved;
      }
      return;
    }
    if (this.initPromise) return this.initPromise;
    this.initPromise = this.doInitialize(symbol)
      .then((value) => {
        this.initialized = true;
        return value;
      })
      .catch((error) => {
        this.initPromise = null;
        throw error;
      });
    return this.initPromise;
  }

  private async doInitialize(symbol?: string): Promise<void> {
    try {
      await this.exchange.loadMarkets();
      const requested = symbol ?? this.symbol;
      const resolved = this.resolveMarketSymbol(requested);
      if (!resolved) {
        throw new Error(`Symbol ${requested} not found in Paradex markets`);
      }
      this.marketSymbol = resolved;
      await this.verifyAccountAccess();
      this.logger("initialize", `Paradex gateway initialized for ${this.marketSymbol}${this.hasPro ? " (pro)" : ""}`);
    } catch (error) {
      this.logger("initialize", error);
      throw error;
    }
  }

  private resolveMarketSymbol(requested: string): string | null {
    const symbol = (requested ?? "").trim();
    if (!symbol) {
      return null;
    }

    const markets = this.exchange.markets ?? {};
    const marketsById = this.exchange.markets_by_id ?? {};

    if (markets[symbol]) {
      return markets[symbol].symbol;
    }

    if (typeof this.exchange.market === "function") {
      try {
        const market = this.exchange.market(symbol);
        if (market?.symbol) {
          return market.symbol;
        }
      } catch {
        /* ignore */
      }
    }

    const lower = symbol.toLowerCase();
    for (const candidate of this.exchange.symbols ?? []) {
      if (candidate.toLowerCase() === lower && markets[candidate]) {
        return markets[candidate].symbol;
      }
    }

    if (marketsById[symbol]) {
      const entry = marketsById[symbol];
      if (Array.isArray(entry) && entry.length > 0) {
        return (entry[0] as any).symbol ?? null;
      }
      return (entry as any).symbol ?? null;
    }

    for (const [id, market] of Object.entries(marketsById)) {
      if (id.toLowerCase() === lower) {
        if (Array.isArray(market) && market.length > 0) {
          return (market[0] as any).symbol ?? null;
        }
        return (market as any).symbol ?? null;
      }
    }

    return null;
  }

  destroy(): void {
    this.destroyed = true;
    for (const [, control] of this.proLoops) {
      control.running = false;
    }
    for (const [, control] of this.klineProLoops) {
      control.running = false;
    }
    this.clearPolling();
    if (typeof this.exchange.close === "function") {
      try {
        void this.exchange.close();
      } catch (error) {
        this.logger("destroy", error);
      }
    }
  }

  private clearPolling(): void {
    if (this.accountPollTimer) {
      clearInterval(this.accountPollTimer);
      this.accountPollTimer = null;
    }
    if (this.orderPollTimer) {
      clearInterval(this.orderPollTimer);
      this.orderPollTimer = null;
    }
    if (this.depthPollTimer) {
      clearInterval(this.depthPollTimer);
      this.depthPollTimer = null;
    }
    if (this.tickerPollTimer) {
      clearInterval(this.tickerPollTimer);
      this.tickerPollTimer = null;
    }
    for (const timer of this.klinePollTimers.values()) {
      clearInterval(timer);
    }
    this.klinePollTimers.clear();
  }

  onAccount(callback: AccountListener): void {
    this.accountListeners.add(callback);
    if (this.lastBalanceSnapshot) {
      try {
        callback(this.lastBalanceSnapshot);
      } catch (error) {
        this.logger("accountReplay", error);
      }
    }
    if (this.hasPro) {
      this.startProLoop("account", () => this.watchAccountLoop());
    } else {
      this.startAccountPolling();
    }
  }

  onOrders(callback: OrderListener): void {
    this.orderListeners.add(callback);
    this.emitCurrentOrders();
    if (this.hasPro) {
      this.startProLoop("orders", () => this.watchOrdersLoop());
    } else {
      this.startOrderPolling();
    }
  }

  onDepth(callback: DepthListener): void {
    this.depthListeners.add(callback);
    if (this.hasPro) {
      this.startProLoop("depth", () => this.watchDepthLoop());
    } else {
      this.startDepthPolling();
    }
  }

  onTicker(callback: TickerListener): void {
    this.tickerListeners.add(callback);
    if (this.hasPro) {
      this.startProLoop("ticker", () => this.watchTickerLoop());
    } else {
      this.startTickerPolling();
    }
  }

  watchKlines(interval: string, callback: KlineListener): void {
    const normalizedInterval = this.normalizeInterval(interval);
    if (!this.klineListeners.has(normalizedInterval)) {
      this.klineListeners.set(normalizedInterval, new Set());
    }
    this.klineListeners.get(normalizedInterval)?.add(callback);
    if (this.hasPro) {
      this.startKlineProLoop(normalizedInterval);
    } else {
      this.startKlinePolling(normalizedInterval);
    }
  }

  private startProLoop(key: string, pump: () => Promise<void>): void {
    if (this.proLoops.has(key)) return;
    const control: ProLoopControl = { running: true };
    this.proLoops.set(key, control);
    void this.runProLoop(key, control, pump);
  }

  private async runProLoop(key: string, control: ProLoopControl, pump: () => Promise<void>): Promise<void> {
    while (!this.destroyed && control.running) {
      try {
        await this.ensureInitialized();
        await pump();
      } catch (error) {
        this.logger(`${key}Loop`, error);
        await this.sleep(this.reconnectDelayMs);
      }
    }
    this.proLoops.delete(key);
  }

  private startKlineProLoop(interval: string): void {
    if (this.klineProLoops.has(interval)) return;
    const control: ProLoopControl = { running: true };
    this.klineProLoops.set(interval, control);
    void this.runKlineProLoop(interval, control);
  }

  private async runKlineProLoop(interval: string, control: ProLoopControl): Promise<void> {
    const key = `klines:${interval}`;
    while (!this.destroyed && control.running) {
      try {
        await this.ensureInitialized();
        if (!this.klineListeners.get(interval)?.size) {
          await this.sleep(500);
          continue;
        }
    const raw = (await this.exchange.watchOHLCV(this.marketSymbol, interval)) as unknown;
    const candles = Array.isArray(raw) && Array.isArray(raw[0]) ? (raw as CcxtOhlcv[]) : [raw as CcxtOhlcv];
        const klines = candles
          .filter((candle) => Array.isArray(candle) && candle.length >= 6)
          .map((candle) => this.mapOHLCVToKline(candle as CcxtOhlcv, interval));
        for (const listener of this.klineListeners.get(interval) ?? []) {
          listener(klines);
        }
      } catch (error) {
        this.logger(key, error);
        await this.sleep(this.reconnectDelayMs);
      }
    }
    this.klineProLoops.delete(interval);
  }

  private async watchAccountLoop(): Promise<void> {
    if (!this.accountListeners.size) {
      await this.sleep(500);
      return;
    }
    await this.fetchAndEmitAccount();
    const hasWatchPositions = typeof (this.exchange as any).watchPositions === "function";
    if (hasWatchPositions) {
      try {
        const raw = await (this.exchange as any).watchPositions([this.marketSymbol]);
        this.logger("watchPositionsRaw", JSON.stringify(raw));
        if (Array.isArray(raw)) {
          const snapshot = this.mapBalanceToAccountSnapshotFromPositions(raw);
          this.lastBalanceSnapshot = snapshot;
          for (const listener of this.accountListeners) {
            listener(snapshot);
          }
        }
      } catch (error) {
        this.logger("watchPositions", error);
      }
    }
    await this.sleep(this.pollIntervals.account);
  }

  private async watchOrdersLoop(): Promise<void> {
    if (!this.orderListeners.size) {
      await this.sleep(500);
      return;
    }
    const rawSymbol = this.exchange.marketId(this.displaySymbol) ?? this.marketSymbol;
    const raw = (await this.exchange.watchOrders(rawSymbol)) as unknown;
    const ordersArray = Array.isArray(raw) ? (raw as CcxtOrder[]) : [raw as CcxtOrder];
    this.updateOrdersFromRemote(ordersArray, []);
  }

  private async watchDepthLoop(): Promise<void> {
    if (!this.depthListeners.size) {
      await this.sleep(500);
      return;
    }
    const depth = (await this.exchange.watchOrderBook(this.marketSymbol, 50)) as CcxtOrderBook;
    const mapped = this.mapOrderBookToDepth(depth);
    for (const listener of this.depthListeners) {
      listener(mapped);
    }
  }

  private async watchTickerLoop(): Promise<void> {
    if (!this.tickerListeners.size) {
      await this.sleep(500);
      return;
    }
    const ticker = (await this.exchange.watchTicker(this.marketSymbol)) as CcxtTicker;
    const mapped = this.mapTickerToAsterTicker(ticker);
    for (const listener of this.tickerListeners) {
      listener(mapped);
    }
  }

  private startAccountPolling(): void {
    if (this.accountPollTimer) return;
    const poll = async () => {
      try {
        await this.ensureInitialized();
        await this.fetchAndEmitAccount();
      } catch (error) {
        this.logger("accountPoll", error);
      }
    };
    void poll();
    this.accountPollTimer = setInterval(() => void poll(), this.pollIntervals.account);
  }

  private startOrderPolling(): void {
    if (this.orderPollTimer) return;
    const poll = async () => {
      try {
        await this.ensureInitialized();

        let openOrders: CcxtOrder[] = [];
        let closedOrders: CcxtOrder[] = [];

        try {
          openOrders = (await this.exchange.fetchOpenOrders(this.marketSymbol)) as CcxtOrder[];
        } catch (error) {
          this.logger("orderPollOpen", error);
        }

        try {
          closedOrders = (await this.exchange.fetchClosedOrders(
            this.marketSymbol,
            undefined,
            50
          )) as CcxtOrder[];
        } catch (error) {
          this.logger("orderPollClosed", error);
        }

        this.updateOrdersFromRemote(openOrders, closedOrders);
      } catch (error) {
        this.logger("orderPoll", error);
        this.emitCurrentOrders();
      }
    };
    void poll();
    this.orderPollTimer = setInterval(() => void poll(), this.pollIntervals.orders);
  }

  private startDepthPolling(): void {
    if (this.depthPollTimer) return;
    const poll = async () => {
      try {
        await this.ensureInitialized();
        const orderbook = (await this.exchange.fetchOrderBook(this.marketSymbol, 50)) as CcxtOrderBook;
        const depth = this.mapOrderBookToDepth(orderbook);
        for (const listener of this.depthListeners) {
          listener(depth);
        }
      } catch (error) {
        this.logger("depthPoll", error);
      }
    };
    void poll();
    this.depthPollTimer = setInterval(() => void poll(), this.pollIntervals.depth);
  }

  private startTickerPolling(): void {
    if (this.tickerPollTimer) return;
    const poll = async () => {
      try {
        await this.ensureInitialized();
        const ticker = (await this.exchange.fetchTicker(this.marketSymbol)) as CcxtTicker;
        const mapped = this.mapTickerToAsterTicker(ticker);
        for (const listener of this.tickerListeners) {
          listener(mapped);
        }
      } catch (error) {
        this.logger("tickerPoll", error);
      }
    };
    void poll();
    this.tickerPollTimer = setInterval(() => void poll(), this.pollIntervals.ticker);
  }

  private startKlinePolling(interval: string): void {
    if (this.klinePollTimers.has(interval)) return;
    const poll = async () => {
      try {
        await this.ensureInitialized();
        const ohlcv = (await this.exchange.fetchOHLCV(this.marketSymbol, interval, undefined, 100)) as CcxtOhlcv[];
        const klines = ohlcv
          .filter((candle) => Array.isArray(candle) && candle.length >= 6)
          .map((candle) => this.mapOHLCVToKline(candle as CcxtOhlcv, interval));
        for (const listener of this.klineListeners.get(interval) ?? []) {
          listener(klines);
        }
      } catch (error) {
        this.logger(`klinePoll:${interval}`, error);
      }
    };
    void poll();
    this.klinePollTimers.set(interval, setInterval(() => void poll(), this.pollIntervals.klines));
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized(params.symbol);
    const symbol = this.marketSymbol;
    const type = this.mapOrderTypeToCcxt(params.type);
    const side = params.side.toLowerCase();
    let amount = params.quantity;
    const price = params.price;

    const extraParams: Record<string, unknown> = {};
    if (params.stopPrice !== undefined) extraParams.stopPrice = params.stopPrice;
    if (params.timeInForce) extraParams.timeInForce = params.timeInForce;
    if (params.reduceOnly !== undefined) {
      extraParams.reduceOnly = params.reduceOnly === "true";
    }
    if (params.closePosition !== undefined) {
      // propagate closePosition flag to the exchange params when provided
      (extraParams as any).closePosition = params.closePosition === "true";
    }

    // Normalize amount for Paradex according to market precision/limits.
    // For STOP_MARKET closePosition orders, prefer using the current position size.
    try {
      const market = typeof (this.exchange as any).market === "function"
        ? (this.exchange as any).market(symbol)
        : (this.exchange.markets ?? {})[symbol];
      const precisionDigits = Number((market?.precision?.amount ?? market?.amountPrecision));
      const limitMin = Number(market?.limits?.amount?.min);
      // Only trust explicit exchange min limit; do NOT infer 1 from precision=0
      const minAmount = Number.isFinite(limitMin) && limitMin > 0 ? limitMin : undefined;

      // If closePosition is requested and amount is missing or too small, prefer using current position size
      const isClosePosition = (extraParams as any).closePosition === true;
      if (isClosePosition) {
        const posAbs = this.getCurrentPositionAbs();
        if (Number.isFinite(posAbs) && posAbs > 0) {
          amount = posAbs;
        }
        const current = Number(amount);
        if (!Number.isFinite(current) || current <= 0 || (minAmount !== undefined && current < minAmount)) {
          amount = (minAmount as number) ?? 1e-5; // fallback if market data is missing
        }
      }

      // Quantize to exchange precision if helper is available (safe for STOP orders)
      if (typeof (this.exchange as any).amountToPrecision === "function" && Number.isFinite(Number(amount))) {
        amount = Number((this.exchange as any).amountToPrecision(symbol, amount));
      }
    } catch (_normalizeError) {
      // Swallow precision normalization errors and let exchange validation surface if any
    }

    try {
      const isClosePosition = (extraParams as any).closePosition === true;
      // Only omit amount for MARKET close-position orders; STOP requires explicit size
      const shouldOmitAmount = isClosePosition && type === "market";
      const amountArg: any = shouldOmitAmount ? undefined : amount;
      // Paradex/ccxt may require `size` even when amount is omitted for closePosition MARKET orders.
      if (shouldOmitAmount && amount != null && extraParams.size === undefined) {
        extraParams.size = amount.toString();
      } else if (!shouldOmitAmount && amountArg != null && extraParams.size === undefined) {
        extraParams.size = amountArg.toString();
      }
      const order = (await this.exchange.createOrder(
        symbol,
        type,
        side,
        amountArg,
        price,
        extraParams
      )) as CcxtOrder;
      const mapped = this.mapOrderToAsterOrder(order);
      this.upsertLocalOrder(mapped);
      return mapped;
    } catch (error) {
      throw new Error(`Paradex createOrder failed: ${extractMessage(error)}`);
    }
  }

  private getCurrentPositionAbs(): number | undefined {
    const snapshot = this.lastBalanceSnapshot;
    if (!snapshot) return undefined;
    const pos = (snapshot.positions || []).find((p) => p.symbol === this.displaySymbol);
    if (!pos) return undefined;
    const amt = Number(pos.positionAmt);
    if (!Number.isFinite(amt)) return undefined;
    return Math.abs(amt);
  }

  async cancelOrder(params: { symbol: string; orderId: number | string }): Promise<void> {
    await this.ensureInitialized(params.symbol);
    try {
      await this.exchange.cancelOrder(params.orderId, this.marketSymbol);
      this.removeLocalOrder(String(params.orderId));
    } catch (error) {
      throw new Error(`Paradex cancelOrder failed: ${extractMessage(error)}`);
    }
  }

  async cancelOrders(params: { symbol: string; orderIdList: Array<number | string> }): Promise<void> {
    await this.ensureInitialized(params.symbol);
    const errors: Array<{ id: number | string; error: unknown }> = [];
    await Promise.all(
      params.orderIdList.map(async (orderId) => {
        try {
          await this.exchange.cancelOrder(orderId, this.marketSymbol);
          this.removeLocalOrder(String(orderId));
        } catch (error) {
          errors.push({ id: orderId, error });
        }
      })
    );
    if (errors.length) {
      const messages = errors.map((entry) => `${entry.id}: ${extractMessage(entry.error)}`).join("; ");
      throw new Error(`Paradex cancelOrders failed for ${messages}`);
    }
  }

  async cancelAllOrders(_params: { symbol: string }): Promise<void> {
    await this.ensureInitialized();
    try {
      if (typeof this.exchange.cancelAllOrders === "function") {
        await this.exchange.cancelAllOrders(this.marketSymbol);
      } else {
        const openOrders = (await this.exchange.fetchOpenOrders(this.marketSymbol)) as CcxtOrder[];
        await Promise.all(openOrders.map((order) => this.exchange.cancelOrder(order.id, this.marketSymbol)));
      }
      this.localOrders.clear();
      this.emitCurrentOrders();
    } catch (error) {
      throw new Error(`Paradex cancelAllOrders failed: ${extractMessage(error)}`);
    }
  }

  private mapBalanceToAccountSnapshot(balance: Balances): AsterAccountSnapshot {
    const now = Date.now();

    const rawPositions = (() => {
      const info = (balance as unknown as { info?: { positions?: unknown } })?.info;
      const positionsValue = info?.positions;
      if (!positionsValue) return [] as Array<any>;
      if (Array.isArray(positionsValue)) return positionsValue as Array<any>;
      return Object.values(positionsValue as Record<string, unknown>);
    })();

    const positions = this.normalizePositions(rawPositions, now);
    this.logger("positions", JSON.stringify({ raw: rawPositions, mapped: positions }));

    this.logger(
      "balanceSnapshot",
      JSON.stringify({
        total: balance.total,
        free: balance.free,
        used: balance.used,
      })
    );

    const free = (balance.free ?? {}) as Record<string, number | undefined>;
    const used = (balance.used ?? {}) as Record<string, number | undefined>;
    const total = (balance.total ?? {}) as Record<string, number | undefined>;

    const assetKeys = new Set<string>([
      ...Object.keys(free),
      ...Object.keys(used),
      ...Object.keys(total),
    ]);

    const assets: AsterAccountAsset[] = Array.from(assetKeys).map((asset) => ({
      asset,
      walletBalance: String(total[asset] ?? 0),
      availableBalance: String(free[asset] ?? 0),
      updateTime: now,
    }));

    const totalWalletBalance = Array.from(assetKeys).reduce((acc, asset) => {
      const value = total[asset];
      return acc + (typeof value === "number" ? value : Number(value ?? 0));
    }, 0);

    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: now,
      totalWalletBalance: totalWalletBalance.toString(),
      totalUnrealizedProfit: positions
        .reduce((acc, pos) => acc + Number(pos.unrealizedProfit ?? 0), 0)
        .toString(),
      positions,
      assets,
    };
  }

  private mapBalanceToAccountSnapshotFromPositions(rawPositions: any[]): AsterAccountSnapshot {
    const now = Date.now();
    const positions = this.normalizePositions(rawPositions, now);
    this.logger("positions", JSON.stringify({ raw: rawPositions, mapped: positions }));
    const snapshot = this.lastBalanceSnapshot ?? {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: now,
      totalWalletBalance: "0",
      totalUnrealizedProfit: "0",
      positions: [],
      assets: [],
    };
    return {
      ...snapshot,
      updateTime: now,
      totalUnrealizedProfit: positions
        .reduce((acc, pos) => acc + Number(pos.unrealizedProfit ?? 0), 0)
        .toString(),
      positions,
    };
  }

  private normalizePositions(rawPositions: any[], now: number): AsterAccountSnapshot["positions"] {
    return rawPositions
      .filter((pos) => pos)
      .map((pos: any) => {
        const rawSymbol =
          pos?.symbol ?? pos?.instrument ?? pos?.market ?? pos?.info?.market ?? this.marketSymbol;
        const normalizedSymbol =
          rawSymbol === this.marketSymbol || rawSymbol === this.displaySymbol
            ? this.displaySymbol
            : String(rawSymbol ?? this.displaySymbol);

        const quantityRaw =
          pos?.positionAmt ?? pos?.contracts ?? pos?.size ?? pos?.amount ?? pos?.info?.size ?? 0;
        let quantityNum = Number(quantityRaw);
        if (!Number.isFinite(quantityNum)) {
          quantityNum = Number(pos?.size ?? pos?.positionAmt ?? 0);
        }
        const rawSide = String(
          pos?.side ?? pos?.info?.side ?? pos?.positionSide ?? pos?.position_side ?? ""
        ).toLowerCase();
        const isShort = rawSide.includes("short") || rawSide.includes("sell");
        const positionAmt = isShort ? -Math.abs(quantityNum) : Math.abs(quantityNum);

        const entryPrice =
          pos?.entryPrice ??
          pos?.averageEntryPrice ??
          pos?.info?.average_entry_price ??
          pos?.entry_price ??
          "0";
        const unrealized =
          pos?.unrealizedPnl ??
          pos?.info?.unrealized_pnl ??
          pos?.unrealized_profit ??
          "0";

        return {
          symbol: normalizedSymbol,
          positionAmt: positionAmt.toString(),
          entryPrice: String(entryPrice ?? "0"),
          unrealizedProfit: String(unrealized ?? "0"),
          positionSide: "BOTH" as const,
          updateTime: now,
        };
      });
  }

  private mapOrderToAsterOrder(order: CcxtOrder): AsterOrder {
    const side = (order.side ?? "buy").toUpperCase() as "BUY" | "SELL";
    const mappedType = this.mapCcxtOrderTypeToAster(order.type);
    return {
      orderId: String(order.id ?? ""),
      clientOrderId: (order.clientOrderId as any as string) || "",
      symbol: this.displaySymbol,
      side,
      type: mappedType,
      status: (order.status as any as string) || "",
      price: order.price?.toString() || "0",
      origQty: order.amount?.toString() || "0",
      executedQty: order.filled?.toString() || "0",
      stopPrice: order.stopPrice?.toString() || "0",
      time: order.timestamp || Date.now(),
      updateTime: order.lastUpdateTimestamp || Date.now(),
      reduceOnly: Boolean((order.info?.reduceOnly as boolean | undefined) ?? false),
      closePosition: Boolean((order.info?.closePosition as boolean | undefined) ?? false),
      avgPrice: order.average?.toString(),
      cumQuote: order.cost?.toString(),
    };
  }

  private mapOrderBookToDepth(orderbook: CcxtOrderBook): AsterDepth {
    return {
      lastUpdateId: orderbook.nonce || Date.now(),
      bids: (orderbook.bids || [])
        .filter((t) => t && t.length >= 2)
        .map(([price, amount]) => [String(price ?? 0), String(amount ?? 0)]),
      asks: (orderbook.asks || [])
        .filter((t) => t && t.length >= 2)
        .map(([price, amount]) => [String(price ?? 0), String(amount ?? 0)]),
      eventTime: orderbook.timestamp,
    };
  }

  private mapTickerToAsterTicker(ticker: CcxtTicker): AsterTicker {
    return {
      symbol: ticker.symbol,
      lastPrice: ticker.last?.toString() || "0",
      openPrice: ticker.open?.toString() || "0",
      highPrice: ticker.high?.toString() || "0",
      lowPrice: ticker.low?.toString() || "0",
      volume: ticker.baseVolume?.toString() || "0",
      quoteVolume: ticker.quoteVolume?.toString() || "0",
      eventTime: ticker.timestamp,
    };
  }

  private mapOHLCVToKline(candle: CcxtOhlcv, interval: string): AsterKline {
    const [timestampRaw, openRaw, highRaw, lowRaw, closeRaw, volumeRaw] = candle;
    const timestamp = typeof timestampRaw === "number" && Number.isFinite(timestampRaw)
      ? timestampRaw
      : Date.now();
    const open = Number(openRaw ?? 0);
    const high = Number(highRaw ?? 0);
    const low = Number(lowRaw ?? 0);
    const close = Number(closeRaw ?? 0);
    const volume = Number(volumeRaw ?? 0);
    return {
      openTime: timestamp,
      closeTime: timestamp + this.getIntervalMs(interval),
      open: open.toString(),
      high: high.toString(),
      low: low.toString(),
      close: close.toString(),
      volume: volume.toString(),
      numberOfTrades: 0,
    };
  }

  private mapOrderTypeToCcxt(type: string): string {
    const typeMap: Record<string, string> = {
      LIMIT: "limit",
      MARKET: "market",
      STOP_MARKET: "stop",
      TRAILING_STOP_MARKET: "trailing-stop",
    };
    return typeMap[type] || "limit";
  }

  private mapCcxtOrderTypeToAster(type: string | undefined): OrderType {
    const typeMap: Record<string, OrderType> = {
      limit: "LIMIT",
      market: "MARKET",
      stop: "STOP_MARKET",
      "trailing-stop": "TRAILING_STOP_MARKET",
    };
    return type ? typeMap[type] ?? "LIMIT" : "LIMIT";
  }

  private normalizeInterval(interval: string): string {
    const map: Record<string, string> = {
      "1m": "1m",
      "3m": "3m",
      "5m": "5m",
      "15m": "15m",
      "30m": "30m",
      "1h": "1h",
      "4h": "4h",
      "1d": "1d",
    };
    return map[interval] ?? "1m";
  }

  private getIntervalMs(interval: string): number {
    const base: Record<string, number> = {
      "1m": 60 * 1000,
      "3m": 3 * 60 * 1000,
      "5m": 5 * 60 * 1000,
      "15m": 15 * 60 * 1000,
      "30m": 30 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "4h": 4 * 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
    };
    return base[interval] ?? 60 * 1000;
  }

  private upsertLocalOrder(order: AsterOrder): void {
    const key = String(order.orderId);
    if (this.isOrderClosed(order)) {
      this.localOrders.delete(key);
      this.emitCurrentOrders();
      return;
    }
    this.localOrders.set(key, order);
    this.emitCurrentOrders();
  }

  private removeLocalOrder(orderId: string): void {
    if (this.localOrders.delete(orderId)) {
      this.emitCurrentOrders();
    }
  }

  private updateOrdersFromRemote(open: CcxtOrder[], closed: CcxtOrder[]): void {
    const nextOpen = new Map<string, AsterOrder>();

    for (const order of open) {
      const mapped = this.mapOrderToAsterOrder(order);
      if (!this.isOrderClosed(mapped)) {
        nextOpen.set(String(mapped.orderId), mapped);
      }
    }

    this.localOrders.clear();
    for (const [id, order] of nextOpen.entries()) {
      this.localOrders.set(id, order);
    }

    this.emitCurrentOrders();
  }

  private emitCurrentOrders(): void {
    if (!this.orderListeners.size) return;
    const open = Array.from(this.localOrders.values()).filter((order) => !this.isOrderClosed(order));
    for (const listener of this.orderListeners) {
      try {
        listener(open);
      } catch (error) {
        this.logger("emitOrders", error);
      }
    }
  }

  private isOrderClosed(order: AsterOrder): boolean {
    const status = (order.status ?? "").toUpperCase();
    if (
      status.includes("CLOSE") ||
      status.includes("FILLED") ||
      status.includes("CANCEL") ||
      status.includes("REJECT")
    ) {
      return true;
    }
    const orig = Number(order.origQty ?? 0);
    const filled = Number(order.executedQty ?? 0);
    if (Number.isFinite(orig) && Number.isFinite(filled) && Math.abs(orig - filled) < 1e-12) {
      return true;
    }
    return false;
  }

  private sleep(duration: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  private async fetchAndEmitAccount(): Promise<void> {
    const balance = (await this.exchange.fetchBalance()) as Balances;
    await this.attachPositions(balance);
    const snapshot = this.mapBalanceToAccountSnapshot(balance);
    this.lastBalanceSnapshot = snapshot;
    for (const listener of this.accountListeners) {
      listener(snapshot);
    }
  }

  private async attachPositions(balance: Balances): Promise<void> {
    const fetchPositions = (this.exchange as any).fetchPositions;
    if (typeof fetchPositions !== "function") return;
    try {
      const positions = await fetchPositions.call(this.exchange);
      this.logger("fetchPositionsResponse", JSON.stringify(positions));
      if (Array.isArray(positions)) {
        ((balance as unknown as { info?: Record<string, unknown> }).info ??= {}).positions = positions;
      }
    } catch (error) {
      this.logger("fetchPositions", error);
    }
  }

  private async verifyAccountAccess(): Promise<void> {
    if (this.onboardingChecked) return;
    try {
      await this.exchange.fetchBalance();
      this.onboardingChecked = true;
    } catch (error) {
      if (this.isNotOnboardedError(error)) {
        throw new Error(
          "Paradex account is not onboarded. Please complete the /onboarding flow on Paradex before running the bot."
        );
      }
      throw error;
    }
  }

  private isNotOnboardedError(error: unknown): boolean {
    const message = extractMessage(error).toUpperCase();
    if (message.includes("NOT_ONBOARDED")) return true;
    const body = (error as any)?.body ?? (error as any)?.response;
    if (typeof body === "string" && body.toUpperCase().includes("NOT_ONBOARDED")) return true;
    if (body && typeof body === "object") {
      const serialized = JSON.stringify(body).toUpperCase();
      if (serialized.includes("NOT_ONBOARDED")) return true;
    }
    return false;
  }
}
