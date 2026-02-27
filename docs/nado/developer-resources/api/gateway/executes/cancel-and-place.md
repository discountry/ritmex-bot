# Cancel And Place

## Rate limits

* The sum of [Cancel Orders](https://docs.nado.xyz/developer-resources/api/gateway/cancel-orders#rate-limits) + [Place Order](https://docs.nado.xyz/developer-resources/api/gateway/place-order#rate-limits) limits

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits).
{% endhint %}

## Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json
{
  "cancel_and_place": {
    "cancel_tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productIds": [2],
      "digests": ["0x"],
      "nonce": "1"
    },
    "cancel_signature": "0x",
    "place_order": {
      "product_id": 1,
      "order": {
        "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
        "priceX18": "1000000000000000000",
        "amount": "1000000000000000000",
        "expiration": "4294967295",
        "appendix": "1537",
        "nonce": "1757062078359666688"
      },
      "signature": "0x",
    }
  }
}
```

{% endtab %}

{% tab title="REST" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/execute`</mark>

**Body**

```json
{
  "cancel_and_place": {
    "cancel_tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productIds": [2],
      "digests": ["0x"],
      "nonce": "1"
    },
    "cancel_signature": "0x",
    "place_order": {
      "product_id": 1,
      "order": {
        "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
        "priceX18": "1000000000000000000",
        "amount": "1000000000000000000",
        "expiration": "4294967295",
        "nonce": "1757062078359666688"
      },
      "signature": "0x",
    }
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="219" align="center">Parameter</th><th width="128" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">cancel_tx</td><td align="center">object</td><td align="center">Yes</td><td>Cancel order transaction object. See <a href="../cancel-orders#signing">Cancel order signing</a> for details on the transaction fields.</td></tr><tr><td align="center">cancel_tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">cancel_tx.productIds</td><td align="center">number[]</td><td align="center">Yes</td><td>A list of product IDs, corresponding to the product ids of the orders in <mark style="color:red;"><code>digests</code></mark></td></tr><tr><td align="center">cancel_tx.digests</td><td align="center">string[]</td><td align="center">Yes</td><td>A list of order digests, represented as hex strings.</td></tr><tr><td align="center">cancel_tx.nonce</td><td align="center">string</td><td align="center">Yes</td><td>Used to differentiate between the same cancellation multiple times. See <a href="../cancel-orders#signing">Cancel order signing</a> section for more details.</td></tr><tr><td align="center">cancel_signature</td><td align="center">string</td><td align="center">Yes</td><td>Signed transaction. See <a href="#signing">Signing</a><a href="../cancel-orders#signing">Cancel order signing</a> for more details.</td></tr><tr><td align="center">place_order</td><td align="center">object</td><td align="center">Yes</td><td>Payload of order to be placed. See <a href="../../../trigger/executes/place-order#request-parameters">Place order request parameters</a> for payload details.</td></tr></tbody></table>

## Signing

{% hint style="warning" %}
**Note**: both <mark style="color:red;">`cancel_tx`</mark> and <mark style="color:red;">`place_order`</mark> objects must be signed using the same signer, otherwise the request will be rejected.
{% endhint %}

* See [Cancel orders signing](https://docs.nado.xyz/developer-resources/api/gateway/cancel-orders#signing) for details on how to sign the order cancellation.
* See [Place order signing](https://docs.nado.xyz/developer-resources/api/gateway/place-order#signing) for details on how to sign the order placement.

## Response

#### Success

```json
{
  "status": "success",
  "signature": {signature},
  "data": { 
    "digest": {order digest} 
  },
  "request_type": "execute_cancel_and_place"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature}
  "error": "{error_msg}"
  "error_code": {error_code}
  "request_type": "execute_cancel_and_place"
}
```
