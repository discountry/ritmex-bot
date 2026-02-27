# Linked Signer

## Rate limits

* 480 requests/min or 8 requests/sec per IP address. (**weight = 5**)

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
  "type": "linked_signer",
  "subaccount": "0x9b9989a4E0b260B84a5f367d636298a8bfFb7a9b42544353504f540000000000"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=linked_signer&subaccount=0x9b9989a4E0b260B84a5f367d636298a8bfFb7a9b42544353504f540000000000`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Message**

```json
{
  "type": "linked_signer",
  "subaccount": "0x9b9989a4E0b260B84a5f367d636298a8bfFb7a9b42544353504f540000000000"
}
```

{% endtab %}
{% endtabs %}

## Response

```json
{
  "status": "success",
  "data": {
    "linked_signer": "0x0000000000000000000000000000000000000000"
  },
  "request_type": "query_linked_signer",
}
```

{% hint style="info" %}
**Notes**:

* <mark style="color:red;">`linked_signer`</mark>: the current linked signer address (20 bytes) associated to the provided `subaccount`. It returns the zero address when no signer is linked.
  {% endhint %}
