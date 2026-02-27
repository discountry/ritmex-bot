# Trigger

The trigger service enables sophisticated order execution strategies through conditional triggers:

## Order Types

### **Price Triggers**

Execute orders when price conditions are met:

* **Stop orders**: Trigger when price moves above or below a threshold
* **Take profit/Stop loss**: Automated position management
* **Support multiple price sources**: Oracle price, last trade price, or mid-book price

### **Time Triggers (TWAP)**

Execute large orders over time using Time-Weighted Average Price:

* **Split large orders**: Break into smaller executions to reduce market impact
* **Configurable intervals**: Set time between executions
* **Slippage protection**: Built-in slippage limits for each execution
* **Custom amounts**: Specify exact amounts for each execution or split evenly

## API Structure

There are two types of actions:

* <mark style="color:red;">`Execute`</mark>: Modifies state (place/cancel orders)
* <mark style="color:red;">`Query`</mark>: Fetches information (list orders, TWAP status)

**HTTP Endpoints:**

* <mark style="color:red;">`POST [TRIGGER_ENDPOINT]/execute`</mark> for order placement and cancellation
* <mark style="color:red;">`POST [TRIGGER_ENDPOINT]/query`</mark> for querying trigger order status

<mark style="color:red;">`HTTP`</mark> requests must set the `Accept-Encoding` to include `gzip`, `br` or `deflate`

## Rate Limits

* **Maximum pending orders**: 25 pending trigger orders per product per subaccount
* **TWAP constraints**: Must use IOC execution type, cannot combine with isolated margin

## Key Requirements

### **Order Appendix Configuration**

All trigger orders require proper [Order Appendix](https://docs.nado.xyz/developer-resources/api/order-appendix) configuration:

* **Trigger type**: Specify price (1), TWAP (2), or TWAP with custom amounts (3) in appendix bits
* **Execution type**: TWAP orders **must** use IOC execution
* **TWAP parameters**: Encode execution count and slippage limits in appendix value field

## Endpoints

### Testnet:

* <mark style="color:red;">`https://trigger.test.nado.xyz/v1`</mark>

{% content-ref url="trigger/executes" %}
[executes](https://docs.nado.xyz/developer-resources/api/trigger/executes)
{% endcontent-ref %}

{% content-ref url="trigger/queries" %}
[queries](https://docs.nado.xyz/developer-resources/api/trigger/queries)
{% endcontent-ref %}
