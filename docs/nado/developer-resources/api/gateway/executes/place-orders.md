# Place Orders

Place multiple orders in a single request. This is more efficient than placing orders individually and allows for better control over batch order placement.

## Rate limits

* With spot leverage: 600 orders/minute or 10 orders/sec per wallet. (**weight=1 per order**)
* Without spot leverage: 30 orders/min or 5 orders every 10 seconds per wallet. (**weight = 20 per order**)

{% hint style="info" %}
See more details in [API Rate limits](https://docs.nado.xyz/developer-resources/api/rate-limits).
{% endhint %}

{% hint style="warning" %}
**Note**: There is a 50ms processing penalty for each `place_orders` request to ensure fair sequencing and prevent gaming of the matching engine.
{% endhint %}

## Request

{% tabs %}
{% tab title="Websocket" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [GATEWAY_WEBSOCKET_ENDPOINT]`</mark>

**Message**

```json
{
  "place_orders": {
    "orders": [
      {
        "product_id": 2,
        "order": {
          "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
          "priceX18": "100000000000000000000000",
          "amount": "1000000000000000000",
          "expiration": "4294967295",
          "nonce": "1757062078359666688",
          "appendix": "1"
        },
        "signature": "0x...",
        "id": 100
      },
      {
        "product_id": 3,
        "order": {
          "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
          "priceX18": "3800000000000000000000",
          "amount": "2000000000000000000",
          "expiration": "4294967295",
          "nonce": "1757062078359666689",
          "appendix": "1"
        },
        "signature": "0x...",
        "id": 101
      }
    ],
    "stop_on_failure": false
  }
}
```

{% endtab %}

{% tab title="REST" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/execute`</mark>

**Body**

```json
{
  "place_orders": {
    "orders": [
      {
        "product_id": 2,
        "order": {
          "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
          "priceX18": "100000000000000000000000",
          "amount": "1000000000000000000",
          "expiration": "4294967295",
          "nonce": "1757062078359666688",
          "appendix": "1"
        },
        "signature": "0x...",
        "id": 100
      },
      {
        "product_id": 3,
        "order": {
          "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
          "priceX18": "3800000000000000000000",
          "amount": "2000000000000000000",
          "expiration": "4294967295",
          "nonce": "1757062078359666689",
          "appendix": "1"
        },
        "signature": "0x...",
        "id": 101
      }
    ],
    "stop_on_failure": false
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="200" align="center">Parameter</th><th width="94" align="center">Type</th><th width="112" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">orders</td><td align="center">array</td><td align="center">Yes</td><td>Array of order objects to place. Each order follows the same structure as <a href="place-order">Place Order</a>.</td></tr><tr><td align="center">orders[].product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to place order.</td></tr><tr><td align="center">orders[].order</td><td align="center">object</td><td align="center">Yes</td><td>Order object (same structure as single order placement).</td></tr><tr><td align="center">orders[].signature</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing hash of the <strong>signed</strong> order.</td></tr><tr><td align="center">orders[].digest</td><td align="center">string</td><td align="center">No</td><td>Hex string representing a hash of the order.</td></tr><tr><td align="center">orders[].spot_leverage</td><td align="center">boolean</td><td align="center">No</td><td>Indicates whether leverage should be used for this order. Defaults to <mark style="color:red;"><code>true</code></mark>.</td></tr><tr><td align="center">orders[].id</td><td align="center">number</td><td align="center">No</td><td>An optional id returned in <mark style="color:red;"><code>Fill</code></mark> and <mark style="color:red;"><code>OrderUpdate</code></mark> events.</td></tr><tr><td align="center">stop_on_failure</td><td align="center">boolean</td><td align="center">No</td><td>If <mark style="color:red;"><code>true</code></mark>, stops processing remaining orders when the first order fails. Already successfully placed orders are NOT cancelled. Defaults to <mark style="color:red;"><code>false</code></mark>.</td></tr></tbody></table>

## Response

```json
{
  "status": "success",
  "data": {
    "place_orders": [
      {
        "digest": "0x1234...",
        "error": null
      },
      {
        "digest": null,
        "error": "insufficient margin"
      }
    ]
  }
}
```

### Response Fields

<table><thead><tr><th width="200">Field</th><th>Description</th></tr></thead><tbody><tr><td>digest</td><td>Order digest (32-byte hash) if successfully placed, <mark style="color:red;"><code>null</code></mark> if failed.</td></tr><tr><td>error</td><td>Error message if order failed, <mark style="color:red;"><code>null</code></mark> if successful.</td></tr></tbody></table>

## Behavior

* **Partial Success**: By default, orders are processed independently. Some orders may succeed while others fail.
* **Stop on Failure**: Set `stop_on_failure: true` to stop processing remaining orders when the first order fails. Already successfully placed orders remain on the book.
* **Order Signing**: Each order must be individually signed using EIP712 (see [Signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) for details).
* **Rate Limits**: Rate limit weight is calculated per order (1 per order with leverage, 20 per order without).

## Use Cases

* **Spread Trading**: Place both legs of a spread trade in one request
* **Multiple Markets**: Open positions across multiple products in one request

## Example

Placing BTC and ETH perp orders simultaneously:

```javascript
const placeOrdersParams = {
  orders: [
    {
      product_id: 2, // BTC-PERP
      order: {
        sender: subaccount,
        priceX18: toX18(100000), // $100k
        amount: toX18(0.1),
        expiration: getExpiration(OrderType.DEFAULT),
        nonce: genOrderNonce(),
        appendix: buildAppendix()
      },
      signature: await signOrder(btcOrder),
      id: 1
    },
    {
      product_id: 3, // ETH-PERP
      order: {
        sender: subaccount,
        priceX18: toX18(3800), // $3.8k
        amount: toX18(1),
        expiration: getExpiration(OrderType.DEFAULT),
        nonce: genOrderNonce(),
        appendix: buildAppendix()
      },
      signature: await signOrder(ethOrder),
      id: 2
    }
  ],
  stop_on_failure: false
};

const response = await client.execute({ place_orders: placeOrdersParams });
```

## See Also

* [Place Order](https://docs.nado.xyz/developer-resources/api/gateway/executes/place-order) - Single order placement
* [Cancel And Place](https://docs.nado.xyz/developer-resources/api/gateway/executes/cancel-and-place) - Atomic cancel and place
* [Signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) - EIP712 order signing
