# Orderbook

## Rate limits

* 2400 requests/min or 40 requests/sec per IP address. (**weight = 1**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Get orderbook" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_V2_ENDPOINT]/orderbook?ticker_id={ticker_id}&depth={depth}`
{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="162">Parameter</th><th width="100">Type</th><th width="107">Required</th><th>Description</th></tr></thead><tbody><tr><td>ticker_id</td><td>string</td><td>Yes</td><td>Identifier of a ticker with delimiter to separate base/target.</td></tr><tr><td>depth</td><td>number</td><td>Yes</td><td>Number of price levels to retrieve.</td></tr></tbody></table>

## Response

```json
{
    "product_id": 1,
    "ticker_id": "BTC-PERP_USDT0",
    "bids": [
        [
            116215.0,
            0.128
        ],
        [
            116214.0,
            0.172
        ]
    ],
    "asks": [
        [
            116225.0,
            0.043
        ],
        [
            116226.0,
            0.172
        ]
    ],
    "timestamp": 1757913317944
}
```

## Response Fields

<table><thead><tr><th width="148">Field Name</th><th width="112.33333333333334">Type</th><th width="114">Nullable</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>u32</td><td>No</td><td>Unique identifier for the product.</td></tr><tr><td>ticker_id</td><td>string</td><td>No</td><td>Identifier of a ticker with delimiter to separate base/target.</td></tr><tr><td>bids</td><td>decimal[]</td><td>No</td><td>An array containing 2 elements. The offer price (first element) and quantity for each bid order (second element).</td></tr><tr><td>asks</td><td>decimal[]</td><td>No</td><td>An array containing 2 elements. The ask price (first element) and quantity for each ask order (second element).</td></tr><tr><td>timestamp</td><td>integer</td><td>No</td><td>Unix timestamp in milliseconds for when the last updated time occurred.</td></tr></tbody></table>
