import type { SupportedExchangeId } from "../exchanges/create-adapter";
import type { StrategyId } from "./args";

export interface CommandCommonOptions {
  exchange?: SupportedExchangeId;
  symbol?: string;
  json: boolean;
  dryRun: boolean;
  timeoutMs: number;
}

export type OrderCreateType = "limit" | "market" | "stop" | "trailing-stop" | "close";

export interface OrderCreatePayload {
  side: "BUY" | "SELL";
  type: OrderCreateType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  activationPrice?: number;
  callbackRate?: number;
  timeInForce?: "GTC" | "IOC" | "FOK" | "GTX";
  reduceOnly?: boolean;
  closePosition?: boolean;
  triggerType?: "UNSPECIFIED" | "TAKE_PROFIT" | "STOP_LOSS";
  slPrice?: number;
  tpPrice?: number;
}

export type ParsedCliCommand =
  | ({ kind: "help"; topic?: string } & CommandCommonOptions)
  | ({ kind: "doctor" } & CommandCommonOptions)
  | ({ kind: "exchange-list" } & CommandCommonOptions)
  | ({ kind: "exchange-capabilities" } & CommandCommonOptions)
  | ({ kind: "market-ticker" } & CommandCommonOptions)
  | ({ kind: "market-depth"; levels?: number } & CommandCommonOptions)
  | ({ kind: "market-kline"; interval: string; limit?: number } & CommandCommonOptions)
  | ({ kind: "account-snapshot" } & CommandCommonOptions)
  | ({ kind: "position-list" } & CommandCommonOptions)
  | ({ kind: "order-open" } & CommandCommonOptions)
  | ({ kind: "order-create"; payload: OrderCreatePayload } & CommandCommonOptions)
  | ({ kind: "order-cancel"; orderId: string } & CommandCommonOptions)
  | ({ kind: "order-cancel-all" } & CommandCommonOptions)
  | ({ kind: "strategy-run"; strategy: StrategyId; silent: boolean } & CommandCommonOptions);

export interface CommandErrorPayload {
  code:
    | "INVALID_ARGS"
    | "MISSING_ENV"
    | "UNSUPPORTED"
    | "EXCHANGE_ERROR"
    | "TIMEOUT"
    | "RUNTIME_ERROR";
  message: string;
  retryable?: boolean;
  details?: unknown;
}

export interface CommandSuccessPayload {
  success: true;
  command: ParsedCliCommand["kind"];
  exchange?: SupportedExchangeId;
  symbol?: string;
  dryRun: boolean;
  ts: string;
  data: unknown;
  warnings?: string[];
}

export interface CommandFailurePayload {
  success: false;
  command: ParsedCliCommand["kind"] | "unknown";
  exchange?: SupportedExchangeId;
  symbol?: string;
  dryRun: boolean;
  ts: string;
  error: CommandErrorPayload;
}

export type CommandPayload = CommandSuccessPayload | CommandFailurePayload;

export interface CommandExecutionResult {
  exitCode: number;
  payload: CommandPayload;
  forceExit: boolean;
}
