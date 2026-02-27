# Streams

## Available Streams

See below the available streams you can subscribe to:

```rust
pub enum StreamSubscription {
    // pass `null` product_id to subscribe to all products
    OrderUpdate { product_id: Option<u32>, subaccount: H256 },
    Trade { product_id: u32 },
    BestBidOffer { product_id: u32 },
    // pass `null` product_id to subscribe to all products
    Fill { product_id: Option<u32>, subaccount: H256 },
    // pass `null` product_id to subscribe to all products
    PositionChange { product_id: Option<u32>, subaccount: H256},
    BookDepth { product_id: u32 },
    // pass `null` product_id to subscribe to all products
    Liquidation { product_id: Option<u32> },
    LatestCandlestick {
        product_id: u32,
        // time interval in seconds (e.g., 60, 300, 900, 3600)
        granularity: i32
    },
    FundingPayment { product_id: u32 },
    // pass `null` product_id to subscribe to all products
    FundingRate { product_id: Option<u32> }
}
```

## **Subscribing to a stream**

{% tabs %}
{% tab title="Order Update" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: Yes.*

{% hint style="info" %}
**Note**: Set <mark style="color:red;">`product_id`</mark> to <mark style="color:red;">`null`</mark> to subscribe to order updates across all products for the subaccount.
{% endhint %}

```json
{
  "method": "subscribe",
  "stream": {
    "type": "order_update",
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "product_id": 1
  },
  "id": 10
}
```

**Subscribe to all products:**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "order_update",
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "product_id": null
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Trade" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

```json
{
  "method": "subscribe",
  "stream": {
    "type": "trade",
    "product_id": 0
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Best Bid Offer" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

```json
{
  "method": "subscribe",
  "stream": {
    "type": "best_bid_offer",
    "product_id": 0
  },
  "id": 10
}
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Fill" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

{% hint style="info" %}
**Note**: Set <mark style="color:red;">`product_id`</mark> to <mark style="color:red;">`null`</mark> to subscribe to fills across all products for the subaccount.
{% endhint %}

```json
{
  "method": "subscribe",
  "stream": {
    "type": "fill",
    "product_id": 1,
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000"
  },
  "id": 10
}
```

**Subscribe to all products:**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "fill",
    "product_id": null,
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000"
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Position Change" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

{% hint style="info" %}
**Note**: Set <mark style="color:red;">`product_id`</mark> to <mark style="color:red;">`null`</mark> to subscribe to position changes across all products for the subaccount.
{% endhint %}

```json
{
  "method": "subscribe",
  "stream": {
    "type": "position_change",
    "product_id": 0,
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000"
  },
  "id": 10
}
```

**Subscribe to all products:**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "position_change",
    "product_id": null,
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000"
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Book Depth" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

```json
{
  "method": "subscribe",
  "stream": {
    "type": "book_depth",
    "product_id": 0
  },
  "id": 10
}
```

{% endtab %}
{% endtabs %}

{% tabs %}
{% tab title="Liquidation" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

{% hint style="info" %}
**Note**: Set <mark style="color:red;">`product_id`</mark> to <mark style="color:red;">`null`</mark> to subscribe to liquidations across all products.
{% endhint %}

```json
{
  "method": "subscribe",
  "stream": {
    "type": "liquidation",
    "product_id": 1
  },
  "id": 10
}
```

**Subscribe to all products:**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "liquidation",
    "product_id": null
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Latest Candlestick" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

{% hint style="info" %}
See all supportes <mark style="color:red;">`granularity`</mark> values in [Available Granularities](https://docs.nado.xyz/developer-resources/archive-indexer/candlesticks#available-granularities)
{% endhint %}

*Requires Authentication: No.*

```json
{
  "method": "subscribe",
  "stream": {
    "type": "latest_candlestick",
    "product_id": 1,
    "granularity": 60
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Funding Payment" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

```json
{
  "method": "subscribe",
  "stream": {
    "type": "funding_payment",
    "product_id": 2
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Funding Rate" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

*Requires Authentication: No.*

{% hint style="info" %}
**Note**: Set <mark style="color:red;">`product_id`</mark> to <mark style="color:red;">`null`</mark> to subscribe to funding rate updates across all products.
{% endhint %}

```json
{
  "method": "subscribe",
  "stream": {
    "type": "funding_rate",
    "product_id": 2
  },
  "id": 10
}
```

**Subscribe to all products:**

```json
{
  "method": "subscribe",
  "stream": {
    "type": "funding_rate",
    "product_id": null
  },
  "id": 10
}
```

{% endtab %}
{% endtabs %}

### **Response**

```json
{
  "result": null,
  "id": 10
}
```

## **Unsubscribing**

{% tabs %}
{% tab title="Order Update" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

```json
{
  "method": "unsubscribe",
  "stream": {
    "type": "order_update",
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "product_id": 1
  },
  "id": 10
}
```

**Unsubscribe from all products:**

```json
{
  "method": "unsubscribe",
  "stream": {
    "type": "order_update",
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    "product_id": null
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Trade" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

```json
{
  "method": "unsubscribe",
  "stream": {
    "type": "trade",
    "product_id": 0
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Best Bid Offer" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

```json
{
  "method": "unsubscribe",
  "stream": {
    "type": "best_bid_offer",
    "product_id": 0
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Fill" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

```json
{
  "method": "unsubscribe",
  "stream": {
    "type": "fill",
    "product_id": 0,
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000"
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Position Change" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

```json
{
  "method": "unsubscribe",
  "stream": {
    "type": "position_change",
    "product_id": 0,
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000"
  },
  "id": 10
}
```

{% endtab %}

{% tab title="Book Depth" %}
**Connect**

<mark style="color:orange;">`WEBSOCKET [SUBSCRIPTIONS_ENDPOINT]`</mark>

**Message**

```json
{
  "method": "unsubscribe",
  "stream": {
    "type": "book_depth",
    "product_id": 0,
  },
  "id": 10
}
```

{% endtab %}
{% endtabs %}

### **Response**

```json
{
  "result": null,
  "id": 10
}
```

## **Listing subscribed streams**

```json
{
  "method": "list",
  "id": 10
}
```

### Response

```json
{
  "result": [
    {
      "type": "default"
    },
    {
      "type": "trade",
      "product_id": 0
    }
  ],
  "id": 10
}
```
