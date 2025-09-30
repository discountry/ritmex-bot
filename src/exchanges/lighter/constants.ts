export type LighterEnvironment = "mainnet" | "testnet" | "staging" | "dev";

export interface LighterHostConfig {
  rest: string;
  ws: string;
}

export const LIGHTER_HOSTS: Record<LighterEnvironment, LighterHostConfig> = {
  mainnet: {
    rest: "https://mainnet.zklighter.elliot.ai",
    ws: "wss://mainnet.zklighter.elliot.ai/stream",
  },
  testnet: {
    rest: "https://testnet.zklighter.elliot.ai",
    ws: "wss://testnet.zklighter.elliot.ai/stream",
  },
  staging: {
    rest: "https://staging.zklighter.elliot.ai",
    ws: "wss://staging.zklighter.elliot.ai/stream",
  },
  dev: {
    rest: "https://dev.zklighter.elliot.ai",
    ws: "wss://dev.zklighter.elliot.ai/stream",
  },
};

export const LIGHTER_CHAIN_IDS: Record<LighterEnvironment, number> = {
  mainnet: 304,
  testnet: 300,
  staging: 300,
  dev: 300,
};

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
