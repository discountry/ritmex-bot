# Trades

## Request

{% tabs %}
{% tab title="Get pairs" %} <mark style="color:green;">**GET**</mark> `[ARCHIVE_V2_ENDPOINT]/trades?ticker_id=BTC-PERP_USDT0&limit=10&max_trade_id=1000000`
{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="153">Parameter</th><th width="108">Type</th><th width="126">Required</th><th>Description</th></tr></thead><tbody><tr><td>ticker_id</td><td>string</td><td>Yes</td><td>Identifier of a ticker with delimiter to separate base/target.</td></tr><tr><td>limit</td><td>integer</td><td>No</td><td>Number of historical trades to retrieve. Defaults to 100. Max of 500.</td></tr><tr><td>max_trade_id</td><td>integer</td><td>No</td><td>Max trade id to include in the result. Use for pagination.</td></tr></tbody></table>

## Response

```json
[
    {
        "product_id": 1,
        "ticker_id": "BTC-PERP_USDT0",
        "trade_id": 6351,
        "price": 112029.5896,
        "base_filled": -0.388,
        "quote_filled": 43467.4807648,
        "timestamp": 1757335618,
        "trade_type": "sell"
    },
    {
        "product_id": 1,
        "ticker_id": "BTC-PERP_USDT0",
        "trade_id": 6350,
        "price": 112032.58899999999,
        "base_filled": -0.179,
        "quote_filled": 20053.833431,
        "timestamp": 1757335618,
        "trade_type": "sell"
    }
]
```

## Response Fields

<table><thead><tr><th width="147">Field Name</th><th width="96">Type</th><th width="140">Nullable</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>u32</td><td>No</td><td>Unique identifier for the product.</td></tr><tr><td>ticker_id</td><td>string</td><td>No</td><td>Identifier of a ticker with delimiter to separate base/target.</td></tr><tr><td>trade_id</td><td>integer</td><td>No</td><td>A unique ID associated with the trade for the currency pair transaction.</td></tr><tr><td>price</td><td>decimal</td><td>No</td><td>Trade price of base asset in target currency.</td></tr><tr><td>base_filled</td><td>decimal</td><td>No</td><td>Amount of base volume filled in trade.</td></tr><tr><td>quote_filled</td><td>decimal</td><td>No</td><td>Amount of quote/target volume filled in trade.</td></tr><tr><td>timestamp</td><td>integer</td><td>No</td><td>Unix timestamp in seconds for when the transaction occurred.</td></tr><tr><td>trade_type</td><td>string</td><td>No</td><td>Indicates the type of the transaction that was completed ("buy" or "sell").</td></tr></tbody></table>
