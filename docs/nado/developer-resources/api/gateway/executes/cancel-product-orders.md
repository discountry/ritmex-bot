# Cancel Product Orders

## Rate limits

* When no **productIds** are provide&#x64;**:** 12 cancellations/min or 2 cancellations/sec per wallet. (**weight=50**)
* When **productIds** are provided: 600 / (5 \* total productIds) cancellations per minute per wallet. (**weight=5\*total productIds**)

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
  "cancel_product_orders": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productIds": [2],
      "nonce": "1"
    },
    "signature": "0x",
    "digest": null
  }
}
```

{% endtab %}

{% tab title="REST" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/execute`</mark>

**Body**

```json
{
  "cancel_product_orders": {
    "tx": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "productIds": [0],
      "nonce": "1"
    },
    "signature": "0x",
    "digest": "0x"
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="178" align="center">Parameter</th><th width="142" align="center">Type</th><th width="104" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td>Cancel product orders transaction object. See <a href="#signing">Signing</a> section for details on transaction fields.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">tx.productIds</td><td align="center">number[]</td><td align="center">Yes</td><td>A list of product IDs to cancel orders for.</td></tr><tr><td align="center">tx.nonce</td><td align="center">string</td><td align="center">Yes</td><td>Used to differentiate between the same cancellation multiple times. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Signed transaction. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">digest</td><td align="center">string</td><td align="center">No</td><td>Hex string representing a hash of the <code>CancellationProducts</code> object.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

```solidity
struct CancellationProducts {
    bytes32 sender;
    uint32[] productIds;
    uint64 nonce;
}
```

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier

<mark style="color:red;">`productIds`</mark>: a list of product Ids for which to cancel all subaccount orders. When left empty, orders from all products will be cancelled.

<mark style="color:red;">`nonce`</mark>: used to differentiate between the same cancellation multiple times, and a user trying to place a cancellation with the same parameters twice. Sent as a string. Encodes two bit of information:

* Most significant <mark style="color:red;">`44`</mark> bits encoding the <mark style="color:red;">`recv_time`</mark> in milliseconds after which the cancellation should be ignored by the matching engine; the engine will accept cancellations where <mark style="color:red;">`current_time < recv_time <= current_time + 100000`</mark>
* Least significant <mark style="color:red;">`20`</mark> bits are a random integer used to avoid hash collisions

  For example, to place a cancellation with a random integer of <mark style="color:red;">`1000`</mark>, and a discard time 50 ms from now, we would send a nonce of <mark style="color:red;">`(timestamp_ms() + 50) << 20 + 1000`</mark>

{% hint style="warning" %}
**Note**: for signing you should always use the data type specified in the solidity struct which might be different from the type sent in the request e.g: <mark style="color:red;">`nonce`</mark> should be an <mark style="color:red;">`uint64`</mark> for **Signing** but should be sent as a <mark style="color:red;">`string`</mark> in the final payload.
{% endhint %}

## Response

#### Success

```json
{
  "status": "success",
  "signature": {signature},
  "data": {
    "cancelled_orders": [
      {
        "product_id": 2,
        "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
        "price_x18": "20000000000000000000000",
        "amount": "-100000000000000000",
        "expiration": "1686332748",
        "order_type": "post_only",
        "nonce": "1768248100142339392",
        "unfilled_amount": "-100000000000000000",
        "digest": "0x3195a7929feb8307edecf9c045j5ced68925108f0aa305f0ee5773854159377c",
        "appendix": "1537",
        "placed_at": 1686332708
      },
      ...
    ]
  },
  "request_type": "execute_cancel_product_orders"
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_cancel_product_orders"
}
```
