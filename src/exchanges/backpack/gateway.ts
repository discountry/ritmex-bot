import ccxt, { type Balances, type Order as CcxtOrder, type OrderBook as CcxtOrderBook, type Ticker as CcxtTicker } from "ccxt";
import type {
  AsterAccountSnapshot,
  AsterOrder,
  AsterDepth,
  AsterTicker,
  AsterKline,
  CreateOrderParams,
  OrderType,
} from "../types";
import type {
  AccountListener,
  OrderListener,
  DepthListener,
  TickerListener,
  KlineListener,
} from "../adapter";

export interface BackpackGatewayOptions {
  apiKey?: string;
  apiSecret?: string;
  password?: string;
  subaccount?: string;
  symbol: string;
  sandbox?: boolean;
  logger?: (context: string, error: unknown) => void;
}

export class BackpackGateway {
  private readonly exchange: any;
  private readonly symbol: string;
  private marketSymbol: string;
  private readonly logger: (context: string, error: unknown) => void;
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  
  // Event listeners
  private accountListeners = new Set<AccountListener>();
  private orderListeners = new Set<OrderListener>();
  private depthListeners = new Set<DepthListener>();
  private tickerListeners = new Set<TickerListener>();
  private klineListeners = new Set<{ interval: string; callback: KlineListener }>();
  
  // Polling intervals
  private accountPollTimer: NodeJS.Timeout | null = null;
  private orderPollTimer: NodeJS.Timeout | null = null;
  private depthPollTimer: NodeJS.Timeout | null = null;
  private tickerPollTimer: NodeJS.Timeout | null = null;
  private klinePollTimers = new Map<string, NodeJS.Timeout>();
  
  // WebSocket streams
  private wsOrderBook: any = null;
  private wsTicker: any = null;
  private wsKlines = new Map<string, any>();
  private wsOrders: any = null;
  private wsBalance: any = null;

  constructor(options: BackpackGatewayOptions) {
    this.symbol = options.symbol.toUpperCase();
    this.marketSymbol = this.symbol;
    this.logger = options.logger ?? ((context, error) => console.error(`[BackpackGateway] ${context}:`, error));
    
    // dynamic constructor for specific exchange
    this.exchange = new (ccxt as any).backpack({
      apiKey: options.apiKey,
      secret: options.apiSecret,
      password: options.password,
      subaccount: options.subaccount,
      sandbox: options.sandbox ?? false,
      enableRateLimit: true,
      timeout: 30000,
    });
  }

  async ensureInitialized(symbol?: string): Promise<void> {
    if (this.initialized) return;
    
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = this.doInitialize(symbol);
    return this.initPromise;
  }

  private async doInitialize(symbol?: string): Promise<void> {
    try {
      await this.exchange.loadMarkets();
      
      // Verify symbol exists
      const requested = (symbol ?? this.symbol).toUpperCase();
      const resolved = this.resolveMarketSymbol(requested);
      if (!resolved) {
        throw new Error(`Symbol ${requested} not found in Backpack markets`);
      }
      this.marketSymbol = resolved;
      
      this.initialized = true;
      this.logger("initialize", `Backpack gateway initialized for ${this.marketSymbol}`);
    } catch (error) {
      this.logger("initialize", error);
      throw error;
    }
  }

  private resolveMarketSymbol(requested: string): string | null {
    // normalize helpers (strip non-alphanumerics for robust comparisons)
    const strip = (v: string | undefined | null) => (v ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Backpack uses USDC quote; accept common USD/USDT aliases in user input
    const normalizeUsdAlias = (v: string) => {
      const up = v.toUpperCase();
      // Replace ...USD... or ...USDT... (optionally before _ or PERP or end) with USDC
      // Examples: BTCUSDPERP -> BTCUSDCPERP, BTCUSD -> BTCUSDC, BTC_USDT_PERP -> BTC_USDC_PERP
      return up
        .replace(/USDT(?=(?:[_-]?PERP)?$)/, "USDC")
        .replace(/USD(?=(?:[_-]?PERP)?$)/, "USDC");
    };

    const requestedWithUsdc = normalizeUsdAlias(requested);
    const compactRequested = strip(requestedWithUsdc);

    // 1) exact key in markets (e.g. "BTC/USDC" or "BTC/USDC:USDC")
    if (this.exchange.markets[requestedWithUsdc]) return requestedWithUsdc;

    // 2) direct markets_by_id lookup by exact id
    const byId = (this.exchange as any).markets_by_id ?? {};
    if (byId[requestedWithUsdc]) return byId[requestedWithUsdc].symbol;

    // 3) flexible lookup: compare compacted forms against ids, symbols, and base+quote
    const markets = Object.values(this.exchange.markets) as Array<any>;
    for (const m of markets) {
      const idCompact = strip(m.id as string);
      const symbolCompact = strip(m.symbol as string);
      const baseQuoteCompact = strip((m.base as string) + (m.quote as string));
      if (idCompact === compactRequested) return m.symbol;
      if (symbolCompact === compactRequested) return m.symbol;
      if (baseQuoteCompact === compactRequested) return m.symbol;
    }

    // 4) try matching against markets_by_id keys by compacted form
    for (const key of Object.keys(byId)) {
      if (strip(key) === compactRequested) return byId[key].symbol;
    }

    return null;
  }

  private normalizeTimeframe(interval: string): string {
    const timeframeMap: Record<string, string> = {
      "1m": "1m",
      "5m": "5m", 
      "15m": "15m",
      "1h": "1h",
      "4h": "4h",
      "1d": "1d",
    };
    return timeframeMap[interval] || "1m";
  }

  // Event subscription methods
  onAccount(callback: AccountListener): void {
    this.accountListeners.add(callback);
    this.startAccountPolling();
  }

  onOrders(callback: OrderListener): void {
    this.orderListeners.add(callback);
    this.startOrderPolling();
  }

  onDepth(callback: DepthListener): void {
    this.depthListeners.add(callback);
    this.startDepthPolling();
  }

  onTicker(callback: TickerListener): void {
    this.tickerListeners.add(callback);
    this.startTickerPolling();
  }

  watchKlines(interval: string, callback: KlineListener): void {
    const normalizedInterval = this.normalizeTimeframe(interval);
    this.klineListeners.add({ interval: normalizedInterval, callback });
    this.startKlinePolling(normalizedInterval);
  }

  // Polling implementations
  private startAccountPolling(): void {
    if (this.accountPollTimer) return;
    
    const poll = async () => {
      try {
        const balance = await this.exchange.fetchBalance();
        const accountSnapshot = this.mapBalanceToAccountSnapshot(balance);
        
        for (const listener of this.accountListeners) {
          listener(accountSnapshot);
        }
      } catch (error) {
        this.logger("accountPoll", error);
      }
    };
    
    poll(); // Initial fetch
    this.accountPollTimer = setInterval(poll, 5000); // Poll every 5 seconds
  }

  private startOrderPolling(): void {
    if (this.orderPollTimer) return;
    
    const poll = async () => {
      try {
        const [openOrders, closedOrders] = await Promise.all([
          this.exchange.fetchOpenOrders(this.marketSymbol),
          this.exchange.fetchClosedOrders(this.marketSymbol, undefined, 50), // Last 50 closed orders
        ]);
        
        const allOrders = [...openOrders, ...closedOrders];
        const mappedOrders = allOrders.map(order => this.mapOrderToAsterOrder(order));
        
        for (const listener of this.orderListeners) {
          listener(mappedOrders);
        }
      } catch (error) {
        this.logger("orderPoll", error);
      }
    };
    
    poll(); // Initial fetch
    this.orderPollTimer = setInterval(poll, 2000); // Poll every 2 seconds
  }

  private startDepthPolling(): void {
    if (this.depthPollTimer) return;
    
    const poll = async () => {
      try {
        const orderbook = await this.exchange.fetchOrderBook(this.marketSymbol, 20);
        const depth = this.mapOrderBookToDepth(orderbook);
        
        for (const listener of this.depthListeners) {
          listener(depth);
        }
      } catch (error) {
        this.logger("depthPoll", error);
      }
    };
    
    poll(); // Initial fetch
    this.depthPollTimer = setInterval(poll, 1000); // Poll every 1 second
  }

  private startTickerPolling(): void {
    if (this.tickerPollTimer) return;
    
    const poll = async () => {
      try {
        const ticker = await this.exchange.fetchTicker(this.marketSymbol);
        const asterTicker = this.mapTickerToAsterTicker(ticker);
        
        for (const listener of this.tickerListeners) {
          listener(asterTicker);
        }
      } catch (error) {
        this.logger("tickerPoll", error);
      }
    };
    
    poll(); // Initial fetch
    this.tickerPollTimer = setInterval(poll, 2000); // Poll every 2 seconds
  }

  private startKlinePolling(interval: string): void {
    if (this.klinePollTimers.has(interval)) return;
    
    const poll = async () => {
      try {
        const ohlcv = await this.exchange.fetchOHLCV(this.marketSymbol, interval, undefined, 100);
        const klines = (ohlcv as number[][])
          .filter((c) => Array.isArray(c) && c.length >= 6)
          .map((c) => this.mapOHLCVToKline([c[0], c[1], c[2], c[3], c[4], c[5]] as [number, number, number, number, number, number], interval));
        
        for (const listener of this.klineListeners) {
          if (listener.interval === interval) {
            listener.callback(klines);
          }
        }
      } catch (error) {
        this.logger("klinePoll", error);
      }
    };
    
    poll(); // Initial fetch
    this.klinePollTimers.set(interval, setInterval(poll, 5000)); // Poll every 5 seconds
  }

  // Order management
  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized();
    
    // Only pass exchange-specific params in the last argument so we don't
    // override ccxt's internal request mapping (e.g. side mapping for Backpack).
    const symbol = this.marketSymbol;
    const type = this.mapOrderTypeToCcxt(params.type);
    const side = params.side.toLowerCase();
    const amount = params.quantity;
    const price = params.price;

    const extraParams: Record<string, unknown> = {};
    if (params.stopPrice !== undefined) extraParams.stopPrice = params.stopPrice;
    // Map GTX (post-only) to Backpack's postOnly boolean and use GTC as TIF
    if (params.timeInForce === "GTX") {
      extraParams.postOnly = true;
      extraParams.timeInForce = "GTC";
    } else if (params.timeInForce !== undefined) {
      extraParams.timeInForce = params.timeInForce; // GTC, IOC, FOK
    }
    // Reduce-only string boolean -> boolean per OpenAPI
    if (params.reduceOnly !== undefined) {
      extraParams.reduceOnly = params.reduceOnly === "true";
    }
    
    const order = await this.exchange.createOrder(
      symbol,
      type,
      side,
      amount,
      price,
      extraParams
    );
    
    return this.mapOrderToAsterOrder(order);
  }

  async cancelOrder(params: { orderId: number | string }): Promise<void> {
    await this.exchange.cancelOrder(params.orderId.toString(), this.marketSymbol);
  }

  async cancelOrders(params: { orderIdList: Array<number | string> }): Promise<void> {
    await Promise.all(
      params.orderIdList.map(orderId => 
        this.exchange.cancelOrder(orderId.toString(), this.marketSymbol)
      )
    );
  }

  async cancelAllOrders(): Promise<void> {
    try {
      if (typeof (this.exchange as any).cancelAllOrders === "function") {
        await (this.exchange as any).cancelAllOrders(this.marketSymbol);
        return;
      }
    } catch {
      // fall through to manual cancel
    }
    const open = await this.exchange.fetchOpenOrders(this.marketSymbol);
    for (const o of open) {
      await this.exchange.cancelOrder(o.id as string, this.marketSymbol);
    }
  }

  // Mapping functions
  private mapBalanceToAccountSnapshot(balance: Balances): AsterAccountSnapshot {
    const positions: any[] = []; // Backpack is spot-only, no positions
    const assets: any[] = [];
    
    for (const [currency, amount] of Object.entries(balance)) {
      if (typeof amount === 'object' && amount !== null) {
        assets.push({
          asset: currency,
          walletBalance: amount.total?.toString() || "0",
          availableBalance: amount.free?.toString() || "0",
          updateTime: Date.now(),
        });
      }
    }
    
    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: Date.now(),
      totalWalletBalance: balance.total?.toString() || "0",
      totalUnrealizedProfit: "0",
      positions,
      assets,
    };
  }

  private mapOrderToAsterOrder(order: CcxtOrder): AsterOrder {
    const side = (order.side ?? "buy").toUpperCase() as "BUY" | "SELL";
    const mappedType = this.mapCcxtOrderTypeToAster(order.type);
    return {
      orderId: String(order.id ?? ""),
      clientOrderId: (order.clientOrderId as any as string) || "",
      symbol: order.symbol || this.marketSymbol,
      side,
      type: mappedType,
      status: (order.status as any as string) || "",
      price: order.price?.toString() || "0",
      origQty: order.amount?.toString() || "0",
      executedQty: order.filled?.toString() || "0",
      stopPrice: order.stopPrice?.toString() || "0",
      time: order.timestamp || Date.now(),
      updateTime: order.lastUpdateTimestamp || Date.now(),
      reduceOnly: false,
      closePosition: false,
      avgPrice: order.average?.toString(),
      cumQuote: order.cost?.toString(),
    };
  }

  private mapOrderBookToDepth(orderbook: CcxtOrderBook): AsterDepth {
    return {
      lastUpdateId: orderbook.nonce || Date.now(),
      bids: (orderbook.bids || []).filter((t) => t && t.length >= 2).map(([price, amount]) => [String(price ?? 0), String(amount ?? 0)]),
      asks: (orderbook.asks || []).filter((t) => t && t.length >= 2).map(([price, amount]) => [String(price ?? 0), String(amount ?? 0)]),
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

  private mapOHLCVToKline(candle: [number, number, number, number, number, number], interval: string): AsterKline {
    const [timestamp, open, high, low, close, volume] = candle;
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
      "LIMIT": "limit",
      "MARKET": "market",
      "STOP_MARKET": "stop",
      "TRAILING_STOP_MARKET": "trailing-stop",
    };
    return typeMap[type] || "limit";
  }

  private mapCcxtOrderTypeToAster(type: string | undefined): OrderType {
    const typeMap: Record<string, OrderType> = {
      "limit": "LIMIT",
      "market": "MARKET",
      "stop": "STOP_MARKET",
      "trailing-stop": "TRAILING_STOP_MARKET",
    };
    return type ? (typeMap[type] ?? "LIMIT") : "LIMIT";
  }

  private getIntervalMs(interval: string): number {
    const intervalMap: Record<string, number> = {
      "1m": 60 * 1000,
      "5m": 5 * 60 * 1000,
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "4h": 4 * 60 * 60 * 1000,
      "1d": 24 * 60 * 60 * 1000,
    };
    return intervalMap[interval] || 60 * 1000;
  }

  // Cleanup
  destroy(): void {
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
}
