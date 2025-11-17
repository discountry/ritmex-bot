import { readFileSync } from "fs";
import { createRequire } from "module";
import path from "path";
import wasmInit, {
  get_order_msg as wasmGetOrderMsgHash,
  sign_message as wasmSignMessage,
} from "@x10xchange/stark-crypto-wrapper-wasm";
import { ec as starkEc, hash as starkHash, selector as starkSelector, shortString as starkShortString } from "starknet";
import type { ExtendedStarknetDomain } from "./types";

export type HexString = `0x${string}`;

export function isHexString(value: string | undefined | null): value is HexString {
  return typeof value === "string" && value.startsWith("0x");
}

export function toHexString(value: string): HexString {
  return (value.startsWith("0x") ? value : `0x${value}`) as HexString;
}

export function fromHexString(value: HexString): string {
  return value.slice(2);
}

export async function tryInitExtendedWasm(): Promise<void> {
  try {
    const require = createRequire(import.meta.url);
    const wasmDir = path.dirname(require.resolve("@x10xchange/stark-crypto-wrapper-wasm"));
    const wasmBuffer = readFileSync(path.join(wasmDir, "stark_crypto_wrapper_wasm_bg.wasm"));
    await wasmInit({ module_or_path: wasmBuffer });
  } catch (error) {
    // Revert to JS implementation if wasm init fails; do not throw to keep bot running.
    if (process.env.EXTENDED_DEBUG === "1" || process.env.EXTENDED_DEBUG === "true") {
      console.warn("[ExtendedSigning] WASM init failed, falling back to JS:", error);
    }
  }
}

const STARKNET_SETTLEMENT_BUFFER_SECONDS = 14 * 24 * 60 * 60;
const MILLIS_IN_SECOND = 1000;

export function calcStarknetExpiration(expiryEpochMillis: number): number {
  return Math.ceil(expiryEpochMillis / MILLIS_IN_SECOND) + STARKNET_SETTLEMENT_BUFFER_SECONDS;
}

export function getStarkPublicKey(privateKey: HexString): string {
  return fromHexString(starkEc.starkCurve.getStarkKey(privateKey) as HexString);
}

export function signMessageHash(messageHash: string, starkPrivateKey: HexString): { signature: { r: string; s: string }; starkKey: string } {
  const starkPublicKey = getStarkPublicKey(starkPrivateKey);
  try {
    const signature = wasmSignMessage(starkPrivateKey, messageHash);
    const result = {
      signature: {
        r: fromHexString(signature.r as HexString),
        s: fromHexString(signature.s as HexString),
      },
      starkKey: starkPublicKey,
    };
    if (typeof signature.free === "function") {
      signature.free();
    }
    return result;
  } catch {
    const signature = starkEc.starkCurve.sign(messageHash, starkPrivateKey);
    return {
      signature: {
        r: signature.r.toString(16),
        s: signature.s.toString(16),
      },
      starkKey: starkPublicKey,
    };
  }
}

function jsGetObjMsgHash(domainHash: string, publicKey: string, objHash: string): string {
  const messageFelt = starkShortString.encodeShortString("StarkNet Message");
  return starkHash.computePoseidonHashOnElements([messageFelt, domainHash, publicKey, objHash]);
}

function jsGetStarknetDomainObjHash(domain: ExtendedStarknetDomain): string {
  const selector = starkSelector.getSelector(
    '"StarknetDomain"("name":"shortstring","version":"shortstring","chainId":"shortstring","revision":"shortstring")'
  );
  return starkHash.computePoseidonHashOnElements([
    selector,
    starkShortString.encodeShortString(domain.name),
    starkShortString.encodeShortString(domain.version),
    starkShortString.encodeShortString(domain.chainId),
    domain.revision,
  ]);
}

function jsGetOrderMsgHash(
  positionId: string,
  baseAssetIdHex: string,
  baseAmount: string,
  quoteAssetIdHex: string,
  quoteAmount: string,
  feeAssetIdHex: string,
  feeAmount: string,
  expiration: string,
  salt: string,
  userPublicKeyHex: string,
  domainName: string,
  domainVersion: string,
  domainChainId: string,
  domainRevision: string
): string {
  const domainHash = jsGetStarknetDomainObjHash({
    name: domainName,
    version: domainVersion,
    chainId: domainChainId,
    revision: parseInt(domainRevision, 10),
  });

  const orderSelector = starkSelector.getSelector(
    '"Order"("position_id":"felt","base_asset_id":"AssetId","base_amount":"i64","quote_asset_id":"AssetId","quote_amount":"i64","fee_asset_id":"AssetId","fee_amount":"u64","expiration":"Timestamp","salt":"felt")"PositionId"("value":"u32")"AssetId"("value":"felt")"Timestamp"("seconds":"u64")'
  );
  const orderHash = starkHash.computePoseidonHashOnElements([
    orderSelector,
    positionId,
    baseAssetIdHex,
    baseAmount,
    quoteAssetIdHex,
    quoteAmount,
    feeAssetIdHex,
    feeAmount,
    expiration,
    salt,
  ]);

  return jsGetObjMsgHash(domainHash, userPublicKeyHex, orderHash);
}

export function getStarknetOrderMsgHash(args: {
  positionId: string;
  baseAssetIdHex: string;
  baseAmount: string;
  quoteAssetIdHex: string;
  quoteAmount: string;
  feeAssetIdHex: string;
  feeAmount: string;
  expiration: string;
  salt: string;
  starkPublicKey: string;
  domain: ExtendedStarknetDomain;
}): string {
  const {
    positionId,
    baseAssetIdHex,
    baseAmount,
    quoteAssetIdHex,
    quoteAmount,
    feeAssetIdHex,
    feeAmount,
    expiration,
    salt,
    starkPublicKey,
    domain,
  } = args;
  try {
    const wasmHash = wasmGetOrderMsgHash(
      positionId,
      baseAssetIdHex,
      baseAmount,
      quoteAssetIdHex,
      quoteAmount,
      feeAssetIdHex,
      feeAmount,
      expiration,
      salt,
      starkPublicKey,
      domain.name,
      domain.version,
      domain.chainId,
      domain.revision.toString()
    );
    return fromHexString(wasmHash as HexString);
  } catch (error) {
    if (process.env.EXTENDED_DEBUG === "1" || process.env.EXTENDED_DEBUG === "true") {
      console.warn("[ExtendedSigning] wasm order hash failed, using JS", error);
    }
    return jsGetOrderMsgHash(
      positionId,
      baseAssetIdHex,
      baseAmount,
      quoteAssetIdHex,
      quoteAmount,
      feeAssetIdHex,
      feeAmount,
      expiration,
      salt,
      starkPublicKey,
      domain.name,
      domain.version,
      domain.chainId,
      domain.revision.toString()
    );
  }
}

export function generateNonce(): number {
  return Math.floor(Math.random() * (2 ** 31 - 1));
}
