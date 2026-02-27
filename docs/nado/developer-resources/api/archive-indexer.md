# Archive (indexer)

Using Nado's indexer API you can access historical data in the platform as it is processed by our offchain sequencer. This includes: trading activity, events, candlesticks and more.

You can interact with our indexer by sending <mark style="color:red;">`HTTP`</mark> requests at <mark style="color:red;">`POST [ARCHIVE_ENDPOINT]`</mark> alongside a json payload of the query. Endpoints:

<mark style="color:red;">`HTTP`</mark> requests must set the `Accept-Encoding` to include `gzip`, `br` or `deflate`

## Endpoints

### Testnet:

* <mark style="color:red;">`https://archive.test.nado.xyz/v1`</mark>

## Available Queries:

{% content-ref url="archive-indexer/orders" %}
[orders](https://docs.nado.xyz/developer-resources/api/archive-indexer/orders)
{% endcontent-ref %}

{% content-ref url="archive-indexer/matches" %}
[matches](https://docs.nado.xyz/developer-resources/api/archive-indexer/matches)
{% endcontent-ref %}

{% content-ref url="archive-indexer/events" %}
[events](https://docs.nado.xyz/developer-resources/api/archive-indexer/events)
{% endcontent-ref %}

{% content-ref url="archive-indexer/candlesticks" %}
[candlesticks](https://docs.nado.xyz/developer-resources/api/archive-indexer/candlesticks)
{% endcontent-ref %}

{% content-ref url="archive-indexer/edge-candlesticks" %}
[edge-candlesticks](https://docs.nado.xyz/developer-resources/api/archive-indexer/edge-candlesticks)
{% endcontent-ref %}

{% content-ref url="archive-indexer/product-snapshots" %}
[product-snapshots](https://docs.nado.xyz/developer-resources/api/archive-indexer/product-snapshots)
{% endcontent-ref %}

{% content-ref url="archive-indexer/funding-rate" %}
[funding-rate](https://docs.nado.xyz/developer-resources/api/archive-indexer/funding-rate)
{% endcontent-ref %}

{% content-ref url="archive-indexer/interest-and-funding-payments" %}
[interest-and-funding-payments](https://docs.nado.xyz/developer-resources/api/archive-indexer/interest-and-funding-payments)
{% endcontent-ref %}

{% content-ref url="archive-indexer/oracle-price" %}
[oracle-price](https://docs.nado.xyz/developer-resources/api/archive-indexer/oracle-price)
{% endcontent-ref %}

{% content-ref url="archive-indexer/oracle-snapshots" %}
[oracle-snapshots](https://docs.nado.xyz/developer-resources/api/archive-indexer/oracle-snapshots)
{% endcontent-ref %}

{% content-ref url="archive-indexer/perp-prices" %}
[perp-prices](https://docs.nado.xyz/developer-resources/api/archive-indexer/perp-prices)
{% endcontent-ref %}

{% content-ref url="archive-indexer/market-snapshots" %}
[market-snapshots](https://docs.nado.xyz/developer-resources/api/archive-indexer/market-snapshots)
{% endcontent-ref %}

{% content-ref url="archive-indexer/edge-market-snapshots" %}
[edge-market-snapshots](https://docs.nado.xyz/developer-resources/api/archive-indexer/edge-market-snapshots)
{% endcontent-ref %}

{% content-ref url="archive-indexer/subaccounts" %}
[subaccounts](https://docs.nado.xyz/developer-resources/api/archive-indexer/subaccounts)
{% endcontent-ref %}

{% content-ref url="archive-indexer/subaccount-snapshots" %}
[subaccount-snapshots](https://docs.nado.xyz/developer-resources/api/archive-indexer/subaccount-snapshots)
{% endcontent-ref %}

{% content-ref url="archive-indexer/linked-signers" %}
[linked-signers](https://docs.nado.xyz/developer-resources/api/archive-indexer/linked-signers)
{% endcontent-ref %}

{% content-ref url="archive-indexer/linked-signer-rate-limit" %}
[linked-signer-rate-limit](https://docs.nado.xyz/developer-resources/api/archive-indexer/linked-signer-rate-limit)
{% endcontent-ref %}

{% content-ref url="archive-indexer/isolated-subaccounts" %}
[isolated-subaccounts](https://docs.nado.xyz/developer-resources/api/archive-indexer/isolated-subaccounts)
{% endcontent-ref %}

{% content-ref url="archive-indexer/signatures" %}
[signatures](https://docs.nado.xyz/developer-resources/api/archive-indexer/signatures)
{% endcontent-ref %}

{% content-ref url="archive-indexer/fast-withdrawal-signature" %}
[fast-withdrawal-signature](https://docs.nado.xyz/developer-resources/api/archive-indexer/fast-withdrawal-signature)
{% endcontent-ref %}

{% content-ref url="archive-indexer/nlp-funding-payments" %}
[nlp-funding-payments](https://docs.nado.xyz/developer-resources/api/archive-indexer/nlp-funding-payments)
{% endcontent-ref %}

{% content-ref url="archive-indexer/nlp-interest-payments" %}
[nlp-interest-payments](https://docs.nado.xyz/developer-resources/api/archive-indexer/nlp-interest-payments)
{% endcontent-ref %}

{% content-ref url="archive-indexer/nlp-snapshots" %}
[nlp-snapshots](https://docs.nado.xyz/developer-resources/api/archive-indexer/nlp-snapshots)
{% endcontent-ref %}

{% content-ref url="archive-indexer/liquidation-feed" %}
[liquidation-feed](https://docs.nado.xyz/developer-resources/api/archive-indexer/liquidation-feed)
{% endcontent-ref %}

{% content-ref url="archive-indexer/sequencer-backlog" %}
[sequencer-backlog](https://docs.nado.xyz/developer-resources/api/archive-indexer/sequencer-backlog)
{% endcontent-ref %}

{% content-ref url="archive-indexer/direct-deposit-address" %}
[direct-deposit-address](https://docs.nado.xyz/developer-resources/api/archive-indexer/direct-deposit-address)
{% endcontent-ref %}

{% content-ref url="archive-indexer/quote-price" %}
[quote-price](https://docs.nado.xyz/developer-resources/api/archive-indexer/quote-price)
{% endcontent-ref %}

{% content-ref url="archive-indexer/ink-airdrop" %}
[ink-airdrop](https://docs.nado.xyz/developer-resources/api/archive-indexer/ink-airdrop)
{% endcontent-ref %}
