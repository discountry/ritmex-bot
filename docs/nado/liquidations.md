# Liquidations

Liquidations on Nado serve as a critical safety valve in leveraged trading, automatically closing positions when your subaccount's maintenance health dips below zero – ensuring losses never exceed your deposited collateral and preserving the platform's stability for all users.

> The liquidation process, triggered by on-chain calculations, uses the mark oracle price from the Chaos Oracle network for fairness, drawing from a time-weighted average of third-party exchange data.

Nado's design emphasizes precision where liquidations prioritize minimal disruption, starting with the most liquid assets and halting if health recovers mid-process. Complementing the liquidation mechanism is the insurance fund, a dedicated USDT0 reserve that absorbs rare shortfalls, acting as the platform's first line of defense.

{% hint style="info" %}
The insurance fund is sustained by 50% of all liquidation profits. It helps to prevent widespread loss socialization, maintaining platform solvency even during extreme volatility.
{% endhint %}

***

### How Liquidations Work

When a subaccount's maintenance health falls below zero, Nado initiates liquidation to restore solvency, closing elements in a structured sequence that minimizes market impact. Any user can act as a liquidator by submitting a transaction to purchase discounted assets or cover marked-up liabilities, earning a profit while aiding recovery.

> The process pauses if initial health rises above zero at any step, giving positions a chance to rebound.

#### NLP Liquidation Priority

The [Nado Liquidity Provider (NLP)](https://docs.nado.xyz/nlp) vault actively participates in liquidations to maintain platform stability and generate yield for liquidity providers. When a liquidatable position is detected, the NLP may front-run external liquidators under certain conditions:

* **Perpetual Positions Only**: The NLP will attempt to front-run liquidations for perpetual futures positions. The NLP does not liquidate spot positions or spread positions.
* **Risk-Based Throttling**: When the NLP vault's risk exposure exceeds a predefined threshold, it will stop front-running liquidations, allowing external liquidators to process them instead. This ensures the NLP maintains healthy risk parameters.

Maintenance Margin Usage is an indicator of when liquidation begins. It indicates the percentage of your maintenance margin that is consumed by open positions. It provides a real-time gauge of how close your account is to liquidation thresholds.

* **Low Risk**: 0 – 40%
* **Medium Risk**: 40 – 70%
* **High Risk**: 70 – 90%
* **Extreme Risk**: 90 – 100%

> If Maintenance Margin Usage reaches 100%, your account is immediately eligible for liquidation. At this point, you will be unable to open new positions until some margin is freed up, either through position closures, additional deposits, or positive PnL realizations.

<figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-7de486e5e982e7a9ce16149425516a459c06dff6%2FDocs-2.png?alt=media" alt=""><figcaption></figcaption></figure>

#### Liquidation Sequence

Liquidators specify a product and amount to target, with the system rounding down to the optimal size that brings maintenance health back to non-negative, whilst making sure the initial health is non-positive. – balancing efficiency with user protection.

The sequence of liquidation operations is as follows:

1. **Cancel Open Orders**: All pending orders in the subaccount are voided to free up resources.
2. **Liquidate Assets**: Spot balances, long spreads, and positive-PnL perpetuals are sold at a discount.
3. **Liquidate Liabilities**: Borrows and short spreads are repaid at a markup.

#### Liquidation Price

The execution price is the oracle price adjusted by the maintenance weight divisor with a 0.5%/0.25% floor, incentivizing quick intervention.

**For Longs**:

$$
\text{Liquidation Price} = \text{oracle\_price} \times \left(1 - \max\left(\frac{1 - \text{maint\_asset\_weight}}{5}, 0.005\right)\right)
$$

**For Shorts**:

$$
\text{Liquidation Price} = \text{oracle\_price} \times \left(1 + \max\left(\frac{\text{maint\_liability\_weight} - 1}{5}, 0.005\right)\right)
$$

{% hint style="info" %}
**Minimum Penalty: 0.5%** - At very high leverage, the liquidation penalty is capped at a minimum of 0.5% to ensure liquidators are always incentivized.
{% endhint %}

***

**For Spread Liquidations**:

When liquidating spread positions (offsetting spot and perp positions), the penalty calculation differs based on which side you're closing:

**Selling Spread (amount > 0)**: Selling spot, closing perp short

1. Calculate penalty: `penalty = (1 - perp_maint_asset_weight) / 10`
2. Apply minimum floor: `penalty = max(penalty, 0.0025)` (0.25%)
3. Liquidation price (discount): `spot_price × (1 - penalty)`

$$
\text{Liquidation Price} = \text{spot\_price} \times \left(1 - \max\left(\frac{1 - \text{perp\_maint\_asset\_weight}}{10}, 0.0025\right)\right)
$$

**Buying Spread (amount < 0)**: Buying spot to cover short, closing perp long

1. Calculate penalty: `penalty = (spot_maint_liability_weight - 1) / 10`
2. Apply minimum floor: `penalty = max(penalty, 0.0025)` (0.25%)
3. Liquidation price (markup): `spot_price × (1 + penalty)`

$$
\text{Liquidation Price} = \text{spot\_price} \times \left(1 + \max\left(\frac{\text{spot\_maint\_liability\_weight} - 1}{10}, 0.0025\right)\right)
$$

{% hint style="info" %}
**Minimum Penalty: 0.25%** - Spread liquidations have a lower minimum of 0.25% (half of non-spread) since they're less risky.
{% endhint %}

***

**For non-spread liquidations, for example**, this creates a gross profit for liquidators:

$$
\text{Long} = \text{oracle\_price} \times \max\left(\frac{1 - \text{maint\_asset\_weight}}{5}, 0.005\right)
$$

$$
\text{Short} = \text{oracle\_price} \times \max\left(\frac{\text{maint\_liability\_weight} - 1}{5}, 0.005\right)
$$

But Nado allocates 50% of this to the insurance fund, so net profit is half:

$$
\text{Net Long} = \text{oracle\_price} \times \max\left(\frac{1 - \text{maint\_asset\_weight}}{10}, 0.0025\right)
$$

$$
\text{Net Short} = \text{oracle\_price} \times \max\left(\frac{\text{maint\_liability\_weight} - 1}{10}, 0.0025\right)
$$

***

#### Outcomes & Insolvency

Liquidation yields two possibilities per product:<br>

1. **Positive Outcome**: The subaccount receives USDT0 (e.g., from selling positive spot balances or closing profitable perps).
2. **Negative Outcome**: The subaccount spends USDT0 (e.g., repaying borrows or covering losing perps).

If all viable liquidations are negative and would deplete USDT0 below zero, the account becomes insolvent – positions are closed at a net loss, generating bad debt. At this point, further safeguards are activated.

**Example**

Suppose you have 31,000 USDT0 and short 10 ETH spot ($30,000 at $3000 / ETH) now. ETH spot maintenance\_liability\_weight is 1.05, then:

$$
\text{Maintenance Health}: 31{,}000 - 30{,}000 \times 1.05 = -500 , \text{USDT0}
$$

A liquidator targets 5 ETH short:

* **Oracle Price** = $3,000 / ETH
* **Liquidation Price** = $3,000 \* (1 + (1.05 - 1) / 5) = $3,030 / ETH
* **Profit** = $30 / ETH
* **Liquidation Fee** (sent to insurance fund) = $15 / ETH

Then:

* You lose 5 ETH short and the loss equals 3,030 \* 5 = 15,150 USDT0.
* You now have a 5 ETH short and 15,850 USDT0 and the maintenance health increases to 100 USDT0. You cannot be liquidated for now.
* The liquidator gets 5 ETH short with (3030 - 15) \* 5 = 15,075 USDT0 (in fact, it will be 15,074 considering $1 fee by Nado, not insurance).
* Liquidation fee (15 \* 5 = 75 USDT0) is distributed to the insurance fund.

**Note**: The liquidator cannot liquidate too much (e.g., 10 ETH short) if it will let the initial health > 0.

#### High-Leverage Example (Minimum Penalty Floor)

At very high leverage, the minimum penalty floor becomes active. Suppose you have a 50x leveraged long SOL position:

* **Position**: Long 1,000 SOL-PERP at $100/SOL (entered when SOL was $100)
* **Current Price**: $100/SOL (oracle price)
* **Maintenance Asset Weight**: 0.99 (for 50x leverage)
* **Your USDT0**: $500 (maintenance health is now negative)

The natural penalty would be:

$$
\text{Natural Penalty} = \frac{1 - 0.99}{5} = \frac{0.01}{5} = 0.002 = 0.2%
$$

But since 0.2% < 0.5% minimum, the **0.5% floor applies**:

* **Liquidation Price** = $100 × (1 - 0.005) = $99.50/SOL
* **Gross Profit** = $100 × 0.005 = $0.50/SOL
* **Liquidation Fee** (to insurance) = $0.25/SOL
* **Liquidator Net Profit** = $0.25/SOL

If a liquidator takes 500 SOL:

* You lose 500 SOL-PERP and pay 500 × $99.50 = $49,750 USDT0
* You now have 500 SOL-PERP long and $50,250 USDT0 (maintenance health restored)
* Liquidator gets 500 SOL-PERP for 500 × $99.50 = $49,750 USDT0 (market value: $50,000)
* Insurance fund receives $125 USDT0

Without the 0.5% floor, liquidators would only earn 0.2% ($100 total), making them unwilling to act. The floor ensures liquidations remain profitable even at extreme leverage.

***

### Insurance Fund & Socialization

The insurance fund is Nado's buffer against insolvency – a segregated USDT0 pool that covers bad debt by paying liquidators to absorb underwater positions.

Seeded by the Nado team, it's replenished with 50% of liquidation profits, growing with platform activity.

If depleted, losses socialize in tiers to spread impact equitably:

1. **Perpetual Socialization**: Pro-rata deductions from other positions in the same market (e.g., all ETH-PERP holders share a 0.1% collateral trim).
2. **USDT0 Depositor Socialization**: Remaining shortfalls hit USDT0 balances across the platform.

This multi-layer approach – insurance first, then targeted, then broad – ensures platform resilience and solvency amid extreme volatility.

#### Example — Insolvency Resolution

Post-liquidation, your subaccount owes $1,000 bad debt on a liquidated SOL-PERP.

* The insurance fund ($1M total) injects $1,000, paying a liquidator $1,050 to take the position (5% incentive).
* The insurance fund’s capital is reduced accordingly to cover the liquidator payment.
* If the insurance fund is depleted, SOL-PERP holders each lose 0.01% of margin (pro-rata).

Users are encouraged to monitor health proactively via the Nado app. With these liquidation mechanisms, Nado turns potential tempests into manageable swells – protecting capital while enabling confident trades.

***
