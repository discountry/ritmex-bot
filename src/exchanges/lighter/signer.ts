import { LighterPrivateKey, signatureToBytes } from "./crypto/schnorr";
import { hashToQuinticExtension } from "./crypto/poseidon2";
import { Fp } from "./crypto/goldilocks";
import { Fp5 } from "./crypto/goldilocks-fp5";
import { arrayFromCanonicalLittleEndianBytes } from "./field-array";
import { bytesToHex } from "./bytes";
import { DEFAULT_TRANSACTION_EXPIRY_BUFFER_MS, LIGHTER_TX_TYPE } from "./constants";
import { safeNumberToUint32, toSafeNumber } from "./decimal";

const BASE64_ENCODE = (bytes: Uint8Array): string => Buffer.from(bytes).toString("base64");
const AUTH_MAX_WINDOW_MS = 7 * 60 * 60 * 1000; // 7 hours

function fpFromUint32(value: number): Fp {
  const uint32 = safeNumberToUint32(value);
  return Fp.fromUint32(uint32);
}

function fpFromInt64(value: bigint | number): Fp {
  const bigintValue = typeof value === "number" ? BigInt(Math.trunc(value)) : value;
  return new Fp(bigintValue);
}

interface KeySlot {
  index: number;
  key: LighterPrivateKey;
}

export interface LighterSignerConfig {
  accountIndex: number | bigint;
  chainId: number;
  apiKeys: Record<number, string>;
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
  txHash: string;
  signature: string;
}

export class LighterSigner {
  readonly accountIndex: bigint;
  readonly chainId: number;
  private readonly keys = new Map<number, LighterPrivateKey>();
  private readonly defaultKeyIndex: number;

  constructor(config: LighterSignerConfig) {
    if (!config || typeof config !== "object") {
      throw new Error("LighterSigner requires configuration");
    }
    this.chainId = config.chainId >>> 0;
    this.accountIndex = typeof config.accountIndex === "number"
      ? BigInt(Math.trunc(config.accountIndex))
      : config.accountIndex;
    const entries = Object.entries(config.apiKeys ?? {}).map(([idx, hex]) => ({
      index: Number(idx),
      key: LighterPrivateKey.fromHex(hex),
    }));
    if (!entries.length) {
      throw new Error("At least one Lighter API private key must be provided");
    }
    for (const entry of entries) {
      if (!Number.isInteger(entry.index) || entry.index < 0 || entry.index > 255) {
        throw new Error(`Invalid API key index: ${entry.index}`);
      }
      this.keys.set(entry.index, entry.key);
    }
    this.defaultKeyIndex = entries[0]!.index;
  }

  private resolveKey(apiKeyIndex?: number): KeySlot {
    const index = apiKeyIndex ?? this.defaultKeyIndex;
    const key = this.keys.get(index);
    if (!key) {
      throw new Error(`Missing private key for API key index ${index}`);
    }
    return { index, key };
  }

  signCreateOrder(params: CreateOrderSignParams): SignedTxPayload {
    const slot = this.resolveKey(params.apiKeyIndex);
    const expiredAt = params.expiredAt ?? BigInt(Date.now() + DEFAULT_TRANSACTION_EXPIRY_BUFFER_MS);
    const hash = hashCreateOrder({
      chainId: this.chainId,
      accountIndex: this.accountIndex,
      apiKeyIndex: slot.index,
      nonce: params.nonce,
      expiredAt,
      marketIndex: params.marketIndex,
      clientOrderIndex: params.clientOrderIndex,
      baseAmount: params.baseAmount,
      price: params.price,
      isAsk: params.isAsk,
      orderType: params.orderType,
      timeInForce: params.timeInForce,
      reduceOnly: params.reduceOnly,
      triggerPrice: params.triggerPrice,
      orderExpiry: params.orderExpiry,
    });

    const signature = slot.key.signHashedMessage(hash);
    const signatureBytes = signatureToBytes(signature);
    const txInfo = JSON.stringify({
      AccountIndex: toSafeNumber(this.accountIndex),
      ApiKeyIndex: slot.index,
      OrderInfo: {
        MarketIndex: params.marketIndex,
        ClientOrderIndex: toSafeNumber(params.clientOrderIndex),
        BaseAmount: toSafeNumber(params.baseAmount),
        Price: safeNumberToUint32(params.price),
        IsAsk: params.isAsk,
        Type: params.orderType,
        TimeInForce: params.timeInForce,
        ReduceOnly: params.reduceOnly,
        TriggerPrice: safeNumberToUint32(params.triggerPrice),
        OrderExpiry: toSafeNumber(params.orderExpiry),
      },
      ExpiredAt: toSafeNumber(expiredAt),
      Nonce: toSafeNumber(params.nonce),
      Sig: BASE64_ENCODE(signatureBytes),
    });

    return {
      txType: LIGHTER_TX_TYPE.CREATE_ORDER,
      txInfo,
      txHash: bytesToHex(hash.toBytes()),
      signature: BASE64_ENCODE(signatureBytes),
    };
  }

  signCancelOrder(params: CancelOrderSignParams): SignedTxPayload {
    const slot = this.resolveKey(params.apiKeyIndex);
    const expiredAt = params.expiredAt ?? BigInt(Date.now() + DEFAULT_TRANSACTION_EXPIRY_BUFFER_MS);
    const hash = hashCancelOrder({
      chainId: this.chainId,
      accountIndex: this.accountIndex,
      apiKeyIndex: slot.index,
      nonce: params.nonce,
      expiredAt,
      marketIndex: params.marketIndex,
      orderIndex: params.orderIndex,
    });
    const signature = slot.key.signHashedMessage(hash);
    const signatureBytes = signatureToBytes(signature);
    const txInfo = JSON.stringify({
      AccountIndex: toSafeNumber(this.accountIndex),
      ApiKeyIndex: slot.index,
      MarketIndex: params.marketIndex,
      Index: toSafeNumber(params.orderIndex),
      ExpiredAt: toSafeNumber(expiredAt),
      Nonce: toSafeNumber(params.nonce),
      Sig: BASE64_ENCODE(signatureBytes),
    });
    return {
      txType: LIGHTER_TX_TYPE.CANCEL_ORDER,
      txInfo,
      txHash: bytesToHex(hash.toBytes()),
      signature: BASE64_ENCODE(signatureBytes),
    };
  }

  signCancelAll(params: CancelAllSignParams): SignedTxPayload {
    const slot = this.resolveKey(params.apiKeyIndex);
    const expiredAt = params.expiredAt ?? BigInt(Date.now() + DEFAULT_TRANSACTION_EXPIRY_BUFFER_MS);
    const hash = hashCancelAll({
      chainId: this.chainId,
      accountIndex: this.accountIndex,
      apiKeyIndex: slot.index,
      nonce: params.nonce,
      expiredAt,
      timeInForce: params.timeInForce,
      time: params.scheduledTime,
    });
    const signature = slot.key.signHashedMessage(hash);
    const signatureBytes = signatureToBytes(signature);
    const txInfo = JSON.stringify({
      AccountIndex: toSafeNumber(this.accountIndex),
      ApiKeyIndex: slot.index,
      TimeInForce: params.timeInForce,
      Time: toSafeNumber(params.scheduledTime),
      ExpiredAt: toSafeNumber(expiredAt),
      Nonce: toSafeNumber(params.nonce),
      Sig: BASE64_ENCODE(signatureBytes),
    });
    return {
      txType: LIGHTER_TX_TYPE.CANCEL_ALL_ORDERS,
      txInfo,
      txHash: bytesToHex(hash.toBytes()),
      signature: BASE64_ENCODE(signatureBytes),
    };
  }

  createAuthToken(deadlineMs: number, apiKeyIndex?: number): string {
    if (!Number.isFinite(deadlineMs) || deadlineMs <= Date.now()) {
      throw new Error("Auth token deadline must be in the future");
    }
    if (deadlineMs - Date.now() > AUTH_MAX_WINDOW_MS) {
      throw new Error("Auth token deadline must be within 7 hours");
    }
    const slot = this.resolveKey(apiKeyIndex);
    const deadlineSeconds = Math.floor(deadlineMs / 1000);
    const message = `${deadlineSeconds}:${toSafeNumber(this.accountIndex)}:${slot.index}`;
    const msgBytes = Buffer.from(message, "utf8");
    const preimage = arrayFromCanonicalLittleEndianBytes(msgBytes);
    const hashed = hashToQuinticExtension(preimage);
    const signature = slot.key.signHashedMessage(hashed);
    const signatureHex = bytesToHex(signatureToBytes(signature));
    return `${message}:${signatureHex}`;
  }
}

interface CreateOrderHashInput {
  chainId: number;
  accountIndex: bigint;
  apiKeyIndex: number;
  nonce: bigint;
  expiredAt: bigint;
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

function hashCreateOrder(input: CreateOrderHashInput): Fp5 {
  const elements = [
    Fp.fromUint32(input.chainId >>> 0),
    Fp.fromUint32(LIGHTER_TX_TYPE.CREATE_ORDER),
    fpFromInt64(input.nonce),
    fpFromInt64(input.expiredAt),
    fpFromInt64(input.accountIndex),
    fpFromUint32(input.apiKeyIndex),
    fpFromUint32(input.marketIndex),
    fpFromInt64(input.clientOrderIndex),
    fpFromInt64(input.baseAmount),
    fpFromUint32(input.price),
    fpFromUint32(input.isAsk),
    fpFromUint32(input.orderType),
    fpFromUint32(input.timeInForce),
    fpFromUint32(input.reduceOnly),
    fpFromUint32(input.triggerPrice),
    fpFromInt64(input.orderExpiry),
  ];
  return hashToQuinticExtension(elements);
}

interface CancelOrderHashInput {
  chainId: number;
  accountIndex: bigint;
  apiKeyIndex: number;
  nonce: bigint;
  expiredAt: bigint;
  marketIndex: number;
  orderIndex: bigint;
}

function hashCancelOrder(input: CancelOrderHashInput): Fp5 {
  const elements = [
    Fp.fromUint32(input.chainId >>> 0),
    Fp.fromUint32(LIGHTER_TX_TYPE.CANCEL_ORDER),
    fpFromInt64(input.nonce),
    fpFromInt64(input.expiredAt),
    fpFromInt64(input.accountIndex),
    fpFromUint32(input.apiKeyIndex),
    fpFromUint32(input.marketIndex),
    fpFromInt64(input.orderIndex),
  ];
  return hashToQuinticExtension(elements);
}

interface CancelAllHashInput {
  chainId: number;
  accountIndex: bigint;
  apiKeyIndex: number;
  nonce: bigint;
  expiredAt: bigint;
  timeInForce: number;
  time: bigint;
}

function hashCancelAll(input: CancelAllHashInput): Fp5 {
  const elements = [
    Fp.fromUint32(input.chainId >>> 0),
    Fp.fromUint32(LIGHTER_TX_TYPE.CANCEL_ALL_ORDERS),
    fpFromInt64(input.nonce),
    fpFromInt64(input.expiredAt),
    fpFromInt64(input.accountIndex),
    fpFromUint32(input.apiKeyIndex),
    fpFromUint32(input.timeInForce),
    fpFromInt64(input.time),
  ];
  return hashToQuinticExtension(elements);
}
