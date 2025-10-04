import { setInterval, clearInterval, setTimeout, clearTimeout } from "timers";
import WebSocket from "ws";
import axios from "axios";
import type {
  AsterAccountAsset,
  AsterAccountPosition,
  AsterAccountSnapshot,
  AsterDepth,
  AsterKline,
  AsterOrder,
  AsterTicker,
  CreateOrderParams,
  OrderSide,
  OrderType,
} from "../types";
import type { EdgeXResponse } from "./client";
import { EdgeXHttpClient, computeNonceFromClientOrderId } from "./client";
import {
  countBase10Scale,
  decimalToBigInt,
  decimalToFraction,
  formatDecimal,
  getScaleFromDenominator,
} from "./decimal";
import { signLimitOrder } from "./l2";
import { EdgeXSignature } from "./signature";
import { extractMessage } from "../../utils/errors";

const META_PATH = "/api/v1/public/meta/getMetaData";
const ACCOUNT_ASSET_PATH = "/api/v1/private/account/getAccountAsset";
const ACTIVE_ORDER_PATH = "/api/v1/private/order/getActiveOrderPage";
const CREATE_ORDER_PATH = "/api/v1/private/order/createOrder";
const CANCEL_ORDER_BY_ID_PATH = "/api/v1/private/order/cancelOrderById";
const CANCEL_ALL_ORDERS_PATH = "/api/v1/private/order/cancelAllOrder";

const PUBLIC_WS_PATH = "/api/v1/public/ws";
const PRIVATE_WS_PATH = "/api/v1/private/ws";

const DEFAULT_BASE_URL = "https://pro.edgex.exchange";
const DEFAULT_WS_URL = "wss://quote.edgex.exchange";
const DEFAULT_POLL_INTERVAL_MS = 5_000;
const DEFAULT_ORDER_EXPIRATION_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const PRIVATE_EXPIRE_OFFSET_MS = 10 * 24 * 60 * 60 * 1000; // 10 days
const EDGE_KLINE_INTERVAL: Record<string, string> = {
  "1m": "MINUTE_1",
  "3m": "MINUTE_3",
  "5m": "MINUTE_5",
  "15m": "MINUTE_15",
  "30m": "MINUTE_30",
  "1h": "HOUR_1",
  "4h": "HOUR_4",
  "12h": "HOUR_12",
  "1d": "DAY_1",
};

interface EdgeXGatewayOptions {
  accountId: string;
  privateKey: string;
  symbol: string;
  positionId?: bigint;
  baseUrl?: string;
  wsPublicUrl?: string;
  wsPrivateUrl?: string;
  orderExpirationMs?: number;
  logger?: (context: string, error: unknown) => void;
}

interface ContractMetadata {
  contractId: string;
  contractName: string;
  takerFeeRate: string;
  makerFeeRate: string;
  syntheticResolution: bigint;
  collateralResolution: bigint;
  syntheticScale: number;
  collateralScale: number;
  syntheticAssetId: string;
  collateralAssetId: string;
  feeAssetId: string;
  tickSize: string;
  stepSize: string;
}

interface CollateralState {
  balance: string;
  available: string;
  coinId: string;
  coinName: string;
}

interface PositionState {
  contractId: string;
  size: string;
  avgEntryPrice?: string;
  unrealizedPnl?: string;
  markPrice?: string;
}

interface AccountState {
  totalEquity: string;
  availableBalance: string;
  collateral: Map<string, CollateralState>;
  positions: Map<string, PositionState>;
}

export class EdgeXGateway {
  readonly symbol: string;

  private readonly accountId: string;
  private readonly positionId: bigint;
  private readonly privateKey: string;
  private readonly http: EdgeXHttpClient;
  private readonly signer: EdgeXSignature;
  private readonly publicHttp: ReturnType<typeof axios.create>;
  private readonly publicWsBase: string;
  private readonly privateWsBase: string;
  private readonly orderExpirationMs: number;
  private readonly logger: (context: string, error: unknown) => void;

  private readonly accountListeners = new Set<(snapshot: AsterAccountSnapshot) => void>();
  private readonly ordersListeners = new Set<(orders: AsterOrder[]) => void>();
  private readonly depthListeners = new Set<(depth: AsterDepth) => void>();
  private readonly tickerListeners = new Set<(ticker: AsterTicker) => void>();
  private readonly klineListeners = new Map<string, Set<(klines: AsterKline[]) => void>>();

  private accountState: AccountState = {
    totalEquity: "0",
    availableBalance: "0",
    collateral: new Map(),
    positions: new Map(),
  };
  private openOrders: Map<string, AsterOrder> = new Map();
  private depthSnapshot: AsterDepth | null = null;
  private tickerSnapshot: AsterTicker | null = null;
  private klineCache: Map<string, AsterKline[]> = new Map();

  private metadata: ContractMetadata | null = null;

  private publicWs: WebSocket | null = null;
  private privateWs: WebSocket | null = null;
  private publicWsReady = false;
  private privateWsReady = false;
  private publicReconnectTimer: NodeJS.Timeout | null = null;
  private privateReconnectTimer: NodeJS.Timeout | null = null;

  private pollTimer: NodeJS.Timeout | null = null;

  constructor(options: EdgeXGatewayOptions) {
    this.symbol = options.symbol.toUpperCase();
    this.accountId = options.accountId;
    const defaultPositionId = parseAccountIdToBigInt(options.accountId);
    this.positionId = options.positionId ?? defaultPositionId;
    this.privateKey = options.privateKey;
    const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.http = new EdgeXHttpClient({ baseUrl, privateKey: options.privateKey });
    this.signer = this.http.getSigner();
    this.publicHttp = axios.create({ baseURL: baseUrl, timeout: 15_000 });
    this.publicWsBase = options.wsPublicUrl ?? DEFAULT_WS_URL;
    this.privateWsBase = options.wsPrivateUrl ?? DEFAULT_WS_URL;
    this.orderExpirationMs = options.orderExpirationMs ?? DEFAULT_ORDER_EXPIRATION_MS;
    this.logger = options.logger ?? ((context, error) => console.error(`[EdgeXGateway] ${context}`, error));
  }

  async ensureInitialized(): Promise<void> {
    if (this.metadata) return;
    await this.loadMetadata();
    await Promise.all([this.refreshAccount(), this.refreshOpenOrders(), this.refreshDepth(), this.refreshTicker()]);
    this.startPolling();
    this.openPublicWs();
    this.openPrivateWs();
  }

  onAccount(listener: (snapshot: AsterAccountSnapshot) => void): () => void {
    this.accountListeners.add(listener);
    listener(this.buildAccountSnapshot());
    return () => this.accountListeners.delete(listener);
  }

  onOrders(listener: (orders: AsterOrder[]) => void): () => void {
    this.ordersListeners.add(listener);
    listener(this.currentOrders());
    return () => this.ordersListeners.delete(listener);
  }

  onDepth(_symbol: string, listener: (depth: AsterDepth) => void): () => void {
    this.depthListeners.add(listener);
    if (this.depthSnapshot) listener(this.depthSnapshot);
    return () => this.depthListeners.delete(listener);
  }

  onTicker(_symbol: string, listener: (ticker: AsterTicker) => void): () => void {
    this.tickerListeners.add(listener);
    if (this.tickerSnapshot) listener(this.tickerSnapshot);
    return () => this.tickerListeners.delete(listener);
  }

  onKlines(_symbol: string, interval: string, listener: (klines: AsterKline[]) => void): () => void {
    if (!this.klineListeners.has(interval)) {
      this.klineListeners.set(interval, new Set());
      void this.refreshKlines(interval);
      this.subscribePublicChannel(klineChannel(this.contractId, interval));
    }
    const listeners = this.klineListeners.get(interval)!;
    listeners.add(listener);
    const cache = this.klineCache.get(interval);
    if (cache) listener(cache);
    return () => {
      listeners.delete(listener);
    };
  }

  async createOrder(params: CreateOrderParams): Promise<AsterOrder> {
    await this.ensureInitialized();
    const meta = this.metadata;
    if (!meta) throw new Error("EdgeX metadata not initialized");

    const side = params.side as OrderSide;
    const orderType = mapOrderType(params.type);
    const timeInForce = mapTimeInForce(params.timeInForce, orderType);

    const sizeStr = normalizeDecimalInput(params.quantity ?? 0);
    const priceStr = orderType === "LIMIT" ? normalizeDecimalInput(params.price ?? 0) : "0";

    const priceFraction = decimalToFraction(priceStr);
    const sizeFraction = decimalToFraction(sizeStr);
    const priceScale = getScaleFromDenominator(priceFraction.denominator);
    const sizeScale = getScaleFromDenominator(sizeFraction.denominator);

    const valueNumerator = priceFraction.numerator * sizeFraction.numerator;
    const valueScale = priceScale + sizeScale;
    const valueDecimal = formatDecimal(valueNumerator, valueScale);

    const amountSynthetic = decimalToBigInt(sizeStr, meta.syntheticScale);
    const amountCollateral = decimalToBigInt(valueDecimal, meta.collateralScale);

    const feeRate = Number(meta.takerFeeRate || 0);
    const feeDecimalValue = Math.ceil(Number(valueDecimal) * feeRate);
    const feeDecimalString = feeDecimalValue.toString();
    const amountFee = BigInt(feeDecimalValue) * 10n ** BigInt(meta.collateralScale);

    const clientOrderIdValue = (params as any).clientOrderId;
    const clientOrderId = typeof clientOrderIdValue === "string" && clientOrderIdValue.length > 0
      ? clientOrderIdValue
      : generateClientOrderId();
    const nonce = computeNonceFromClientOrderId(clientOrderId);
    const l2ExpireTime = Date.now() + this.orderExpirationMs;
    const expireTime = Math.max(l2ExpireTime - PRIVATE_EXPIRE_OFFSET_MS, Date.now());
    const expirationHours = Math.floor(l2ExpireTime / (60 * 60 * 1000));

    const signature = signLimitOrder({
      isBuy: side === "BUY",
      amountSynthetic,
      amountCollateral,
      amountFee,
      syntheticAssetId: meta.syntheticAssetId,
      collateralAssetId: meta.collateralAssetId,
      feeAssetId: meta.feeAssetId,
      positionId: this.positionId,
      nonce,
      expirationHours,
      privateKey: this.privateKey,
    });

    const body: Record<string, unknown> = {
      accountId: this.accountId,
      contractId: meta.contractId,
      price: priceStr,
      size: sizeStr,
      type: orderType,
      timeInForce,
      side,
      l2Signature: signature.signature,
      l2Nonce: nonce.toString(),
      l2ExpireTime: l2ExpireTime.toString(),
      l2Value: valueDecimal,
      l2Size: sizeStr,
      l2LimitFee: feeDecimalString,
      clientOrderId,
      expireTime: expireTime.toString(),
      reduceOnly: parseReduceOnly(params.reduceOnly),
    };

    if (params.stopPrice != null) {
      body.triggerPrice = normalizeDecimalInput(params.stopPrice);
      body.triggerPriceType = "LAST_PRICE";
    }

    const response = await this.http.post<{ orderId: string }>(CREATE_ORDER_PATH, body);
    if (response.code !== "SUCCESS") {
      throw new Error(`EdgeX create order failed: ${response.code}`);
    }

    const orderId = response.data?.orderId ?? "";
    const order = this.mapOrder({
      orderId,
      clientOrderId,
      contractId: meta.contractId,
      accountId: this.accountId,
      status: "OPEN",
      price: priceStr,
      size: sizeStr,
      side,
      type: orderType,
      createdTime: Date.now(),
    });
    this.openOrders.set(orderId, order);
    this.emitOrders();
    return order;
  }

  async cancelOrder(orderId: string): Promise<void> {
    await this.http.post(CANCEL_ORDER_BY_ID_PATH, {
      accountId: this.accountId,
      orderIdList: [orderId],
    });
    this.openOrders.delete(orderId);
    this.emitOrders();
  }

  async cancelOrders(orderIds: string[]): Promise<void> {
    if (orderIds.length === 0) return;
    await this.http.post(CANCEL_ORDER_BY_ID_PATH, {
      accountId: this.accountId,
      orderIdList: orderIds,
    });
    for (const id of orderIds) this.openOrders.delete(id);
    this.emitOrders();
  }

  async cancelAllOrders(): Promise<void> {
    const meta = this.metadata;
    if (!meta) return;
    await this.http.post(CANCEL_ALL_ORDERS_PATH, {
      accountId: this.accountId,
      filterContractIdList: [meta.contractId],
    });
    this.openOrders.clear();
    this.emitOrders();
  }

  private async loadMetadata(): Promise<void> {
    try {
      const response = await this.publicHttp.get<EdgeXResponse>(META_PATH);
      if (response.data.code !== "SUCCESS") {
        throw new Error(`Meta request failed: ${response.data.code}`);
      }
      const data = response.data.data ?? {};
      const contractList: any[] = data.contractList ?? [];
      const globalMeta = data.global ?? {};
      const collateralCoin = globalMeta.starkExCollateralCoin ?? {};

      const contract = findContract(contractList, this.symbol);
      if (!contract) {
        throw new Error(`EdgeX contract metadata not found for symbol ${this.symbol}`);
      }

      const syntheticResolution = parseResolution(contract.starkExResolution ?? "0x1");
      const collateralResolution = parseResolution(collateralCoin.starkExResolution ?? "0xF4240");

      this.metadata = {
        contractId: contract.contractId,
        contractName: contract.contractName,
        takerFeeRate: contract.defaultTakerFeeRate ?? "0",
        makerFeeRate: contract.defaultMakerFeeRate ?? "0",
        syntheticResolution,
        collateralResolution,
        syntheticScale: countBase10Scale(syntheticResolution),
        collateralScale: countBase10Scale(collateralResolution),
        syntheticAssetId: contract.starkExSyntheticAssetId ?? "",
        collateralAssetId: collateralCoin.starkExAssetId ?? "",
        feeAssetId: collateralCoin.starkExAssetId ?? "",
        tickSize: contract.tickSize ?? "0.1",
        stepSize: contract.stepSize ?? "0.001",
      };
    } catch (error) {
      throw new Error(`Failed to load EdgeX metadata: ${extractMessage(error)}`);
    }
  }

  private async refreshAccount(): Promise<void> {
    try {
      const response = await this.http.get(ACCOUNT_ASSET_PATH, {
        accountId: this.accountId,
      });
      if (response.code !== "SUCCESS") return;
      const data = response.data ?? {};
      const account = data.account ?? {};
      const collateralList: any[] = data.collateralList ?? data.collateralAssetList ?? [];
      const positionList: any[] = data.positionList ?? [];
      const positionAssetList: any[] = data.positionAssetList ?? [];

      const collateralMap = new Map<string, CollateralState>();
      for (const entry of collateralList) {
        const coinId = entry.coinId ?? entry.coinName ?? "USDT";
        const coinName = entry.coinName ?? coinId;
        const balance = entry.amount ?? entry.totalBalance ?? entry.walletBalance ?? "0";
        const available = entry.availableBalance ?? entry.availableAmount ?? balance;
        collateralMap.set(coinId, {
          coinId,
          coinName,
          balance: balance.toString(),
          available: available.toString(),
        });
      }

      const positionMap = new Map<string, PositionState>();
      for (const entry of positionList) {
        const contractId = entry.contractId ?? entry.symbol;
        if (!contractId) continue;
        const existing: PositionState = positionMap.get(contractId) ?? {
          contractId,
          size: "0",
        };
        if (entry.openSize != null) existing.size = entry.openSize.toString();
        if (entry.avgEntryPrice != null) existing.avgEntryPrice = entry.avgEntryPrice.toString();
        if (entry.unrealizePnl != null) existing.unrealizedPnl = entry.unrealizePnl.toString();
        positionMap.set(contractId, existing);
      }
      for (const entry of positionAssetList) {
        const contractId = entry.contractId ?? entry.symbol;
        if (!contractId) continue;
        const existing: PositionState = positionMap.get(contractId) ?? {
          contractId,
          size: "0",
        };
        if (entry.positionValue != null) existing.markPrice = entry.positionValue.toString();
        if (entry.avgEntryPrice != null) existing.avgEntryPrice = entry.avgEntryPrice.toString();
        if (entry.unrealizePnl != null) existing.unrealizedPnl = entry.unrealizePnl.toString();
        positionMap.set(contractId, existing);
      }

      this.accountState = {
        totalEquity: account.totalEquity ?? account.totalBalance ?? "0",
        availableBalance: account.availableBalance ?? account.availableAmount ?? "0",
        collateral: collateralMap,
        positions: positionMap,
      };
      this.emitAccount();
    } catch (error) {
      this.logger("refreshAccount", error);
    }
  }

  private async refreshOpenOrders(): Promise<void> {
    try {
      const meta = this.metadata;
      if (!meta) return;
      const response = await this.http.get(ACTIVE_ORDER_PATH, {
        accountId: this.accountId,
        filterContractIdList: meta.contractId,
      });
      if (response.code !== "SUCCESS") return;

      const orders = response.data?.dataList ?? response.data?.orderList ?? [];
      this.openOrders.clear();
      for (const order of orders) {
        const mapped = this.mapOrder(order);
        this.openOrders.set(mapped.orderId.toString(), mapped);
      }
      this.emitOrders();
    } catch (error) {
      this.logger("refreshOpenOrders", error);
    }
  }

  private async refreshTicker(): Promise<void> {
    try {
      const meta = this.metadata;
      if (!meta) return;
      const response = await this.publicHttp.get<EdgeXResponse>("/api/v1/public/quote/getTicker", {
        params: { contractId: meta.contractId },
      });
      if (response.data.code !== "SUCCESS") return;
      const ticker = response.data.data?.[0];
      if (!ticker) return;
      this.tickerSnapshot = {
        symbol: this.symbol,
        lastPrice: ticker.lastPrice ?? ticker.close ?? "0",
        openPrice: ticker.open ?? "0",
        highPrice: ticker.high ?? "0",
        lowPrice: ticker.low ?? "0",
        volume: ticker.size ?? "0",
        quoteVolume: ticker.value ?? "0",
        eventTime: Date.now(),
      };
      this.emitTicker();
    } catch (error) {
      this.logger("refreshTicker", error);
    }
  }

  private async refreshDepth(): Promise<void> {
    try {
      const meta = this.metadata;
      if (!meta) return;
      const response = await this.publicHttp.get<EdgeXResponse>("/api/v1/public/quote/getDepth", {
        params: { contractId: meta.contractId, level: 15 },
      });
      if (response.data.code !== "SUCCESS") return;
      const info = response.data.data?.[0];
      if (!info) return;
      this.depthSnapshot = {
        lastUpdateId: Number(info.endVersion ?? Date.now()),
        bids: (info.bids ?? []).map((level: [string, string]) => [level[0], level[1]]),
        asks: (info.asks ?? []).map((level: [string, string]) => [level[0], level[1]]),
        eventTime: Date.now(),
      };
      this.emitDepth();
    } catch (error) {
      this.logger("refreshDepth", error);
    }
  }

  private async refreshKlines(interval: string): Promise<void> {
    const edgeInterval = EDGE_KLINE_INTERVAL[interval];
    if (!edgeInterval) return;
    try {
      const meta = this.metadata;
      if (!meta) return;
      const response = await this.publicHttp.get<EdgeXResponse>("/api/v1/public/quote/getKline", {
        params: {
          contractId: meta.contractId,
          klineType: edgeInterval,
          priceType: "LAST_PRICE",
        },
      });
      if (response.data.code !== "SUCCESS") return;
      const klines: AsterKline[] = (response.data.data ?? []).map((item: any) => ({
        eventTime: Date.now(),
        symbol: this.symbol,
        interval,
        openTime: Number(item.klineTime ?? 0),
        closeTime: Number(item.klineTime ?? 0) + intervalToMs(interval),
        open: item.open ?? "0",
        high: item.high ?? "0",
        low: item.low ?? "0",
        close: item.close ?? "0",
        volume: item.size ?? "0",
        numberOfTrades: Number(item.trades ?? 0),
      }));
      this.klineCache.set(interval, klines);
      this.emitKlines(interval);
    } catch (error) {
      this.logger("refreshKlines", error);
    }
  }

  private openPublicWs(): void {
    if (this.publicWs && this.publicWsReady) return;
    const url = `${this.publicWsBase}${PUBLIC_WS_PATH}?timestamp=${Date.now()}`;
    try {
      const ws = new WebSocket(url);
      ws.on("open", () => {
        this.publicWsReady = true;
        this.subscribePublicChannel(`ticker.${this.contractId}`);
        this.subscribePublicChannel(`depth.${this.contractId}.15`);
        for (const interval of this.klineListeners.keys()) {
          this.subscribePublicChannel(klineChannel(this.contractId, interval));
        }
      });
      ws.on("message", (data) => this.handlePublicMessage(data));
      ws.on("close", () => {
        this.publicWsReady = false;
        this.schedulePublicReconnect();
      });
      ws.on("error", (error) => this.logger("publicWs:error", error));
      this.publicWs = ws;
    } catch (error) {
      this.logger("publicWs", error);
      this.schedulePublicReconnect();
    }
  }

  private openPrivateWs(): void {
    if (this.privateWs && this.privateWsReady) return;
    const url = `${this.privateWsBase}${PRIVATE_WS_PATH}?accountId=${this.accountId}`;
    const headers = this.signer.createWebsocketHeaders(this.accountId);
    try {
      const ws = new WebSocket(url, undefined, {
        headers: {
          "X-edgeX-Api-Timestamp": headers.timestamp,
          "X-edgeX-Api-Signature": headers.signature,
        },
      });
      ws.on("open", () => {
        this.privateWsReady = true;
      });
      ws.on("message", (data) => this.handlePrivateMessage(data));
      ws.on("close", () => {
        this.privateWsReady = false;
        this.schedulePrivateReconnect();
      });
      ws.on("error", (error) => this.logger("privateWs:error", error));
      this.privateWs = ws;
    } catch (error) {
      this.logger("privateWs", error);
      this.schedulePrivateReconnect();
    }
  }

  private subscribePublicChannel(channel: string): void {
    if (!this.publicWs || this.publicWs.readyState !== WebSocket.OPEN) return;
    this.publicWs.send(JSON.stringify({ type: "subscribe", channel }));
  }

  private schedulePublicReconnect(): void {
    if (this.publicReconnectTimer) return;
    this.publicReconnectTimer = setTimeout(() => {
      this.publicReconnectTimer = null;
      this.openPublicWs();
    }, 2_000);
  }

  private schedulePrivateReconnect(): void {
    if (this.privateReconnectTimer) return;
    this.privateReconnectTimer = setTimeout(() => {
      this.privateReconnectTimer = null;
      this.openPrivateWs();
    }, 2_000);
  }

  private handlePublicMessage(raw: WebSocket.RawData): void {
    try {
      const text = typeof raw === "string" ? raw : raw.toString("utf8");
      const message = JSON.parse(text);
      if (message?.type === "ping") {
        this.publicWs?.send(JSON.stringify({ type: "pong", time: message.time }));
        return;
      }
      const quote = extractQuoteEvent(message);
      if (!quote) return;
      const { channel, payload } = quote;
      if (channel.startsWith("ticker")) {
        this.tickerSnapshot = {
          symbol: this.symbol,
          lastPrice: payload?.lastPrice ?? payload?.close ?? "0",
          openPrice: payload?.open ?? "0",
          highPrice: payload?.high ?? "0",
          lowPrice: payload?.low ?? "0",
          volume: payload?.size ?? "0",
          quoteVolume: payload?.value ?? "0",
          eventTime: Date.now(),
        };
        this.emitTicker();
        return;
      }
      if (channel.startsWith("depth")) {
        const bids = payload?.bids ?? [];
        const asks = payload?.asks ?? [];
        this.depthSnapshot = {
          lastUpdateId: Number(payload?.endVersion ?? Date.now()),
          bids: bids.map((level: [string, string]) => [level[0], level[1]]),
          asks: asks.map((level: [string, string]) => [level[0], level[1]]),
          eventTime: Date.now(),
        };
        this.emitDepth();
        return;
      }
      if (channel.startsWith("kline")) {
        const interval = parseEdgeInterval(channel);
        if (!interval) return;
        const dataList: any[] = Array.isArray(payload?.data) ? payload.data : payload ? [payload] : [];
        const klines: AsterKline[] = dataList.map((item) => ({
          eventTime: Date.now(),
          symbol: this.symbol,
          interval,
          openTime: Number(item.klineTime ?? 0),
          closeTime: Number(item.klineTime ?? 0) + intervalToMs(interval),
          open: item.open ?? "0",
          high: item.high ?? "0",
          low: item.low ?? "0",
          close: item.close ?? "0",
          volume: item.size ?? "0",
          numberOfTrades: Number(item.trades ?? 0),
        }));
        this.klineCache.set(interval, klines);
        this.emitKlines(interval);
      }
    } catch (error) {
      this.logger("handlePublicMessage", error);
    }
  }

  private handlePrivateMessage(raw: WebSocket.RawData): void {
    try {
      const text = typeof raw === "string" ? raw : raw.toString("utf8");
      const message = JSON.parse(text);
      if (message?.type === "ping") {
        this.privateWs?.send(JSON.stringify({ type: "pong", time: message.time }));
        return;
      }
      if (message?.type === "trade-event") {
        const data = message.content?.data ?? message.data ?? {};
        this.applyTradeEvent(data);
      }
    } catch (error) {
      this.logger("handlePrivateMessage", error);
    }
  }

  private applyTradeEvent(event: any): void {
    if (event?.account) {
      for (const accountUpdate of event.account) {
        if (accountUpdate?.totalEquity) this.accountState.totalEquity = accountUpdate.totalEquity.toString();
        if (accountUpdate?.availableBalance) this.accountState.availableBalance = accountUpdate.availableBalance.toString();
      }
      this.emitAccount();
    }
    if (event?.collateral) {
      for (const entry of event.collateral) {
        const coinId = entry.coinId ?? "USDT";
        this.accountState.collateral.set(coinId, {
          coinId,
          coinName: entry.coinName ?? coinId,
          balance: entry.balance ?? entry.amount ?? "0",
          available: entry.availableBalance ?? entry.balance ?? "0",
        });
      }
      this.emitAccount();
    }
    if (event?.position) {
      for (const pos of event.position) {
        const contractId = pos.contractId;
        if (!contractId) continue;
        const existing: PositionState = this.accountState.positions.get(contractId) ?? {
          contractId,
          size: "0",
        };
        if (pos.size != null) existing.size = pos.size.toString();
        if (pos.entryPrice != null) existing.avgEntryPrice = pos.entryPrice.toString();
        if (pos.unrealizedPnl != null) existing.unrealizedPnl = pos.unrealizedPnl.toString();
        this.accountState.positions.set(contractId, existing);
      }
      this.emitAccount();
    }
    if (event?.order) {
      for (const order of event.order) {
        const mapped = this.mapOrder(order);
        if (mapped.status === "CANCELED" || mapped.status === "FILLED") {
          this.openOrders.delete(mapped.orderId.toString());
        } else {
          this.openOrders.set(mapped.orderId.toString(), mapped);
        }
      }
      this.emitOrders();
    }
  }

  private startPolling(): void {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      void this.refreshAccount();
      void this.refreshOpenOrders();
      void this.refreshTicker();
    }, DEFAULT_POLL_INTERVAL_MS);
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private buildAccountSnapshot(): AsterAccountSnapshot {
    const assets: AsterAccountAsset[] = [];
    for (const entry of this.accountState.collateral.values()) {
      assets.push({
        asset: entry.coinName,
        walletBalance: entry.balance,
        availableBalance: entry.available,
        updateTime: Date.now(),
      });
    }

    const positions: AsterAccountPosition[] = [];
    const meta = this.metadata;
    for (const [contractId, position] of this.accountState.positions.entries()) {
      if (meta && contractId !== meta.contractId) continue;
      positions.push({
        symbol: this.symbol,
        positionAmt: position.size ?? "0",
        entryPrice: position.avgEntryPrice ?? "0",
        unrealizedProfit: position.unrealizedPnl ?? "0",
        positionSide: "BOTH",
        updateTime: Date.now(),
        markPrice: position.markPrice ?? position.avgEntryPrice ?? "0",
      });
    }

    return {
      canTrade: true,
      canDeposit: true,
      canWithdraw: true,
      updateTime: Date.now(),
      totalWalletBalance: this.accountState.totalEquity,
      totalUnrealizedProfit: "0",
      positions,
      assets,
      totalMarginBalance: this.accountState.totalEquity,
      totalInitialMargin: "0",
      totalMaintMargin: "0",
      totalOpenOrderInitialMargin: "0",
      totalCrossWalletBalance: this.accountState.totalEquity,
      totalCrossUnPnl: "0",
    } as AsterAccountSnapshot;
  }

  private currentOrders(): AsterOrder[] {
    return Array.from(this.openOrders.values());
  }

  private emitAccount(): void {
    const snapshot = this.buildAccountSnapshot();
    for (const listener of this.accountListeners) listener(snapshot);
  }

  private emitOrders(): void {
    const orders = this.currentOrders();
    for (const listener of this.ordersListeners) listener(orders);
  }

  private emitDepth(): void {
    if (!this.depthSnapshot) return;
    for (const listener of this.depthListeners) listener(this.depthSnapshot);
  }

  private emitTicker(): void {
    if (!this.tickerSnapshot) return;
    for (const listener of this.tickerListeners) listener(this.tickerSnapshot);
  }

  private emitKlines(interval: string): void {
    const cache = this.klineCache.get(interval);
    if (!cache) return;
    const listeners = this.klineListeners.get(interval);
    if (!listeners) return;
    for (const listener of listeners) listener(cache);
  }

  private mapOrder(order: any): AsterOrder {
    return {
      orderId: order.orderId ?? order.id ?? "",
      clientOrderId: order.clientOrderId ?? order.clientId ?? "",
      symbol: this.symbol,
      side: (order.side ?? "BUY") as OrderSide,
      type: (order.type ?? "LIMIT") as OrderType,
      status: order.status ?? "OPEN",
      price: order.price ?? "0",
      origQty: order.size ?? order.orderSize ?? "0",
      executedQty: order.filledSize ?? order.executedSize ?? "0",
      stopPrice: order.triggerPrice ?? "0",
      time: Number(order.createTime ?? order.createdTime ?? Date.now()),
      updateTime: Number(order.updateTime ?? order.updatedTime ?? Date.now()),
      reduceOnly: Boolean(order.reduceOnly ?? false),
      closePosition: false,
    };
  }

  private get contractId(): string {
    return this.metadata?.contractId ?? "";
  }
}

function findContract(contractList: any[], symbol: string): any | null {
  const upper = symbol.toUpperCase();
  return (
    contractList.find((item) => item.contractName?.toUpperCase() === upper) ||
    contractList.find((item) => item.contractId?.toUpperCase() === upper) ||
    null
  );
}

function parseAccountIdToBigInt(value: string): bigint {
  try {
    return BigInt(value);
  } catch (error) {
    throw new Error(`Invalid EdgeX account id: ${value}`);
  }
}

function parseResolution(value: string): bigint {
  try {
    if (value.startsWith("0x") || value.startsWith("0X")) {
      return BigInt(value);
    }
    return BigInt(value);
  } catch {
    return 1n;
  }
}

function parseReduceOnly(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}

function mapOrderType(type: string | undefined): string {
  const upper = (type ?? "LIMIT").toUpperCase();
  switch (upper) {
    case "MARKET":
      return "MARKET";
    case "STOP_MARKET":
      return "STOP_MARKET";
    case "TAKE_PROFIT_MARKET":
      return "TAKE_PROFIT_MARKET";
    default:
      return "LIMIT";
  }
}

function mapTimeInForce(value: string | undefined, orderType: string): string {
  const upper = (value ?? "").toUpperCase();
  switch (upper) {
    case "IOC":
      return "IMMEDIATE_OR_CANCEL";
    case "FOK":
      return "FILL_OR_KILL";
    case "GTX":
      return "POST_ONLY";
    case "GTC":
      return "GOOD_TIL_CANCEL";
    default:
      return orderType === "MARKET" ? "IMMEDIATE_OR_CANCEL" : "GOOD_TIL_CANCEL";
  }
}

function intervalToMs(interval: string): number {
  switch (interval) {
    case "1m":
      return 60 * 1000;
    case "3m":
      return 3 * 60 * 1000;
    case "5m":
      return 5 * 60 * 1000;
    case "15m":
      return 15 * 60 * 1000;
    case "30m":
      return 30 * 60 * 1000;
    case "1h":
      return 60 * 60 * 1000;
    case "4h":
      return 4 * 60 * 60 * 1000;
    case "12h":
      return 12 * 60 * 60 * 1000;
    case "1d":
      return 24 * 60 * 60 * 1000;
    default:
      return 60 * 1000;
  }
}

function parseEdgeInterval(channel: string): string | null {
  const parts = channel.split(".");
  const edgeInterval = parts[parts.length - 1];
  const entry = Object.entries(EDGE_KLINE_INTERVAL).find(([, value]) => value === edgeInterval);
  return entry ? entry[0] : null;
}

function klineChannel(contractId: string, interval: string): string {
  const edge = EDGE_KLINE_INTERVAL[interval] ?? EDGE_KLINE_INTERVAL["1m"];
  return `kline.${contractId}.${edge}`;
}

function extractQuoteEvent(message: any): { channel: string; payload: any } | null {
  if (!message) return null;
  if (message.type === "quote-event") {
    return {
      channel: message.channel ?? "",
      payload: message.data ?? message.payload ?? {},
    };
  }
  if (message.type === "payload") {
    const data = Array.isArray(message.content?.data) ? message.content?.data[0] : message.content?.data ?? message.payload ?? {};
    return {
      channel: message.channel ?? "",
      payload: data ?? {},
    };
  }
  return null;
}

function normalizeDecimalInput(value: number | string): string {
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return "0";
  const str = value.toString();
  if (!/e/i.test(str)) return str;
  const parts = str.toLowerCase().split("e");
  const mantissaRaw = parts[0] ?? "0";
  const exponentRaw = parts[1] ?? "0";
  const mantissa = mantissaRaw;
  const exp = Number(exponentRaw);
  const negative = mantissa.startsWith("-");
  const unsigned = negative ? mantissa.slice(1) : mantissa;
  const [intPart, fracPart = ""] = unsigned.split(".");
  let digits = (intPart + fracPart).replace(/^0+/, "") || "0";
  let decimalIndex = intPart.length + exp;
  if (decimalIndex <= 0) {
    digits = digits.padStart(digits.length + (1 - decimalIndex), "0");
    decimalIndex = 1;
  }
  if (decimalIndex >= digits.length) {
    digits = digits.padEnd(decimalIndex, "0");
    return `${negative ? "-" : ""}${digits}`;
  }
  const integer = digits.slice(0, decimalIndex) || "0";
  const fraction = digits.slice(decimalIndex).replace(/0+$/, "");
  const sign = negative ? "-" : "";
  return fraction ? `${sign}${integer}.${fraction}` : `${sign}${integer}`;
}

function generateClientOrderId(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1e6).toString().padStart(6, "0")}`;
}
