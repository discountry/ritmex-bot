export type LighterEnvironment = "mainnet" | "testnet" | "staging" | "dev" | "rh" | "rh-testnet";

export interface LighterHostConfig {
  rest: string;
  ws: string;
}

export interface LighterNetworkConfig extends LighterHostConfig {
  /**
   * Chain id folded into every signature. A wrong value is unrecoverable: the signer
   * happily produces a payload and the sequencer rejects every transaction.
   * No endpoint exposes it, so this table is the only source of truth.
   */
  chainId: number;
  /**
   * `l1_providers[0].chainId` from `/api/v1/layer1BasicInfo`, plus the ZkLighter contract
   * address — the only deployment fingerprints the server hands out. Used at startup to
   * prove REST really points at the venue the config claims. `null` = not verified.
   */
  l1ChainId: number | null;
  zkLighterContract: string | null;
  /** Settlement/quote asset the venue defaults to when metadata does not name one. */
  defaultQuoteAsset: string;
}

/**
 * Every knob a deployment needs, bound together so no caller can mix a REST host from one
 * venue with the chain id or websocket of another.
 */
export const LIGHTER_NETWORKS: Record<LighterEnvironment, LighterNetworkConfig> = {
  mainnet: {
    rest: "https://mainnet.zklighter.elliot.ai",
    ws: "wss://mainnet.zklighter.elliot.ai/stream",
    chainId: 304,
    l1ChainId: 1,
    zkLighterContract: "0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7",
    defaultQuoteAsset: "USDC",
  },
  rh: {
    rest: "https://api.rh.lighter.xyz",
    ws: "wss://api.rh.lighter.xyz/stream",
    chainId: 466324,
    l1ChainId: 4663,
    zkLighterContract: "0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d",
    defaultQuoteAsset: "USDG",
  },
  "rh-testnet": {
    rest: "https://api.rh-testnet.lighter.xyz",
    ws: "wss://api.rh-testnet.lighter.xyz/stream",
    chainId: 300,
    // Shares L1 chain id 123456 with zklighter testnet; only the contract tells them apart.
    l1ChainId: 123456,
    zkLighterContract: "0x8413Cd5B9856B6D156A8A1066D778885FeaE38F8",
    defaultQuoteAsset: "USDG",
  },
  testnet: {
    rest: "https://testnet.zklighter.elliot.ai",
    ws: "wss://testnet.zklighter.elliot.ai/stream",
    chainId: 300,
    l1ChainId: 123456,
    zkLighterContract: "0xe034801BC49cCDC79FB683022dA0591C86077261",
    defaultQuoteAsset: "USDC",
  },
  staging: {
    rest: "https://staging.zklighter.elliot.ai",
    ws: "wss://staging.zklighter.elliot.ai/stream",
    chainId: 300,
    l1ChainId: null,
    zkLighterContract: null,
    defaultQuoteAsset: "USDC",
  },
  dev: {
    rest: "https://dev.zklighter.elliot.ai",
    ws: "wss://dev.zklighter.elliot.ai/stream",
    chainId: 300,
    l1ChainId: null,
    zkLighterContract: null,
    defaultQuoteAsset: "USDC",
  },
};

/** Spellings users actually type, mapped onto canonical environment names. */
export const LIGHTER_ENVIRONMENT_ALIASES: Record<string, LighterEnvironment> = {
  robinhood: "rh",
  robinhoodchain: "rh",
  "robinhood-chain": "rh",
  "rh-mainnet": "rh",
  rhc: "rh",
  "robinhood-testnet": "rh-testnet",
  rhtestnet: "rh-testnet",
  prod: "mainnet",
  production: "mainnet",
};

/**
 * Web app hostnames. Pasting one of these as a base URL is a common mistake — they serve the
 * SPA, not the API — so they resolve to the matching environment's real REST host instead.
 */
export const LIGHTER_APP_HOSTS: Record<string, LighterEnvironment> = {
  "app.lighter.xyz": "mainnet",
  "robinhoodchain.lighter.xyz": "rh",
};

export const LIGHTER_HOSTS: Record<LighterEnvironment, LighterHostConfig> = Object.fromEntries(
  Object.entries(LIGHTER_NETWORKS).map(([env, config]) => [env, { rest: config.rest, ws: config.ws }])
) as Record<LighterEnvironment, LighterHostConfig>;

export const LIGHTER_CHAIN_IDS: Record<LighterEnvironment, number> = Object.fromEntries(
  Object.entries(LIGHTER_NETWORKS).map(([env, config]) => [env, config.chainId])
) as Record<LighterEnvironment, number>;

export const DEFAULT_LIGHTER_ENVIRONMENT: LighterEnvironment = "testnet";

export const DEFAULT_TRANSACTION_EXPIRY_BUFFER_MS = 10 * 60 * 1000 - 1000; // 10 min minus 1s
export const DEFAULT_AUTH_TOKEN_HORIZON_MS = 10 * 60 * 1000; // server default is 10 minutes
export const DEFAULT_AUTH_TOKEN_BUFFER_MS = 60 * 1000; // refresh one minute before expiry

export const DEFAULT_ORDER_EXPIRY_PLACEHOLDER = -1; // signer converts -1 -> 28 days
export const IMMEDIATE_OR_CANCEL_EXPIRY_PLACEHOLDER = 0; // signer treats 0 as immediate

export const LIGHTER_ORDER_TYPE = {
  LIMIT: 0,
  MARKET: 1,
  STOP_LOSS: 2,
  STOP_LOSS_LIMIT: 3,
  TAKE_PROFIT: 4,
  TAKE_PROFIT_LIMIT: 5,
  TWAP: 6,
} as const;

export const LIGHTER_TIME_IN_FORCE = {
  IMMEDIATE_OR_CANCEL: 0,
  GOOD_TILL_TIME: 1,
  POST_ONLY: 2,
} as const;

export const LIGHTER_CANCEL_ALL_TIME_IN_FORCE = {
  IMMEDIATE: 0,
  SCHEDULED: 1,
  ABORT: 2,
} as const;

export type LighterOrderType = (typeof LIGHTER_ORDER_TYPE)[keyof typeof LIGHTER_ORDER_TYPE];
export type LighterTimeInForce = (typeof LIGHTER_TIME_IN_FORCE)[keyof typeof LIGHTER_TIME_IN_FORCE];
export type LighterCancelAllTimeInForce =
  (typeof LIGHTER_CANCEL_ALL_TIME_IN_FORCE)[keyof typeof LIGHTER_CANCEL_ALL_TIME_IN_FORCE];

export const LIGHTER_TX_TYPE = {
  CREATE_ORDER: 14,
  CANCEL_ORDER: 15,
  CANCEL_ALL_ORDERS: 16,
} as const;

export const NIL_TRIGGER_PRICE = 0;
export const NIL_CLIENT_ORDER_INDEX = 0;
