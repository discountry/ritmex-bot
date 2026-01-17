import type { AsterOrder } from "../../exchanges/types";
import { isOrderActiveStatus } from "../../utils/order-status";

export interface HourlyStatsSnapshot {
  placeCount: number;
  cancelCount: number;
  fillCount: number;
  realizedPnl: number;
  startTime: number;
}

export class HourlyStatsTracker {
  private placeCount = 0;
  private cancelCount = 0;
  private fillCount = 0;
  private realizedPnl = 0;
  private startTime = Date.now();

  private lastOrderStates = new Map<string, { status: string; filledQty: number; price: number; side: string }>();

  /**
   * 记录一次下单尝试
   */
  recordPlace(): void {
    this.placeCount++;
  }

  /**
   * 记录一次撤单尝试
   */
  recordCancel(): void {
    this.cancelCount++;
  }

  /**
   * 更新订单状态并统计成交和盈亏
   * @param currentOrders 当前所有订单的快照
   */
  updateOrders(currentOrders: AsterOrder[]): void {
    for (const order of currentOrders) {
      const orderId = String(order.orderId);
      const status = order.status || "";
      const filledQty = Number(order.executedQty || 0);
      const price = Number(order.price || 0);
      const side = order.side || "BUY";

      const lastState = this.lastOrderStates.get(orderId);

      if (lastState) {
        // 如果成交数量增加了
        if (filledQty > lastState.filledQty) {
          const newFill = filledQty - lastState.filledQty;
          this.fillCount++;
          // 这里简单记录成交次数，如果需要精确盈亏，通常需要 entryPrice，
          // 但在 STANDX 刷分场景，用户主要关注成交了多少次。
          // 真正的盈亏建议从账户余额变动中获取更准确。
        }
      } else {
        // 新订单，如果已经有成交
        if (filledQty > 0) {
          this.fillCount++;
        }
      }

      // 更新状态记录
      this.lastOrderStates.set(orderId, { status, filledQty, price, side });
    }

    // 清理已经不在 currentOrders 中且不是活跃状态的订单记录（防止内存泄漏）
    const currentIds = new Set(currentOrders.map(o => String(o.orderId)));
    for (const id of this.lastOrderStates.keys()) {
      if (!currentIds.has(id)) {
        const state = this.lastOrderStates.get(id);
        // 如果订单消失了，且最后状态不是活跃状态，说明已经结束
        if (state && !isOrderActiveStatus(state.status)) {
          this.lastOrderStates.delete(id);
        }
      }
    }
  }

  /**
   * 记录盈亏变动
   */
  addPnl(pnl: number): void {
    this.realizedPnl += pnl;
  }

  getSnapshot(): HourlyStatsSnapshot {
    return {
      placeCount: this.placeCount,
      cancelCount: this.cancelCount,
      fillCount: this.fillCount,
      realizedPnl: this.realizedPnl,
      startTime: this.startTime,
    };
  }

  reset(): void {
    this.placeCount = 0;
    this.cancelCount = 0;
    this.fillCount = 0;
    this.realizedPnl = 0;
    this.startTime = Date.now();
    // lastOrderStates 不重置，保持跨小时追踪
  }
}
