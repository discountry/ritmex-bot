# Max NLP Mintable

## Rate limits

* 120 requests/min or 20 requests every 10 seconds per IP address. (**weight = 20**)

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
  "type": "max_nlp_mintable",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "spot_leverage": "true"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=max_nlp_mintable&sender={sender}`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "max_nlp_mintable",
  "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
  "spot_leverage": "true"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="154" align="center">Parameter</th><th width="97" align="center">Type</th><th width="87" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">sender</td><td align="center">string</td><td align="center">Yes</td><td>A <mark style="color:red;"><code>bytes32</code></mark> sent as a hex string; includes the address and the subaccount identifier.</td></tr><tr><td align="center">spot_leverage</td><td align="center">boolean</td><td align="center">No</td><td>Boolean sent as a string. indicates whether leverage should be used; when set to <mark style="color:red;"><code>false</code></mark> , returns the max amount of base LP mintable possible without borrow. Defaults to <mark style="color:red;"><code>true</code></mark></td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
      "max_quote_amount": "34250782930221490366619"
   },
   "request_type": "query_max_nlp_mintable",
}
```
