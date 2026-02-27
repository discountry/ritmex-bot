# Place Orders

Place multiple trigger orders in a single request. This is more efficient than placing orders individually and allows for better control over batch trigger order placement.

## Rate limits

* A max of 25 pending trigger orders per product per subaccount

{% hint style="info" %}
See more details in [Trigger Service Limits](https://docs.nado.xyz/developer-resources/rate-limits#trigger-service-limits).
{% endhint %}

{% hint style="warning" %}
**Important**: All orders in a batch must belong to the same subaccount. Orders with different senders will be rejected.
{% endhint %}

## Request

<mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/execute`</mark>

### Body

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
          "appendix": "4096"
        },
        "trigger": {
          "price_trigger": {
            "price_requirement": {
              "oracle_price_below": "100000000000000000000000"
            }
          }
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
          "appendix": "4096"
        },
        "trigger": {
          "price_trigger": {
            "price_requirement": {
              "oracle_price_above": "3800000000000000000000"
            }
          }
        },
        "signature": "0x...",
        "id": 101
      }
    ],
    "stop_on_failure": false
  }
}
```

## Request Parameters

<table><thead><tr><th width="200" align="center">Parameter</th><th width="94" align="center">Type</th><th width="112" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">orders</td><td align="center">array</td><td align="center">Yes</td><td>Array of trigger order objects to place. Each order follows the same structure as <a href="place-order">Place Order</a>. <strong>All orders must have the same sender</strong>.</td></tr><tr><td align="center">orders[].product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to place order.</td></tr><tr><td align="center">orders[].order</td><td align="center">object</td><td align="center">Yes</td><td>Order object (same structure as single order placement).</td></tr><tr><td align="center">orders[].trigger</td><td align="center">object</td><td align="center">Yes</td><td>Trigger criteria - either price_trigger or time_trigger. See <a href="place-order">Place Order</a> for details.</td></tr><tr><td align="center">orders[].signature</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing hash of the <strong>signed</strong> order.</td></tr><tr><td align="center">orders[].digest</td><td align="center">string</td><td align="center">No</td><td>Hex string representing a hash of the order.</td></tr><tr><td align="center">orders[].spot_leverage</td><td align="center">boolean</td><td align="center">No</td><td>Indicates whether leverage should be used for this order. Defaults to <mark style="color:red;"><code>true</code></mark>.</td></tr><tr><td align="center">orders[].id</td><td align="center">number</td><td align="center">No</td><td>An optional id returned in <mark style="color:red;"><code>Fill</code></mark> and <mark style="color:red;"><code>OrderUpdate</code></mark> events.</td></tr><tr><td align="center">stop_on_failure</td><td align="center">boolean</td><td align="center">No</td><td>If <mark style="color:red;"><code>true</code></mark>, stops processing remaining orders when the first order fails. Already successfully placed orders are NOT cancelled. Defaults to <mark style="color:red;"><code>false</code></mark>.</td></tr></tbody></table>

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
        "error": "Max trigger orders limit reached"
      }
    ]
  }
}
```

### Response Fields

<table><thead><tr><th width="200">Field</th><th>Description</th></tr></thead><tbody><tr><td>digest</td><td>Order digest (32-byte hash) if successfully placed, <mark style="color:red;"><code>null</code></mark> if failed.</td></tr><tr><td>error</td><td>Error message if order failed, <mark style="color:red;"><code>null</code></mark> if successful.</td></tr></tbody></table>

## Behavior

* **Partial Success**: By default, orders are processed independently. Some orders may succeed while others fail.
* **Stop on Failure**: Set `stop_on_failure: true` to stop processing remaining orders when the first order fails. Already successfully placed orders remain active.
* **Same Sender Required**: All orders in a batch must have the same sender. Mixed sender batches will be rejected with `BatchSenderMismatch` error.
* **Order Signing**: Each order must be individually signed using EIP712 (see [Signing](https://github.com/nadohq/nado-docs/blob/main/docs/developer-resources/api/gateway/executes/signing/README.md) for details).
* **Per-Order Limits**: The 25 pending trigger orders per product per subaccount limit applies to each order individually.

## Use Cases

* **Multi-Market Stop Losses**: Set stop loss triggers across multiple products simultaneously
* **Bracket Orders**: Place both take profit and stop loss triggers together
* **Conditional Exits**: Create multiple exit strategies across different products

## Example

Placing stop loss triggers for BTC and ETH perps:

```javascript
const placeTriggerOrdersParams = {
  orders: [
    {
      product_id: 2, // BTC-PERP
      order: {
        sender: subaccount,
        priceX18: toX18(95000), // Stop at $95k
        amount: toX18(-0.1), // Sell 0.1 BTC
        expiration: getExpiration(OrderType.DEFAULT),
        nonce: genOrderNonce(),
        appendix: buildAppendix({
          order_type: 0,
          trigger_type: OrderAppendixTriggerType.PRICE
        })
      },
      trigger: {
        price_trigger: {
          price_requirement: {
            oracle_price_below: toX18(95000)
          }
        }
      },
      signature: await signOrder(btcOrder),
      id: 1
    },
    {
      product_id: 3, // ETH-PERP
      order: {
        sender: subaccount, // Must be same sender
        priceX18: toX18(3600), // Stop at $3.6k
        amount: toX18(-1), // Sell 1 ETH
        expiration: getExpiration(OrderType.DEFAULT),
        nonce: genOrderNonce(),
        appendix: buildAppendix({
          order_type: 0,
          trigger_type: OrderAppendixTriggerType.PRICE
        })
      },
      trigger: {
        price_trigger: {
          price_requirement: {
            oracle_price_below: toX18(3600)
          }
        }
      },
      signature: await signOrder(ethOrder),
      id: 2
    }
  ],
  stop_on_failure: false
};

const response = await triggerClient.execute({ place_orders: placeTriggerOrdersParams });
```

## See Also

* [Place Order](https://docs.nado.xyz/developer-resources/api/trigger/executes/place-order) - Single trigger order placement
* [Cancel Orders](https://docs.nado.xyz/developer-resources/api/trigger/executes/cancel-orders) - Cancel multiple trigger orders
* [List Trigger Orders](https://docs.nado.xyz/developer-resources/api/trigger/queries/list-trigger-orders) - Query active trigger orders
