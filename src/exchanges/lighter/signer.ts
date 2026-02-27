import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";

export interface LighterSignerConfig {
  accountIndex: number | bigint;
  chainId: number;
  apiKeys: Record<number, string>;
  baseUrl?: string; // optional for offline signing/tests
}

interface BaseSignOptions {
  apiKeyIndex?: number;
  nonce: bigint;
  expiredAt?: bigint;
}

export interface CreateOrderSignParams extends BaseSignOptions {
  marketIndex: number;
  clientOrderIndex: bigint;
  baseAmount: bigint;
  price: number;
  isAsk: number;
  orderType: number;
  timeInForce: number;
  reduceOnly: number;
  triggerPrice: number;
  orderExpiry: bigint;
}

export interface CancelOrderSignParams extends BaseSignOptions {
  marketIndex: number;
  orderIndex: bigint;
}

export interface CancelAllSignParams extends BaseSignOptions {
  timeInForce: number;
  scheduledTime: bigint;
}

export interface SignedTxPayload {
  txType: number;
  txInfo: string;
  txHash?: string;
  signature?: string;
}

type PendingResolver = {
  resolve: (value: any) => void;
  reject: (error: Error) => void;
};

class PythonSignerBridge {
  private readonly child: ChildProcessWithoutNullStreams;
  private readonly pending = new Map<number, PendingResolver>();
  private readonly scriptPath: string;
  private seq = 0;

  constructor(scriptPath: string) {
    this.scriptPath = scriptPath;
    this.child = spawn("python3", [this.scriptPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    const rl = createInterface({ input: this.child.stdout });
    rl.on("line", (line) => this.onLine(line));
    this.child.on("error", (error) => {
      this.rejectAll(new Error(`lighter signer bridge failed to start: ${String(error)}`));
    });
    this.child.on("exit", (code, signal) => {
      this.rejectAll(new Error(`lighter signer bridge exited (code=${code}, signal=${signal ?? ""})`));
    });
    this.child.stderr.on("data", (chunk) => {
      const message = chunk.toString().trim();
      if (message.length) {
        console.error(`[LighterSignerBridge] ${message}`);
      }
    });
  }

  private onLine(line: string): void {
    let payload: any;
    try {
      payload = JSON.parse(line);
    } catch (error) {
      console.error(`[LighterSignerBridge] invalid JSON: ${line}`, error);
      return;
    }
    const { id, error } = payload;
    const pending = this.pending.get(Number(id));
    if (!pending) {
      if (error) {
        console.error(`[LighterSignerBridge] error without pending request: ${error}`);
      }
      return;
    }
    this.pending.delete(Number(id));
    if (error) {
      pending.reject(new Error(String(error)));
      return;
    }
    pending.resolve(payload.result ?? null);
  }

  private rejectAll(error: Error): void {
    for (const { reject } of this.pending.values()) {
      reject(error);
    }
    this.pending.clear();
  }

  async call(method: string, params: Record<string, unknown>): Promise<any> {
    const id = ++this.seq;
    const payload = JSON.stringify({ id, method, params }, (_key, value) => {
      if (typeof value === "bigint") return value.toString();
      return value;
    });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.child.stdin.write(payload + "\n", (err) => {
        if (err) {
          this.pending.delete(id);
          reject(err);
        }
      });
    });
  }
}

function resolveScriptPath(): string {
  const current = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(current, "./lighter_signer_bridge.py");
}

export class LighterSigner {
  readonly accountIndex: bigint;
  readonly chainId: number;
  readonly defaultKeyIndex: number;
  private readonly baseUrl: string;
  private readonly bridge: PythonSignerBridge;
  private readonly ready: Promise<void>;

  constructor(config: LighterSignerConfig) {
    this.accountIndex = typeof config.accountIndex === "number"
      ? BigInt(Math.trunc(config.accountIndex))
      : config.accountIndex;
    this.chainId = config.chainId >>> 0;
    // Default to localhost to allow offline signing in tests
    this.baseUrl = config.baseUrl ?? "http://localhost";

    const entries = Object.entries(config.apiKeys ?? {});
    if (!entries.length) {
      throw new Error("At least one Lighter API private key must be provided");
    }
    this.defaultKeyIndex = Number(entries[0]![0]);

    const bridge = new PythonSignerBridge(resolveScriptPath());
    this.bridge = bridge;
    const baseUrl = this.baseUrl;
    const chainId = this.chainId;
    const accountIndexStr = this.accountIndex.toString();
    this.ready = (async () => {
      for (const [index, key] of entries) {
        await bridge.call("create_client", {
          apiKeyIndex: Number(index),
          privateKey: key,
          baseUrl,
          chainId,
          accountIndex: accountIndexStr,
        });
      }
    })();
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  async signCreateOrder(params: CreateOrderSignParams): Promise<SignedTxPayload> {
    await this.ensureReady();
    const apiKeyIndex = params.apiKeyIndex ?? this.defaultKeyIndex;

    const result = await this.bridge.call("sign_create_order", {
      apiKeyIndex,
      marketIndex: params.marketIndex,
      clientOrderIndex: params.clientOrderIndex.toString(),
      baseAmount: params.baseAmount.toString(),
      price: params.price,
      isAsk: params.isAsk,
      orderType: params.orderType,
      timeInForce: params.timeInForce,
      reduceOnly: params.reduceOnly,
      triggerPrice: params.triggerPrice,
      orderExpiry: params.orderExpiry.toString(),
      nonce: params.nonce.toString(),
      accountIndex: this.accountIndex.toString(),
    });

    const txInfo = String(result);
    let signature: string | undefined;
    let txHash: string | undefined;
    try {
      const parsed = JSON.parse(txInfo);
      if (typeof parsed?.Sig === "string") signature = parsed.Sig;
      if (typeof parsed?.SignedHash === "string") txHash = parsed.SignedHash;
    } catch {
      // ignore parsing errors – txInfo still valid for sendTx
    }

    return {
      txType: 14,
      txInfo,
      txHash,
      signature,
    };
  }

  async signCancelOrder(params: CancelOrderSignParams): Promise<SignedTxPayload> {
    await this.ensureReady();
    const apiKeyIndex = params.apiKeyIndex ?? this.defaultKeyIndex;

    const result = await this.bridge.call("sign_cancel_order", {
      apiKeyIndex,
      marketIndex: params.marketIndex,
      orderIndex: params.orderIndex.toString(),
      nonce: params.nonce.toString(),
      accountIndex: this.accountIndex.toString(),
    });

    const txInfo = String(result);
    let signature: string | undefined;
    try {
      const parsed = JSON.parse(txInfo);
      if (typeof parsed?.Sig === "string") signature = parsed.Sig;
    } catch {
      // ignore
    }

    return {
      txType: 15,
      txInfo,
      signature,
    };
  }

  async signCancelAll(params: CancelAllSignParams): Promise<SignedTxPayload> {
    await this.ensureReady();
    const apiKeyIndex = params.apiKeyIndex ?? this.defaultKeyIndex;

    const result = await this.bridge.call("sign_cancel_all", {
      apiKeyIndex,
      timeInForce: params.timeInForce,
      scheduledTime: params.scheduledTime.toString(),
      nonce: params.nonce.toString(),
      accountIndex: this.accountIndex.toString(),
    });

    const txInfo = String(result);
    let signature: string | undefined;
    try {
      const parsed = JSON.parse(txInfo);
      if (typeof parsed?.Sig === "string") signature = parsed.Sig;
    } catch {
      // ignore
    }

    return {
      txType: 16,
      txInfo,
      signature,
    };
  }

  async createAuthToken(deadlineMs: number, apiKeyIndex?: number): Promise<string> {
    await this.ensureReady();
    const index = apiKeyIndex ?? this.defaultKeyIndex;
    const result = await this.bridge.call("create_auth_token", {
      apiKeyIndex: index,
      deadlineMs: Math.floor(deadlineMs / 1000),
      accountIndex: this.accountIndex.toString(),
    });
    return String(result ?? "");
  }
}
