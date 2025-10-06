import type { OHLCV, Signal } from '../types';

export interface BacktestParams {
   initialEquity: number; // e.g., 10000
   tradeQty: number; // fallback fixed size in units
   feePct: number; // taker fee, e.g., 0.001
   slippagePct: number; // applied on fills
   lossLimitPct?: number; // legacy percent stop vs entry (e.g., 0.01 == 1%)
   trailingProfitPct?: number; // legacy activation threshold vs entry (e.g., 0.02)
   // ATR-based risk controls
   atrLen?: number; // ATR period
   atrStopMult?: number; // stop distance = ATR * mult
   atrTrailMult?: number; // trailing distance = ATR * mult
   riskPct?: number; // per-trade risk as % of equity (e.g., 0.01 for 1%)
}

export interface Trade {
   ts: number;
   side: 'BUY' | 'SELL';
   price: number;
   qty: number;
   fee: number;
   reason?: string;
   pnl?: number; // realized PnL for close trades
   realized?: boolean; // true if this trade closes a position
}

export interface PortfolioSnapshot {
   ts: number;
   price: number;
   qty: number; // position quantity (+ long, - short)
   entryPrice: number | null;
   equity: number; // cash + position value
   pnlUnrealized: number;
   drawdown: number; // current drawdown %
}

export interface BacktestResult {
   trades: Trade[];
   equityCurve: PortfolioSnapshot[];
}

export class Simulator {
   private equity: number;
   private qty: number = 0;
   private entryPrice: number | null = null;
   private peakEquity: number;
   private trailingStopPx: number | null = null;

   constructor(private readonly params: BacktestParams) {
      this.equity = params.initialEquity;
      this.peakEquity = this.equity;
   }

   step(bar: OHLCV, signal: Signal, atr?: number | null): { trade?: Trade; snapshot: PortfolioSnapshot } {
      // risk controls on current bar extremes
      const price = bar.close;
      const [low, high] = [bar.low, bar.high];
      let trade: Trade | undefined;

      // ATR trailing: dynamically follow price if configured; else legacy activation model
      const curAtr = atr ?? null;
      if (this.params.atrTrailMult && this.params.atrTrailMult > 0 && curAtr && curAtr > 0 && this.qty !== 0) {
         const dir = this.qty >= 0 ? 'long' : 'short';
         const dist = this.params.atrTrailMult * curAtr;
         this.trailingStopPx = dir === 'long' ? price - dist : price + dist;
      } else if (this.entryPrice !== null && this.params.trailingProfitPct && this.params.trailingProfitPct > 0) {
         const dir = this.qty >= 0 ? 'long' : 'short';
         const activatePx = dir === 'long' ? this.entryPrice * (1 + this.params.trailingProfitPct) : this.entryPrice * (1 - this.params.trailingProfitPct);
         const activated = dir === 'long' ? high >= activatePx : low <= activatePx;
         if (activated) {
            const trailPx = dir === 'long' ? price - (high - low) / 2 : price + (high - low) / 2;
            this.trailingStopPx = trailPx;
         }
      }

      // stop-loss check: ATR-based takes precedence if configured
      if (this.entryPrice !== null && this.qty !== 0) {
         const dir = this.qty >= 0 ? 'long' : 'short';
         let stopPx: number | null = null;
         if (this.params.atrStopMult && this.params.atrStopMult > 0 && curAtr && curAtr > 0) {
            const dist = this.params.atrStopMult * curAtr;
            stopPx = dir === 'long' ? (this.entryPrice - dist) : (this.entryPrice + dist);
         } else if (this.params.lossLimitPct && this.params.lossLimitPct > 0) {
            stopPx = dir === 'long' ? this.entryPrice * (1 - this.params.lossLimitPct) : this.entryPrice * (1 + this.params.lossLimitPct);
         }
         if (stopPx !== null) {
            const hit = dir === 'long' ? low <= stopPx : high >= stopPx;
            if (hit) {
               trade = this.close(bar, 'Stop loss');
            }
         }
      }

      // trailing stop check
      if (!trade && this.trailingStopPx !== null && this.qty !== 0) {
         const dir = this.qty >= 0 ? 'long' : 'short';
         const hit = dir === 'long' ? low <= this.trailingStopPx : high >= this.trailingStopPx;
         if (hit) {
            trade = this.close(bar, 'Trailing stop');
            this.trailingStopPx = null;
         }
      }

      // act on strategy signal if no stop has closed position
      if (!trade) {
         if (signal.action === 'BUY') {
            if (this.qty <= 0) {
               const qty = this.computeRiskQty(curAtr);
               trade = this.open(bar, 'BUY', qty, signal.reason);
            }
         } else if (signal.action === 'SELL') {
            if (this.qty >= 0) {
               const qty = this.computeRiskQty(curAtr);
               trade = this.open(bar, 'SELL', qty, signal.reason);
            }
         }
      }

      const pnlUnrealized = this.entryPrice !== null ? (this.qty >= 0 ? price - this.entryPrice : this.entryPrice - price) * Math.abs(this.qty) : 0;
      const equity = this.equity + pnlUnrealized;
      this.peakEquity = Math.max(this.peakEquity, equity);
      const dd = this.peakEquity > 0 ? (this.peakEquity - equity) / this.peakEquity : 0;

      const snapshot: PortfolioSnapshot = { ts: bar.ts, price, qty: this.qty, entryPrice: this.entryPrice, equity, pnlUnrealized, drawdown: dd };
      return { trade, snapshot };
   }

   private open(bar: OHLCV, side: 'BUY' | 'SELL', qty: number, reason?: string): Trade {
      const fillPx = this.applySlippage(bar.close);
      // close opposite if any
      if (this.qty !== 0) {
         const _ = this.close(bar, 'Flip');
      }
      this.qty = side === 'BUY' ? qty : -qty;
      this.entryPrice = fillPx;
      const fee = Math.abs(fillPx * this.qty) * this.params.feePct;
      this.equity -= fee;
      return { ts: bar.ts, side, price: fillPx, qty, fee, reason, realized: false };
   }

   private close(bar: OHLCV, reason?: string): Trade {
      const fillPx = this.applySlippage(bar.close);
      const qtyAbs = Math.abs(this.qty);
      const pnl = (this.qty >= 0 ? fillPx - (this.entryPrice ?? fillPx) : (this.entryPrice ?? fillPx) - fillPx) * qtyAbs;
      const fee = Math.abs(fillPx * qtyAbs) * this.params.feePct;
      this.equity += pnl;
      this.equity -= fee;
      const side = this.qty >= 0 ? 'SELL' : 'BUY';
      this.qty = 0;
      this.entryPrice = null;
      this.trailingStopPx = null;
      return { ts: bar.ts, side, price: fillPx, qty: qtyAbs, fee, reason, pnl, realized: true };
   }

   private applySlippage(px: number): number {
      const s = this.params.slippagePct;
      if (!s || s <= 0) { return px; }
      return this.qty >= 0 ? px * (1 + s) : px * (1 - s);
   }

   private computeRiskQty(curAtr: number | null | undefined): number {
      const riskPct = this.params.riskPct;
      const mult = this.params.atrStopMult;
      if (!riskPct || riskPct <= 0 || !mult || mult <= 0 || !curAtr || curAtr <= 0) {
         return this.params.tradeQty;
      }
      const riskAmount = this.equity * riskPct;
      const stopDist = curAtr * mult;
      const qty = riskAmount / stopDist;
      // guard against pathological values
      return Math.max(0, qty);
   }
}
