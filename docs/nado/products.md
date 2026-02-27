# Products

### Spot Trading

To get started, deposit supported collaterals such as USDT0 or wETH into your unified account. These assets serve as margin, enabling up to 5x leverage on spot positions for amplified exposure without needing separate approvals.

For example, you can swap wETH for USDT0 seamlessly or open a leveraged long on wETH using your USDT0 balance.

> Capital efficiency is core to Nado's design. All deposits earn automatic native yields, compounded from platform fees and lending activity.

Unlike traditional DEXs with isolated pools, Nado unifies liquidity across products, so your spot holdings can directly offset risks in perpetuals or fund borrows from money markets. This turns spot trading into a strategic anchor – borrow to scale positions or hedge against perpetuals for balanced plays – all within one account.

***

### Perpetual Trading <a href="#docs-internal-guid-a1f1ab1b-7fff-c941-639a-2f97764e2a1d" id="docs-internal-guid-a1f1ab1b-7fff-c941-639a-2f97764e2a1d"></a>

Perpetual futures on Nado let you go long or short on assets like BTC, ETH, SOL, BNB, and XRP with up to 20x leverage and USDT0 settlement.

Positions are funded through your unified margin system, where the entire portfolio, including spot holdings, borrows, and other open perp positions, nets against exposures in real time. A long wETH spot position, for instance, can collateralize a short SOL perp, reducing overall risk and freeing up capital.

> Basis trading is streamlined where users can open a spot-perp pair directly to capture convergence opportunities, executing delta-neutral strategies without bridging assets or managing multiple interfaces. This simplifies complex setups, like funding rate arbitrage, into single, atomic trades.

All perps benefit from MEV protections and oracle-based pricing to prevent manipulation, ensuring fair execution amid market swings.

***

### Money Markets

Nado's money markets enable lending, borrowing, and yield accrual, intertwined with your trades for frictionless efficiency.

Lenders supply USDT0 or wETH to the pool, earning a proportional share of borrower interest as passive yield on idle assets. Borrowers access spot collateral-backed loans at dynamic rates shaped by supply and demand – rates rise with borrowing pressure to curb excess, and they fall amid liquidity abundance to spur activity.

> All loans remain overcollateralized via smart contracts: post crypto assets as collateral, held securely on-chain until repayment.

Unified margin nets exposures, so healthy spot or perp positions cover borrows without forced liquidations.

***

#### Dynamic Interest Rate Model <a href="#docs-internal-guid-08be47ef-7fff-bae8-0f4e-0d9fc1d262ec" id="docs-internal-guid-08be47ef-7fff-bae8-0f4e-0d9fc1d262ec"></a>

Nado's money markets use a dynamic interest rate model to adapt rates in real time to supply and demand, promoting balanced utilization and efficient capital flow.

Every 15 minutes, the system recalculates rates based on the utilization ratio (R), defined as the proportion of borrowed assets to the total available supply in the pool:

$$
R = \frac{\text{borrowed}}{\text{borrowed} + \text{available}}
$$

This frequent adjustment ensures rates respond swiftly to market shifts. As borrowing demand rises and R approaches 1, borrow rates climb to discourage over-leveraging, while deposit rates may dip to attract more liquidity. Conversely, when R falls (abundant supply), borrow rates decrease to incentivize uptake, and deposit rates rise to reward lenders.

For each spot product (e.g., wETH or USDT0), the model employs four tunable parameters to shape the rate curve:

* **small\_cap**: The utilization threshold below which rates remain flat at a minimal "floor" level, encouraging baseline borrowing without over-penalizing low demand.
* **large\_cap**: The high-utilization ceiling where rates plateau or escalate sharply to cap extreme borrowing.
* **floor**: The minimum borrow rate (as a percentage), setting a baseline cost even in low-demand scenarios.
* **inflection**: The pivot point where the curve bends from gradual to steeper increases, fine-tuning sensitivity around moderate utilization (typically 50 - 80%).

These parameters create a "kinked linear" curve for the optimal rate. It stays constant (at the floor) for R below small\_cap, then slopes linearly upward to the inflection point, accelerates more aggressively toward large\_cap, and caps thereafter.

This design prevents rates from stagnating at zero (discouraging idle capital) or spiking uncontrollably (avoiding liquidity crunches).

The final rates incorporate a protocol fee (interest\_fee = 0.2, or 20%) to sustain the platform:

$$
\text{Deposit Rate} = \text{Optimal Rate} \times (1 - \text{interest\_fee}) \left( \text{Lenders receive } 80% \text{ of the optimal rate as yield.} \right)
$$

$$
\text{Borrow Rate} = \frac{\text{Optimal Rate}}{1 - \text{interest\_fee}} \left( \text{Borrowers pay the full optimal rate} \right)
$$

Nado’s model fosters resilience by auto-balancing the pool, rewarding patient lenders with competitive yields, and keeping borrowing accessible without fixed hurdles. All while netting exposures across your unified account for seamless integration with spot and perpetual trades.

***

### Nado Liquidity Provider (NLP)

Nado's Liquidity Provider (NLP) transforms idle USDT0 into dynamic liquidity for perpetual markets, fueling tighter spreads and smoother executions across altcoin pairs. As a vault-based protocol embedded in the CLOB DEX, NLP channels deposits into diversified strategies that capture yields from liquidations and market-making — while netting risks in real-time for resilient capital efficiency. This complements money markets by extending passive income opportunities, turning volatility into shared platform strength without isolated leverage exposures.

At its core, NLP federates sub-vaults weighted by strategy, with automated rebalancing ensuring proportional allocations during deposits and withdrawals. Yields accrue from unrealized PnL in perpetual positions, aggregated equitably across LPs and reflected in real-time token pricing:

$$
\frac{\text{total assets} + \text{oracle-fed unrealized gains}}{\text{outstanding lp shares}}
$$

Withdrawals redeem at current value after a 4-day lock to align long-term commitment, buffered by a modest fee (1 USDT0 fixed plus the greater of 1 USDT0 or 10 bps) that redistributes to holders and guards against oracle latency.

> Capped at 20,000 USDT0 per account during Private Alpha, this USDT0-only design strips away multi-asset friction, delivering clean, predictable access.

Key safeguards include health gates that pause outflows for deleveraging, non-liquidatable vaults to weather storms, and oracle-driven price fidelity — ensuring compounding endures without forced closures. Strategies target long-tail altcoins, liquidations, narrowing bid-ask gaps and accelerating new listings, while diversified subaccounts (like maker spreads) amplify depth without custody risks.

Variable yields, shaped by market dynamics, reward retail LPs with institutional-grade alpha, creating a virtuous cycle: every deposit enhances liquidity, compounding returns and precision for all traders on Nado.

***

### The Edge Converges

Nado's products form a cohesive ecosystem – fully integrated at the protocol level for seamless capital efficiency, not bolted-on features. Unified liquidity aggregates depth across spot, perpetuals, and money markets, reducing slippage and enabling reliable fills even in thin conditions.

Cross-margining treats your entire portfolio as collateral, netting exposures to free up funds and minimize over-collateralization.

On Nado, portfolios become precision tools.

***
