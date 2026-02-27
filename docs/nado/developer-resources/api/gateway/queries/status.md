# Status

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
  "type": "status"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=status`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "status"
}
```

{% endtab %}
{% endtabs %}

## Response

```json
{
  "status": "success",
  "data": "active",
  "request_type": "query_status",
}
```

{% hint style="info" %}
The offchain sequencer could be in any of the following statuses:

* <mark style="color:red;">`active`</mark>: accepting incoming executes.
* <mark style="color:red;">`failed`</mark>: sequencer is in a failed state.
  {% endhint %}
