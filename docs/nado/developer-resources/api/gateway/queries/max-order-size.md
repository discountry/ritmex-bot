# Max Order Size

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
  "type": "max_order_size",
  "product_id": 1,
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "price_x18": "23000000000000000000000",
  "direction": "short",
  "spot_leverage": "true",
  "reduce_only": "false",
  "isolated": "false"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=max_order_size&product_id={product_id}&sender={sender}&price_x18={price_x18}&direction={direction}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "max_order_size",
  "product_id": 1,
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "price_x18": "23000000000000000000000",
  "direction": "short",
  "spot_leverage": "true",
  "reduce_only": "false",
  "isolated": "false"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="158" align="center">Parameter</th><th width="97" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">sender</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to retrieve max order size.</td></tr><tr><td align="center">price_x18</td><td align="center">string</td><td align="center">Yes</td><td>An <mark style="color:red;"><code>int128</code></mark> representing the price of the order multiplied by 1e18, sent as a string. For example, a price of 1 USDT0 would be sent as <code>"1000000000000000000"</code></td></tr><tr><td align="center">direction</td><td align="center">string</td><td align="center">Yes</td><td><mark style="color:red;"><code>long</code></mark> for max bid or <mark style="color:red;"><code>short</code></mark> for max ask.</td></tr><tr><td align="center">spot_leverage</td><td align="center">string</td><td align="center">No</td><td>Boolean sent as a string. Indicates whether leverage should be used; when set to <mark style="color:red;"><code>false</code></mark> , returns the max order possible without borrow. Defaults to <mark style="color:red;"><code>true</code></mark></td></tr><tr><td align="center">reduce_only</td><td align="center">string</td><td align="center">No</td><td>Boolean sent as a string. Indicates wether to retrieve the max order size to close / reduce a position. Defaults to <mark style="color:red;"><code>false</code></mark></td></tr><tr><td align="center">isolated</td><td align="center">string</td><td align="center">No</td><td>Boolean sent as a string. When set to <mark style="color:red;"><code>true</code></mark>, calculates max order size for an isolated margin position. Defaults to <mark style="color:red;"><code>false</code></mark>. See <a href="https://github.com/nadohq/nado-docs/blob/main/docs/basics/isolated-margin.md">Isolated Margin</a> to learn more.</td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
    "max_order_size": "137847520631947079935"
  },
  "request_type": "query_max_order_size",
}
```
