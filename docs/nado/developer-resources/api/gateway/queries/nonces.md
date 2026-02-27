# Nonces

## Rate limits

* 1200 requests/min or 20 requests/sec per IP address. (**weight = 2**)

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
  "type": "nonces",
  "address": "0x0000000000000000000000000000000000000000"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GGET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=nonces&address={address}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "nonces",
  "address": "0x0000000000000000000000000000000000000000"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="134" align="center">Parameter</th><th width="86" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">address</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes20</code></mark> sent as a hex string representing the wallet address.</td></tr></tbody></table>

## Response

```json
{
  "status":"success",
  "data":{
    "tx_nonce": 0,
    "order_nonce": 1753048133299863552
  },
  "request_type": "query_nonces",
}
```

{% hint style="info" %}
**Note**: when doing any execute that is not <mark style="color:red;">`place_orders`</mark>, i.e. <mark style="color:red;">`withdraw_collateral`</mark>, <mark style="color:red;">`liquidate_subaccount`</mark>, you want to use <mark style="color:red;">`tx_nonce`</mark> as the nonce. <mark style="color:red;">`tx_nonce`</mark> increments by one each time a successful execute goes through. <mark style="color:red;">`order_nonce`</mark> is a historical artifact for the frontend, and simply returns the current timestamp in milliseconds plus 100000 multiplied by 2\*\*20.
{% endhint %}
