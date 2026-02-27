# Market Prices

## Rate limits

* 2400 requests/min or 40 requests/sec per IP address. (**weight = 1**) or length of <mark style="color:red;">`product_ids`</mark> for [multi-product markets](#multiple-products) query.

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Single Product

### Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json
{
  "type": "market_price",
  "product_id": 1
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=market_price&product_id={product_id}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "market_price",
  "product_id": 1
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="97" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to retrieve market price data.</td></tr></tbody></table>

### Response

```json
{
  "status": "success",
  "data": {
    "product_id": 1,
    "bid_x18": "24224000000000000000000",
    "ask_x18": "24243000000000000000000"
  },
  "request_type": "query_market_price",
}
```

{% hint style="info" %}
**Note**: that price is represented using fixed point, so it is <mark style="color:red;">`1e18`</mark> times greater than the decimal price.
{% endhint %}

## Multiple Products

### Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [CORE_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json
{
  "type": "market_prices",
  "product_ids": [1, 2]
}
```

{% endtab %}

{% tab title="REST" %} <mark style="color:orange;">`POST /query`</mark>

**Body**

```json
{
  "type": "market_prices",
  "product_ids": [1, 2]
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="118" align="center">Type</th><th width="135.125" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">Yes</td><td>List of spot / perp products for which to retrieve market price data.</td></tr></tbody></table>

### Response

```json
{
  "status": "success",
  "data": {
    "market_prices": [
      {
        "product_id": 1,
        "bid_x18": "31315000000000000000000",
        "ask_x18": "31326000000000000000000"
      },
      {
        "product_id": 2,
        "bid_x18": "31291000000000000000000",
        "ask_x18": "31301000000000000000000"
      },
    ]
  },
  "request_type": "query_market_prices"
}
```
