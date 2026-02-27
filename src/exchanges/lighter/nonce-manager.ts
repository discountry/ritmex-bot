import { LighterHttpClient } from "./http-client";
import type { LighterNonceManager } from "./types";

interface NonceSlot {
  apiKeyIndex: number;
  next: bigint;
  lastIssued: bigint | null;
}

export interface NonceManagerOptions {
  accountIndex: number;
  apiKeyIndices: number[];
  http: LighterHttpClient;
}

export class HttpNonceManager implements LighterNonceManager {
  private readonly accountIndex: number;
  private readonly apiKeyIndices: number[];
  private readonly http: LighterHttpClient;
  private readonly slots = new Map<number, NonceSlot>();
  private pointer = 0;
  private initPromise: Promise<void> | null = null;

  constructor(options: NonceManagerOptions) {
    if (!options.apiKeyIndices.length) {
      throw new Error("Nonce manager requires at least one API key index");
    }
    this.accountIndex = options.accountIndex;
    this.apiKeyIndices = Array.from(new Set(options.apiKeyIndices)).sort((a, b) => a - b);
    this.http = options.http;
  }

  async init(force = false): Promise<void> {
    if (!this.initPromise || force) {
      this.initPromise = this.refreshAll(force).catch((error) => {
        this.initPromise = null;
        throw error;
      });
    }
    await this.initPromise;
  }

  next(): { apiKeyIndex: number; nonce: bigint } {
    if (!this.slots.size) {
      throw new Error("Nonce manager not initialized");
    }
    const slot = this.pickSlot();
    const nonce = slot.next;
    slot.lastIssued = nonce;
    slot.next = nonce + 1n;
    return { apiKeyIndex: slot.apiKeyIndex, nonce };
  }

  acknowledgeFailure(apiKeyIndex: number): void {
    const slot = this.slots.get(apiKeyIndex);
    if (!slot || slot.lastIssued === null) return;
    slot.next = slot.lastIssued;
    slot.lastIssued = null;
  }

  async refresh(apiKeyIndex: number): Promise<void> {
    const nonce = await this.http.getNextNonce(this.accountIndex, apiKeyIndex);
    // eslint-disable-next-line no-console
    if (process.env.LIGHTER_DEBUG === "1" || process.env.LIGHTER_DEBUG === "true") {
      console.debug("[LighterNonceManager] refresh", { apiKeyIndex, nonce: nonce.toString() });
    }
    this.slots.set(apiKeyIndex, { apiKeyIndex, next: nonce, lastIssued: null });
  }

  nextFor(apiKeyIndex: number): { apiKeyIndex: number; nonce: bigint } {
    if (!this.slots.size) {
      throw new Error("Nonce manager not initialized");
    }
    const slot = this.slots.get(apiKeyIndex);
    if (!slot) {
      throw new Error(`Nonce slot for API key index ${apiKeyIndex} is not initialized`);
    }
    const nonce = slot.next;
    slot.lastIssued = nonce;
    slot.next = nonce + 1n;
    return { apiKeyIndex, nonce };
  }

  private async refreshAll(force: boolean): Promise<void> {
    await Promise.all(
      this.apiKeyIndices.map(async (index) => {
        if (!force && this.slots.has(index)) return;
        await this.refresh(index);
      })
    );
    this.pointer = 0;
  }

  private pickSlot(): NonceSlot {
    const total = this.apiKeyIndices.length;
    if (total === 0) {
      throw new Error("Nonce manager not initialized");
    }
    const index = this.apiKeyIndices[this.pointer % total]!;
    this.pointer = (this.pointer + 1) % total;
    const slot = this.slots.get(index);
    if (!slot) {
      throw new Error(`Nonce slot for API key index ${index} is not initialized`);
    }
    return slot;
  }
}
