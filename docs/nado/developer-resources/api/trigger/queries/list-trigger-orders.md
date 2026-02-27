# List Trigger Orders

## Request

{% tabs %}
{% tab title="Basic query" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/query`</mark>

**Body**

```json

{
  "type": "list_trigger_orders",
  "tx": {
    "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "recvTime": "1688768157050"
  },
  "signature": "0x",
  "product_ids": [1, 2],
  "max_update_time": 1688768157,
  "limit": 20
}
```

{% endtab %}

{% tab title="Fetch by digest" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/query`</mark>

**Body**

```json

{
  "type": "list_trigger_orders",
  "tx": {
    "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "recvTime": "1688768157050"
  },
  "signature": "0x",
  "digests": ["0x5886d5eee7dc4879c7f8ed1222fdbbc0e3681a14c1e55d7859515898c7bd2038"],
  "limit": 20
}
```

{% endtab %}

{% tab title="Filter by type and status" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/query`</mark>

**Body**

```json

{
  "type": "list_trigger_orders",
  "tx": {
    "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "recvTime": "1688768157050"
  },
  "signature": "0x",
  "trigger_types": ["time_trigger"],
  "status_types": ["twap_executing", "waiting_price"],
  "product_ids": [1, 2, 3],
  "limit": 50
}
```

{% endtab %}

{% tab title="Filter by reduce-only" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/query`</mark>

**Body**

```json

{
  "type": "list_trigger_orders",
  "tx": {
    "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "recvTime": "1688768157050"
  },
  "signature": "0x",
  "reduce_only": true,
  "product_ids": [1, 2],
  "limit": 20
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

{% hint style="info" %}
**Note**: `max_update_time` It's the time that the trigger order last changed state. For example, if a trigger order is placed & pending, the update time = time of placement. If the trigger order is cancelled, then the update time = time of cancellation.
{% endhint %}

<table><thead><tr><th width="201" align="center">Parameter</th><th width="128" align="center">Type</th><th width="129" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">tx</td><td align="center">object</td><td align="center">Yes</td><td>List trigger orders transaction object. See <a href="#signing">Signing</a> section for details on the transaction fields.</td></tr><tr><td align="center">tx.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">tx.recvTime</td><td align="center">string</td><td align="center">Yes</td><td>Encoded time in milliseconds after which the list trigger orders transaction will be ignored. cannot be more than 100 seconds from the time it is received by the server.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Signed transaction. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">product_ids</td><td align="center">number[]</td><td align="center">No</td><td>If provided, returns trigger orders for the specified products; otherwise, returns trigger orders for all products.</td></tr><tr><td align="center">trigger_types</td><td align="center">string[]</td><td align="center">No</td><td>If provided, filters by trigger type. Values: <mark style="color:red;"><code>price_trigger</code></mark>, <mark style="color:red;"><code>time_trigger</code></mark>.</td></tr><tr><td align="center">status_types</td><td align="center">string[]</td><td align="center">No</td><td>If provided, filters by order status. Values: <mark style="color:red;"><code>cancelled</code></mark>, <mark style="color:red;"><code>triggered</code></mark>, <mark style="color:red;"><code>internal_error</code></mark>, <mark style="color:red;"><code>triggering</code></mark>, <mark style="color:red;"><code>waiting_price</code></mark>, <mark style="color:red;"><code>waiting_dependency</code></mark>, <mark style="color:red;"><code>twap_executing</code></mark>, <mark style="color:red;"><code>twap_completed</code></mark>.</td></tr><tr><td align="center">max_update_time</td><td align="center">number</td><td align="center">No</td><td>If provided, returns all trigger orders that were last updated up to <mark style="color:red;"><code>max_update_time</code></mark>. must be a unix epoch in seconds.</td></tr><tr><td align="center">max_digest</td><td align="center">string</td><td align="center">No</td><td>If provided, returns all trigger orders up to the given order digest (exclusive). This can be used for pagination.</td></tr><tr><td align="center">digests</td><td align="center">string[]</td><td align="center">No</td><td>If provided, only returns the trigger orders for the associated digests. <strong>Note</strong>: all other filters are ignored when <mark style="color:red;"><code>digests</code></mark> is provided.</td></tr><tr><td align="center">reduce_only</td><td align="center">boolean</td><td align="center">No</td><td>If provided, filters trigger orders by reduce-only flag. <mark style="color:red;"><code>true</code></mark> returns only orders that can only decrease existing positions. If omitted, returns all orders regardless of reduce-only status.</td></tr><tr><td align="center">limit</td><td align="center">number</td><td align="center">No</td><td>If provided, returns the most recently updated trigger orders up to <mark style="color:red;"><code>limit</code></mark>. defaults to 100. max limit is 500.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

```solidity
struct ListTriggerOrders {
    bytes32 sender;
    uint64 recvTime;
}
```

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier

<mark style="color:red;">`recvTime`</mark>: the time in milliseconds (a `recv_time`) after which the transaction should be ignored by the trigger service. cannot be more than 100 seconds from the time it is received by the server.

{% hint style="warning" %}
**Note**: for signing you should always use the data type specified in the solidity struct which might be different from the type sent in the request e.g: <mark style="color:red;">`recvTime`</mark> should be an <mark style="color:red;">`uint64`</mark> for **Signing** but should be sent as a <mark style="color:red;">`string`</mark> in the final payload.
{% endhint %}

## Response

#### Success

```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "order": {
          "order": {
            "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43000000000000000000000000",
            "priceX18": "1000000000000000000",
            "amount": "1000000000000000000",
            "expiration": "2000000000",
            "nonce": "1",
          },
          "signature": "0x...",
          "product_id": 1,
          "spot_leverage": true,
          "trigger": {
            "price_above": "1000000000000000000"
          },
          "digest": "0x..."
        },
        "status": "pending",
        "placed_at": 1688768157000,
        "updated_at": 1688768157050
      }
    ]
  },
  "request_type": "query_list_trigger_orders"
}
```

{% hint style="info" %}
**Note**: trigger orders can have the following statuses:

* **cancelled**: trigger order was cancelled due to user request, order expiration, or account health issues.
* **triggered**: trigger criteria was met, and order was submitted for execution.
* **internal\_error**: an internal error occurred while processing the trigger order.
* **triggering**: trigger order is currently being processed for execution.
* **waiting\_price**: trigger order is waiting for price criteria to be met.
* **waiting\_dependency**: trigger order is waiting for a dependency order to be filled.
* **twap\_executing**: TWAP order is currently executing individual orders over time.
* **twap\_completed**: TWAP order has completed all scheduled executions.
  {% endhint %}

#### Failure

```json
{
  "status": "failure",
  "signature": {signature}
  "error": "{error_msg}"
  "error_code": {error_code}
  "request_type": "query_list_trigger_orders"
}
```
