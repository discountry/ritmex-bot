import { pedersen } from "@starkware-industries/starkware-crypto-utils";
import { ec as starkEc, sign as starkSign } from "@starkware-industries/starkware-crypto-utils";

const FIELD_PRIME = BigInt("0x080000000000011000000000000000000000000000000000000000000000001");
const LIMIT_ORDER_WITH_FEE_TYPE = 3n;

export interface EdgeXL2OrderSignInput {
  isBuy: boolean;
  amountSynthetic: bigint;
  amountCollateral: bigint;
  amountFee: bigint;
  syntheticAssetId: string;
  collateralAssetId: string;
  feeAssetId: string;
  positionId: bigint;
  nonce: number;
  expirationHours: number;
  privateKey: string;
}

export interface EdgeXL2SignatureResult {
  signature: string;
  r: string;
  s: string;
}

export function signLimitOrder(input: EdgeXL2OrderSignInput): EdgeXL2SignatureResult {
  const messageHash = calcLimitOrderHash({
    syntheticAssetId: input.syntheticAssetId,
    collateralAssetId: input.collateralAssetId,
    feeAssetId: input.feeAssetId,
    isBuy: input.isBuy,
    amountSynthetic: input.amountSynthetic,
    amountCollateral: input.amountCollateral,
    amountFee: input.amountFee,
    nonce: BigInt(input.nonce),
    positionId: input.positionId,
    expirationHours: BigInt(input.expirationHours),
  });

  const keyPair = starkEc.keyFromPrivate(stripHexPrefix(input.privateKey), "hex");
  const signature = starkSign(keyPair, messageHash, { canonical: true });
  const r = signature.r.toString(16).padStart(64, "0");
  const s = signature.s.toString(16).padStart(64, "0");
  return {
    signature: `${r}${s}`,
    r,
    s,
  };
}

interface LimitOrderHashParams {
  syntheticAssetId: string;
  collateralAssetId: string;
  feeAssetId: string;
  isBuy: boolean;
  amountSynthetic: bigint;
  amountCollateral: bigint;
  amountFee: bigint;
  nonce: bigint;
  positionId: bigint;
  expirationHours: bigint;
}

function calcLimitOrderHash(params: LimitOrderHashParams): string {
  const syntheticAsset = hexToField(params.syntheticAssetId);
  const collateralAsset = hexToField(params.collateralAssetId);
  const feeAsset = hexToField(params.feeAssetId);

  const amountSynthetic = toField(params.amountSynthetic);
  const amountCollateral = toField(params.amountCollateral);
  const amountFee = toField(params.amountFee);
  const nonce = toField(params.nonce);
  const positionId = toField(params.positionId);
  const expiration = toField(params.expirationHours);

  const assetSell = params.isBuy ? collateralAsset : syntheticAsset;
  const assetBuy = params.isBuy ? syntheticAsset : collateralAsset;

  const amountSell = params.isBuy ? amountCollateral : amountSynthetic;
  const amountBuy = params.isBuy ? amountSynthetic : amountCollateral;

  let msg = pedersenPair(assetSell, assetBuy);
  msg = pedersenPair(msg, feeAsset);

  let packed0 = amountSell;
  packed0 = shiftLeft(packed0, 64n) + amountBuy;
  packed0 = shiftLeft(packed0, 64n) + amountFee;
  packed0 = shiftLeft(packed0, 32n) + nonce;
  packed0 = toField(packed0);

  msg = pedersenPair(msg, packed0);

  let packed1 = LIMIT_ORDER_WITH_FEE_TYPE;
  packed1 = shiftLeft(packed1, 64n) + positionId;
  packed1 = shiftLeft(packed1, 64n) + positionId;
  packed1 = shiftLeft(packed1, 64n) + positionId;
  packed1 = shiftLeft(packed1, 32n) + expiration;
  packed1 = shiftLeft(packed1, 17n);
  packed1 = toField(packed1);

  const final = pedersenPair(msg, packed1);
  return final.toString(16);
}

function pedersenPair(a: bigint, b: bigint): bigint {
  const result = pedersen([toHex(a), toHex(b)]);
  return BigInt(`0x${result}`);
}

function toField(value: bigint): bigint {
  let normalized = value % FIELD_PRIME;
  if (normalized < 0n) normalized += FIELD_PRIME;
  return normalized;
}

function hexToField(value: string): bigint {
  const stripped = stripHexPrefix(value);
  return toField(BigInt(`0x${stripped || "0"}`));
}

function toHex(value: bigint): string {
  return toField(value).toString(16);
}

function stripHexPrefix(value: string): string {
  if (!value) return "";
  return value.startsWith("0x") || value.startsWith("0X") ? value.slice(2) : value;
}

function shiftLeft(value: bigint, bits: bigint): bigint {
  return toField(value << bits);
}
