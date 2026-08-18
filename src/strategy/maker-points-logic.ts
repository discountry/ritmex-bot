export type MakerPointsBand = "0-10" | "10-30" | "30-100";

/**
 * StandX 的 Maker Points 在距 mark price 100 bps 处倍率归零。
 * 越过这条线的挂单不产生任何积分，只消耗保证金和下单配额。
 */
export const MAKER_POINTS_ZERO_BPS = 100;

/** 布尔开关全开时各档位的默认目标距离（bps）。 */
export const DEFAULT_BAND_BPS: Record<MakerPointsBand, number> = {
  "0-10": 9,
  "10-30": 29,
  // 活动改为线性梯度后贴边（99 bps）倍率仅 0.18%，40 bps 仍有 10.7%
  "30-100": 40,
};

export interface MakerPointsBandConfig {
  band0To10: boolean;
  band10To30: boolean;
  band30To100: boolean;
  /** 各档位目标距离（bps）；省略时回落到 DEFAULT_BAND_BPS。 */
  band0To10Bps?: number;
  band10To30Bps?: number;
  band30To100Bps?: number;
}

export interface BandTarget {
  band: MakerPointsBand;
  bps: number;
}

const BAND_ORDER: MakerPointsBand[] = ["0-10", "10-30", "30-100"];

function resolveBandBps(band: MakerPointsBand, configured: number | undefined): number {
  if (Number.isFinite(configured) && (configured as number) > 0) {
    return Math.min(configured as number, MAKER_POINTS_ZERO_BPS);
  }
  return DEFAULT_BAND_BPS[band];
}

/**
 * 展开启用的档位及其目标距离，按距离升序返回。
 * 布尔开关继续决定档位是否启用，bps 数值可单独覆盖默认值。
 */
export function buildBandTargets(config: MakerPointsBandConfig): BandTarget[] {
  const enabled: Record<MakerPointsBand, boolean> = {
    "0-10": config.band0To10,
    "10-30": config.band10To30,
    "30-100": config.band30To100,
  };
  const configured: Record<MakerPointsBand, number | undefined> = {
    "0-10": config.band0To10Bps,
    "10-30": config.band10To30Bps,
    "30-100": config.band30To100Bps,
  };
  return BAND_ORDER.filter((band) => enabled[band])
    .map((band) => ({ band, bps: resolveBandBps(band, configured[band]) }))
    .sort((a, b) => a.bps - b.bps);
}

export function buildBpsTargets(config: MakerPointsBandConfig): number[] {
  return buildBandTargets(config).map((target) => target.bps);
}

/**
 * Maker Points 的线性梯度倍率，三段折线：
 *   0–10 bps:  100%  → 40%
 *   10–30 bps: 40%   → 12.5%
 *   30–100 bps: 12.5% → 0%
 * 系数由活动公布的样例点（2/5/10/20/50 bps）反解得到。
 */
export function makerPointsMultiplier(distanceBps: number): number {
  if (!Number.isFinite(distanceBps) || distanceBps < 0) return 0;
  if (distanceBps >= MAKER_POINTS_ZERO_BPS) return 0;
  if (distanceBps <= 10) return 1 - 0.06 * distanceBps;
  if (distanceBps <= 30) return 0.4 - 0.01375 * (distanceBps - 10);
  return (0.125 * (MAKER_POINTS_ZERO_BPS - distanceBps)) / 70;
}

/**
 * 挂单价相对参考价的带符号距离（bps）。
 * 正数表示朝“更不容易成交”的方向偏离：BUY 在参考价下方，SELL 在参考价上方。
 * 负数说明挂单已经穿过参考价，随时可能被吃。
 */
export function signedDistanceBps(side: "BUY" | "SELL", price: number, anchor: number): number {
  if (!Number.isFinite(price) || !Number.isFinite(anchor) || anchor <= 0) return Number.NaN;
  const raw = side === "BUY" ? anchor - price : price - anchor;
  return (raw / anchor) * 10000;
}

export interface SafeQuoteInput {
  side: "BUY" | "SELL";
  /** 目标距离（bps）。 */
  targetBps: number;
  /** 交易所 mark price；不可用时传 null。 */
  markPrice: number | null;
  /** 盘口一档：BUY 用 bid1，SELL 用 ask1。 */
  bookPrice: number;
  /** 距 mark 的最大允许距离（bps），超出即失去积分资格。 */
  maxDistanceBps: number;
}

/**
 * 同时以 mark price 和盘口一档为基准算价，取对“不成交”更安全的一侧：
 * BUY 取更低价、SELL 取更高价。
 *
 * 随后按 maxDistanceBps 夹回 —— 否则在 mark 远离盘口时，为了安全选出的价格
 * 可能被推过 100 bps 悬崖，挂单虽然更安全却一分不得。
 */
export function resolveSafeQuotePrice(input: SafeQuoteInput): number | null {
  const { side, targetBps, markPrice, bookPrice, maxDistanceBps } = input;
  if (!Number.isFinite(bookPrice) || bookPrice <= 0) return null;
  if (!Number.isFinite(targetBps) || targetBps < 0) return null;

  const mark = Number.isFinite(markPrice ?? Number.NaN) && (markPrice ?? 0) > 0 ? (markPrice as number) : null;
  const factor = side === "BUY" ? 1 - targetBps / 10000 : 1 + targetBps / 10000;
  const fromBook = bookPrice * factor;
  const candidate =
    mark == null
      ? fromBook
      : side === "BUY"
        ? Math.min(fromBook, mark * factor)
        : Math.max(fromBook, mark * factor);

  // 悬崖以 mark 为准；拿不到 mark 时只能用盘口近似
  const anchor = mark ?? bookPrice;
  const cap = Math.max(0, Math.min(maxDistanceBps, MAKER_POINTS_ZERO_BPS));
  const limit = side === "BUY" ? anchor * (1 - cap / 10000) : anchor * (1 + cap / 10000);
  const clamped = side === "BUY" ? Math.max(candidate, limit) : Math.min(candidate, limit);

  return Number.isFinite(clamped) && clamped > 0 ? clamped : null;
}

/**
 * 该档位允许的距离漂移（bps）。远档天然容忍更大的漂移，因为同样的盘口移动
 * 对远档的倍率影响小得多，没必要跟着近档一起撤挂。
 */
export function bandRepriceToleranceBps(targetBps: number, minRepriceBps: number, ratio: number): number {
  const floor = Number.isFinite(minRepriceBps) && minRepriceBps > 0 ? minRepriceBps : 0;
  const scaled = Number.isFinite(ratio) && ratio > 0 ? targetBps * ratio : 0;
  return Math.max(floor, scaled);
}

export interface KeepQuoteInput {
  side: "BUY" | "SELL";
  /** 当前已挂在盘口上的价格。 */
  existingPrice: number;
  /** 参考价：优先 mark price。 */
  anchor: number;
  targetBps: number;
  toleranceBps: number;
  maxDistanceBps: number;
}

/**
 * 判断现有挂单是否还能原地不动。保持不动意味着这一轮不撤不挂，
 * 订单得以在盘口连续停留，跨过 Maker Points 的 3 秒计分门槛。
 */
export function shouldKeepQuote(input: KeepQuoteInput): boolean {
  const { side, existingPrice, anchor, targetBps, toleranceBps, maxDistanceBps } = input;
  const distance = signedDistanceBps(side, existingPrice, anchor);
  if (!Number.isFinite(distance)) return false;
  // 已经穿到参考价另一侧，随时可能成交，必须立即重挂
  if (distance <= 0) return false;
  // 已经掉出积分范围，留着也不得分
  if (distance >= Math.min(maxDistanceBps, MAKER_POINTS_ZERO_BPS)) return false;
  return Math.abs(distance - targetBps) <= toleranceBps;
}
