# Place Order

## Rate limits

* A max of 25 pending trigger orders per product per subaccount

{% hint style="info" %}
See more details in [Trigger Service Limits](https://docs.nado.xyz/developer-resources/rate-limits#trigger-service-limits).
{% endhint %}

## Request

{% tabs %}
{% tab title="Price Trigger" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/execute`</mark>

**Body**

```json

{
  "place_order": {
    "product_id": 1,
    "order": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "priceX18": "9900000000000000000000",
      "amount": "1000000000000000000",
      "expiration": "4294967295",
      "nonce": "1757062078359666688"
    },
    "trigger": {
      "price_trigger": {
        "price_requirement": {
          "oracle_price_below": "9900000000000000000000"
        }
      }
    },
    "signature": "0x",
    "id": 100
  }
}
```

{% endtab %}

{% tab title="TWAP Trigger" %} <mark style="color:orange;">`POST [TRIGGER_ENDPOINT]/execute`</mark>

**Body**

```json

{
  "place_order": {
    "product_id": 1,
    "order": {
      "sender": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
      "priceX18": "9900000000000000000000",
      "amount": "5000000000000000000",
      "expiration": "4294967295",
      "nonce": "1757062078359666688",
      "appendix": "21474836490"
    },
    "trigger": {
      "time_trigger": {
        "interval": 30,
        "amounts": ["1000000000000000000", "1000000000000000000", "1000000000000000000", "1000000000000000000", "1000000000000000000"]
      }
    },
    "signature": "0x",
    "id": 100
  }
}
```

{% endtab %}
{% endtabs %}

## Request Parameters

<table><thead><tr><th width="180" align="center">Parameter</th><th width="94" align="center">Type</th><th width="112" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td align="center">product_id</td><td align="center">number</td><td align="center">Yes</td><td>Id of spot / perp product for which to place order. Use <a href="../../gateway/queries/all-products">All products</a> query to retrieve all valid product ids.</td></tr><tr><td align="center">order</td><td align="center">object</td><td align="center">Yes</td><td>Order object, see <a href="../../../gateway/executes/place-order#signing">Signing</a> section for details on each order field.</td></tr><tr><td align="center">signature</td><td align="center">string</td><td align="center">Yes</td><td>Hex string representing hash of the <strong>signed</strong> order. See <a href="../../../gateway/executes/place-order#signing">Signing</a> section for more details.</td></tr><tr><td align="center">trigger</td><td align="center">object</td><td align="center">Yes</td><td>Trigger criteria can be either:<br><strong>Price-based:</strong> <mark style="color:red;"><code>{"price_trigger": {"price_requirement": {"oracle_price_above": "{PRICE}"}}}</code></mark><br><strong>Time-based (TWAP):</strong> <mark style="color:red;"><code>{"time_trigger": {"interval": {SECONDS}, "amounts": ["{AMOUNT1}", "{AMOUNT2}", ...]}}</code></mark></td></tr><tr><td align="center">digest</td><td align="center">string</td><td align="center">No</td><td>Hex string representing a hash of the order.</td></tr><tr><td align="center">spot_leverage</td><td align="center">boolean</td><td align="center">No</td><td>Indicates whether leverage should be used; when set to <mark style="color:red;"><code>false</code></mark> , placing the order fails if the transaction causes a borrow on the subaccount. Defaults to <mark style="color:red;"><code>true</code></mark>.</td></tr><tr><td align="center">id</td><td align="center">number</td><td align="center">No</td><td>An optional id that when provided is returned as part of <mark style="color:red;"><code>Fill</code></mark> and <mark style="color:red;"><code>OrderUpdate</code></mark> stream events when the order is triggered / executed. See <a href="../../gateway/executes/place-order">gateway > place order</a> and <a href="../../subscriptions">subscriptions</a> for more details.</td></tr></tbody></table>

{% hint style="info" %}
**Price Trigger Options:**

* <mark style="color:red;">`oracle_price_above`</mark>: Order is triggered if the oracle price is above or at the indicated price.
* <mark style="color:red;">`oracle_price_below`</mark>: Order is triggered if the oracle price is below or at the indicated price.
* <mark style="color:red;">`last_price_above`</mark>: Order is triggered if the last trade price is above or at the indicated price.
* <mark style="color:red;">`last_price_below`</mark>: Order is triggered if the last trade price is below or at the indicated price.
* <mark style="color:red;">`mid_price_above`</mark>: Order is triggered if the mid book price is above or at the indicated price.
* <mark style="color:red;">`mid_price_below`</mark>: Order is triggered if the mid book price is below or at the indicated price.

**TWAP (Time-Weighted Average Price) Trigger:**

* <mark style="color:red;">`time_trigger`</mark>: Executes orders at regular intervals over time.
  * <mark style="color:red;">`interval`</mark>: Time in seconds between each execution.
  * <mark style="color:red;">`amounts`</mark>: Optional array specifying the exact amount for each execution. If not provided, the total order amount is split evenly across executions.
* **TWAP orders must use IOC (Immediate or Cancel) execution type only**
* **TWAP orders cannot be combined with isolated margin**
* Use the <mark style="color:red;">`list_twap_executions`</mark> query to track individual execution statuses.
  {% endhint %}

## Trigger Order Dependencies

**Price triggers** can optionally depend on other orders being filled first. This allows creating complex order chains where one trigger only activates after another order executes.

**Dependency Configuration:**

```json
{
  "trigger": {
    "price_trigger": {
      "price_requirement": {
        "oracle_price_above": "50000000000000000000000"
      },
      "dependency": {
        "digest": "0x1234567890abcdef1234567890abcdef12345678",
        "on_partial_fill": false
      }
    }
  }
}
```

**Parameters:**

* <mark style="color:red;">`digest`</mark>: The order digest (32-byte hex string) that must be filled before this trigger activates
* <mark style="color:red;">`on_partial_fill`</mark>:
  * `true`: Trigger activates when the dependency order is partially filled
  * `false`: Trigger only activates when the dependency order is completely filled

**Important Notes:**

* Dependencies are **only supported for price triggers**, not TWAP orders
* Dependency orders can be regular orders or other trigger orders
* Circular dependencies are not allowed
* If a dependency order is cancelled, the dependent trigger order is also cancelled

**Use Cases:**

* **Take profit after stop loss**: Set a take profit order that only triggers after a stop loss executes
* **Scaling strategies**: Execute multiple orders in sequence based on fills
* **Complex exit strategies**: Chain multiple conditional exits together

## Constructing Order Appendix

{% hint style="warning" %}
**CRITICAL**: The order <mark style="color:red;">`appendix`</mark> field must be correctly configured for trigger orders. The appendix is a 128-bit integer sent as a string.
{% endhint %}

### Using Python SDK (Recommended)

```python
from nado_protocol.utils.appendix import build_appendix
from nado_protocol.utils.appendix import OrderAppendixTriggerType

# Price trigger order
appendix = build_appendix(
    order_type=0,  # DEFAULT
    trigger_type=OrderAppendixTriggerType.PRICE
)
# Result: "4096"

# TWAP order: 5 executions, 1% slippage (must use IOC)
appendix = build_appendix(
    order_type=1,  # IOC (required for TWAP)
    trigger_type=OrderAppendixTriggerType.TWAP,
    twap_times=5,
    twap_slippage_frac=0.01
)
# Result: "21474841600"
```

### Manual Bit Manipulation

```python
def build_trigger_appendix(trigger_type, order_type=0, twap_times=0, twap_slippage_frac=0.0):
    appendix = 0
    
    # Version (bits 0-7): Always 0
    appendix |= 0
    
    # Order type (bits 9-10): 0=DEFAULT, 1=IOC (required for TWAP)
    appendix |= (order_type & 0b11) << 9
    
    # Trigger type (bits 12-13): 1=PRICE, 2=TWAP, 3=TWAP_CUSTOM_AMOUNTS
    appendix |= (trigger_type & 0b11) << 12
    
    # TWAP configuration in value field (bits 32-127)
    if trigger_type == 2 or trigger_type == 3:  # TWAP or TWAP_CUSTOM_AMOUNTS
        slippage_x6 = int(twap_slippage_frac * 1_000_000)
        value = (twap_times & ((1 << 32) - 1)) | ((slippage_x6 & ((1 << 32) - 1)) << 32)
        appendix |= (value & ((1 << 96) - 1)) << 32
    
    return str(appendix)

# Examples:
price_appendix = build_trigger_appendix(1)  # Price trigger
# Result: "4096"

twap_appendix = build_trigger_appendix(2, 1, 5, 0.01)  # TWAP: IOC, 5 times, 1% slippage  
# Result: "21474841600"

twap_custom = build_trigger_appendix(3, 1, 10, 0.005)  # TWAP_CUSTOM_AMOUNTS: IOC, 10 times, 0.5% slippage
# Result: "42949678080"
```

{% hint style="info" %}
**Important constraints:**

* TWAP orders **must** use IOC (order\_type=1) execution
* TWAP orders **cannot** be combined with isolated margin
* For complete appendix encoding specification, see [Order Appendix](https://docs.nado.xyz/developer-resources/api/order-appendix) documentation
  {% endhint %}

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
