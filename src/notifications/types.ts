export type NotificationLevel = "info" | "warn" | "error" | "success";

export interface TradeNotification {
  type: "order_filled" | "position_opened" | "position_closed" | "stop_loss" | "token_expired" | "custom";
  level: NotificationLevel;
  symbol: string;
  title: string;
  message: string;
  accountLabel?: string;
  details?: Record<string, string | number | boolean | null | string[]>;
  timestamp?: number;
}

export interface NotificationSender {
  send(notification: TradeNotification): Promise<void>;
  isEnabled(): boolean;
}

export interface NotificationConfig {
  enabled: boolean;
  accountLabel?: string;
}
