import type { ExchangeAdapter, ExchangePrecision } from "../../exchanges/adapter";
import { extractMessage } from "../../utils/errors";
import { t } from "../../i18n";
import type { LogHandler } from "./subscriptions";

/** Smallest tick/step an engine will accept; guards against a config of 0. */
const MIN_INCREMENT = 1e-9;
/** Two ticks that differ by less than this are the same tick. */
const INCREMENT_EPSILON = 1e-12;
const RETRY_DELAY_MS = 2000;

export interface PrecisionSeed {
  priceTick: number;
  qtyStep: number;
}

/**
 * Config slice the syncer writes through to. Engines that read
 * `config.priceTick` / `config.qtyStep` directly stay correct without change.
 * `qtyStep` is optional: the maker-family configs carry only a price tick.
 */
export interface PrecisionConfigTarget {
  priceTick: number;
  qtyStep?: number;
}

export interface PrecisionSyncerMessages {
  synced: (precision: ExchangePrecision) => string;
  failed: (error: unknown) => string;
}

/**
 * Fetches trading precision from the exchange once, retrying until it lands, and
 * exposes the live values every engine quotes against.
 *
 * Owns its retry timer so a stopped engine stops retrying — the eight hand-rolled
 * copies of this logic leaked one retry loop each.
 */
export class PrecisionSyncer {
  private priceTickValue: number;
  private qtyStepValue: number;
  private minBaseAmountValue: number | null = null;
  private minQuoteAmountValue: number | null = null;

  private inFlight: Promise<void> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private stopped = false;

  constructor(
    private readonly exchange: ExchangeAdapter,
    private readonly config: PrecisionConfigTarget,
    seed: PrecisionSeed,
    private readonly log: LogHandler,
    private readonly messages: PrecisionSyncerMessages
  ) {
    this.priceTickValue = Math.max(MIN_INCREMENT, seed.priceTick);
    this.qtyStepValue = Math.max(MIN_INCREMENT, seed.qtyStep);
  }

  get priceTick(): number {
    return this.priceTickValue;
  }

  get qtyStep(): number {
    return this.qtyStepValue;
  }

  get minBaseAmount(): number | null {
    return this.minBaseAmountValue;
  }

  get minQuoteAmount(): number | null {
    return this.minQuoteAmountValue;
  }

  /** Idempotent: a sync already in flight or already completed is not repeated. */
  start(): void {
    if (this.stopped || this.inFlight) return;
    const getPrecision = this.exchange.getPrecision?.bind(this.exchange);
    if (!getPrecision) return;

    this.inFlight = getPrecision()
      .then((precision) => {
        if (this.stopped || !precision) return;
        if (this.apply(precision)) {
          this.log("info", this.messages.synced(precision));
        }
      })
      .catch((error) => {
        this.inFlight = null;
        if (this.stopped) return;
        this.log("error", this.messages.failed(extractMessage(error)));
        this.retryTimer = setTimeout(() => {
          this.retryTimer = null;
          this.start();
        }, RETRY_DELAY_MS);
      });
  }

  /** Discards the completed sync so the next start() refetches. */
  refresh(): void {
    this.inFlight = null;
    this.start();
  }

  stop(): void {
    this.stopped = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  /** @returns whether either increment actually moved. */
  private apply(precision: ExchangePrecision): boolean {
    let changed = false;
    if (isUsableIncrement(precision.priceTick) && differs(precision.priceTick, this.priceTickValue)) {
      this.priceTickValue = precision.priceTick;
      this.config.priceTick = precision.priceTick;
      changed = true;
    }
    if (isUsableIncrement(precision.qtyStep) && differs(precision.qtyStep, this.qtyStepValue)) {
      this.qtyStepValue = precision.qtyStep;
      this.config.qtyStep = precision.qtyStep;
      changed = true;
    }
    if (precision.minBaseAmount != null && Number.isFinite(precision.minBaseAmount)) {
      this.minBaseAmountValue = precision.minBaseAmount;
    }
    if (precision.minQuoteAmount != null && Number.isFinite(precision.minQuoteAmount)) {
      this.minQuoteAmountValue = precision.minQuoteAmount;
    }
    return changed;
  }
}

/**
 * Every engine reports precision sync with the same wording, so they share one
 * syncer built from `log.common.precision*`.
 *
 * @param seedQtyStep step used until the exchange reports one. Maker-family engines
 *   pass a fixed default; config-driven engines pass `config.qtyStep`.
 */
export function createPrecisionSyncer(
  exchange: ExchangeAdapter,
  config: PrecisionConfigTarget,
  seedQtyStep: number,
  log: LogHandler
): PrecisionSyncer {
  return new PrecisionSyncer(
    exchange,
    config,
    { priceTick: config.priceTick, qtyStep: seedQtyStep },
    log,
    {
      synced: (precision) =>
        t("log.common.precisionSynced", {
          priceTick: precision.priceTick,
          qtyStep: precision.qtyStep,
        }),
      failed: (error) => t("log.common.precisionFailed", { error: String(error) }),
    }
  );
}

function isUsableIncrement(value: number | undefined): value is number {
  return value != null && Number.isFinite(value) && value > 0;
}

function differs(next: number, current: number): boolean {
  return Math.abs(next - current) > INCREMENT_EPSILON;
}
