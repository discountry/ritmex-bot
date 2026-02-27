# Oracles

Oracles are a cornerstone of Nado's market pricing, bridging off-chain market data to on-chain executions with speed, security, and risk intelligence – ensuring every trade, from spot fills to perpetual funding, reflects precise value without delay, distortion, or exploitation.

Oracle feeds update continuously via Nado's sequencer, bundling prices with actions for seamless on-chain settlement on the Ink L2 – minimizing gas and maximizing precision across Nado markets.

***

### How Nado's Oracle Model Works

Nado's oracles ingest prices from diverse, high-fidelity sources, aggregating them into tamper-resistant indexes that power critical functions like collateral valuation, liquidations, and funding rates.

> [Chaos Labs](https://chaoslabs.xyz/oracles) is the oracle provider powering Nado, delivering high-throughput and risk-aware price feeds for the Nado orderbook.

Chaos Protocol is a decentralized network of nodes that performs off-chain computations with advanced anomaly detection and outlier filtering, then pushes secure, real-time updates on-chain via EVM-compatible feeds tailored to Nado's products on Ink L2. This architecture treats data as an active risk variable, enabling circuit breakers to halt anomalous feeds and protect against manipulation – all while maintaining millisecond-level latency for seamless DEX operations.

#### Key Benefits

* **Low-Latency**: Chaos’ decentralized node network delivers WebSocket-driven updates rivaling TradFi speeds, minimizing stale prices and enabling real-time mark pricing without bottlenecks.
* **Robustness & Resilience**: Built-in anomaly detection and circuit breakers proactively identify and mitigate exploits, ensuring feeds remain resilient even in volatile or adversarial markets.
* **Cost-Efficiency**: Optimized aggregation reduces update overhead, supporting broad asset coverage without inflating gas costs on Ink L2.
* **Security & Decentralization**: A growing network of validators eliminates single points of failure, with zero-knowledge proofs for reserve validations and real-time risk parameter adjustments.
* **Risk Intelligence**: Beyond pricing, feeds incorporate dynamic risk signals for automated protocol tuning, enhancing solvency and capital efficiency.

***

### Price Feeds

Nado leverages Chaos Labs' Edge Price Oracles for three core feed types, each engineered for precision, performance, and market integrity. These feeds aggregate real-time price data from multiple sources including centralized and decentralized exchanges (CEXs / DEXs), with each source assigned a reliability-based weight.

> The system calculates a weighted median price (the 50th percentile by cumulative weight) rather than a simple average, providing superior resistance to outliers and manipulation.

Chaos Labs aggregates data from a minimum of 3 sources per feed (generally 5-7 for blue-chip assets like BTC and ETH, with exceptions per feed for coverage optimization). Each feed requires a minimum quorum of 3 valid sources to compute and publish. Prices are recomputed every 500ms, ensuring low-latency freshness. Validation layers – including staleness filtering, deviation detection, and the quorum requirement – are applied to ensure data integrity.

#### Source Selection & Weightings

Chaos Labs selects high-fidelity sources from top centralized exchanges (CEXs) and decentralized exchanges (DEXs), assigning reliability-based relative weights normalized to sum to 1.0. Weights are generally as follows, with exceptions applied per feed for asset-specific liquidity or coverage:

**CEXs (Primary Spot / Perp Venues):**

* **Binance**: 3/11 ≈ 0.27
* **Coinbase**: 3/11 ≈ 0.27
* **Bybit**: 2/11 ≈ 0.18
* **OKX**: 2/11 ≈ 0.18
* **Others** (Kraken, Gate, Bitget combined): 1/11 ≈ 0.09 (divided equally among them, ≈ 0.03 each)

**DEXs (Equal Weighting for DeFi Depth)**:

* **Uniswap** (and forks)
* **Curve** (and forks)
* **Hyperliquid**

{% hint style="info" %}
DEX weights are equally distributed (e.g., 1/3 ≈ 0.33 each if all three are active for a feed), blended with CEXs in the overall aggregation. This hybrid approach ensures broad market representation while prioritizing liquid venues.
{% endhint %}

#### Spot Oracle Prices

These benchmark underlying asset values from leading spot venues, using a weighted median of the last trade across USD / BUSD-paired exchanges like Binance, Coinbase, and Uniswap. Chaos Labs' anomaly algorithms filter noise in real-time, smoothing volatility for accurate collateral health scores and borrow limits.

> **Example**: For ETH / USD (a blue-chip feed using 6 sources), if Binance (weight: 0.27) quotes $3,000, Coinbase (0.27) $2,995, Bybit (0.18) $3,002, Uniswap (DEX, 0.17), and two others (combined 0.11) at $3,005 and $2,990, the weighted median at the 500ms recompute interval yields $3,000 – rejecting a spiked $3,100 outlier from a low-weight source to prevent inflated valuations, after passing staleness and deviation checks with a minimum quorum of 3 sources.

#### Perpetual Prices

Tailored for Nado's perpetual markets, these feeds aggregate open interest-weighted prices from major perp venues (e.g., Binance Futures, Bybit), incorporating funding rate signals and liquidity depth. Chaos’ risk component auto-adjusts for imbalances, ensuring fair settlement without premium decay distortions.

> **Example**: In a BTC-PERP with $2B open interest skewed long (using 7 sources for this blue-chip feed), the feed blends prices from high-reliability venues like Binance ($60,000, weight: 0.27), Coinbase ($59,990, 0.27), Bybit ($60,010, 0.18), Hyperliquid (DEX, equal weight ≈ 0.08), and others (combined 0.20), yielding a weighted median index of $59,980 every 500ms – triggering a +0.02% funding rate to balance positions, validated by deviation detection and a minimum quorum of 3 sources.

#### Mark Price

Nado's fair-value anchor for risk management, this weighted median-derived mid-price from orderbook depth (top 2% bids / asks) across spot and perp sources provides a manipulation-resistant reference for liquidations and PnL. Chaos Labs' circuit breakers pause updates if deviations exceed 1%, safeguarding against flash crashes.

> **Example**: In a thin ETH book with weighted median mid-price at $3,000 (from spot sources like Coinbase $2,990 weight: 0.27 and perp like Bybit $3,010 weight: 0.18, plus DEXs and others totaling 0.55; using 5 sources), versus spot $2,990, a -0.01% funding applies to your 10x long on $30,000 notional – crediting $3 hourly to offset a 1% dip's $300 loss, netting -$297 and preserving your edge in flux, after staleness filtering confirms all sources are within the 500ms recompute interval and quorum of at least 3 is met.

Nado’s oracle model turns market signals into actionable clarity – robust, rapid, and resilient.

***
