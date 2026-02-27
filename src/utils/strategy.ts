import type { AsterAccountAsset, AsterAccountSnapshot, AsterKline } from "../exchanges/types";

export interface PositionSnapshot {
  positionAmt: number;
  entryPrice: number;
  unrealizedProfit: number;
  markPrice: number | null;
}

export function getPosition(snapshot: AsterAccountSnapshot | null, symbol: string): PositionSnapshot {
  if (!snapshot) {
    return { positionAmt: 0, entryPrice: 0, unrealizedProfit: 0, markPrice: null };
  }
  // For spot, derive position strictly from asset balances to avoid WS-cleared positions.
  if (snapshot.marketType === "spot") {
    const baseSymbol =
      normalizeBaseSymbol(snapshot.baseAsset) ?? parseSymbolParts(symbol).base ?? normalizeBaseSymbol(symbol);
    if (baseSymbol) {
      const asset = selectAsset(snapshot.assets ?? [], baseSymbol, snapshot.baseAssetId);
      const amt = Number(asset?.walletBalance ?? 0);
      const available = Number(asset?.availableBalance ?? asset?.walletBalance ?? 0);
      const size = Number.isFinite(amt) && amt > 0 ? amt : Number.isFinite(available) ? Math.max(0, available) : 0;
      if (size > 0) {
        return { positionAmt: size, entryPrice: 0, unrealizedProfit: 0, markPrice: null };
      }
    }
    return { positionAmt: 0, entryPrice: 0, unrealizedProfit: 0, markPrice: null };
  }

  const positions = snapshot.positions?.filter((p) => p.symbol === symbol) ?? [];
  if (positions.length === 0) {
    return { positionAmt: 0, entryPrice: 0, unrealizedProfit: 0, markPrice: null };
  }
  const NON_ZERO_EPS = 1e-8;
  const withExposure = positions.filter((p) => Math.abs(Number(p.positionAmt)) > NON_ZERO_EPS);
  const selected =
    withExposure.find((p) => p.positionSide === "BOTH") ??
    withExposure.sort((a, b) => Math.abs(Number(b.positionAmt)) - Math.abs(Number(a.positionAmt)))[0] ??
    positions[0];
  const rawMark = Number(selected?.markPrice);
  const markPrice = Number.isFinite(rawMark) && rawMark > 0 ? rawMark : null;
  return {
    positionAmt: Number(selected?.positionAmt) || 0,
    entryPrice: Number(selected?.entryPrice) || 0,
    unrealizedProfit: Number(selected?.unrealizedProfit) || 0,
    markPrice,
  };
}

export function validateAccountSnapshotForSymbol(
  snapshot: AsterAccountSnapshot | null,
  symbol: string
): { ok: true } | { ok: false; issues: string[] } {
  if (!snapshot) return { ok: true };
  const positions = snapshot.positions?.filter((p) => p.symbol === symbol) ?? [];
  if (positions.length === 0) return { ok: true };

  const NON_ZERO_EPS = 1e-8;
  const issues: string[] = [];

  for (const position of positions) {
    const amt = Number(position.positionAmt);
    if (!Number.isFinite(amt)) {
      issues.push("invalid_positionAmt");
      continue;
    }
    if (Math.abs(amt) <= NON_ZERO_EPS) {
      continue;
    }

    const entryPrice = Number(position.entryPrice);
    if (!Number.isFinite(entryPrice) || entryPrice <= 0) {
      issues.push("invalid_entryPrice");
    }

    const unrealizedProfit = Number(position.unrealizedProfit);
    if (!Number.isFinite(unrealizedProfit)) {
      issues.push("invalid_unrealizedProfit");
    }

    const rawMark = Number(position.markPrice);
    if (position.markPrice != null && position.markPrice !== "" && (!Number.isFinite(rawMark) || rawMark <= 0)) {
      issues.push("invalid_markPrice");
    }
  }

  if (issues.length === 0) return { ok: true };
  return { ok: false, issues: Array.from(new Set(issues)) };
}

export function getSMA(values: AsterKline[], length: number): number | null {
  if (!Array.isArray(values) || values.length < length) return null;
  const window = values.slice(-length);
  const closes = window.map((kline) => Number(kline.close));
  if (closes.some((price) => !Number.isFinite(price))) {
    return null;
  }
  const sum = closes.reduce((acc, current) => acc + current, 0);
  if (!Number.isFinite(sum)) {
    return null;
  }
  const average = sum / closes.length;
  return Number.isFinite(average) ? average : null;
}

export function calcStopLossPrice(entryPrice: number, qty: number, side: "long" | "short", loss: number): number {
  if (side === "long") {
    return entryPrice - loss / qty;
  }
  return entryPrice + loss / Math.abs(qty);
}

export function calcTrailingActivationPrice(entryPrice: number, qty: number, side: "long" | "short", profit: number): number {
  if (side === "long") {
    return entryPrice + profit / qty;
  }
  return entryPrice - profit / Math.abs(qty);
}

export function computeBollingerBandwidth(
  values: AsterKline[],
  length: number,
  stdMultiplier: number
): number | null {
  const period = Number.isInteger(length) ? Number(length) : 0;
  const multiplier = Number.isFinite(stdMultiplier) ? stdMultiplier : 0;
  if (!Array.isArray(values) || period <= 0 || values.length < period || multiplier <= 0) {
    return null;
  }
  const window = values.slice(-period);
  const closes = window.map((kline) => Number(kline.close));
  if (closes.some((close) => !Number.isFinite(close))) {
    return null;
  }
  const mean = closes.reduce((sum, price) => sum + price, 0) / period;
  if (!Number.isFinite(mean) || mean <= 0) {
    return null;
  }
  const variance = closes.reduce((sum, price) => {
    const diff = price - mean;
    return sum + diff * diff;
  }, 0) / period;
  const std = Math.sqrt(Math.max(variance, 0));
  const width = std * multiplier * 2;
  if (!Number.isFinite(width)) {
    return null;
  }
  return width / mean;
}

/**
 * Return true if the intended order price is within the allowed deviation from mark price.
 * - For BUY: orderPrice must be <= markPrice * (1 + maxPct)
 * - For SELL: orderPrice must be >= markPrice * (1 - maxPct)
 * If markPrice is null/invalid, the check passes (no protection possible).
 */
export function isOrderPriceAllowedByMark(params: {
  side: "BUY" | "SELL";
  orderPrice: number | null | undefined;
  markPrice: number | null | undefined;
  maxPct: number;
}): boolean {
  const { side, orderPrice, markPrice, maxPct } = params;
  const price = Number(orderPrice);
  const mark = Number(markPrice);
  if (!Number.isFinite(price) || !Number.isFinite(mark) || mark <= 0) return true;
  if (side === "BUY") {
    return price <= mark * (1 + Math.max(0, maxPct));
  }
  return price >= mark * (1 - Math.max(0, maxPct));
}

export function parseSymbolParts(symbol: string | undefined): { base?: string; quote?: string } {
  const normalized = (symbol ?? "").toUpperCase();
  if (!normalized) return {};
  const delimiters = ["/", "-", ":"];
  for (const delimiter of delimiters) {
    if (normalized.includes(delimiter)) {
      const [base, quote] = normalized.split(delimiter);
      return { base: base || undefined, quote: quote || undefined };
    }
  }
  if (normalized.length >= 6) {
    return { base: normalized.slice(0, 3), quote: normalized.slice(3) };
  }
  return { base: normalized };
}

function normalizeBaseSymbol(symbol: string | undefined): string | undefined {
  return parseSymbolParts(symbol).base;
}

function selectAsset(assets: AsterAccountAsset[], baseSymbol: string, baseAssetId?: number): AsterAccountAsset | undefined {
  const normalized = baseSymbol.toUpperCase();
  const targetId = Number(baseAssetId);
  return assets.find((asset) => {
    const matchesId = Number.isFinite(targetId) && Number(asset.assetId) === targetId;
    const matchesSymbol = normalizeBaseSymbol(asset.asset) === normalized;
    return matchesId || matchesSymbol;
  });
}
