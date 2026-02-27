# Rate limits

## Overview

* Nado uses a weight-based rate-limiting system across queries and executes. We limit based on <mark style="color:red;">`IP address`</mark>, <mark style="color:red;">`Wallet address`</mark>, and a global <mark style="color:red;">`max # of orders per subaccount per market`</mark>.
* These limits equally apply to both <mark style="color:red;">`http`</mark> requests and <mark style="color:red;">`Websocket`</mark> messages.
* Limits are applied on a <mark style="color:red;">`1 minute`</mark> and <mark style="color:red;">`10 seconds`</mark> basis.

## Limits

* IP addresses have a max weight limit of <mark style="color:red;">`2400`</mark> per minute or <mark style="color:red;">`400`</mark> every 10 seconds applied only to queries.
* Wallet addresses have a max weight limit of <mark style="color:red;">`600`</mark> per minute or <mark style="color:red;">`100`</mark> every 10 seconds applied only to executes.
* Users can have up to <mark style="color:red;">`500`</mark> open orders per subaccount per market.
* Orders have the following additional limits:
  * Place orders (with spot leverage): up to <mark style="color:red;">`600`</mark> per minute or <mark style="color:red;">`100`</mark> every 10 seconds across all markets.
  * Place orders (without spot leverage): up to <mark style="color:red;">`30`</mark> per minute or <mark style="color:red;">`5`</mark> every 10 seconds across all markets. **Note**: orders without spot leverage are <mark style="color:red;">`20x`</mark> more expensive to place due to additional health checks needed.
  * Order cancellations: up to <mark style="color:red;">`600`</mark> per minute or <mark style="color:red;">`100`</mark> every 10 seconds.

## Query Weights

Queries are rate-limited based on IP. The following weights are applied per query:

* [**Status**](https://docs.nado.xyz/developer-resources/api/gateway/queries/status): <mark style="color:red;">`IP weight = 1`</mark>
* [**Contracts**](https://docs.nado.xyz/developer-resources/api/gateway/queries/contracts): <mark style="color:red;">`IP weight = 1`</mark>
* [**Nonces**](https://docs.nado.xyz/developer-resources/api/gateway/queries/nonces): <mark style="color:red;">`IP weight = 2`</mark>
* [**Order**](https://docs.nado.xyz/developer-resources/api/gateway/queries/order)**:** <mark style="color:red;">`IP weight = 1`</mark>
* [**Orders**](https://docs.nado.xyz/developer-resources/api/gateway/queries/orders): <mark style="color:red;">`IP weight = 2 * product_ids.length`</mark>
* [**Subaccount Info**](https://docs.nado.xyz/developer-resources/api/gateway/queries/subaccount-info): <mark style="color:red;">`IP weight = 2`</mark> (or <mark style="color:red;">`10`</mark> with `txns`, or <mark style="color:red;">`15`</mark> with `txns` + `pre_state="true"`)
* [**Isolated Positions**](https://docs.nado.xyz/developer-resources/api/gateway/queries/isolated-positions): <mark style="color:red;">`IP weight = 10`</mark>
* [**Market Liquidity**](https://docs.nado.xyz/developer-resources/api/gateway/queries/market-liquidity): <mark style="color:red;">`IP weight = 1`</mark>
* [**Symbols**](https://docs.nado.xyz/developer-resources/api/gateway/queries/symbols): <mark style="color:red;">`IP weight = 2`</mark>
* [**All Products**](https://docs.nado.xyz/developer-resources/api/gateway/queries/all-products): <mark style="color:red;">`IP weight = 5`</mark>
* [**Edge All Products**](https://docs.nado.xyz/developer-resources/api/gateway/queries/edge-all-products): <mark style="color:red;">`IP weight = 5`</mark>
* [**Market Prices**](https://docs.nado.xyz/developer-resources/api/gateway/queries/market-prices)**:** <mark style="color:red;">`IP weight = product_ids.length`</mark>
* [**Max Order Size**](https://docs.nado.xyz/developer-resources/api/gateway/queries/max-order-size)**:** <mark style="color:red;">`IP weight = 5`</mark>
* [**Max Withdrawable**](https://docs.nado.xyz/developer-resources/api/gateway/queries/max-withdrawable)**:** <mark style="color:red;">`IP weight = 5`</mark>
* [**Max NLP Mintable**](https://docs.nado.xyz/developer-resources/api/gateway/queries/max-nlp-mintable)**:** <mark style="color:red;">`IP weight = 20`</mark>
* [**Max NLP Burnable**](https://docs.nado.xyz/developer-resources/api/gateway/queries/max-nlp-burnable)**:** <mark style="color:red;">`IP weight = 20`</mark>
* [**NLP Pool Info**](https://docs.nado.xyz/developer-resources/api/gateway/queries/nlp-pool-info)**:** <mark style="color:red;">`IP weight = 20`</mark>
* [**NLP Locked Balances**](https://docs.nado.xyz/developer-resources/api/gateway/queries/nlp-locked-balances)**:** <mark style="color:red;">`IP weight = 20`</mark>
* [**Health Groups**](https://docs.nado.xyz/developer-resources/api/gateway/queries/health-groups)**:** <mark style="color:red;">`IP weight = 2`</mark>
* [**Linked Signer**](https://docs.nado.xyz/developer-resources/api/gateway/queries/linked-signer)**:** <mark style="color:red;">`IP weight = 5`</mark>
* [**Insurance**](https://docs.nado.xyz/developer-resources/api/gateway/queries/insurance): <mark style="color:red;">`IP weight = 2`</mark>
* [**Fee Rates**](https://docs.nado.xyz/developer-resources/api/gateway/queries/fee-rates)**:** <mark style="color:red;">`IP weight = 2`</mark>
* [**Assets**](https://docs.nado.xyz/developer-resources/api/v2/assets): <mark style="color:red;">`IP weight = 2`</mark>
* [**Orderbook**](https://docs.nado.xyz/developer-resources/api/v2/orderbook): <mark style="color:red;">`IP weight = 1`</mark>

## Archive (indexer) Weights

* Archive (indexer) queries are rate-limited based on IP.
* IP addresses have a max weight limit of <mark style="color:red;">`2400`</mark> per minute or <mark style="color:red;">`400`</mark> every 10 seconds.

The following weights are applied per query:

* [**Orders**](https://docs.nado.xyz/developer-resources/api/archive-indexer/orders)**:** <mark style="color:red;">`IP Weight = 2 + (limit * subaccounts.length / 20)`</mark>; where <mark style="color:red;">`limit`</mark> and <mark style="color:red;">`subaccounts`</mark> are query params.
* [**Matches**](https://docs.nado.xyz/developer-resources/api/archive-indexer/matches)**:** <mark style="color:red;">`IP Weight = 2 + (limit * subaccounts.length / 10)`</mark>; where <mark style="color:red;">`limit`</mark> and <mark style="color:red;">`subaccounts`</mark> are query params.
* [**Events**](https://docs.nado.xyz/developer-resources/api/archive-indexer/events)**:** <mark style="color:red;">`IP Weight = 2 + (limit * subaccounts.length / 10)`</mark>; where <mark style="color:red;">`limit`</mark> and <mark style="color:red;">`subaccounts`</mark> are query params.
* [**Candlesticks**](https://docs.nado.xyz/developer-resources/api/archive-indexer/candlesticks)**:** <mark style="color:red;">`IP Weight = 1 + limit / 20`</mark>; where <mark style="color:red;">`limit`</mark> is a query param.
* [**Edge Candlesticks**](https://docs.nado.xyz/developer-resources/api/archive-indexer/edge-candlesticks): <mark style="color:red;">`IP Weight = 1 + limit / 20`</mark>; where <mark style="color:red;">`limit`</mark> is a query param.
* [**Product Snapshots**](https://docs.nado.xyz/developer-resources/api/archive-indexer/product-snapshots)**:** <mark style="color:red;">`IP Weight = 10`</mark> for single `products` query, or <mark style="color:red;">`10 * timestamps.length`</mark> for multiple `product_snapshots` query with max\_time parameter
* [**Funding Rate**](https://docs.nado.xyz/developer-resources/api/archive-indexer/funding-rate)**:** <mark style="color:red;">`IP Weight = 2`</mark>
* [**Interest & funding payments**](https://docs.nado.xyz/developer-resources/api/archive-indexer/interest-and-funding-payments)**:** <mark style="color:red;">`IP Weight = 5`</mark>
* [**Oracle Price**](https://docs.nado.xyz/developer-resources/api/archive-indexer/oracle-price)**:** <mark style="color:red;">`IP Weight = 2`</mark>
* [**Oracle Snapshots**](https://docs.nado.xyz/developer-resources/api/archive-indexer/oracle-snapshots): <mark style="color:red;">`IP Weight = max((snapshot_count * product_ids.length / 100), 2)`</mark>; where snapshot\_count is <mark style="color:red;">`interval.count.min(500)`</mark>
* [**Perp Prices**](https://docs.nado.xyz/developer-resources/api/archive-indexer/perp-prices)**:** <mark style="color:red;">`IP Weight = 2`</mark> (includes both single `price` and multiple `perp_prices` queries)
* [**Market Snapshots**](https://docs.nado.xyz/developer-resources/api/archive-indexer/market-snapshots)**:** <mark style="color:red;">`IP Weight = max((snapshot_count * product_ids.length / 100), 2)`</mark>; where snapshot\_count is <mark style="color:red;">`interval.count.min(500)`</mark>
* [**Edge Market Snapshots**](https://docs.nado.xyz/developer-resources/api/archive-indexer/edge-market-snapshots): <mark style="color:red;">`IP weight = (interval.count.min(500) / 20) + (interval.count.clamp(2, 20) * 2)`</mark>
* [**Subaccounts**](https://docs.nado.xyz/developer-resources/api/archive-indexer/subaccounts)**:** <mark style="color:red;">`IP Weight = 2`</mark>
* [**Subaccount Snapshots**](https://docs.nado.xyz/developer-resources/api/archive-indexer/subaccount-snapshots): <mark style="color:red;">`IP Weight = 2 + (limit * subaccounts.length / 10)`</mark>; where <mark style="color:red;">`limit`</mark> and <mark style="color:red;">`subaccounts`</mark> are query params.
* [**Linked Signers**](https://docs.nado.xyz/developer-resources/api/archive-indexer/linked-signers): <mark style="color:red;">`IP Weight = 2`</mark>
* [**Linked Signer Rate Limit**](https://docs.nado.xyz/developer-resources/api/archive-indexer/linked-signer-rate-limit)**:** <mark style="color:red;">`IP Weight = 2`</mark>
* [**Isolated Subaccounts**](https://docs.nado.xyz/developer-resources/api/archive-indexer/isolated-subaccounts): <mark style="color:red;">`IP Weight = 2`</mark>
* [**Signatures**](https://docs.nado.xyz/developer-resources/api/archive-indexer/signatures): <mark style="color:red;">`IP Weight = 2 + len(digests) / 10`</mark>; where <mark style="color:red;">`digests`</mark> is a query param.
* [**Fast Withdrawal Signature**](https://docs.nado.xyz/developer-resources/api/archive-indexer/fast-withdrawal-signature): <mark style="color:red;">`IP Weight = 10`</mark>
* [**NLP Funding Payments**](https://docs.nado.xyz/developer-resources/api/archive-indexer/nlp-funding-payments): <mark style="color:red;">`IP Weight = 5`</mark>
* [**NLP Interest Payments**](https://docs.nado.xyz/developer-resources/api/archive-indexer/nlp-interest-payments): <mark style="color:red;">`IP Weight = 5`</mark>
* [**NLP Snapshots**](https://docs.nado.xyz/developer-resources/api/archive-indexer/nlp-snapshots): <mark style="color:red;">`IP Weight = limit.min(500) / 100`</mark>; where <mark style="color:red;">`limit`</mark> is a query param.
* [**Tx Hashes**](https://docs.nado.xyz/developer-resources/api/archive-indexer/tx-hashes): <mark style="color:red;">`IP Weight = idxs.length * 2`</mark>; where <mark style="color:red;">`idxs`</mark> is an array of submission indices (max 100).
* [**Liquidation Feed**](https://docs.nado.xyz/developer-resources/api/archive-indexer/liquidation-feed)**:** <mark style="color:red;">`IP Weight = 2`</mark>
* [**Sequencer Backlog**](https://docs.nado.xyz/developer-resources/api/archive-indexer/sequencer-backlog): <mark style="color:red;">`IP Weight = 1`</mark>
* [**Direct Deposit Address**](https://docs.nado.xyz/developer-resources/api/archive-indexer/direct-deposit-address): <mark style="color:red;">`IP Weight = 10`</mark>
* [**Quote Price**](https://docs.nado.xyz/developer-resources/api/archive-indexer/quote-price): <mark style="color:red;">`IP Weight = 2`</mark>
* [**Ink Airdrop**](https://docs.nado.xyz/developer-resources/api/archive-indexer/ink-airdrop): <mark style="color:red;">`IP Weight = 2`</mark>

## Execute Weights

Executes are rate-limited based on Wallet address. The following weights are applied per execute:

* [**Place order**](https://docs.nado.xyz/developer-resources/api/gateway/executes/place-order)**:**
  * With spot leverage: <mark style="color:red;">`Wallet weight = 1`</mark>
  * Without spot leverage: <mark style="color:red;">`Wallet weight = 20`</mark>
* [**Place orders**](https://docs.nado.xyz/developer-resources/api/gateway/executes/place-orders)**:**
  * With spot leverage: <mark style="color:red;">`Wallet weight = 1 per order`</mark>
  * Without spot leverage: <mark style="color:red;">`Wallet weight = 20 per order`</mark>
  * **Note**: 50ms processing penalty per request
* [**Cancel orders**](https://docs.nado.xyz/developer-resources/api/gateway/executes/cancel-orders)**:**
  * When no **digests** are provided: <mark style="color:red;">`Wallet weight = 1`</mark>
  * When **digests** are provided: <mark style="color:red;">`Wallet weight = total digests`</mark>
* [**Cancel Product Orders**](https://docs.nado.xyz/developer-resources/api/gateway/executes/cancel-product-orders)**:**
  * When no **productIds** are provide&#x64;**:** <mark style="color:red;">`Wallet weight = 50`</mark>
  * When **productIds** are provided: <mark style="color:red;">`Wallet weight = 5 * total productIds`</mark>
* [**Cancel And Place**](https://docs.nado.xyz/developer-resources/api/gateway/executes/cancel-and-place):
  * The sum of [Cancel orders](https://docs.nado.xyz/developer-resources/api/gateway/executes/cancel-orders) + [Place order](https://docs.nado.xyz/developer-resources/api/gateway/executes/place-order) limits
* [**Withdraw Collateral**](https://docs.nado.xyz/developer-resources/api/gateway/executes/withdraw-collateral)**:**
  * With spot leverage: <mark style="color:red;">`Wallet weight = 10`</mark>
  * Without spot leverage: <mark style="color:red;">`Wallet weight = 20`</mark>
* [**Liquidate Subaccount**](https://docs.nado.xyz/developer-resources/api/gateway/executes/liquidate-subaccount): <mark style="color:red;">`Wallet weight = 20`</mark>
* [**Mint NLP**](https://docs.nado.xyz/developer-resources/api/gateway/executes/mint-nlp): <mark style="color:red;">`Wallet weight = 10`</mark>
* [**Burn NLP**](https://docs.nado.xyz/developer-resources/api/gateway/executes/burn-nlp): <mark style="color:red;">`Wallet weight = 10`</mark>
* [**Link Signer**](https://docs.nado.xyz/developer-resources/api/gateway/executes/link-signer): <mark style="color:red;">`Wallet weight = 30`</mark>
  * Can only perform a max of 50 link signer requests every 7 days per subaccount.
* [**Transfer Quote:**](https://docs.nado.xyz/developer-resources/api/gateway/executes/transfer-quote) <mark style="color:red;">`Wallet weight = 10`</mark>
  * Can only transfer to a max of 5 new recipients within 24hrs.

## Trigger Service Limits

The trigger service has additional limits specific to conditional orders:

* **Pending trigger orders**: Max of <mark style="color:red;">`25`</mark> pending trigger orders per product per subaccount
* **TWAP orders**: Must use IOC execution type and cannot be combined with isolated margin
