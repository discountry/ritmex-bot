import type { CreateOrderParams, OrderType } from "../types";
import { Decimal, roundToStep, toDecimal, toLong } from "./math";
import { calcStarknetExpiration, generateNonce, getStarkPublicKey, getStarknetOrderMsgHash, signMessageHash, toHexString } from "./signing";
import type { ExtendedFees, ExtendedMarket, ExtendedStarknetDomain } from "./types";

export interface ExtendedOrderContext {
  market: ExtendedMarket;
  fees: ExtendedFees;
  domain: ExtendedStarknetDomain;
  vaultId: string;
  starkPrivateKey: string;
  builderId?: string;
  builderFeeRate?: string;
}

export interface BuiltOrderPayload {
  payload: Record<string, unknown>;
  orderId: string;
  params: CreateOrderParams;
}

function resolveTimeInForce(input?: CreateOrderParams["timeInForce"]): "GTT" | "IOC" {
  if (!input) return "GTT";
  const normalized = input.toString().toUpperCase();
  if (normalized === "IOC" || normalized === "FOK") return "IOC";
  return "GTT";
}

function resolveTotalFeeRate(ctx: ExtendedOrderContext, postOnly?: boolean): Decimal {
  const maker = toDecimal(ctx.fees.makerFeeRate);
  const taker = toDecimal(ctx.fees.takerFeeRate);
  const builderRate = ctx.builderFeeRate ? toDecimal(ctx.builderFeeRate) : null;
  const base = postOnly ? maker : Decimal.max(maker, taker);
  return builderRate ? base.plus(builderRate) : base;
}

function resolveOrderType(input: OrderType, stopPrice?: number | undefined): { type: "LIMIT" | "MARKET" | "CONDITIONAL"; triggerPrice?: Decimal } {
  if (input === "MARKET") {
    return { type: "MARKET" };
  }
  if (input === "STOP" || input === "STOP_MARKET" || input === "TAKE_PROFIT" || input === "TAKE_PROFIT_MARKET") {
    const triggerPrice = stopPrice !== undefined ? toDecimal(stopPrice) : undefined;
    return { type: "CONDITIONAL", triggerPrice };
  }
  return { type: "LIMIT" };
}

export class ExtendedOrderBuilder {
  private readonly ctx: ExtendedOrderContext;

  constructor(context: ExtendedOrderContext) {
    this.ctx = context;
  }

  build(params: CreateOrderParams & { marketPrice?: number; now?: number }): BuiltOrderPayload {
    const market = this.ctx.market;
    const l2 = market.l2Config;
    const trading = market.tradingConfig;
    const isPostOnly = params.timeInForce === "GTX";
    const timeInForce = resolveTimeInForce(isPostOnly ? "GTT" : params.timeInForce);
    const now = params.now ?? Date.now();
    const expiryEpochMillis = now + 60 * 60 * 1000;
    const nonce = toLong(generateNonce());

    const minPriceChange = toDecimal(trading.minPriceChange);
    const minQtyChange = toDecimal(trading.minOrderSizeChange);
    const qty = roundToStep(toDecimal(params.quantity ?? 0), minQtyChange, Decimal.ROUND_DOWN);

    const orderType = resolveOrderType(params.type, params.stopPrice);
    const basePrice = this.resolvePrice(params, orderType, params.marketPrice, minPriceChange);
    const price = roundToStep(basePrice, minPriceChange, params.side === "BUY" ? Decimal.ROUND_UP : Decimal.ROUND_DOWN);

    const totalFeeRate = resolveTotalFeeRate(this.ctx, isPostOnly);

    const collateralAmount = qty.times(price);
    const fee = totalFeeRate.times(collateralAmount);

    const roundingMode = params.side === "BUY" ? Decimal.ROUND_UP : Decimal.ROUND_DOWN;
    const collateralAmountStark = collateralAmount.times(l2.collateralResolution).integerValue(roundingMode);
    const feeStark = fee.times(l2.collateralResolution).integerValue(Decimal.ROUND_UP);
    const syntheticAmountStark = qty.times(l2.syntheticResolution).integerValue(roundingMode);

    const expiration = calcStarknetExpiration(expiryEpochMillis).toString(10);
    const starkPublicKey = toHexString(getStarkPublicKey(this.ctx.starkPrivateKey as any));
    const starknetOrderHash = getStarknetOrderMsgHash({
      positionId: toLong(this.ctx.vaultId).toString(10),
      baseAssetIdHex: toHexString(l2.syntheticId),
      baseAmount: syntheticAmountStark.toString(10),
      quoteAssetIdHex: toHexString(l2.collateralId),
      quoteAmount: collateralAmountStark.toString(10),
      feeAssetIdHex: toHexString(l2.collateralId),
      feeAmount: feeStark.toString(10),
      expiration,
      salt: nonce.toString(10),
      starkPublicKey,
      domain: this.ctx.domain,
    });

    const signature = signMessageHash(starknetOrderHash, this.ctx.starkPrivateKey as any);
    const reduceOnly = params.reduceOnly === "true" || params.reduceOnly === true;
    const payload: Record<string, unknown> = {
      id: starknetOrderHash,
      market: market.name,
      type: orderType.type,
      side: params.side,
      qty: qty.toString(10),
      price: price.toString(10),
      timeInForce,
      expiryEpochMillis,
      fee: totalFeeRate.toString(10),
      nonce: nonce.toString(10),
      reduceOnly,
      postOnly: isPostOnly,
      settlement: {
        signature: {
          r: toHexString(signature.signature.r),
          s: toHexString(signature.signature.s),
        },
        starkKey: toHexString(signature.starkKey),
        collateralPosition: toLong(this.ctx.vaultId).toString(10),
      },
    };

    if (orderType.type === "CONDITIONAL" && orderType.triggerPrice) {
      const direction = params.side === "BUY" ? "UP" : "DOWN";
      payload.trigger = {
        triggerPrice: orderType.triggerPrice.toString(10),
        triggerPriceType: params.triggerType ?? "LAST",
        direction,
        triggerPriceDirection: direction,
        executionPriceType: params.type === "STOP_MARKET" || params.type === "TAKE_PROFIT_MARKET" ? "MARKET" : "LIMIT",
      };
    }

    return {
      payload,
      orderId: starknetOrderHash,
      params,
    };
  }

  private resolvePrice(
    params: CreateOrderParams,
    orderType: { type: "LIMIT" | "MARKET" | "CONDITIONAL"; triggerPrice?: Decimal },
    marketPrice: number | undefined,
    minPriceChange: Decimal
  ): Decimal {
    if (params.price !== undefined && params.price !== null) {
      return toDecimal(params.price);
    }

    const fallbackPrice = Number.isFinite(marketPrice) ? marketPrice ?? NaN : NaN;
    if (orderType.type === "MARKET") {
      const basis = Number.isFinite(fallbackPrice) ? fallbackPrice! : minPriceChange.toNumber() || 1;
      const factor = params.side === "BUY" ? 1.0075 : 0.9925;
      return roundToStep(toDecimal(basis * factor), minPriceChange, params.side === "BUY" ? Decimal.ROUND_UP : Decimal.ROUND_DOWN);
    }

    if (orderType.type === "CONDITIONAL" && orderType.triggerPrice) {
      return orderType.triggerPrice;
    }

    const base = Number.isFinite(fallbackPrice) ? fallbackPrice! : minPriceChange.toNumber() || 1;
    return toDecimal(base);
  }
}
