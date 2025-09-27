export type LogHandler = (type: string, detail: string) => void;

interface SubscriptionMessages {
  subscribeFail: (error: unknown) => string;
  processFail: (error: unknown) => string;
}

export function safeSubscribe<T>(
  subscribe: (cb: (payload: T) => void) => void,
  handler: (payload: T) => void,
  log: LogHandler,
  messages: SubscriptionMessages
): void {
  try {
    subscribe((payload) => {
      try {
        handler(payload);
      } catch (error) {
        log("error", messages.processFail(error));
      }
    });
  } catch (error) {
    log("error", messages.subscribeFail(error));
  }
}
