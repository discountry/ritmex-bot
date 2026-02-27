# Assets

## Rate limits

* 1200 requests/min or 20 requests/sec per IP address. (**weight = 2**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Get assets" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_V2_ENDPOINT]/assets`
{% endtab %}
{% endtabs %}

## Response

```json
[
  {
    "product_id": 0,
    "ticker_id": null,
    "market_type": null,
    "name": "USDT0",
    "symbol": "USDT0",
    "taker_fee": null,
    "maker_fee": null,
    "can_withdraw": true,
    "can_deposit": true
  },
  {
    "product_id": 2,
    "ticker_id": "BTC-PERP_USDT0",
    "market_type": "perp",
    "name": "Bitcoin Perp",
    "symbol": "BTC-PERP",
    "maker_fee": 0.0002,
    "taker_fee": 0,
    "can_withdraw": false,
    "can_deposit": false
  },
  {
    "product_id": 1,
    "ticker_id": "BTC_USDT0",
    "market_type": "spot",
    "name": "Bitcoin",
    "symbol": "BTC",
    "taker_fee": 0.0003,
    "maker_fee": 0,
    "can_withdraw": true,
    "can_deposit": true
  }
]
```

## Response Fields

<table><thead><tr><th>Field name</th><th width="95">Type</th><th width="106">Nullable</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>number</td><td>No</td><td>Internal unique ID of spot / perp product</td></tr><tr><td>name</td><td>string</td><td>No</td><td>Asset name (as represented internally in the exchange).</td></tr><tr><td>symbol</td><td>string</td><td>No</td><td>Asset symbol (as represented internally in the exchange).</td></tr><tr><td>maker_fee</td><td>decimal</td><td>No</td><td>Fees charged for placing a market-making order on the book.</td></tr><tr><td>taker_fee</td><td>decimal</td><td>No</td><td>Fees applied when liquidity is removed from the book.</td></tr><tr><td>can_withdraw</td><td>boolean</td><td>No</td><td>Indicates if asset withdrawal is allowed.</td></tr><tr><td>can_deposit</td><td>boolean</td><td>No</td><td>Indicates if asset deposit is allowed.</td></tr><tr><td>ticker_id</td><td>string</td><td>Yes</td><td>Identifier of a ticker with delimiter to separate base/quote. This is <mark style="color:red;"><code>null</code></mark> for assets without market e.g: <mark style="color:red;"><code>USDT0</code></mark></td></tr><tr><td>market_type</td><td>string</td><td>Yes</td><td>Name of market type (<code>spot</code> or <code>perp</code>) of asset. This is <mark style="color:red;"><code>null</code></mark> for assets without a market e.g: <mark style="color:red;"><code>USDT0</code></mark></td></tr></tbody></table>
