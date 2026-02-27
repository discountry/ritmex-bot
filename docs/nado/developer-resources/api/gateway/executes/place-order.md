# Place Order

## Rate limits

* With spot leverage: 600 orders/minute or 10 orders/sec per wallet. (**weight=1**)
* Without spot leverage: 30 orders/min or 5 orders every 10 seconds per wallet. (**weight = 20**)

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
  "place_order": {
    "product_id": 1,
    "order": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "priceX18": "1000000000000000000",
      "amount": "1000000000000000000",
      "expiration": "4294967295",
      "nonce": "1757062078359666688",
      "appendix": "1"
    },
    "signature": "0x",
    "id": 100
  }
}
```

{% endtab %}

{% tab title="REST" %} <mark style="color:orange;">`POST [GATEWAY_REST_ENDPOINT]/execute`</mark>

**Body**

```json

{
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
    "id": 100
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="180" align="center">Parameter</th><th width="94" align="center">Type</th><th width="112" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to place order. Use <a href="../queries/all-products">All products</a> query to retrieve all valid product ids.</td></tr><tr><td align="center">order</td><td align="center">object</td><td align="center">Yes</td><td>Order object, see <a href="#signing">Signing</a> section for details on each order field.</td></tr><tr><td align="center">order.sender</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing the subaccount's 32 bytes (address + subaccount name) of the tx sender.</td></tr><tr><td align="center">order.priceX18</td><td align="center">string</td><td align="center">Yes</td><td>Price of the order multiplied by 1e18.</td></tr><tr><td align="center">order.amount</td><td align="center">string</td><td align="center">Yes</td><td>Quantity of the order multiplied by 1e18.</td></tr><tr><td align="center">order.expiration</td><td align="center">string</td><td align="center">Yes</td><td>A time after which the order should automatically be cancelled, as a timestamp in seconds after the unix epoch.</td></tr><tr><td align="center">order.nonce</td><td align="center">string</td><td align="center">Yes</td><td>Used to differentiate between the same order multiple times. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">order.appendix</td><td align="center">string</td><td align="center">Yes</td><td>Encodes various order properties including execution types, isolated positions, TWAP parameters, and trigger types. See order appendix section for more details.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing hash of the <strong>signed</strong> order. See <a href="#signing">Signing</a> section for more details.</td></tr><tr><td align="center">digest</td><td align="center">string</td><td align="center">No</td><td>Hex string representing a hash of the order.</td></tr><tr><td align="center">spot_leverage</td><td align="center">boolean</td><td align="center">No</td><td>Indicates whether leverage should be used; when set to <mark style="color:red;"><code>false</code></mark> , placing the order fails if the transaction causes a borrow on the subaccount. Defaults to <mark style="color:red;"><code>true</code></mark>.</td></tr><tr><td align="center">id</td><td align="center">number</td><td align="center">No</td><td>An optional id that when provided is returned as part of <mark style="color:red;"><code>Fill</code></mark> and <mark style="color:red;"><code>OrderUpdate</code></mark> stream events. See <a href="../../subscriptions">subscriptions</a> for more details.<br><br><strong>NOTE</strong>: The client <mark style="color:red;"><code>id</code></mark> should not be used to differentiate orders, as it is not included in the order hash (i.e., the order <mark style="color:red;"><code>digest</code></mark>). Instead, use the last 20 bits of the order nonce to distinguish between similar orders. For more details, refer to <a href="#order-nonce">Order Nonce</a>.</td></tr></tbody></table>

## Signing

{% hint style="info" %}
See more details and examples in our [signing](https://docs.nado.xyz/developer-resources/api/gateway/signing) page.
{% endhint %}

The solidity typed data struct that needs to be signed is:

```solidity
struct Order {
    bytes32 sender;
    int128 priceX18;
    int128 amount;
    uint64 expiration;
    uint64 nonce;
    uint128 appendix;
}
```

<mark style="color:red;">`sender`</mark>: a <mark style="color:red;">`bytes32`</mark> sent as a hex string; includes the address and the subaccount identifier

<mark style="color:red;">`priceX18`</mark>: an <mark style="color:red;">`int128`</mark> representing the price of the order multiplied by 1e18, sent as a string. For example, a price of 1 USDT0 would be sent as <mark style="color:red;">`"1000000000000000000"`</mark>

<mark style="color:red;">`amount`</mark>: an <mark style="color:red;">`int128`</mark> representing the quantity of the order multiplied by 1e18, sent as a string. A positive amount means that this is a buy order, and a negative amount means this is a sell order.

<mark style="color:red;">`expiration`</mark>: a time after which the order should automatically be cancelled, as a timestamp in seconds after the unix epoch, sent as a string.

### Order Nonce

<mark style="color:red;">`nonce`</mark>: used to differentiate between the same order multiple times, and a user trying to place an order with the same parameters twice. Sent as a string. Encodes two bit of information:

* Most significant <mark style="color:red;">`44`</mark> bits encoding the time in milliseconds (a `recv_time`) after which the order should be ignored by the matching engine
* Least significant <mark style="color:red;">`20`</mark> bits are a random integer used to avoid hash collisions

  For example, to place an order with a random integer of <mark style="color:red;">`1000`</mark>, and a discard time 50 ms from now, we would send a nonce of <mark style="color:red;">`((timestamp_ms() + 50) << 20) + 1000)`</mark>

```python
import time
unix_epoch_ms = int(time.time()) * 1000
nonce = ((unix_epoch_ms + 50) << 20) + 1000
```

{% hint style="warning" %}
**Note**: for signing you should always use the data type specified in the solidity struct which might be different from the type sent in the request e.g: <mark style="color:red;">`nonce`</mark> should be an <mark style="color:red;">`uint64`</mark> for **Signing** but should be sent as a <mark style="color:red;">`string`</mark> in the final payload.
{% endhint %}

## Order Appendix

{% hint style="info" %}
See more details and examples in our [Order Appendix](https://docs.nado.xyz/developer-resources/api/order-appendix) page.
{% endhint %}

<mark style="color:red;">`appendix`</mark>: is a 128-bit integer that encodes extra order parameters like execution type, isolated margin, and trigger type.

### Bit Layout

```json
| value   | reserved | trigger | reduce only | order type | isolated | version |
| 64 bits | 50 bits  | 2 bits  | 1 bit       | 2 bits     | 1 bit    | 8 bits  |
| 127..64 | 63..14   | 13..12  | 11          | 10..9      | 8        | 7..0    |
```

**Fields (from LSB to MSB):**

* <mark style="color:red;">**Version (8 bits, 0–7)**</mark> – protocol version (currently `1`)
* <mark style="color:red;">**Isolated (1 bit, 8)**</mark> – whether the order uses isolated margin
* <mark style="color:red;">**Order Type (2 bits, 9–10)**</mark> – 0 = DEFAULT, 1 = IOC, 2 = FOK, 3 = POST\_ONLY
  * <mark style="color:red;">`0`</mark> - <mark style="color:red;">`DEFAULT`</mark>: Standard limit order behavior
  * <mark style="color:red;">`1`</mark> - <mark style="color:red;">`IOC (Immediate or Cancel)`</mark>: Execute immediately, cancel unfilled portion
  * <mark style="color:red;">`2`</mark> - <mark style="color:red;">`FOK (Fill or Kill)`</mark>: Execute completely or cancel entire order
  * <mark style="color:red;">`3`</mark> - <mark style="color:red;">`POST_ONLY`</mark>: Only add liquidity, reject if would take liquidity
* <mark style="color:red;">**Reduce Only (1 bit, 11)**</mark> – only decreases an existing position.
* <mark style="color:red;">**Trigger Type (2 bits, 12–13)**</mark> – 0 = NONE, 1 = PRICE, 2 = TWAP, 3 = TWAP\_CUSTOM\_AMOUNTS
* <mark style="color:red;">**Reserved (50 bits, 14–63)**</mark> – future use
* <mark style="color:red;">**Value (64 bits, 64–127)**</mark> – extra data (isolated margin or TWAP parameters)
  * if <mark style="color:red;">`trigger`</mark> is <mark style="color:red;">`2`</mark> or <mark style="color:red;">`3`</mark> ⇒ <mark style="color:red;">`value`</mark> represents how many times the TWAP order will execute and the maximum acceptable slippage. Encoded as:

    ```json
    | times  | slippage_x6 |
    | 32 bits|   32 bits   |
    ```

    * <mark style="color:red;">`times`</mark> : Number of TWAP executions.
    * <mark style="color:red;">`slippage_x6`</mark>: Maximum slippage × 1,000,000 (6 decimal precision).
  * if <mark style="color:red;">`isolated`</mark> is <mark style="color:red;">`1`</mark> ⇒ <mark style="color:red;">`value`</mark> represents <mark style="color:red;">`margin_x6`</mark> (in x6 precision, 6 decimals) to be transferred to the isolated subaccount when the order gets its first match.
  * otherwise, <mark style="color:red;">`value`</mark> is <mark style="color:red;">`0`</mark>.

## Response

#### Success

```json
{
  "status": "success",
  "signature": {signature},
  "data": { 
    "digest": {order digest} 
  },
  "request_type": "execute_place_order"
  "id": 100
}
```

#### Failure

```json
{
  "status": "failure",
  "signature": {signature},
  "error": "{error_msg}",
  "error_code": {error_code},
  "request_type": "execute_place_order"
}
```
