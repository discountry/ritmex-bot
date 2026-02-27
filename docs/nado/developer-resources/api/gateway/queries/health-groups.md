# Health Groups

{% hint style="info" %}
**Note**: a health group is a perp and spot product whose health is calculated together (e.g. BTC and BTC-PERP).
{% endhint %}

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
  "type": "health_groups"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=health_groups`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Message**

```json
{
  "type": "health_groups"
}
```

{% endtab %}
{% endtabs %}

## Response

```json
{
    "status": "success",
    "data": {
        "health_groups": [
            [
                1,
                2
            ]
        ]
    },
    "request_type": "query_health_groups"
}
```

{% hint style="info" %}

* <mark style="color:red;">`health_groups`</mark>: list of all available health groups. **Note**: <mark style="color:red;">`health_groups[i]`</mark> is the spot / perp product pair of health group <mark style="color:red;">`i`</mark> where <mark style="color:red;">`health_groups[i][0]`</mark> is the spot <mark style="color:red;">`product_id`</mark> and <mark style="color:red;">`health_groups[i][1]`</mark> is the perp <mark style="color:red;">`product_id`</mark>. Additionally, it is possible for a health group to only have either a spot or perp product, in which case, the product that doesn’t exist is set to <mark style="color:red;">`0`</mark>.
  {% endhint %}
