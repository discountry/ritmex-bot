# Cancel Orders

## Request

{% tabs %}
{% tab title="REST" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/execute`</mark>

**Body**

```json

{
  "cancel_orders": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productIds": [0],
      "digests": ["0x"],
      "nonce": "1"
    },
    "signature": "0x"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

See [Core > Executes > Cancel Orders](https://docs.nado.xyz/developer-resources/gateway/executes/cancel-orders#request-parameters)

## Response

#### Success

```json
{
  "status": "success",
  "signature": {signature},
  "request_type": "execute_cancel_orders"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_cancel_orders"
}
```
