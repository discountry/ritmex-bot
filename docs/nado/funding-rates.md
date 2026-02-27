# Funding Rates

Funding rates are a core feature of perpetual contracts on Nado, designed to keep the price of the contracts closely aligned with the underlying spot price of the asset, even though perpetuals have no expiration date.

Unlike traditional futures, which naturally converge to spot prices as expiry approaches, perpetuals rely on funding rates to achieve this balance. These rates represent small, periodic payments exchanged between long and short positions – longs pay shorts when the perpetual price exceeds the spot price (positive rate), and shorts pay longs in the opposite case (negative rate).

> The funding rate mechanism encourages trading activity that pulls prices back toward equilibrium, ensuring fair and efficient markets.

On Nado, funding rates settle every hour and are proportional to your position's notional value – meaning the full size of the trade, not just your margin. Rates are displayed in real-time on the trading terminal and are capped at 2% per day to avoid excessive swings.

By incorporating funding rates into your strategy, you can anticipate holding costs or potential rebates on open positions, turning what might seem like a minor detail into a key factor for long-term trades.

***

### How Funding Rates Work

Nado calculates funding rates using a transparent formula that compares the perpetual contract's mark price to the spot index price, sourced from third-party oracles. This difference, known as the funding index, determines the rate paid or received at each funding interval.

The goal is to mimic the natural price convergence of expiring contracts, but continuously, fostering balanced liquidity without fixed deadlines.

#### Key Components

* **Spot Index Price**: An aggregated benchmark from major exchanges (Binance, Coinbase Pro, Kraken) via the Stork oracle network. It uses a median of real-time prices to resist manipulation, providing a stable reference for the asset's true market value.
* **Perpetual Mark Price**: A time-weighted average price (TWAP) calculated from Nado's orderbook over the funding interval. This reflects on-chain trading activity without relying solely on external oracles, ensuring accuracy tied to actual liquidity.
* **Funding Interval**: Payments occur hourly, on the hour, between all open positions in the market. This frequent adjustment keeps deviations minimal.
* **Calculation Formulas**:

$$
\text{Funding Index} = \frac{\text{TWAP(mark price)} - \text{TWAP(spot\_index)}}{\text{TWAP(spot\_index)}}
$$

$$
\text{Hourly Funding Rate} = \frac{\text{funding\_index}}{24}
$$

$$
\text{Annualized Funding} = \text{funding\_index} \times 365
$$

> **Payment Mechanics**: The rate applies to the notional value of your position. For example, a 0.01% hourly rate on a $10,000 notional long means paying (or receiving) $1 that hour, impacting a user’s unsettled USDT0. No platform fees are involved – it's a direct transfer between longs and shorts.

These components work together like a thermostat in a room: the index detects temperature (price) deviations from the set point (spot), and the rate adjusts the "heat" (incentives) to restore balance, operating smoothly in the background.

***

### Positive Funding Rates

A positive funding rate occurs when the perpetual mark price trades above the spot index price, indicating stronger demand for longs. In this scenario, holders of long positions pay shorts, which discourages excessive bullishness and encourages shorts to enter, gradually pushing the perpetual price down toward spot levels.

> This dynamic is common in bullish markets, where optimism drives perps higher. The funding rate acts as a counterbalance, rendering extended long positions more expensive while rewarding shorts for providing liquidity.

**Example**: Suppose ETH's spot index price is $3,000, but Nado's ETH perpetual mark price is $3,030 (a 1% premium). This yields a positive funding rate of +0.01% per hour (or about 3.65% annualized).

* Alice holds a long position of 10 ETH perpetuals, with a notional value of $30,300 (10 × $3,030).
* Alice’s initial margin is $3,030 (10x leverage).
* At settlement, Alice pays shorts: 0.01% of $30,300 = $3.03 for the hour.

Over 24 hours, this totals about $72.72, subtracted from Alice’s collateral.

If ETH rises 2% during the day (to $3,060 spot), Alice’s position gains $606 in PnL. Subtracting the $72.72 funding cost, and Alice’s net gain is $533.28 – a meaningful reduction in PnL for holding the position over extended periods.

In contrast, a short position of the same size would receive that $72.72 funding rate payment, boosting their returns as the premium unwinds. Historically, such rates can persist for weeks during a market uptrend, so monitoring the funding rates helps decide whether to close, hedge, or flip to short for the rebate.

***

### Negative Funding Rates

When the perpetual mark price falls below the spot index price, the funding rate turns negative, meaning shorts pay longs. This setup counters bearish pressure by rendering short positions more costly to keep open, attracting longs to buy the "discount" and lift prices back up.

> Negative rates often emerge in market downtrends or when spot sentiment outpaces perpetuals, providing a subtle boost to longs and a reminder for shorts to reassess.

**Example**: Now, ETH's spot index is $3,000, but the perpetual mark is $2,970 (a 1% discount), resulting in a -0.01% hourly rate.

* Alice’s Long Position: 10 ETH perpetuals, notional $29,700 (10 × $2,970).
* Initial Margin: $2,970 (10x leverage).
* Shorts Pay Alice: 0.01% of $29,700 = $2.97 for the hour.
* Daily Total: about $71.28 added to Alice’s collateral.

If ETH drops 2% (to $2,940 spot), Alice’s position loses $594 in PnL. The $71.28 funding receipt softens this to a net loss of $522.72. For a short of the same size, they'd pay out $71.28, compounding their costs in a falling market.

In extended bear phases – where negatives have lasted months – this can turn defensive longs into earners, offsetting volatility and rewarding patience.

Funding rates evolve with open interest and market sentiment, so make sure to review them in Nado's trading terminal before entering trades. By factoring in funding rates, traders can align their strategies with these built-in incentives, enhancing precision across spot, perps, and beyond.

***
