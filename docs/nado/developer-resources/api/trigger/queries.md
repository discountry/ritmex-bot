# Queries

All queries go through the following endpoint; the exact details of the query are specified by the JSON payload.

* **REST**: <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/query`</mark>

## API Response

All `queries` return in the format:

```json
{
  "status": "success" | "failure",
  "data"?: {data},
  "error"?: "{error_msg}",
  "error_code"?: {error_code},
  "request_type": "{request_type}"
}
```

## Available Queries:

{% content-ref url="queries/list-trigger-orders" %}
[list-trigger-orders](https://docs.nado.xyz/developer-resources/api/trigger/queries/list-trigger-orders)
{% endcontent-ref %}

{% content-ref url="queries/list-twap-executions" %}
[list-twap-executions](https://docs.nado.xyz/developer-resources/api/trigger/queries/list-twap-executions)
{% endcontent-ref %}
