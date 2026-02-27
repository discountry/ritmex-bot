# List TWAP Executions

## Request

{% tabs %}
{% tab title="Get TWAP executions" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/query`</mark>

**Body**

```json

{
  "type": "list_twap_executions",
  "digest": "0x5886d5eee7dc4879c7f8ed1222fdbbc0e3681a14c1e55d7859515898c7bd2038"
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="201" align="center">Parameter</th><th width="128" align="center">Type</th><th width="129" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">digest</td><td align="center">string</td><td align="center">Yes</td><td>The digest of the TWAP trigger order to get execution details for.</td></tr></tbody></table>

## Response

#### Success

```json
{
  "status": "success",
  "data": {
    "executions": [
      {
        "execution_id": 1,
        "scheduled_time": 1688768157,
        "status": "pending",
        "updated_at": 1688768157050
      },
      {
        "execution_id": 2,
        "scheduled_time": 1688768187,
        "status": {
          "executed": {
            "executed_time": 1688768187050,
            "execute_response": {
              "status": "success",
              "data": {
                "digest": "0x..."
              },
              "id": 12345,
              "request_type": "place_order"
            }
          }
        },
        "updated_at": 1688768187050
      },
      {
        "execution_id": 3,
        "scheduled_time": 1688768217,
        "status": {
          "failed": "Insufficient balance"
        },
        "updated_at": 1688768217050
      },
      {
        "execution_id": 4,
        "scheduled_time": 1688768247,
        "status": {
          "cancelled": "user_requested"
        },
        "updated_at": 1688768247050
      }
    ]
  },
  "request_type": "query_list_twap_executions"
}
```

{% hint style="info" %}
**Note**: TWAP executions can have the following statuses:

* **pending**: execution is scheduled but has not yet been attempted.
* **executed**: execution was successful, includes execution time and response details from the engine.
* **failed**: execution failed, includes error message.
* **cancelled**: execution was cancelled, includes cancellation reason (e.g., "user\_requested", "linked\_signer\_changed", "expired", "account\_health", "isolated\_subaccount\_closed", "dependent\_order\_cancelled").
  {% endhint %}

#### Failure

```json
{
  "status": "failure",
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "query_list_twap_executions"
}
```
