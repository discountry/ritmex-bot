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
 * 获取指定档位的盘口价格
 * @param depth 深度数据
 * @param level 档位（1=买1/卖1，2=买2/卖2，以此类推）
 * @returns 指定档位的买卖价格，如果该档位不存在则回退到最近的有效档位
 */
export function getPricesAtLevel(
  depth?: AsterDepth | null,
  level: number = 1
): { bidAtLevel: number | null; askAtLevel: number | null } {
  const index = Math.max(0, level - 1);

  // 尝试获取指定档位，如果不存在则回退到最近的有效档位
  const bids = depth?.bids ?? [];
  const asks = depth?.asks ?? [];

  let bidAtLevel: number | null = null;
  let askAtLevel: number | null = null;

  // 从指定档位向前查找第一个有效的买价
  for (let i = Math.min(index, bids.length - 1); i >= 0; i--) {
    const bid = Number(bids[i]?.[0]);
    if (Number.isFinite(bid)) {
      bidAtLevel = bid;
      break;
    }
  }

  // 从指定档位向前查找第一个有效的卖价
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
 * 计算从盘口一档到目标价格之间的挂单总量
 * @param depth 深度数据
 * @param side 挂单方向: BUY 检查 bids, SELL 检查 asks
 * @param targetPrice 目标挂单价格
 * @returns 从一档到目标价格之间的挂单总量 (不包含目标价格本身)
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
    // BUY 订单挂在 bid 侧，检查从 bid1 到目标价格之间的所有 bids
    // bids 按价格从高到低排序，目标价格 < bid1
    const bids = depth.bids ?? [];
    for (const level of bids) {
      const price = Number(level[0]);
      const qty = Number(level[1]);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) continue;
      // 只计算价格 > 目标价格的档位 (目标价格以上的挂单)
      if (price > targetPrice) {
        total += qty;
      } else {
        // bids 是从高到低排序，一旦 price <= targetPrice 就停止
        break;
      }
    }
  } else {
    // SELL 订单挂在 ask 侧，检查从 ask1 到目标价格之间的所有 asks
    // asks 按价格从低到高排序，目标价格 > ask1
    const asks = depth.asks ?? [];
    for (const level of asks) {
      const price = Number(level[0]);
      const qty = Number(level[1]);
      if (!Number.isFinite(price) || !Number.isFinite(qty)) continue;
      // 只计算价格 < 目标价格的档位 (目标价格以下的挂单)
      if (price < targetPrice) {
        total += qty;
      } else {
        // asks 是从低到高排序，一旦 price >= targetPrice 就停止
        break;
      }
    }
  }

  return total;
}


