# Order Appendix

The **Order Appendix** is a 128-bit integer that encodes extra order parameters like execution type, isolated margin, and trigger configurations.

## Bit Layout

```json
| value   | reserved | trigger | reduce only | order type | isolated | version |
| 64 bits | 50 bits  | 2 bits  | 1 bit       | 2 bits     | 1 bit    | 8 bits  |
| 127..64 | 63..14   | 13..12  | 11          | 10..9      | 8        | 7..0    |
```

## Fields (from LSB to MSB)

### <mark style="color:red;">Version</mark>

**8-bits (0-7)**. Protocol version identifier. Currently <mark style="color:red;">`1`</mark>. May increment when encoding structure updates.

### <mark style="color:red;">Isolated</mark>

**1-bit (8)**. Indicates whether the order uses isolated margin. Isolated positions have dedicated margin for a specific product, creating a separate isolated subaccount. The original account becomes the "parent subaccount" that can manage the isolated position.

*Key Properties:*

* Creates isolated subaccount with dedicated margin
* Only quote transfers allowed between isolated and parent subaccounts
* Parent account can sign orders for isolated subaccount
* Cannot be combined with TWAP orders

*Example:*

```python
from nado_protocol.utils.appendix import build_appendix
from nado_protocol.utils.math import to_x6

# Create isolated order with 1000 USDT0 margin
appendix = build_appendix(
    order_type=OrderType.DEFAULT,
    isolated=True,
    isolated_margin=to_x6(1000)  # 1000 USDT0 (x6 precision)
)
```

### <mark style="color:red;">Order Type</mark>

**2-bits (9-10)**. Execution behavior for the order.

*Values:*

* <mark style="color:red;">`0`</mark> - <mark style="color:red;">`DEFAULT`</mark>: Standard limit order behavior.
* <mark style="color:red;">`1`</mark> - <mark style="color:red;">`IOC (Immediate or Cancel)`</mark>: Execute immediately, cancel unfilled portion.
* <mark style="color:red;">`2`</mark> - <mark style="color:red;">`FOK (Fill or Kill)`</mark>: Execute completely or cancel entire order.
* <mark style="color:red;">`3`</mark> - <mark style="color:red;">`POST_ONLY`</mark>: Only add liquidity, reject if would take liquidity.

*Example:*

```python
from nado_protocol.utils.appendix import build_appendix

# Post-only order that only provides liquidity
appendix = build_appendix(
    order_type=OrderType.POST_ONLY
)
```

### <mark style="color:red;">Reduce Only</mark>

**1-bit (11)**. Restricts order to only decrease existing positions. Prevent accidentally increasing position size. Order will be rejected if it would increase the position in the same direction.

*Use Cases:*

* Risk management when closing positions.
* Taking profits without adding exposure.
* Automated position reduction strategies.

*Example:*

```python
from nado_protocol.utils.appendix import build_appendix

# Reduce-only order to close part of existing position
appendix = build_appendix(
    order_type=OrderType.DEFAULT,
    reduce_only=True
)
```

### <mark style="color:red;">Trigger Type</mark>

**2-bits (12-13)**. Conditional execution behavior.

*Values:*

* <mark style="color:red;">`0`</mark> - <mark style="color:red;">`NONE`</mark>: Execute immediately (regular order).
* <mark style="color:red;">`1`</mark> - <mark style="color:red;">`PRICE`</mark>: Price-based conditional order.
* <mark style="color:red;">`2`</mark> - <mark style="color:red;">`TWAP`</mark>: Time-Weighted Average Price execution.
* <mark style="color:red;">`3`</mark> - <mark style="color:red;">`TWAP_CUSTOM_AMOUNTS`</mark>: TWAP with randomized amounts.

*Example:*

```python
from nado_protocol.utils.appendix import build_appendix

# TWAP order executing 5 times with 0.5% max slippage
appendix = build_appendix(
    order_type=OrderType.DEFAULT,
    trigger_type=OrderAppendixTriggerType.TWAP,
    twap_times=5,
    twap_slippage_frac=0.005  # 0.5%
)
```

### <mark style="color:red;">Reserved</mark>

**50-bits (14-63)**. Reserved for future protocol extensions. Must be set to `0`.

### <mark style="color:red;">Value</mark>

**64-bits (64-127)**. Context-dependent data based on other flags.

#### <mark style="color:red;">**TWAP Configuration (when trigger = 2 or 3)**</mark>

Encodes TWAP execution parameters in the 64-bit value field:

```json
| times  | slippage_x6 |
| 32 bits|   32 bits   |
```

**Fields:**

* <mark style="color:red;">`times`</mark>: Number of TWAP executions.
* <mark style="color:red;">`slippage_x6`</mark>: Maximum slippage × 1\_000\_000 (6 decimal precision).

**Example:**

```python
from nado_protocol.utils.appendix import build_appendix, order_twap_data

# TWAP: 10 executions, 1% max slippage
appendix = build_appendix(
    order_type=OrderType.DEFAULT,
    trigger_type=OrderAppendixTriggerType.TWAP,
    twap_times=10,
    twap_slippage_frac=0.01  # 1%
)

# Extract TWAP data
times, slippage = order_twap_data(appendix)
# times = 10, slippage = 0.01
```

#### <mark style="color:red;">**Isolated Margin (when isolated = 1)**</mark>

Amount of quote (margin\_x6) to transfer to isolated subaccount on first fill, stored in the 64-bit value field.

{% hint style="warning" %}
**Important:** Isolated margin is stored in **x6 precision** (6 decimals) in the appendix value field.

* Stored as `margin_x6` (6 decimal places)
* Takes up 64 bits (bits 64-127 of the appendix)
  {% endhint %}

*Example:*

```python
from nado_protocol.utils.appendix import build_appendix, order_isolated_margin
from nado_protocol.utils.math import to_x6

# Isolated order with 500 USDT0 margin
appendix = build_appendix(
    order_type=OrderType.DEFAULT,
    isolated=True,
    isolated_margin=to_x6(500)  # 500 USDT0 (x6 precision)
)

# Extract isolated margin
margin = order_isolated_margin(appendix)
# Returns: 500000000 (500 * 10^6 in x6 precision)
```

## Constraints

* **Isolated + TWAP**: Cannot combine isolated orders with TWAP (trigger types 2 or 3).
* **TWAP Requirements**: TWAP orders must specify both <mark style="color:red;">`twap_times`</mark> and <mark style="color:red;">`twap_slippage_frac`</mark> .
* **Isolated Margin**: Can only set <mark style="color:red;">`isolated_margin`</mark> when <mark style="color:red;">`isolated=True`</mark> .

## Migration from Legacy Format

**Before (deprecated):**

* Order type encoded in <mark style="color:red;">`expiration`</mark> field.
* Reduce-only flag encoded in <mark style="color:red;">`nonce`</mark> field.
* Limited trigger functionality.

**After (current):**

* All flags consolidated in 128-bit <mark style="color:red;">`appendix`</mark> .
* <mark style="color:red;">`expiration`</mark> is pure timestamp.
* <mark style="color:red;">`nonce`</mark> encodes <mark style="color:red;">`recv_time`</mark> only.
* Enhanced trigger and isolated margin support.

## Building Appendix Values

#### Using Python SDK (Recommended)

```python
from nado_protocol.utils.expiration import OrderType
from nado_protocol.utils.appendix import build_appendix, OrderAppendixTriggerType

# Simple market order
appendix = build_appendix(order_type=OrderType.DEFAULT)

# Post-only reduce order
appendix = build_appendix(
    order_type=OrderType.POST_ONLY,
    reduce_only=True
)

# Isolated order with margin
appendix = build_appendix(
    order_type=OrderType.DEFAULT,
    isolated=True,
    isolated_margin=to_x6(1000)  # 1000 USDT0 (x6 precision)
)

# TWAP order
appendix = build_appendix(
    order_type=OrderType.DEFAULT,
    trigger_type=OrderAppendixTriggerType.TWAP,
    twap_times=5,
    twap_slippage_frac=0.01  # 1%
)
```

#### Manual Bit Manipulation (Advanced)

{% hint style="info" %}
Refer to [nado\_protocol.utils.order](https://nadohq.github.io/nado-python-sdk/_modules/nado_protocol/utils/order.html) for a detailed implementation.
{% endhint %}

```python
# Build appendix manually
def build_manual_appendix(order_type=0, isolated=False, reduce_only=False,
                         trigger_type=0, value=0):
    appendix = 0

    # Version (bits 0-7)
    appendix |= 1  # Version 1

    # Isolated (bit 8)
    if isolated:
        appendix |= 1 << 8

    # Order type (bits 9-10)
    appendix |= (order_type & 0b11) << 9

    # Reduce only (bit 11)
    if reduce_only:
        appendix |= 1 << 11

    # Trigger type (bits 12-13)
    appendix |= (trigger_type & 0b11) << 12

    # Reserved bits 14-63 (set to 0)

    # Value (bits 64-127)
    # Note: Value is stored in x6 precision for isolated margin
    appendix |= (value & ((1 << 64) - 1)) << 64

    return appendix

# Example: Post-only reduce order
appendix = build_manual_appendix(
    order_type=3,  # POST_ONLY
    reduce_only=True
)
```

### Utility Functions

```python
# Check order properties
is_reduce_only = order_reduce_only(appendix)
is_trigger = order_is_trigger_order(appendix)
is_isolated = order_is_isolated(appendix)
version = order_version(appendix)
order_type = order_execution_type(appendix)
trigger_type = order_trigger_type(appendix)

# Extract context data
twap_data = order_twap_data(appendix)  # Returns (times, slippage) or None
isolated_margin = order_isolated_margin(appendix)  # Returns margin or None
```
