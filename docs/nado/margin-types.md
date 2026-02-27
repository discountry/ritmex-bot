# Margin Types

Nado offers two margin modes to suit your trading style:

1. **Unified Margin**
2. **Isolated Margin**

Unified margin is a form of cross-margin that treats your entire account – deposits, positions, and unrealized profits / losses – as a single, interconnected pool of collateral across spot, perpetuals, and money markets (e.g., spot borrowing). A single collateral pool allows assets to automatically offset risks via a single health score that dynamically adjusts to your portfolio’s collateral – computed via the on-chain risk engine.

> Unified margin is ideal for diversified portfolios where you want to maximize capital efficiency without intensive manual adjustments.

Isolated margin, on the other hand, assigns a fixed amount of collateral to one specific perpetual position, keeping it separate from the rest of your account – like placing a single bet in a sealed compartment to protect the rest of your funds. Isolated margin is widely popular for confining collateral risks to a single perpetual position, where margin maintenance and liquidation risks only impact that specific open position.

> Isolated margin is useful for high-volatility trades, such as using higher leverage or opening positions in more price-volatile altcoin perpetuals. If you prefer strict risk limits per position, then isolated margin enables you to ensure that one trade’s outcome doesn’t affect others.

Both modes are available on Nado using the same account – with unified cross-margin as the default margin type. Users can switch seamlessly between unified cross-margin and isolated margin via the Nado order panel to adapt their strategy as markets shift.

***

### Unified Margin

Unified margin is a form of cross-margin that consolidates all your account balances and open positions into one margin pool, enabling real-time margin offsets that reduce overall margin requirements and enhance capital efficiency.

<figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-0353640755334357d898090465457ebf04e07a5e%2FDocs.png?alt=media" alt=""><figcaption></figcaption></figure>

#### How it Works

* **Shared Collateral Pool**: Every asset in your Nado account (e.g., USDT0 deposits, kBTC holdings, etc) and all open positions contribute to a unified health score, calculated by Nado's on-chain risk engine. This score reflects your total available collateral and maintenance margin levels before hitting margin limits and liquidation thresholds.
* **Automatic Netting & Rebalancing**: Positive PnL from one position can offset losses in another, dynamically adjusting margin needs. Maintenance margin (the buffer against liquidation) and initial margin (required to open positions) are computed holistically, often resulting in lower margin requirements than isolated margin trades.
* **Risk Tiers for Visibility**: Monitor your portfolio through intuitive risk levels, updated in real-time for proactive management.

#### Benefits & Examples

The core advantage of unified cross-margin is maximizing capital efficiency.

Your portfolio operates as an interconnected system, where balanced exposures minimize tied-up funds and amplify buying power. It's suited for strategies like basis trades or multi-asset hedges, eliminating the need for constant rebalancing.

**Example**: Consider the following basis trade scenario:

* You deposit 10,000 USDT0 and open a long wETH spot position worth $20,000 (2x leverage).
* Simultaneously, you short an ETH perpetuals contract for $20,000 notional (also 2x leverage).
* With unified margin and custom logic for handling spread trades, offsetting exposure nets out – meaning your effective margin requirement may drop notably compared to an isolated margin ETH perpetual of the same size. The risk engine recognizes the hedge and adjusts the margin levels accordingly.
* More specifically, if the ETH price dips 5%, the spot loss is balanced by the perpetual’s profits, maintaining health above 80% without requiring additional collateral deposits.

As a result, unified margin not only saves capital but also automates risk adjustments during market swings, letting you scale your trades without constantly making manual changes.

#### Leverage & Margin Requirements Under Unified Margin

When trading with cross-margin, the leverage selector in the order panel does not determine how much margin is reserved for your position. Instead, it acts purely as a front-end sizing control that limits your maximum notional size per order.

Under the hood, margin requirements are calculated using a market’s risk parameters. Because unified margin exposes your entire account as a shared collateral pool, Nado does not lock a specific amount of margin based on the leverage selected.&#x20;

{% hint style="info" %}
The margin shown is a visual metric to gauge the amount of margin utilized by a position.
{% endhint %}

What this means in practice:

* Selecting 5x leverage does not assign 20% of notional as margin for an order.
* Initial margin is calculated using the market’s risk weights.
* Your entire account equity is available to support the new position, rather than a fixed, isolated amount.

As a result, traders may see cases such as:

* A $4,000 notional position
* Max leverage: 20x
* Selected leverage: 5x
* Actual margin used: \~$200, because the risk engine is applying the market’s leverage parameters, not the front-end slider.

Unified margin is designed to maximize capital efficiency, allowing Nado’s risk engine to evaluate your account holistically rather than locking collateral per position. The leverage slider remains a tool for controlling order size, not a determinant of allocated margin.

***

### Isolated Margin

Isolated margin dedicates a precise amount of collateral to a single perpetual position, ensuring its risks stay contained.

The isolated margin type is available exclusively for perpetuals, with a cap of one isolated position per perpetual market. It complements unified margin by allowing users to express their trading strategies with a sharper focus, removing the position’s margin impact from their Nado account’s broader portfolio of assets.

<figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-d8eacb0184124765acc80b84e2d508d3b42cf7ed%2FDocs%20(2).png?alt=media" alt=""><figcaption></figcaption></figure>

#### How it Works

* **Dedicated Allocation**: When opening a position, select isolated mode and specify the desired leverage amount. This amount alone determines the position's health and leverage (up to 20x), independent of your main Nado account.
* **Independent Risk Checks**: Each isolated position has its own liquidation threshold – no shared PnL or offsets. If your position breaches maintenance margin (typically 50% of initial), it's liquidated solely on its collateral, leaving the rest of your account intact and unaffected.
* **Integration with Cross-Margin**: Funds on Nado transfer smoothly from your unified pool to fund a new isolated margin position. Notably, traders can still utilize both unified and isolated margin in the same market (e.g., cross-margin spot wETH alongside isolated ETH perps) per their trading strategy or risk preferences.

#### Benefits & Examples

Isolated margin excels in targeted risk control, limiting downside to predefined amounts while enabling bolder leverage on specific markets. It promotes precise position sizing and eases oversight of outliers, functioning as a safeguard for exploratory trades amid broader stability.

Unlike unified margin’s shared collateral pool, isolated acts as a firewall. It’s ideal for testing new strategies or riding short-term swings without portfolio-wide risk impacts.

**Example**: Consider the following SOL perpetual scenario.

* Bob starts with 10,000 USDT0 in spot assets in his account.
* Bob allocates 2,000 USDT0 to a 10x leveraged SOL-PERP long amid a volatile market – a $20,000 notional position.
* Bob’s main Nado account now holds 8,000 USDT0 in spot assets, while the 2,000 USDT0 functions as the collateral for his SOL-PERP position.
* If the SOL price drops by 10% and triggers liquidation of Bob’s SOL-PERP, Bob only loses the 2,000 USDT0 collateral.
* The remaining 8,000 USDT0 spot holdings in Bob’s main account remain untouched, preserving 80% of his capital and limiting the risk exclusively to his SOL-PERP.

Nado users can also adjust their open isolated margin positions by simply adding / removing margin via the trading terminal (with optional borrowing from money markets). This recalculates health instantly without affecting other positions.

Switch between modes anytime in the order panel, or manage isolated trades directly from the positions table. With clear health indicators and automated calculations, Nado equips you to trade with confidence, turning market flux into focused opportunity.

***
