# Contracts

## Request

{% tabs %}
{% tab title="Get pairs" %} <mark style="color:green;">**GET**</mark> `[ARCHIVE_V2_ENDPOINT]/contracts?edge={true|false}`
{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="145">Parameter</th><th width="81">Type</th><th width="106">Required</th><th>Description</th></tr></thead><tbody><tr><td>edge</td><td>bool</td><td>No</td><td>Wether to retrieve volume and OI metrics for all chains. When turned off, it only returns metrics for the current chain. Defaults to <mark style="color:red;">true</mark>.</td></tr></tbody></table>

## Response

{% hint style="info" %}
**Note**: the response is a map of <mark style="color:red;">`ticker_id`</mark> -> contract info object.
{% endhint %}

```json
{
    "BTC-PERP_USDT0": {
        "product_id": 1,
        "ticker_id": "BTC-PERP_USDT0",
        "base_currency": "BTC-PERP",
        "quote_currency": "USDT0",
        "last_price": 25744.0,
        "base_volume": 794.154,
        "quote_volume": 20475749.367766097,
        "product_type": "perpetual",
        "contract_price": 25830.738843799172,
        "contract_price_currency": "USD",
        "open_interest": 3059.325,
        "open_interest_usd": 79024625.11330591,
        "index_price": 25878.913320746455,
        "mark_price": 25783.996946729356,
        "funding_rate": -0.003664562348812546,
        "next_funding_rate_timestamp": 1694379600,
        "price_change_percent_24h": -0.6348599635253989
    }
}
```

## Response Fields

<table><thead><tr><th width="274">Field Name</th><th width="93">Type</th><th width="97">Nullable</th><th>Description</th></tr></thead><tbody><tr><td>product_id</td><td>u32</td><td>No</td><td>Unique identifier for the product.</td></tr><tr><td>ticker_id</td><td>string</td><td>No</td><td>Identifier of a ticker with delimiter to separate base/target.</td></tr><tr><td>base_currency</td><td>string</td><td>No</td><td>Symbol of the base asset.</td></tr><tr><td>quote_currency</td><td>string</td><td>No</td><td>Symbol of the target asset.</td></tr><tr><td>last_price</td><td>decimal</td><td>No</td><td>Last transacted price of base currency based on given quote currency.</td></tr><tr><td>base_volume</td><td>decimal</td><td>No</td><td>24-hours trading volume for the pair (unit in base)</td></tr><tr><td>quote_volume</td><td>decimal</td><td>No</td><td>24-hours trading volume for the pair (unit in quote/target)</td></tr><tr><td>product_type</td><td>string</td><td>No</td><td>Name of product type.</td></tr><tr><td>contract_price</td><td>string</td><td>No</td><td>Describes the price per contract.</td></tr><tr><td>contract_price_currency</td><td>string</td><td>No</td><td>Describes the currency which the contract is priced in.</td></tr><tr><td>open_interest</td><td>decimal</td><td>No</td><td>The current open interest for the perp contract.</td></tr><tr><td>open_interest_usd</td><td>decimal</td><td>No</td><td>The value in USD of the current open interest.</td></tr><tr><td>index_price</td><td>decimal</td><td>No</td><td>Last calculated index price for underlying of contract</td></tr><tr><td>funding_rate</td><td>decimal</td><td>No</td><td>Current 24hr funding rate. Can compute hourly funding rate dividing by 24.</td></tr><tr><td>next_funding_rate_timestamp</td><td>integer</td><td>No</td><td>Timestamp of the next funding rate change</td></tr><tr><td>price_change_percent_24h</td><td>decimal</td><td>No</td><td>24-hours % price change of market pair</td></tr></tbody></table>
