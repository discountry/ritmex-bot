# Max Withdrawable

## Rate limits

* 480 requests/min or 80 requests every 10 seconds per IP address. (**weight = 5**)

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
  "type": "max_withdrawable",
  "product_id": 1,
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "spot_leverage": "true"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=max_withdrawable&product_id={product_id}&sender={sender}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Message**

```json
{
  "type": "max_withdrawable",
  "product_id": 1,
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "spot_leverage": "true"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="154" align="center">Parameter</th><th width="97" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">sender</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to retrieve max withdrawable amount.</td></tr><tr><td align="center">spot_leverage</td><td align="center">string</td><td align="center">No</td><td>Boolean sent as a string. Indicates whether leverage should be used; when set to <mark style="color:red;"><code>false</code></mark> , returns the max withdrawable amount possible without borrow. Defaults to <mark style="color:red;"><code>true</code></mark></td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
    "max_withdrawable": "7968557932297078268650"
  },
  "request_type": "query_max_withdrawable",
}
```
