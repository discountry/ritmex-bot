# Orders

## Rate limits

* 1200 requests/min or 20 requests/sec per IP address. (**weight = 2**) or 2 \* length of <mark style="color:red;">`product_ids`</mark> for [multi-product orders](#multiple-products) query.

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
  "type": "subaccount_orders",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "product_id": 1
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=subaccount_orders&sender={sender}&product_id={product_id}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "subaccount_orders",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "product_id": 1
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="97" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">sender</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to retrieve subaccount orders.</td></tr></tbody></table>

### Response

```json
{
  "status": "success",
  "data": {
    "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
    "product_id": 1,
    "orders": [
      {
        "product_id": 1,
        "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
        "price_x18": "1000000000000000000",
        "amount": "1000000000000000000",
        "expiration": "2000000000",
        "nonce": "1",
        "unfilled_amount": "1000000000000000000",
        "digest": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "placed_at": 1682437739,
        "appendix": "1537",
        "order_type": "ioc"
      }
    ]
  },
  "request_type": "query_subaccount_orders"
}
```

{% hint style="info" %}
**Note**: that side of the order (buy/sell) is included in the sign of <mark style="color:red;">`amount`</mark> and <mark style="color:red;">`unfilled_amount`</mark> . They are positive if the order is a buy order, otherwise negative.
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
  "type": "orders",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "product_ids": [1, 2, 3]
}
```

{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST /query`</mark>

**Body**

```json
{
  "type": "orders",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "product_ids": [1, 2, 3]
}
```

{% endtab %}
{% endtabs %}

### Request Parameters

<table><thead><tr><th width="140" align="center">Parameter</th><th width="109" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">sender</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">Yes</td><td>List of spot / perp products for which to retrieve open orders.</td></tr></tbody></table>

### Response

```json
{
  "status": "success",
  "data": {
    "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
    "product_orders": [
      {
        "product_id": 1,
        "orders": [
           {
            "product_id": 1,
            "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
            "price_x18": "1000000000000000000",
            "amount": "1000000000000000000",
            "expiration": "2000000000",
            "nonce": "1",
            "unfilled_amount": "1000000000000000000",
            "digest": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "appendix": "1537",
            "placed_at": 1682437739,
            "order_type": "ioc"
          }
        ]
      },
      {
        "product_id": 2,
        "orders": []
      }
    ]
  },
  "request_type": "query_orders"
}
```
