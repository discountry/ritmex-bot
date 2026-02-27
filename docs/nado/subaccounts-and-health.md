# Subaccounts & Health

Subaccounts and health form the backbone of risk management on Nado, allowing traders to segment trading activities while maintaining a clear view of their overall exposure per each subaccount.

> Health is Nado's weighted measure of account stability, factoring in asset quality, volatility, and liquidity to determine your buffer against liquidations and capacity for new trades.

By default, subaccounts use unified margin for efficiency, but you can toggle isolated margin per position. Health calculations update in real-time via the on-chain risk engine, displayed as intuitive gauges in the Nado app. Green for safe sailing, red for imminent gales.

***

### Subaccounts

A subaccount is essentially a dedicated trading compartment tied to your main wallet address, enabling up to four subaccounts per address on Nado. Notably, the 4 subaccounts is the cap for users on the front-end, while API users have no limit on the number of subaccounts per wallet address.

> Subaccounts let you divide your wallet into up to four independent silos – each with its own balances, positions, and margin. Each subaccount operates autonomously.

#### Subaccount Naming

When working with Nado, subaccounts follow a specific naming convention:

* **`default`** - This is your main/primary subaccount. Every wallet address automatically has a "default" subaccount upon first interaction.
* **`default_1`** - Your first additional subaccount (automatically assigned when created)
* **`default_2`** - Your second additional subaccount
* **`default_3`** - Your third additional subaccount

{% hint style="info" %}
When you create additional subaccounts on the frontend, they are automatically assigned these sequential names (`default_1`, `default_2`, `default_3`). You can connect up to **4 subaccounts** simultaneously: `default` (main), `default_1`, `default_2`, and `default_3`.
{% endhint %}

Deposits, withdrawals, positions, and PnL remain fully isolated within it, ensuring a liquidation in one never affects the others. This structure protects diversified strategies – for instance, dedicating one subaccount to conservative spot holds and another to aggressive perpetual positions – while tying all to the same wallet address for independent oversight of each subaccount.

#### Key Benefits

* **Risk Isolation**: Limit fallout from volatile or riskier trades – only the subaccount's assets are at stake during liquidation.
* **Capital Efficiency**: Within each subaccount, unified margin pools resources across spot, perps, and money markets by default – maximizing capital efficiency.
* **Compounding Ease**: Unrealized PnL from winning trades automatically bolster the subaccount's margin, fueling further opportunities without manual transfers between accounts.
* **Flexibility**: Switch between cross- and isolated-margin modes per subaccount, adapting to strategy needs without disrupting the whole. Unified cross-margin is the default account type on Nado.

To create a subaccount, navigate to the Nado app’s account menu and assign a unique label or name for that specific subaccount. Of note, users are required to make an initial transfer for each subaccount in order for it to be created. Either deposits from the user’s wallet or transfers on Nado from an existing subaccount will work.

{% hint style="info" %}
Transfers between subaccounts are instant and incur a network fee: $1 USDT0 for standard transfers, or $0.10 USDT0 when either the sender or recipient is an isolated subaccount. For teams or advanced users, this mirrors a multi-account structure on centralized exchanges, but fully on-chain.
{% endhint %}

***

### Health

Health quantifies your subaccount's resilience, using weighted calculations to blend all assets and positions into a unified risk score. It accounts for variances like an asset's volatility (e.g., BTC vs. a stablecoin) or liquidity.

Low health signals more risk, a negative value on maintenance health triggers liquidation, and initial health gates new entries, preventing overextension.

There are two health thresholds:

1. **Maintenance Health**: Your liquidation buffer; if < 0, the subaccount risks partial or full close-out to protect the protocol.
2. **Initial Health**: Your available collateral; if < 0, you can't open new positions until collateral deposits restore it to a positive value.

In traditional terms, maintenance health approximates "USDT0 to liquidation," and initial health mirrors "free collateral." Weights adjust for these nuances. For example, stable assets get higher weights for more robust risk profiles, and volatile ones receive lower weights to reflect increased risk profiles.

#### Weight Parameters

Every product (spot tokens, perps) has four weights:

* **maintenance\_asset\_weight**: Discounts / rewards assets for maintenance health.
* **maintenance\_liability\_weight**: Penalizes liabilities (e.g., shorts) for maintenance.
* **initial\_asset\_weight**: Similar for initial health, often stricter.
* **initial\_liability\_weight**: Heightens scrutiny on borrowings.

These ensure balanced contributions. For example, a high-volatility token might have a 0.8 asset weight, meaning it counts as 80% of its value toward health.

#### Spot Health

Spot assets serve as Nado's primary collateral, powering trades across products. Their health is straightforward, reflecting value adjusted for stability.

$$
\text{Spot Health} = weight \times amount \times price
$$

**Example**

You hold 5 BTC in a subaccount, with BTC at $10,000.

**Weights**:

* maintenance\_asset\_weight = 0.9
* initial\_asset\_weight = 0.8

> **Initial Health** = 5 × $10,000 × 0.8 = $40,000

> **Maintenance Health** = 5 × $10,000 × 0.9 = $45,000

{% hint style="info" %}
With no positions, your $40,000 initial health means that much buying power for new trades. If BTC dips to $9,000, health recalculates to $36,000 initial – prompting a deposit if nearing zero.
{% endhint %}

#### Perpetual Health

Perpetuals introduce leverage, so health nets current value against entry costs, capturing unrealized PnL.

**Example** (**Short Position**)

You short 5 BTC-perps at entry / entry price $10,000, current $10,000.

**Weights**:

* maintenance\_asset\_weight = 0.95
* maintenance\_liability\_weight = 1.05
* initial\_asset\_weight = 0.9
* initial\_liability\_weight = 1.1

> **Initial Health** = -5 × $10,000 × 1.1 − (-5 × $10,000) = -$5,000

> **Maintenance Health** = -5 × $10,000 × 1.05 − (-5 × $10,000) = -$2,500

{% hint style="info" %}
This equates to 10x leverage (1 / (1 - 0.9) = 10). On other platforms, you'd see $5,000 initial margin and $2,500 maintenance – same thresholds, weighted for Nado's unified cross-margin. If BTC rises to $11,000, your short loses $5,000 PnL, dropping maintenance health further; a collateral deposit restores it.
{% endhint %}

#### Leverage Calculation

Nado's weights imply maximum leverage:

$$
\text{Leverage} = \frac{1}{1 - \text{initial\_asset\_weight}}
$$

{% hint style="info" %}
For BTC's 0.9 weight, that would be 10x max – scalable per asset, ensuring volatility-matched limits.
{% endhint %}

***

### Special Cases

#### Spreads

Spreads are offsetting positions on the same asset (e.g., long spot BTC, short BTC-PERP). The system recognizes spread trades as hedges, boosting your health beyond what the individual positions would provide.

> **Intuition**: If you're long spot BTC and short BTC-PERP, both positions move together. When BTC goes up, your spot gains but your perp loses. When BTC goes down, your spot loses but your perp gains. This hedging reduces risk, so the system gives you better health.

The spread health calculation follows this logic:

***

**Step 1: Calculate Basis Amount**

The basis amount is how much of your position is actually hedged (the overlapping part):

$$
\text{basis\_amount} = \begin{cases}
\min(\text{spot\_amount}, -\text{perp\_amount}) & \text{if spot\_amount} > 0 \\
-\max(\text{spot\_amount}, -\text{perp\_amount}) & \text{if spot\_amount} \leq 0
\end{cases}
$$

**Example 1 - Long Spot, Short Perp**:

```
Position: +2 wBTC spot, -3 BTC-PERP

Since spot_amount > 0:
  basis_amount = min(2, -(-3))
               = min(2, 3)
               = 2

Result: You have a spread of size 2 (the hedged portion)
        The remaining -1 BTC-PERP is a naked short
```

**Example 2 - Short Spot, Long Perp**:

```
Position: -5 wBTC spot, +3 BTC-PERP

Since spot_amount < 0:
  basis_amount = -max(-5, -3)
               = -(-3)
               = 3

Result: You have a spread of size 3 (the hedged portion)
        The remaining -2 wBTC spot is a naked short
```

***

**Step 2: Calculate Existing Weight**

This is the average penalty already applied to your positions (before considering the spread benefit):

$$
\text{existing\_weight} = \frac{\text{spot\_long\_weight} + \text{perp\_long\_weight}}{2}
$$

**Example** (using 20x leverage BTC):

```
spot_long_weight = 0.95 (for 20x leverage)
perp_long_weight = 0.95 (for 20x leverage)

existing_weight = (0.95 + 0.95) / 2 = 0.95
```

***

**Step 3: Calculate Spread Weight**

The spread weight gives you better treatment than individual positions. It's calculated from the underlying product weights:

**Base Spread Weight**:

$$
\text{spread\_weight} = 1 - \frac{1 - \text{product\_weight}}{5}
$$

Where product\_weight is:

* **If spot\_amount > 0** (long spot, short perp): Use perp\_long\_weight
* **If spot\_amount ≤ 0** (short spot, long perp): Use spot\_long\_weight

**Spread Weight Caps** (to manage extreme leverage):

* **Initial health**:

$$
\text{spread\_weight} = \min(\text{spread\_weight}, 0.99)
$$

* **Maintenance health**:

$$
\text{spread\_weight} = \min(\text{spread\_weight}, 0.994)
$$

**Example** (using 20x leverage):

```
perp_long_weight = 0.95

Base spread_weight = 1 - (1 - 0.95) / 5
                   = 1 - 0.05 / 5
                   = 1 - 0.01
                   = 0.99

Since 0.99 equals the cap, no adjustment needed.
Final spread_weight = 0.99
```

***

**Step 4: Calculate Spread Health Contribution**

$$
\text{spread\_health\_increase} = \text{basis\_amount} \times (\text{spot\_price} + \text{perp\_price}) \times (\text{spread\_weight} - \text{existing\_weight})
$$

**Complete Example**:

```
Position: +2 wBTC spot, -3 BTC-PERP
BTC spot price: $90,000
BTC perp price: $90,000
Both at 20x leverage (long_weight = 0.95)

Step 1 - Basis Amount:
  basis_amount = min(2, 3) = 2

Step 2 - Existing Weight:
  existing_weight = (0.95 + 0.95) / 2 = 0.95

Step 3 - Spread Weight:
  spread_weight = 1 - (1 - 0.95) / 5 = 0.99

Step 4 - Health Increase:
  spread_health_increase = 2 × ($90,000 + $90,000) × (0.99 - 0.95)
                         = 2 × $180,000 × 0.04
                         = $14,400 extra health!

What this means:
  - Without spread benefit: Each position uses weight 0.95
  - With spread benefit: The overlapping 2 BTC uses effective weight 0.99
  - You gain $14,400 in health, allowing more leverage on the spread
```

**Key Takeaway**: Spreads give you better health (higher effective weight) because both legs move together, reducing risk. The system recognizes this and gives you \~5x more leverage on the hedged portion!

***

**High-Leverage Example (Spread Weight Cap)**

At very high leverage, the spread weight caps become active. Suppose you have 50x leverage positions:

```
Position: +1 wBTC spot, -1 BTC-PERP
BTC spot price: $90,000
BTC perp price: $90,000
Both at 50x leverage (long_weight = 0.98)

Step 1 - Basis Amount:
  basis_amount = min(1, 1) = 1

Step 2 - Existing Weight:
  existing_weight = (0.98 + 0.98) / 2 = 0.98

Step 3 - Spread Weight (INITIAL HEALTH):
  Natural calculation: spread_weight = 1 - (1 - 0.98) / 5
                                      = 1 - 0.02 / 5
                                      = 1 - 0.004
                                      = 0.996

  But 0.996 > 0.99 (initial health cap)
  Final spread_weight = 0.99 (CAPPED!)

Step 3 - Spread Weight (MAINTENANCE HEALTH):
  Same natural calculation: 0.996

  But 0.996 > 0.994 (maintenance health cap)
  Final spread_weight = 0.994 (CAPPED!)

Step 4 - Health Increase:
  Initial health boost = 1 × ($90,000 + $90,000) × (0.99 - 0.98)
                       = $180,000 × 0.01
                       = $1,800

  Maintenance health boost = 1 × ($90,000 + $90,000) × (0.994 - 0.98)
                          = $180,000 × 0.014
                          = $2,520

What this means:
  - At 20x leverage (weight 0.95): Natural spread_weight = 0.99, no capping needed
  - At 50x leverage (weight 0.98): Natural spread_weight = 0.996, gets capped to 0.99/0.994
  - The caps prevent excessive leverage on spreads while still providing significant benefit
  - You still get improved health, but the benefit is limited at extreme leverage levels
```

{% hint style="info" %}
Notably, health is calculated by applying the penalty first as if there is no spread, then increasing health for all the spread pairs. The existing penalty means the already applied health deduction when no spread is taken into account.
{% endhint %}

With these tools, Nado turns complexity into clarity, letting you navigate markets with measured confidence.

***
