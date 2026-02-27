# Query Markets & Products

In this section, we'll be going over fetching:

* State and config for all markets & products.
* Latest market price for one product.
* Market liquidity for one product (i.e. amount of liquidity at each price tick).

For all available queries, consult the [API reference](https://nadohq.github.io/nado-typescript-sdk/).

## All Markets Query

The `getAllEngineMarkets` function returns the state of all markets from our backend API, which reflects the state of the off-chain matching engine.

```typescript
// Fetches state from offchain sequencer 
const allMarkets = await nadoClient.market.getAllMarkets();
```

## Latest market price <a href="#latest-market-price" id="latest-market-price"></a>

The `getLatestMarketPrice` function returns the market price data of a single product given by its product id.

```typescript
const latestMarketPrice = await nadoClient.market.getLatestMarketPrice({
  productId: 1,
});
```

### Market liquidity <a href="#market-liquidity" id="market-liquidity"></a>

The `getMarketLiquidity` function returns the available liquidity at each price tick. The number of price levels for each side of the book is given by `depth`. For example, a depth of `2` will retrieve 2 levels of bids and 2 levels of asks. Price levels are separated by the `priceIncrement` of the market, given by the `getAllMarkets` query.

```typescript
const marketLiquidity = await nadoClient.market.getMarketLiquidity({
  productId: 1,
  depth: 2,
});
```

## Full example

```typescript
import {getNadoClient, prettyPrintJson} from './common';

async function main() {
  const nadoClient = await getNadoClient();

  const allMarkets = await nadoClient.market.getAllMarkets();
  prettyPrintJson('All Markets', allMarkets);

  const latestMarketPrice = await nadoClient.market.getLatestMarketPrice({
    productId: 1,
  });
  prettyPrintJson('Latest Market Price (Product ID 1)', latestMarketPrice);

  const marketLiquidity = await nadoClient.market.getMarketLiquidity({
    productId: 1,
    // Per side of the book
    depth: 2,
  });
  prettyPrintJson('Market Liquidity (Product ID 1)', marketLiquidity);
}

main();
```
