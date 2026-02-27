# Order Types

Nado equips traders with a streamlined set of order types to navigate volatility with precision – executing at market speed or guarding edges with calculated triggers. Available across spot and perpetuals, these integrate seamlessly with the orderbook, ensuring fills that align with your strategy without excess complexity.

***

### Market Order

Executes immediately at the best available price in the orderbook. Ideal for quick entries or exits in liquid markets, where speed of execution beats exact pricing. Slippage is minimized by deep liquidity, but monitor thin books to avoid wider spreads.

> **Example**: You're bullish on ETH during a sudden rally and want to buy 1 ETH right now. Place a market buy order – it fills instantly at the current ask price of $2,500, even if it slips slightly to $2,510 in a fast-moving market.

### Limit Order

Place a buy or sell at a specific price or better, resting in the orderbook until matched. Provides control over entry / exit points – buy below current price, sell above – for strategies like scaling in or taking profits. Makers are charged lower fees, rewarding patience.

> **Example**: ETH is trading at $2,500, but you believe it'll dip before rising. Set a limit buy order for 1 ETH at $2,450 or lower. If the price drops and hits your level, it executes automatically; otherwise, it sits until conditions align, earning you maker rebates if filled.

### Stop Market Order

Triggers a market order once the asset hits a predefined stop price, converting to immediate execution. Use to limit losses (stop-loss) or chase breakouts (stop-buy). In turbulent swings, it activates swiftly via oracle feeds, protecting capital without manual intervention.

> **Example**: You hold a long position in BTC at $60,000 and want to cap losses at 5%. Set a stop market sell order at $57,000. If BTC crashes to that level, it triggers a market sell, closing your position at the next available price (say, $56,900) to stem further downside.

### Stop Limit Order

Triggers a limit order at a stop price, then executes only at your specified limit or better, combining protection with price discipline. For example, sell if price drops to $50 (stop), but only at $49.50 or higher (limit). Stop-limit orders shield against price gaps while avoiding poor fills in fast markets.

> **Example**: Short on SOL at $150, you set a stop limit buy at $160 (stop) with a limit of $162. If SOL surges to $160, it places a limit buy order at $162 or less. This locks in profits if it retraces slightly, but skips execution if it gaps wildly above $162.

### TWAP (Time-Weighted Average Price)

TWAP orders slice a large order into smaller chunks executed evenly over a set duration, averaging the price to reduce market impact. Perfect for institutional volumes or gradual accumulations – specify time window and total size, and Nado handles the cadence.

TWAP orders lower slippage in volatile sessions, preserving your edge.

> **Example**: You want to accumulate 100 ETH over the next hour without spiking the price from $2,500. Set a TWAP buy for 100 ETH over 60 minutes – it breaks into \~1.67 ETH chunks every minute, averaging your entry at $2,505 despite intra-hour swings between $2,490 and $2,520.

### Scaled Orders (Coming Soon)

Deploys a ladder of limit orders across a predefined price range, with customizable price and size distributions for staggered, gradual execution. Ideal for scaling into or out of trades amid volatility, reducing slippage and averaging fills over multiple levels. Select flat, increasing, or decreasing price distribution, paired with even split, increasing, or decreasing size distribution; anchor to current market price.

Configure with Fill-or-Kill (FoK) or Immediate-or-Cancel (IOC) behavior, or allow partial fills.

> **Example**: ETH trades at $3,000; you aim to buy 10 ETH on a potential dip without rattling the book. Set a scaled buy for 10 ETH over $2,950–$2,900 (5 even orders of 2 ETH). As price falls to $2,940, the lowest fills first at $2,900; further drops trigger the rest, netting an average entry of \~$2,920 versus a single large limit's impact.

***

{% hint style="info" %}
To promote fair and orderly markets while protecting liquidity providers from ultra-low-latency predatory strategies, Nado applies a fixed 30 ms speed bump to all non-post-only orders (i.e., any aggressive order that would immediately cross and take liquidity from the book).

* Post-only orders (limit orders explicitly flagged as post-only) are exempt and execute with zero added latency.
* The 30 ms delay is currently uniform across all accounts and trading tiers.
* Future updates may introduce tiered speed-bump adjustments based on maker volume, NLP participation, or other contribution metrics — details will be announced in advance.

This mechanism significantly reduces adverse selection risk for passive liquidity providers without materially impacting retail or legitimate high-frequency trading strategies.
{% endhint %}

***
