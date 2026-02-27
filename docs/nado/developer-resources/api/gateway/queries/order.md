# Order

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
  "type": "order",
  "product_id": 1,
  "digest": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=order&product_id={product_id}&digest={digest}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "order",
  "product_id": 1,
  "digest": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="97" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to retrieve order.</td></tr><tr><td align="center">digest</td><td align="center">string</td><td align="center">Yes</td><td>Order digest to retrieve.</td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
    "product_id": 1,
    "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
    "price_x18": "1000000000000000000",
    "amount": "1000000000000000000",
    "expiration": "2000000000",
    "nonce": "1",
    "unfilled_amount": "1000000000000000000",
    "digest": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "placed_at": 1681951347,
    "appendix": "1537",
    "order_type": "ioc"
  },
  "request_type": "query_order",
}
```

{% hint style="info" %}
**Note**: that side of the order (buy/sell) is included in the sign of <mark style="color:red;">`amount`</mark> and <mark style="color:red;">`unfilled_amount`</mark> . They are positive if the order is a buy order, otherwise negative.
{% endhint %}
