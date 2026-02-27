# Market Liquidity

## Rate limits

* 2400 requests/min or 40 requests/sec per IP address. (**weight = 1**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits)
{% endhint %}

## Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json
{
  "type": "market_liquidity",
  "product_id": 1,
  "depth": 10
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=market_liquidity&product_id={product_id}&depth={depth}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "market_liquidity",
  "product_id": 1,
  "depth": 10
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="97" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to retrieve market liquidity.</td></tr><tr><td align="center">depth</td><td align="center">number</td><td align="center">Yes</td><td>Number of price levels to retrieve. (<mark style="color:red;"><code>max: 100</code></mark>)</td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
    "bids": [
      [
        "30234000000000000000000",
        "663000000000000000"
      ],
      [
        "30170000000000000000000",
        "24623000000000000000"
      ]
    ],
    "asks": [
      [
        "30245000000000000000000",
        "664000000000000000"
      ],
      [
        "30252000000000000000000",
        "4646000000000000000"
      ]
    ],
    "timestamp": "1681850046966693400",
    "product_id": 1
  },
  "request_type": "query_market_liquidity"
}
```

{% hint style="info" %}
**Note:**

* Each entry inside bids and asks is an array of price and size respectively. **Note**: that price is represented using fixed point, so it is <mark style="color:red;">`1e18`</mark> times greater than the decimal price.
* <mark style="color:red;">`timestamp`</mark> is in nanoseconds.
  {% endhint %}
