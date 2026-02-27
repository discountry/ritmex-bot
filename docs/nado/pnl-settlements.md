# PnL Settlements

PnL settlements on Nado represent the ongoing realization of profits and losses from your open positions, seamlessly converting unrealized gains or losses into actual USDT0 balances without interrupting your trading flow. At its core, PnL – profit and loss – measures the difference between a position's current market value and its opening cost, providing a real-time snapshot of performance.

On Nado, the settlement process runs continuously in the background.

As perpetuals fluctuate, positive PnL (winners) draws USDT0 from negative PnL (losers) across the platform, much like a self-balancing scale that redistributes weight to keep the entire system level. This automatic mechanism ensures your account value accurately reflects economic reality, with unsettled PnL acting as a bridge between open trades and settled cash.

<figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-dbeb869e0b43f58b85160a19ab7754870cd53598%2FPnL%20Settlements%20Conceptual%20Graphic.png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

For settlements on Nado, you'll see two key metrics:<br>

1. **Perp PnL** (aggregate across all perpetual positions)
2. **Position PnL** (for a specific trade)

These are updated in real-time, influencing your subaccount health and available margin. No manual intervention is needed – settlements happen transparently and automatically.

***

### How PnL Settlements Work

Nado breaks lifetime PnL into two components:

* **Unsettled USDT0** (pending transfers)
* **Settled USDT0** (already realized in your balance)

Settlements occur automatically whenever losers' negative PnL can fund winners' positives, altering USDT0 balances accordingly.

<figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-fab5c26d6f7021ce16d57d65c5c118d547157763%2FPnL%20Settlements%20Conceptual%20Graphic(2).png?alt=media" alt="" width="563"><figcaption></figcaption></figure>

This continuous flow prevents distortions, maintaining equilibrium across dynamic trading activity on the platform. More specifically:<br>

* **Unsettled USDT0**: The portion of PnL yet to transfer between accounts. Positive values signal incoming deposits to your USDT0 balance; negative ones indicate upcoming withdrawals. It fluctuates with position volatility and hold duration – not always mirroring total PnL.
* **Settled USDT0**: PnL already incorporated into your USDT0 holdings, visible on the Portfolio Overview. Over time, as settlements accumulate, your assets and borrows adjust to reflect these changes.

$$
\text{Total PnL} = \text{Unsettled USDT0} + \text{Settled USDT0}
$$

Users can view unsettled USDT0 by checking the Unsettled column in the Balances table of the Margin Manager page on the Nado app.

> For a full audit of your settlements, navigate to **Portfolio → History → Settlements Table**, which logs every transfer with timestamps and amounts.

***

### View PnL Metrics

* **Perp PnL**: Track total unrealized across perpetuals on the Portfolio Overview or Perpetual Positions pages – essential for gauging subaccount health.
* **Position PnL**: Drill into specifics via the Perp Positions table, showing individual trade performance.

$$
\text{Account Value} \neq \text{Assets} - \text{Borrows} \pm \text{Perp PnL}
$$

**Instead**:

$$
\text{Account Value} = \text{Assets} - \text{Borrows} \pm \text{Unsettled USDT0}
$$

This formula captures the dynamic nature of settlements, ensuring your displayed equity aligns with on-chain reality.

***

### Examples of Settlement in Action

Settlements aren't tied directly to a position's overall direction. Instead, they depend on market timing and peer activity. A winning trade might yield negative unsettled USDT0 if it funded others mid-hold, while a loser could show positive if it received from bigger shorts.

You open a 5 ETH long perpetual at $3,000 (notional $15,000, 5x leverage on $3,000 margin) and a 3 ETH short at $3,000.

* ETH rises to $3,100
* Your long gains $500 PnL (+3.33%)
* Your short loses $300 (-3.33%)
* Unsettled USDT0: +$200 net (winners pull from platform losers)

Over multiple hours, $150 settles into your USDT0 (from external shorts funding your long), leaving $50 unsettled. Your account value rises to $3,200 (original $3,000 + $200 net PnL), but assets now include the settled $150.

#### Volatility Swing Examples

Consider the scenario if ETH dips to $2,900 mid-day.

* Your long now is - $500 PnL, short +$300.
* Unsettled flips to -$200 (your short funds platform longs).
* By evening's recovery to $3,050, it rebounds to +$150 unsettled.

> **Total Lifetime PnL**: +$250, with $100 settled – demonstrating how swings create interim negatives even on net winners.

***

### Closing Positions & Balance Adjustments

When you close a position, any remaining unsettled USDT0 settles automatically into your USDT0 balance, typically within minutes. This finalizes the trade's economics where gains boost collateral for new plays, losses deduct without surprise.

Open positions cause gradual USDT0 balance shifts as back-end settlements process – normal behavior that doesn't restrict trading. Your buying power remains tied to health, not just balances, so monitor both to better gauge your risk profile.

#### Handling Negative PnL Without USDT0

If negative PnL accrues without sufficient USDT0, settlements continue but only as long as your subaccount health stays positive, Nado auto-borrows the shortfall from its embedded money markets at the prevailing rates. This keeps positions viable during drawdowns, but it adds interest.

With PnL settlements woven into Nado's fabric, your trades evolve from static bets to living strategies – precise, adaptive, and always aligned with the market's pulse.

***
