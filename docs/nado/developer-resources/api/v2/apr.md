# APR

## Request

{% tabs %}
{% tab title="Get pairs" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_V2_ENDPOINT]/apr`
{% endtab %}
{% endtabs %}

## Response

```json
[
    {
        "name": "USDT0",
        "symbol": "USDT0",
        "product_id": 0,
        "deposit_apr": 6.32465621e-10,
        "borrow_apr": 0.010050173557473174,
        "tvl": 20001010125092.633
    },
    {
        "name": "Wrapped BTC",
        "symbol": "WBTC",
        "product_id": 1,
        "deposit_apr": 8.561123e-12,
        "borrow_apr": 0.010050166480005895,
        "tvl": 1045563178297771.2
    }
]
```

## Response Fields

<table><thead><tr><th width="139">Field name</th><th width="93">Type</th><th width="97">Nullable</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>number</td><td>No</td><td>Internal unique ID of spot / perp product</td></tr><tr><td>name</td><td>string</td><td>No</td><td>Asset name (as represented internally in the exchange).</td></tr><tr><td>symbol</td><td>string</td><td>No</td><td>Asset symbol (as represented internally in the exchange).</td></tr><tr><td>deposit_apr</td><td>float</td><td>No</td><td>The current estimated APR for depositing or holding this asset. <strong>Note</strong>: This value should be multiplied by 100 to represent the percentage (%) form.</td></tr><tr><td>borrow_apr</td><td>float</td><td>No</td><td>The current estimated APR for borrowing this asset. <strong>Note</strong>: This value should be multiplied by 100 to represent the percentage (%) form.</td></tr><tr><td>tvl</td><td>tvl</td><td>No</td><td>Total Value Locked (TVL) represents the current USDT0 value of this asset, calculated as the difference between deposits and borrows.</td></tr></tbody></table>
