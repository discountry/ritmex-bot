/**
 * How long to wait before the nth reconnect attempt (1-based).
 * Return a fixed value for a constant delay, or grow it for backoff.
 */
export type BackoffPolicy = (attempt: number) => number;

export const fixedBackoff = (delayMs: number): BackoffPolicy => () => delayMs;

/** `base * 2^(attempt-1)`, capped at `maxMs`. */
export const exponentialBackoff = (baseMs: number, maxMs: number): BackoffPolicy => (attempt) =>
  Math.min(baseMs * Math.pow(2, attempt - 1), maxMs);

/** `base * attempt`, capped at `maxMs`. */
export const linearBackoff = (baseMs: number, maxMs: number): BackoffPolicy => (attempt) =>
  Math.min(baseMs * attempt, maxMs);

export interface ReconnectSchedulerOptions {
  /** Reopens the socket. Rejections are reported and then retried. */
  connect: () => void | Promise<void>;
  backoff: BackoffPolicy;
  /** Returns false to abandon reconnecting (e.g. the gateway was closed). */
  shouldReconnect?: () => boolean;
  onError?: (error: unknown, attempt: number) => void;
  onSchedule?: (delayMs: number, attempt: number) => void;
}

/**
 * Owns the reconnect timer for one socket.
 *
 * Every gateway hand-rolled the same three pieces — a "one pending attempt at a
 * time" guard, an attempt counter feeding a backoff formula, and resetting that
 * counter once the socket opens — each with its own field names and a slightly
 * different formula. Forgetting the reset is the classic way backoff silently
 * degrades into a 30-second stall after a transient blip, so the reset lives
 * here next to the counter it guards.
 *
 * Deliberately narrow: connect/auth/subscribe/heartbeat differ per venue and
 * stay in each gateway.
 */
export class ReconnectScheduler {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private attempts = 0;
  private stopped = false;

  constructor(private readonly options: ReconnectSchedulerOptions) {}

  /** Consecutive failed attempts since the last successful open. */
  get attemptCount(): number {
    return this.attempts;
  }

  get pending(): boolean {
    return this.timer != null;
  }

  /** Queues a reconnect. A no-op while one is already pending. */
  schedule(): void {
    if (this.stopped || this.timer) return;
    if (this.options.shouldReconnect && !this.options.shouldReconnect()) return;

    const attempt = this.attempts + 1;
    const delay = this.options.backoff(attempt);
    this.options.onSchedule?.(delay, attempt);

    this.timer = setTimeout(() => {
      this.timer = null;
      this.attempts = attempt;
      if (this.stopped) return;
      try {
        const result = this.options.connect();
        if (result && typeof result.then === "function") {
          result.catch((error) => this.handleFailure(error, attempt));
        }
      } catch (error) {
        this.handleFailure(error, attempt);
      }
    }, delay);
  }

  /** Call once the socket is open: clears backoff so the next blip retries fast. */
  onConnected(): void {
    this.attempts = 0;
    this.cancel();
  }

  /** Cancels a pending attempt without ending the scheduler. */
  cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /** Permanently stops reconnecting; use when the gateway shuts down. */
  stop(): void {
    this.stopped = true;
    this.cancel();
  }

  private handleFailure(error: unknown, attempt: number): void {
    this.options.onError?.(error, attempt);
    this.schedule();
  }
}
