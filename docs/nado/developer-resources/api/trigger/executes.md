# Executes

## Overview

All executes go through the following endpoint; the exact details of the execution are specified by the JSON payload.

* **REST**: <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/execute`</mark>

## API Response

All `Execute` messages return the following information:

```json
{
  "status": "success" | "failure",
  "error"?: "{error_msg}",
  "error_code"?: {error_code},
  "request_type": "{request_type}",
}
```

## Available Executes:

{% content-ref url="executes/place-order" %}
[place-order](https://docs.nado.xyz/developer-resources/api/trigger/executes/place-order)
{% endcontent-ref %}

{% content-ref url="executes/cancel-orders" %}
[cancel-orders](https://docs.nado.xyz/developer-resources/api/trigger/executes/cancel-orders)
{% endcontent-ref %}

{% content-ref url="executes/cancel-product-orders" %}
[cancel-product-orders](https://docs.nado.xyz/developer-resources/api/trigger/executes/cancel-product-orders)
{% endcontent-ref %}
