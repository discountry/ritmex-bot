export class StrategyEventEmitter<TEvent extends string, TPayload> {
  private readonly listeners = new Map<TEvent, Set<(payload: TPayload) => void>>();

  on(event: TEvent, handler: (payload: TPayload) => void): void {
    const handlers = this.listeners.get(event) ?? new Set<(payload: TPayload) => void>();
    handlers.add(handler);
    this.listeners.set(event, handlers);
  }

  off(event: TEvent, handler: (payload: TPayload) => void): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (handlers.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit(event: TEvent, payload: TPayload, onError?: (error: unknown) => void): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (error) {
        onError?.(error);
      }
    }
  }
}
