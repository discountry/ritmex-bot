# Orderbook Architecture

Nado harnesses DeFi's turbulent energy into a unified edge, fusing CEX speed with on-chain sovereignty on Ink L2. Its architecture integrates spot, perpetuals, and money markets into one risk-calibrated engine. The orderbook delivers 5–15 ms latency, MEV-proof executions, and superior capital efficiency – fueling Ink L2's premier liquidity hub.

At its core, Nado's design rests on two interlocking pillars:

1. **A protocol-level clearinghouse and risk engine housed on-chain.**
2. **A powerful off-chain sequencer – the central-limit orderbook (CLOB).**

<figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-c5adffcf6a28dee280bd7f573283a4a0a836ecb7%2FDocs-3.png?alt=media" alt=""><figcaption></figcaption></figure>

Threaded through Ink's EVM-compatible rails, the two pillars form a low-latency CLOB DEX where every order converges with exacting precision.

***

### The Nado Orderbook

In decentralized exchanges (DEXs) like Nado, an orderbook is the core engine powering trades. It acts like a real-time marketplace ledger, listing all open buy orders (bids) from users willing to purchase assets at specific prices and sell orders (asks) from those ready to sell.

These orders are stacked by prices:

* **Bids**: Increase as you go lower (deeper discounts for buyers)
* **Asks**: Rise higher (premiums for sellers).

This creates a transparent view of supply and demand, enabling efficient matching of trades without intermediaries.

<div data-full-width="false"><figure><img src="https://1830223543-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FAF0FfquYfYpmCNhlEvb9%2Fuploads%2Fgit-blob-860bf4d5bffc73156e2e21c42313f7d32f95ac79%2FDocs-1.png?alt=media" alt=""><figcaption></figcaption></figure></div>

The depth chart visual above illustrates this dynamically:<br>

* **Green Side** (left): Represents bids – buy orders below the current market price. Denser green bands indicate stronger buying interest and liquidity at those levels, meaning large trades can execute with minimal price slippage.
* **Red Side** (right): Shows asks – sell orders above the market price. Thicker red areas signal robust selling pressure and depth.
* **Center** (mid-price line): The equilibrium point, calculated as the average of the highest bid and lowest ask. It's where the market "balances" and most trades occur.

Mid-book depth zooms in on liquidity around this mid-price – the heart of the orderbook. It measures how much volume (in assets or value) sits just on either side, showing market resilience.

Deeper mid-book (denser dots / bands near the center) means the DEX can handle bigger trades smoothly, reducing volatility. In Nado, this depth ensures fair, slippage-resistant trades, even in volatile crypto conditions.

***

### On-Chain Clearinghouse – Calibrated Control

Every position breathes through Nado's on-chain clearinghouse – a vigilant hub that computes exposures, collaterals, and offsets in real-time. Unified cross-margin spans your portfolio where liabilities net out intuitively across spot, leverage, and borrows.

Oracle feeds pulse sub-second, triggering liquidations only when thresholds breach. Orders submitted to the sequencer are batched and submitted on-chain, starving MEV opportunities and letting your trading signal cut clean through the noise.

***

### Off-Chain Sequencer – Blistering Performance

Speed defines the strike. Nado's off-chain sequencer matches orders in 5–15 ms, then batches them for seamless on-chain settlement via Ink L2. As a central-limit orderbook (CLOB), it accepts limit orders through the intuitive front-end app or an HFT-optimized API, empowering automated, high-performance strategies.

The sequencer holds no custody: assets stay locked in on-chain smart contracts, under your sole control. It cannot censor trades or forge signatures – all settlements, from withdrawals to liquidations, demand on-chain verification.

Millisecond latencies and periodic batching render MEV extraction uneconomical, shielding executions from front-running. Like an accelerator atop on-chain rails, the sequencer delivers CEX-grade matching without custody shadows.

Nado's design channels market flux into high-velocity execution – a decisive edge for traders.

***

### Nado’s Horizon: The Perfect Convergence

Nado's technical stack unifies liquidity across products, its capital efficiency turns portfolios into weapons, and the Ink L2 offers sub-second finality.

Battle-tested on chains past amidst cycles of DeFi’s volatility, and now re-engineered for Ink's frontier, Nado delivers the tools for traders to outperform the market.

***
