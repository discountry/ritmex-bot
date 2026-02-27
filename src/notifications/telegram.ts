import type { NotificationSender, TradeNotification, NotificationConfig } from "./types";

export interface TelegramConfig extends NotificationConfig {
  botToken: string;
  chatId: string;
}

const LEVEL_EMOJI: Record<string, string> = {
  info: "ℹ️",
  warn: "⚠️",
  error: "🚨",
  success: "✅",
};

const TYPE_EMOJI: Record<string, string> = {
  order_filled: "📝",
  position_opened: "📈",
  position_closed: "📉",
  stop_loss: "🛑",
  token_expired: "⏰",
  custom: "📢",
};

const LOG_PREFIX = "[Telegram]";

function formatNotificationMessage(notification: TradeNotification, accountLabel?: string): string {
  const levelEmoji = LEVEL_EMOJI[notification.level] ?? "";
  const typeEmoji = TYPE_EMOJI[notification.type] ?? "";
  const timestamp = notification.timestamp ?? Date.now();
  const time = new Date(timestamp).toISOString().replace("T", " ").substring(0, 19);

  const label = notification.accountLabel ?? accountLabel ?? notification.symbol;

  const lines: string[] = [
    `${typeEmoji}${levelEmoji} [${label}] ${notification.title}`,
    ``,
    `${notification.message}`,
  ];

  if (notification.details && Object.keys(notification.details).length > 0) {
    lines.push(``);
    for (const [key, value] of Object.entries(notification.details)) {
      if (value != null) {
        if (Array.isArray(value)) {
          lines.push(`• ${key}: ${value.join(", ") || "[]"}`);
        } else {
          lines.push(`• ${key}: ${value}`);
        }
      }
    }
  }

  lines.push(``);
  lines.push(`🕐 ${time} UTC`);
  lines.push(`📊 ${notification.symbol}`);

  return lines.join("\n");
}

export class TelegramNotifier implements NotificationSender {
  private readonly config: TelegramConfig;
  private readonly baseUrl: string;
  private sendQueue: Promise<void> = Promise.resolve();

  constructor(config: Partial<TelegramConfig> = {}) {
    this.config = {
      enabled: Boolean(config.botToken && config.chatId),
      botToken: config.botToken ?? "",
      chatId: config.chatId ?? "",
      accountLabel: config.accountLabel,
    };
    this.baseUrl = `https://api.telegram.org/bot${this.config.botToken}`;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  async send(notification: TradeNotification): Promise<void> {
    if (!this.isEnabled()) {
      return;
    }

    this.sendQueue = this.sendQueue
      .then(() => this.doSend(notification))
      .catch(() => {});
  }

  private async doSend(notification: TradeNotification): Promise<void> {
    const text = formatNotificationMessage(notification, this.config.accountLabel);
    const url = `${this.baseUrl}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text,
        }),
      });

      if (response.ok) {
        console.info(`${LOG_PREFIX} Notification sent (status ${response.status}).`);
        return;
      }
      const errorText = await response.text().catch(() => "unknown error");
      console.error(`${LOG_PREFIX} Failed to send notification: ${response.status} ${errorText}`);
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to send notification: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export function createTelegramNotifier(): TelegramNotifier {
  return new TelegramNotifier({
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID,
    accountLabel: process.env.TELEGRAM_ACCOUNT_LABEL,
  });
}
