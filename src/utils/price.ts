import type { AsterDepth, AsterTicker } from "../exchanges/types";

export function getTopPrices(depth?: AsterDepth | null): { topBid: number | null; topAsk: number | null } {
  const bid = Number(depth?.bids?.[0]?.[0]);
  const ask = Number(depth?.asks?.[0]?.[0]);
  return {
    topBid: Number.isFinite(bid) ? bid : null,
    topAsk: Number.isFinite(ask) ? ask : null,
  };
}

/**
 * Get orderbook prices at a target depth level.
 * @param depth orderbook depth snapshot
 * @param level depth level (1=best bid/ask, 2=second level, etc.)
 * @returns bid/ask at target level, or nearest valid level fallback
 */
export function getPricesAtLevel(
  depth?: AsterDepth | null,
  level: number = 1
): { bidAtLevel: number | null; askAtLevel: number | null } {
  const index = Math.max(0, level - 1);

  // Try target level first; fallback to nearest valid level if missing.
  const bids = depth?.bids ?? [];
  const asks = depth?.asks ?? [];

  let bidAtLevel: number | null = null;
  let askAtLevel: number | null = null;

  // Scan backward from target level for first valid bid.
  for (let i = Math.min(index, bids.length - 1); i >= 0; i--) {
    const bid = Number(bids[i]?.[0]);
    if (Number.isFinite(bid)) {
      bidAtLevel = bid;
      break;
    }
  }

  // Scan backward from target level for first valid ask.
  for (let i = Math.min(index, asks.length - 1); i >= 0; i--) {
    const ask = Number(asks[i]?.[0]);
    if (Number.isFinite(ask)) {
      askAtLevel = ask;
      break;
    }
  }

  return { bidAtLevel, askAtLevel };
}

export function getMidOrLast(depth?: AsterDepth | null, ticker?: AsterTicker | null): number | null {
  const { topBid, topAsk } = getTopPrices(depth);
  if (topBid != null && topAsk != null) return (topBid + topAsk) / 2;
  const last = Number(ticker?.lastPrice);
  return Number.isFinite(last) ? last : null;
}

/**
 * Calculate total visible depth between top of book and target price.
 * @param depth orderbook depth snapshot
 * @param side order side: BUY checks bids, SELL checks asks
 * @param targetPrice target order price
 * @returns total size between level 1 and target price (excluding target)
 */
export function getDepthBetweenPrices(
  depth: AsterDepth | null | undefined,
  side: "BUY" | "SELL",
  targetPrice: number
): number {
  if (!depth) return 0;
  if (!Number.isFinite(targetPrice) || targetPrice <= 0) return 0;

  let total = 0;

  if (side === "BUY") {
    // BUY orders rest on bid side; sum bids from bid1 down to target.
    // Bids are sorted high -> low, targetPrice < bid1.
    const bids = depth.bids ?? [];
    for (const level of bids) {
      const price = Number(level[0]);
      const qty = Number(level[1]);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) continue;
      // Only include levels with price > targetPrice.
      if (price > targetPrice) {
        total += qty;
      } else {
        // Since bids are high -> low, we can stop once price <= targetPrice.
        break;
      }
    }
  } else {
    // SELL orders rest on ask side; sum asks from ask1 up to target.
    // Asks are sorted low -> high, targetPrice > ask1.
    const asks = depth.asks ?? [];
    for (const level of asks) {
      const price = Number(level[0]);
      const qty = Number(level[1]);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) continue;
      // Only include levels with price < targetPrice.
      if (price < targetPrice) {
        total += qty;
      } else {
        // Since asks are low -> high, we can stop once price >= targetPrice.
        break;
      }
    }
  }

  return total;
}


