# Pairs

## Request

{% tabs %}
{% tab title="Get pairs" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_V2_ENDPOINT]/pairs?market={spot|perp}`
{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145">Parameter</th><th width="81">Type</th><th width="106">Required</th><th>Description</th></tr></thead><tbody><tr><td>market</td><td>string</td><td>No</td><td>Indicates the corresponding market to fetch trading pairs for. Allowed values are: <mark style="color:red;"><code>spot</code></mark>and <mark style="color:red;"><code>perp</code></mark>. When no <mark style="color:red;"><code>market</code></mark> param is provided, it returns all available pairs.</td></tr></tbody></table>

## Response

```json
[
    {
        "product_id": 1,
        "ticker_id": "BTC-PERP_USDT0",
        "base": "BTC-PERP",
        "quote": "USDT0"
    },
    {
        "product_id": 2,
        "ticker_id": "ETH-PERP_USDT0",
        "base": "ETH-PERP",
        "quote": "USDT0"
    },
    {
        "product_id": 3,
        "ticker_id": "BTC_USDT0",
        "base": "BTC",
        "quote": "USDT0"
    },
    {
        "product_id": 4,
        "ticker_id": "ETH_USDT0",
        "base": "ETH",
        "quote": "USDT0"
    }
]
```

## Response Fields

<table><thead><tr><th width="139">Field name</th><th width="93">Type</th><th width="97">Nullable</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>u32</td><td>No</td><td>Unique identifier for the product.</td></tr><tr><td>ticker_id</td><td>string</td><td>No</td><td>Identifier of a ticker with delimiter to separate base/target.</td></tr><tr><td>base</td><td>string</td><td>No</td><td>Symbol of the base asset.</td></tr><tr><td>quote</td><td>string</td><td>No</td><td>Symbol of the target asset.</td></tr></tbody></table>
