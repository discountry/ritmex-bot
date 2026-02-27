import type {
  LighterAccountDetails,
  LighterKline,
  LighterMarketStats,
  LighterOrderBookMetadata,
} from "./types";
import { DEFAULT_LIGHTER_ENVIRONMENT, LIGHTER_HOSTS } from "./constants";

interface ApiResponseBase {
  code: number;
  message?: string | null;
}

interface OrderBooksResponse extends ApiResponseBase {
  order_books?: LighterOrderBookMetadata[];
}

interface ExchangeStatsResponse extends ApiResponseBase {
  order_book_stats?: Array<{
    market_id: number;
    index_price?: string;
    mark_price?: string;
    last_trade_price: string;
    open_interest?: string;
    daily_base_token_volume?: number;
    daily_quote_token_volume?: number;
    daily_price_low?: number;
    daily_price_high?: number;
    daily_price_change?: number;
    symbol: string;
    funding_rate?: string;
    funding_timestamp?: number;
    current_funding_rate?: string;
  }>;
}

interface NextNonceResponse extends ApiResponseBase {
  nonce: number;
}

export interface SendTxResponse extends ApiResponseBase {
  tx_hash: string;
  predicted_execution_time_ms?: number;
}

interface CandlesticksResponse extends ApiResponseBase {
  resolution: string;
  candlesticks: Array<{
    start_timestamp?: number;
    end_timestamp?: number;
    timestamp?: number;
    open: number | string;
    high: number | string;
    low: number | string;
    close: number | string;
    base_token_volume: number | string;
    quote_token_volume: number | string;
    trades?: number;
  }>;
}

interface AccountResponse extends ApiResponseBase {
  account?: LighterAccountDetails;
  accounts?: LighterAccountDetails[];
}

export interface LighterHttpClientOptions {
  baseUrl?: string;
  environment?: keyof typeof LIGHTER_HOSTS;
  priceProtection?: boolean;
  fetcher?: typeof fetch;
}

export class LighterHttpClient {
  readonly baseUrl: string;
  private readonly priceProtection: boolean | undefined;
  private readonly fetcher: typeof fetch;

  constructor(options: LighterHttpClientOptions = {}) {
    const env = options.environment ?? DEFAULT_LIGHTER_ENVIRONMENT;
    const host = options.baseUrl ?? LIGHTER_HOSTS[env]?.rest;
    if (!host) {
      throw new Error(`Unknown Lighter environment: ${env}`);
    }
    this.baseUrl = host.replace(/\/$/, "");
    this.priceProtection = options.priceProtection;
    this.fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
    if (!this.fetcher) {
      throw new Error("Global fetch is not available; provide a custom fetch implementation");
    }
  }

  async getOrderBooks(): Promise<LighterOrderBookMetadata[]> {
    const response = await this.get<OrderBooksResponse>("/api/v1/orderBooks");
    return response.order_books ?? [];
  }

  async getExchangeStats(): Promise<LighterMarketStats[]> {
    const response = await this.get<ExchangeStatsResponse>("/api/v1/exchangeStats");
    const stats = response.order_book_stats ?? [];
    return stats.map((entry) => ({
      market_id: entry.market_id,
      symbol: entry.symbol,
      market_type: (entry as any).market_type,
      index_price: (entry as any).index_price ?? entry.mark_price ?? entry.last_trade_price,
      mid_price: (entry as any).mid_price,
      mark_price: entry.mark_price ?? (entry as any).mid_price ?? entry.last_trade_price,
      last_trade_price: entry.last_trade_price,
      open_interest: (entry as any).open_interest ?? "0",
      daily_base_token_volume: entry.daily_base_token_volume,
      daily_quote_token_volume: entry.daily_quote_token_volume,
      daily_price_low: entry.daily_price_low,
      daily_price_high: entry.daily_price_high,
      daily_price_change: entry.daily_price_change,
      current_funding_rate: entry.current_funding_rate,
      funding_rate: entry.funding_rate,
      funding_timestamp: entry.funding_timestamp,
    }));
  }

  async getAccountDetails(
    accountIndex: number,
    authToken?: string,
    options: { by?: "index" | "l1_address"; value?: string | number } = {}
  ): Promise<LighterAccountDetails | null> {
    const query: Record<string, unknown> = {};
    if (authToken) {
      query.auth = authToken;
    }
    const by = options.by ?? "index";
    query.by = by;
    if (options.value !== undefined) {
      query.value = options.value;
    } else if (by === "index") {
      query.value = accountIndex;
    }
    const response = await this.get<AccountResponse>("/api/v1/account", {
      query,
      headers: authToken ? { Authorization: authToken } : undefined,
      tolerateNotFound: true,
    });
    const account = response.account ?? (Array.isArray(response.accounts) ? response.accounts[0] : null);
    return account ?? null;
  }

  async getCandlesticks(params: {
    marketId: number;
    resolution: string;
    countBack: number;
    startTimestamp: number;
    endTimestamp: number;
    setTimestampToEnd?: boolean;
  }): Promise<LighterKline[]> {
    const response = await this.get<CandlesticksResponse>("/api/v1/candlesticks", {
      query: {
        market_id: params.marketId,
        resolution: params.resolution,
        count_back: params.countBack,
        start_timestamp: params.startTimestamp,
        end_timestamp: params.endTimestamp,
        set_timestamp_to_end: params.setTimestampToEnd ?? true,
      },
    });

    return (response.candlesticks ?? []).map((entry) => ({
      start_timestamp: entry.start_timestamp ?? entry.timestamp ?? 0,
      end_timestamp:
        entry.end_timestamp ??
        (entry.start_timestamp ?? entry.timestamp ?? 0) + 1,
      open: String(entry.open ?? 0),
      high: String(entry.high ?? 0),
      low: String(entry.low ?? 0),
      close: String(entry.close ?? 0),
      base_token_volume: String(entry.base_token_volume ?? 0),
      quote_token_volume: String(entry.quote_token_volume ?? 0),
      trades: entry.trades,
    }));
  }

  async getNextNonce(accountIndex: number, apiKeyIndex: number): Promise<bigint> {
    const response = await this.get<NextNonceResponse>("/api/v1/nextNonce", {
      query: {
        account_index: accountIndex,
        api_key_index: apiKeyIndex,
      },
    });
    if (typeof response.nonce !== "number") {
      throw new Error("Lighter nextNonce response missing nonce");
    }
    return BigInt(response.nonce);
  }

  async sendTransaction(
    txType: number,
    txInfo: string,
    options: { priceProtection?: boolean; authToken?: string } = {}
  ): Promise<SendTxResponse> {
    const form = new FormData();
    form.set("tx_type", String(txType));
    form.set("tx_info", txInfo);
    const priceProtection = options.priceProtection ?? this.priceProtection;
    form.set("price_protection", String(priceProtection ?? false));
    return this.postForm<SendTxResponse>("/api/v1/sendTx", form, options.authToken);
  }

  private async get<T extends ApiResponseBase>(
    path: string,
    options: {
      query?: Record<string, unknown>;
      headers?: Record<string, string | undefined>;
      tolerateNotFound?: boolean;
    } = {}
  ): Promise<T> {
    const url = new URL(path, `${this.baseUrl}`);
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) continue;
        url.searchParams.set(key, String(value));
      }
    }
    const requestUrl = url.toString();
    const response = await this.fetcher(requestUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        ...this.cleanHeaders(options.headers),
      },
    });
    if (options.tolerateNotFound && response.status === 404) {
      return { code: 404 } as T;
    }
    return this.parseResponse<T>(response, requestUrl);
  }

  private async post<T extends ApiResponseBase>(path: string, body: unknown, authToken?: string): Promise<T> {
    const requestUrl = new URL(path, `${this.baseUrl}`).toString();
    const response = await this.fetcher(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(authToken ? { Authorization: authToken } : {}),
      },
      body: JSON.stringify(body),
    });
    return this.parseResponse<T>(response, requestUrl);
  }

  private async postForm<T extends ApiResponseBase>(path: string, form: FormData, authToken?: string): Promise<T> {
    const requestUrl = new URL(path, `${this.baseUrl}`).toString();
    const response = await this.fetcher(requestUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(authToken ? { Authorization: authToken } : {}),
      },
      body: form as any,
    });
    return this.parseResponse<T>(response, requestUrl);
  }

  private cleanHeaders(headers?: Record<string, string | undefined>): Record<string, string> | undefined {
    if (!headers) return undefined;
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (value) result[key] = value;
    }
    return Object.keys(result).length ? result : undefined;
  }

  private async parseResponse<T extends ApiResponseBase>(response: Response, requestUrl: string): Promise<T> {
    const text = await response.text();
    if (!response.ok) {
      const snippet = text ? truncateBody(text) : response.statusText;
      throw new Error(`Lighter HTTP ${response.status} ${response.statusText} (${requestUrl}): ${snippet}`);
    }
    if (!text) {
      throw new Error(`Empty Lighter response body (${requestUrl})`);
    }
    let parsed: T;
    try {
      parsed = JSON.parse(text) as T;
    } catch (error) {
      throw new Error(`Failed to parse Lighter response (${requestUrl}): ${String(error)}. Body: ${truncateBody(text)}`);
    }
    if (typeof parsed.code === "number" && parsed.code !== 200) {
      throw new Error(parsed.message ?? `Lighter API returned code ${parsed.code} (${requestUrl})`);
    }
    return parsed;
  }
}

function truncateBody(body: string, limit = 200): string {
  return body.length > limit ? `${body.slice(0, limit)}…` : body;
}
