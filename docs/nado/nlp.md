# NLP

In decentralized finance, perpetual futures markets blend high potential with intense volatility.

Liquidity in altcoin pairs often lags behind major markets, fostering gaps in depth and efficiency that complicate trading. The Nado Liquidity Provider (NLP) aims to counter this within Nado's CLOB DEX, via a vault architecture that bolsters infrastructure and delivers yields to liquidity providers (LPs).

> NLP transforms USDT0 deposits from idle capital into active liquidity across the exchange.

Seamlessly embedded in Nado's orderbook, it directs LP capital toward bespoke vault strategies deployed across Nado’s perpetual markets. LPs accrue yield while narrowing spreads, enhancing order fill execution, and minimizing slippage.

For retail LPs or traders, the NLP offers a path to competitive APYs and better liquidity, turning altcoin volatility into shared platform strength.

***

### How NLP Works: From Deposit to Dynamic Yield

Under the hood, NLP operates as a federation of sub-vaults, each tied to a dedicated strategy and funding is allocated across these pools by predefined weights — overseen by weighted subaccounts

LP capital is distributed proportionally, with automated rebalancing – calculated off-contract to minimize proportional errors – occurring seamlessly during deposits and withdrawals to preserve equilibrium.

Yields are sourced from unrealized PnL from the vault strategy deployed in perpetual markets, harnessed through liquidations and market-making while prioritizing capital safeguards and swift redemptions over leveraged exposures.

> Users share equally in all PnLs, creating a diversified buffer that tempers volatility into more predictable passive income. As outcomes compound, user LP shares generate yield on USDT0 deposits proportional to the total share of LP capital deposited into the vault.

<figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-d798fc0daf95ca378eaf7c5e8007e825b82e6e30%2FDocs-5.png?alt=media" alt=""><figcaption></figcaption></figure>

To make the LP token pricing mechanism more accessible, consider it like determining the value of your portion of a shared pie where the size of each slice adjusts based on the pie’s total worth. Here's a step-by-step explanation:

* **Calculate Total Assets**: Begin with the total USDT0 deposited into the vault – this reflects the collective USDT0 contributions from all LPs.
* **Incorporate Unrealized PnLs**: Next, factor in the current estimated profits or losses from open perpetual positions. These "unrealized" values are calculated using up-to-date prices from oracle feeds, providing a realistic snapshot of ongoing trades without waiting for them to close.
* **Divide by Outstanding LP Tokens**: Finally, divide the combined total (assets plus unrealized PnLs) by the number of LP tokens in circulation. Each LP token reflects a proportional claim on this full value, much like dividing a pie amongst your friends.

This approach ensures transparency and equity. When you withdraw, you receive an amount based on the vault's value at that exact moment. It's a real-time reflection of performance.Withdrawals redeem at the current price, though a 4-day lock post-mint encourages long-term alignment, with burns available only after this period.

{% hint style="info" %}
A modest withdrawal fee guards against oracle latency: 1 USDT0 for sequencer costs, plus the greater of 1 USDT0 or 10 bps of the amount – redistributed to remaining providers as a shared incentive for long-term alignment.
{% endhint %}

***

### Key Features: What Powers the NLP

The NLP fuses institutional-grade strategies with seamless retail access, unlocking yields tailored to Nado's altcoin prowess. These innovations help amplify DEX liquidity, sparking a self-reinforcing loop where every deposit fuels better trades across the platform.

#### Accessible, Diversified Strategies

Sub-vaults are capable of deploying multiple approaches in parallel. Currently, only one vault is live for the Private Alpha — primarily utilizing a liquidations and maker spread strategy. All profit and loss (PnL) outcomes are aggregated and distributed proportionally across the vault, thereby promoting effective risk diversification and contributing to the overall stabilization of yields.

At the core of the system, strategies are calibrated to target perpetual futures contracts. By harnessing oracles for price feeds, the strategies can mitigate custody-related vulnerabilities – such as those arising from asset transfers or off-chain exposures.

Under the hood, a robust architecture of dedicated subaccounts function as specialized pools governed by weighted ownership structures.

Consider, for instance, allocations to institutional-grade traders specializing in market-making: these entities are empowered to execute orders on behalf of the pool, leveraging their expertise to generate alpha in real-time.

All ensuing profits – net of operational nuances – are then channeled back to LPs, accruing proportionally to each liquidity provider's share and fostering a collaborative ecosystem where individual contributions amplify collective gains.

> It is important to note that NLP vault yields are inherently variable, influenced by prevailing market conditions and the performance dynamics of the underlying strategies.

Moving forward, additional vaults with differing strategies can be added to the NLP to boost yield and provide more depth for altcoin perpetuals on the Nado orderbook.

#### USDT0-Only Simplicity

Deposits and redemptions are streamlined exclusively through USDT0, eliminating the complexities and distractions inherent in managing multiple assets. This singular focus creates a clean, predictable entry point for liquidity providers, allowing them to engage without the encumbrance of fragmented holdings or conversion overheads.

> **Important**: The value of the NLP position is capped at a maximum of 20,000 USDT0 per Nado trading account during the Private Alpha.
>
> For instance, if a user deposits 19,000 USDT0 and the position grows to 20,000 USDT0, they would reach the cap. Any changes to these caps will be communicated ahead of time and updated on the Nado app interface either during the Private Alpha or later.

#### Calibrated Risk Controls

Real-time oracle updates keep share prices sharp, with fees used as a latency buffer. Health gates enforce safe leverage, pausing withdrawals if needed for deleveraging. The vault's design ensures it cannot be liquidated – even in unhealthy states – allowing compounding to endure volatility without exposure to forced closures.

{% hint style="info" %}
NLP never liquidates spot assets, but NLP pool owners can trade spot assets, minimizing risks associated with custody and asset transfers. The NLP’s design, where the NLP cannot be liquidated even in an unhealthy state, allows compounding to better endure volatility.
{% endhint %}

The 4-day lock post-mint fosters better longer-term commitment, balancing liquidity with stability.

#### Altcoin Liquidity Amplifier

The NLP strategically targets long-tail perpetual futures contracts – less active trading pairs characterized by wider bid-ask spreads and shallower order book depths, where traditional liquidity provision often falls short.

The protocol's core advantage emerges by allocating capital to these altcoin pairs, where vault strategies actively contribute to improved liquidity and execution in those markets – helping to narrow spreads under more sustained book depth.

Additionally, the NLP helps accelerate new listings, bridging the gap between emerging assets and eager traders. Each USDT0 deposit into the vault acts as a catalyst, transforming idle capital into a dynamic way to enhance trading liquidity while returning yield.

***

### Navigating Volatility with Precision

In the perpetual landscape, where volatility unfolds with unyielding intensity, liquidity emerges as the defining differentiator – facilitating seamless order matching, reducing slippage, and enabling the precision required for sustained edge extraction.

> NLP democratizes access to these vault-caliber tactics for retail liquidity providers, delivering real yield for passive capital allocation.

A core tenet of NLP is its insulation from the perils of isolated leverage exposure, such as unanticipated liquidations that can erode individual positions. The vault's fortified architecture – bolstered by diversified sub-strategies – serves as a resilient intermediary.

Potential disruptions, whether from oracle discrepancies or transient strategy under-performance, are attenuated through layered fee structures and gating mechanisms that distribute impacts across the LP base, ensuring no single event overwhelms the system.

In summary, the NLP turns idle USDT0 deposits into more active capital on the platform, compounding yields and improving platform liquidity via market depth on less liquid altcoin pairs.

***
