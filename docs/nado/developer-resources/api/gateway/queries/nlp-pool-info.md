# NLP Pool Info

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
  "type": "nlp_pool_info"
}
```

{% endtab %}

{% tab title="REST (GET)" %} <mark style="color:green;">**GET**</mark> `[GATEWAY_REST_ENDPOINT]/query?type=nlp_pool_info`
{% endtab %}

{% tab title="REST (POST)" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/query`</mark>

**Body**

```json
{
  "type": "nlp_pool_info"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

This query does not require any parameters.

## Response

```json
{
  "status": "success",
  "data": {
    "nlp_pools": [
      {
        "pool_id": 1,
        "subaccount": "0x0000000000000000000000000000000000000000000000000000000000000002",
        "owner": "0x1234567890123456789012345678901234567890",
        "balance_weight_x18": "500000000000000000",
        "subaccount_info": {
          "subaccount": "0x0000000000000000000000000000000000000000000000000000000000000002",
          "exists": true,
          "health": {
            "assets": "1000000000000000000000",
            "liabilities": "500000000000000000000",
            "initial_health": "250000000000000000000",
            "maintenance_health": "100000000000000000000"
          },
          "spot_balances": [],
          "perp_balances": []
        },
        "open_orders": []
      }
    ]
  },
  "request_type": "query_nlp_pool_info"
}
```

## Response Fields

### NLP Pool Info

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>nlp_pools</td><td>Array of NLP pool objects</td></tr></tbody></table>

### NLP Pool Object

<table><thead><tr><th width="263">Field name</th><th>Description</th></tr></thead><tbody><tr><td>pool_id</td><td>Unique identifier for the pool</td></tr><tr><td>subaccount</td><td>The subaccount address associated with this pool (bytes32 hex string)</td></tr><tr><td>owner</td><td>The owner address of the pool (bytes20 hex string)</td></tr><tr><td>balance_weight_x18</td><td>Weight of this pool's balance in x18 format (string representation of u128)</td></tr><tr><td>subaccount_info</td><td>Complete subaccount information including health, balances, and positions</td></tr><tr><td>open_orders</td><td>Array of currently open orders for this pool</td></tr></tbody></table>
