# Tickers

## Request

{% tabs %}
{% tab title="Get pairs" %} <mark style="color:green;">**GET**</mark> `[ARCHIVE_V2_ENDPOINT]/tickers?market={spot|perp}&edge={true|false}`
{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145">Parameter</th><th width="81">Type</th><th width="106">Required</th><th>Description</th></tr></thead><tbody><tr><td>market</td><td>string</td><td>No</td><td>Indicates the corresponding market to fetch trading tickers info for. Allowed values are: <mark style="color:red;"><code>spot</code></mark>and <mark style="color:red;"><code>perp</code></mark>. When no <mark style="color:red;"><code>market</code></mark> param is provided, it returns all available tickers.</td></tr><tr><td>edge</td><td>bool</td><td>No</td><td>Whether to retrieve volume metrics for all chains. When turned off, it only returns metrics for the current chain. Defaults to <mark style="color:red;">true</mark>.</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note**: the response is a map of <mark style="color:red;">`ticker_id`</mark> -> ticker info object.
{% endhint %}

```json
{
    "BTC-PERP_USDT0": {
        "product_id": 1,
        "ticker_id": "BTC-PERP_USDT0",
        "base_currency": "BTC",
        "quote_currency": "USDT0",
        "last_price": 25728.0,
        "base_volume": 552.048,
        "quote_volume": 14238632.207250029,
        "price_change_percent_24h": -0.6348599635253989
    }
}
```

## Response Fields

<table><thead><tr><th width="253">Field Name</th><th width="93">Type</th><th width="97">Nullable</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>u32</td><td>No</td><td>Unique identifier for the product.</td></tr><tr><td>ticker_id</td><td>string</td><td>No</td><td>Identifier of a ticker with delimiter to separate base/target.</td></tr><tr><td>base_currency</td><td>string</td><td>No</td><td>Symbol of the base asset.</td></tr><tr><td>quote_currency</td><td>string</td><td>No</td><td>Symbol of the target asset.</td></tr><tr><td>last_price</td><td>decimal</td><td>No</td><td>Last transacted price of base currency based on given quote currency.</td></tr><tr><td>base_volume</td><td>decimal</td><td>No</td><td>24-hours trading volume for the pair (unit in base)</td></tr><tr><td>quote_volume</td><td>decimal</td><td>No</td><td>24-hours trading volume for the pair (unit in quote/target)</td></tr><tr><td>price_change_percent_24h</td><td>decimal</td><td>No</td><td>24-hours % price change of market pair</td></tr></tbody></table>
