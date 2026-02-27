# Contracts

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
  "type": "contracts"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=contracts`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "contracts"
}
```

{% endtab %}
{% endtabs %}

## Response

```json
{
    "status": "success",
    "data": {
        "chain_id": "763373",
        "endpoint_addr": "0xf8963f7860af7de9b94893edb9a3b5c155e1fc0c"
    },
    "request_type": "query_contracts"
}
```

{% hint style="info" %}
**Note:**

* <mark style="color:red;">`endpoint_addr`</mark> is the address of the Nado endpoint contracts. Deposits are sent to the endpoint address; **this to used sign every request except&#x20;**<mark style="color:red;">**`PlaceOrder`**</mark>
  {% endhint %}
