# Grid Trading Strategy Guide

This guide explains how to use the grid trading strategy in Ritmex Bot. We will use an ASTERUSDT perpetual contract as a worked example and walk through the full flow from environment configuration to live monitoring. Key parameters, risk controls, and common questions are all covered.

---

## Environment Configuration

1. Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```

2. Configure the Aster exchange API:
   ```env
   EXCHANGE=aster
   ASTER_API_KEY=your_api_key
   ASTER_API_SECRET=your_api_secret
   TRADE_SYMBOL=ASTERUSDT
   ```

3. Set precision and grid parameters. The example below uses a 1.50–2.50 price range, 20 grid levels, 5 contracts per order, and a 50-contract maximum position:
   ```env
   PRICE_TICK=0.0001
   QTY_STEP=0.01

   GRID_LOWER_PRICE=1.50
   GRID_UPPER_PRICE=2.50
   GRID_LEVELS=20
   GRID_ORDER_SIZE=5
   GRID_MAX_POSITION_SIZE=50
   GRID_REFRESH_INTERVAL_MS=1000
   GRID_MAX_LOG_ENTRIES=200
   GRID_DIRECTION=both
   GRID_STOP_LOSS_PCT=0.02
   GRID_RESTART_TRIGGER_PCT=0.02
   GRID_AUTO_RESTART_ENABLED=true
   GRID_MAX_CLOSE_SLIPPAGE_PCT=0.05
   ```

> **Important:** `GRID_ORDER_SIZE` and `GRID_MAX_POSITION_SIZE` must satisfy the rule: `max_position ÷ order_size ≥ grid_levels`. In this example, 50 ÷ 5 = 10, which is less than 20 grid levels — so the strategy will only place orders at the 10 nearest levels above and below the current price, keeping total exposure within the position cap.

---

## How the Grid Works

- **Geometric (equal-ratio) spacing** — all grid price levels are distributed proportionally between the upper and lower bounds.
- **Current-price-first order placement** — on start-up or market-driven refresh, orders are filled in closest-to-current-price order to avoid stale far-end fills.
- **Directional mode** — `GRID_DIRECTION=both` opens positions on both the buy and sell sides. Setting it to `long` or `short` restricts new opens to that side only; orders on the opposite side are automatically marked `reduceOnly`.
- **Risk controls:**
  - If price falls below `lower_bound × (1 - STOP_LOSS_PCT)` **or** rises above `upper_bound × (1 + STOP_LOSS_PCT)`, the strategy cancels all limit orders and closes the position at market.
  - When `GRID_AUTO_RESTART_ENABLED=true`, the grid will restart automatically once price returns inside the boundary by `RESTART_TRIGGER_PCT`.
- **Position cap** — `GRID_MAX_POSITION_SIZE` is a hard ceiling on total held contracts, preventing the grid from accumulating an oversized position during a sustained directional move.

---

## Running the Strategy

After installing dependencies, launch the grid strategy directly from the CLI:

```bash
bun install
bun run index.ts --strategy grid --exchange aster
```

To run inside the interactive Ink dashboard instead:

```bash
bun start
```

Then select **"Basic Grid Strategy"** from the menu.

---

## Monitoring and Tuning

The dashboard shows:

- Current best bid/ask, position direction, open-order summary, and position overview.
- A scrolling log of order status updates and risk-control events.
- A record of stop-loss triggers with the reason logged.

**Tuning recommendations:**

1. **Tighten the range** — to increase the profit captured per grid step, reduce the gap between the upper and lower bounds and decrease the number of levels.
2. **Add more levels** — increase `GRID_LEVELS` and lower `GRID_ORDER_SIZE` proportionally; remember to raise `GRID_MAX_POSITION_SIZE` accordingly so all levels can be filled.
3. **Adjust close tolerance** — `GRID_MAX_CLOSE_SLIPPAGE_PCT` controls the maximum allowed deviation from the mark price when closing, ensuring `reduceOnly` orders are not rejected by the exchange.
4. **Single-direction mode** — if you only want to "sell high, buy low" without holding a net short position, set `GRID_DIRECTION=long`; sell orders will automatically become `reduceOnly`.

---

## Restart and Recovery Behaviour

After a restart, the strategy will:

- Re-subscribe to account, order, depth, and ticker streams.
- Recompute the grid from the current position and open-order snapshot, placing only the **missing** orders rather than rebuilding the entire grid from scratch.
- Continue tracking price levels as long as the position cap allows.

This means that even if the process crashes, the grid will resume from where it left off as long as the exchange snapshot is intact. If you manually cancelled any orders before the restart, the strategy will clean up any stale orders that fall outside the current grid plan on its next startup.

---

## FAQ

**Q: Why do only a few grid levels near the current price have orders?**

Each grid order consumes a portion of the position cap. When `GRID_MAX_POSITION_SIZE / GRID_ORDER_SIZE < GRID_LEVELS`, only enough levels to stay within the position limit are populated. Adjust either parameter to increase coverage.

**Q: Why does the strategy close immediately when price breaks above the upper boundary?**

This is the stop-loss protection triggering. Once the 2% buffer beyond the boundary is breached, the grid cancels all limit orders and closes the position at market to prevent runaway exposure.

**Q: How do I manually adjust my position?**

Stop the strategy (Ctrl+C or exit the dashboard), make your manual adjustments on the exchange, then restart. The strategy will base its new grid layout on the updated position and open-order state.

---

## Summary

With the configuration above you can run an automated geometric grid strategy on the ASTERUSDT perpetual contract. Always test in sandbox or with a small allocation first to ensure the parameters suit the current volatility profile and fee structure before scaling up capital.

Good luck trading!