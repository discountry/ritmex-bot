# Definitions / Formulas

## Definitions

### **Unsettled USDT0**

Perp balances have two main components:

* <mark style="color:red;">`amount`</mark>
* <mark style="color:red;">`v_quote_balance`</mark>

When you buy a perp, <mark style="color:red;">`amount`</mark> increments and <mark style="color:red;">`v_quote_balance`</mark> decrements, and vice versa for selling.

Settlement is the process of converting from <mark style="color:red;">v\_quote\_balance</mark> into actual USDT0 balance. This happens mostly on position close, but may happen on extremely negative PNL positions when we need to pay out positive PNL positions.

The amount that is transferred between <mark style="color:red;">`v_quote_balance`</mark> in the perp and your USDT0 balance is an amount that results in <mark style="color:red;">`amount * oracle_price + v_quote_balance == 0`</mark>. Unsettled USDT0 is the total amount that would be transferred between <mark style="color:red;">`v_quote_balance`</mark> and your USDT0 balance summed across all perps.

### **Unsettled PNL**

**Note:** Technically, there is no such concept as "Unsettled PNL" in our system. However, the UI displays "Unsettled PnL" in some places (e.g., in the USDT0 Balance section) for user clarity.

**What the UI actually shows:** When you see "Unsettled PnL" in the UI, it refers to **Unsettled USDT0** (see above) - the total unsettled quote balance across all perp positions.

**For developers:** Always use **Unsettled USDT0** when referring to this value programmatically. It represents the sum of <mark style="color:red;">`amount × oracle_price + v_quote_balance`</mark> across all perp positions, which is the amount that would be settled into your USDT0 balance.

### **Unrealized PNL**

Refers to the estimated gains or losses of a current position based on the difference between the average entry price and the current oracle price.

## Formulas

### **Unrealized PNL**

Using the [indexer's events query](https://docs.nado.xyz/developer-resources/api/archive-indexer/events), your unrealized PNL at the end of some event is given by:

{% code lineNumbers="true" %}

```python
unrealized_pnl = (
    event.post_balance.amount * event.product.oracle_price_x18 
    - event.net_entry_unrealized
)
```

{% endcode %}

### Total PNL

Your total PNL between <mark style="color:red;">`event1`</mark> and <mark style="color:red;">`event2`</mark>, assuming <mark style="color:red;">`event1`</mark> is after <mark style="color:red;">`event2`</mark> - is given by:

<pre class="language-python" data-line-numbers><code class="lang-python"><strong>total_pnl = (
</strong><strong>    (event1.post_balance.amount * event1.product.oracle_price_x18 - event1.net_entry_cumulative)
</strong><strong>    - (event2.post_balance.amount * event2.product.oracle_price_x18 - event2.net_entry_cumulative)
</strong><strong>)
</strong></code></pre>

{% hint style="info" %}
**Notes**:

* You can use 0 for the second term for the PNL to compute since the beginning of time.
* For spots, we will count deposits and withdraws towards your PNL. i.e. if you deposit BTC, for PNL tracking purposes it is counted as a BTC long at the oracle price.
  {% endhint %}
