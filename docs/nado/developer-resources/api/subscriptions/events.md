# Events

## **Order Update**

**Update speed: real-time**

```json
{
  "type": "order_update",
  // timestamp of the event in nanoseconds
  "timestamp": "1695081920633151000", 
  "product_id": 1,
  // order digest
  "digest": "0xf7712b63ccf70358db8f201e9bf33977423e7a63f6a16f6dab180bdd580f7c6c",
  // remaining amount to be filled.
  // will be `0` if the order is either fully filled or cancelled.
  "amount": "82000000000000000",
  // any of: "filled", "cancelled", "placed"
  "reason": "filled",
  // an optional `order id` that can be provided when placing an order
  "id": 100
}
```

### Example Scenarios:

Let's assume your initial order amount is 100 units and each match occurs for an amount of 10 units.

{% hint style="info" %}
**Note**: The following events only include <mark style="color:red;">`amount`</mark> and <mark style="color:red;">`reason`</mark> for simplicity.
{% endhint %}

#### Scenario 1: Limit Order Partially Fills and Gets Placed

Your limit order matches against existing orders in the book.

You will receive the following events over websocket, each with the same timestamp but in sequential order:

* Event 1: `(90, "filled")` — 10 units of your order are filled.
* Event 2: `(80, "filled")` — Another 10 units are filled.
* Event 3: `(80, "placed")` — The remaining 80 units are placed on the book.

#### Scenario 2: Immediate-Or-Cancel (IOC) Order Partially Fills

Your IOC order matches against existing orders but is not completely filled.

The events you will receive are as follows:

* Event 1: `(90, "filled")` — 10 units are filled.
* Event 2: `(80, "filled")` — Another 10 units are filled.
* Event 3: `(0, "cancelled")` — The remaining order is cancelled. **Note**: If your IOC order is fully filled, the last event you will receive is `(0, "filled")`.

#### Scenario 3: Resting Limit Order Gets Matched

Your existing, or "resting," limit order matches against an incoming order.

You will receive the following event: `(90, "filled")` — 10 units of your resting limit order are filled.

#### Scenario 4: Resting Limit Order Gets Cancelled

Your resting limit order could be cancelled for various reasons, such as manual cancellation, expiration, failing health checks, or self-trade prevention.

In any of these cases, you will receive: `(0, "cancelled")`

#### **Scenario 5: IOC order doesn't cross the book or FOK order fails to be entirely filled**

In any of these cases, you will receive: `(0, "cancelled")`

## **Trade**

**Update speed: real-time**

```json
{
    "type": "trade",
    "timestamp": "1676151190656903000", // timestamp of the event in nanoseconds
    "product_id": 1,
    "price": "1000", // price the trade happened at, multiplied by 1e18
    // both taker_qty and maker_qty have the same value;
    // set to filled amount (min amount of taker and maker) when matching against book
    "taker_qty": "1000",
    "maker_qty": "1000",
    "is_taker_buyer": true
}
```

## **Best Bid Offer**

**Update speed: real-time**

```json
{
    "type": "best_bid_offer",
    "timestamp": "1676151190656903000", // timestamp of the event in nanoseconds
    "product_id": 1,
    "bid_price": "1000", // the highest bid price, multiplied by 1e18
    "bid_qty": "1000", // quantity at the highest bid, multiplied by 1e18. 
                       // i.e. if this is USDT0 with 6 decimals, one USDT0 
                       // would be 1e12
    "ask_price": "1000", // lowest ask price
    "ask_qty": "1000" // quantity at the lowest ask
}
```

## **Fill**

**Update speed: real-time**

```json
{
    "type": "fill",
    "timestamp": "1676151190656903000", // timestamp of the event in nanoseconds
    "product_id": 1,
    // the subaccount that placed this order
    "subaccount": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
    // hash of the order that uniquely identifies it
    "order_digest": "0xf4f7a8767faf0c7f72251a1f9e5da590f708fd9842bf8fcdeacbaa0237958fff",
    // order appendix containing execution type, reduce-only flag, etc.
    "appendix": "4096",
    // the amount filled, multiplied by 1e18
    "filled_qty": "1000",
    // the amount outstanding unfilled, multiplied by 1e18
    "remaining_qty": "2000",
    // the original order amount, multiplied by 1e18
    "original_qty": "3000",
    // fill price
    "price": "24991000000000000000000",
    // true for `taker`, false for `maker`
    "is_taker": true,
    "is_bid": true,
    // the amount of fee paid, multiplied by 1e18
    "fee": "100",
    // the submission_idx of the transaction (n_submissions - 1)
    // can use to map `fills` to historical `matches`.
    "submission_idx": 100,
    // an optional `order id` that can be provided when placing an order
    "id": 100
}
```

## **Position Change**

**Update speed: real-time**

```json
{
    "type":"position_change",
    "timestamp": "1676151190656903000", // timestamp of event in nanoseconds
    "product_id":1,
    // subaccount who's position changed
    "subaccount":"0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43706d00000000000000000000",
    // whether this position change is for an isolated margin position
    "isolated": false,
    // new amount for this product
    "amount":"51007390115411548",
    // new quote balance for this product; zero for everything except non lp perps
    // the negative of the entry cost of the perp
    "v_quote_amount":"0",
    // any of: "deposit_collateral", "match_orders", "withdraw_collateral", "transfer_quote", "settle_pnl", "mint_nlp", "burn_nlp", "liquidate_subaccount"
    "reason": "deposit_collateral"
}
```

{% hint style="info" %}
**Note:** that it is possible that back to back <mark style="color:red;">`position_change`</mark> events have the same fields except for <mark style="color:red;">`timestamp`</mark>. Additionally, <mark style="color:red;">`position_change`</mark> events are not sent on interest and funding payments, and also are not sent on actions done through slow mode (except deposits). The full list of actions that will trigger a <mark style="color:red;">`PositionChange`</mark> event are:

* Minting or burning NLP tokens
* Liquidating a subaccount
* Matching orders
* Depositing or withdrawing spot
* Settling PNL
  {% endhint %}

## **Book Depth**

**Update speed: once every 50ms**

```json
{
    "type":"book_depth",
    // book depth aggregates a number of events once every 50ms
    // these are the minimum and maximum timestamps from 
    // events that contributed to this response
    "min_timestamp": "1683805381879572835",
    "max_timestamp": "1683805381879572835",
    // the max_timestamp of the last book_depth event for this product
    "last_max_timestamp": "1683805381771464799",
    "product_id":1,
    // changes to the bid side of the book in the form of [[price, new_qty]]
    "bids":[["21594490000000000000000","51007390115411548"]],
    // changes to the ask side of the book in the form of [[price, new_qty]]
    "asks":[["21694490000000000000000","0"],["21695050000000000000000","0"]]
}
```

{% hint style="info" %}
**Note**: To keep an updated local orderbook, do the following:

1. Subscribe to the `book_depth` stream and queue up events.
2. Get a market data snapshot by calling [MarketLiquidity](https://docs.vertexprotocol.com/developer-resources/api/gateway/queries/market-liquidity). The snapshot contains a `timestamp` in the response.
3. Apply events with `max_timestamp` > snapshot `timestamp`.
4. When you receive an event where its `last_max_timestamp` is not equal to the `max_timestamp` of the last event you've received, it means some events were lost and you should repeat 1-3 again.
   {% endhint %}

## **Liquidation**

**Update speed: real-time**

```json
{
  "type": "liquidation",
  "timestamp": "1234567890000", // timestamp of the event in nanoseconds
  // single element for regular liquidations, two elements for spread liquidations (spot_id, perp_id)
  "product_ids": [1],
  // liquidator subaccount (32 bytes)
  "liquidator": "0x7a5ec2748e9065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
  // liquidatee subaccount (32 bytes)
  "liquidatee": "0x8b6fd3859f7065794491a8d29dcf3f9edb8d7c43746573743000000000000000",
  // amount liquidated (positive for long, negative for short)
  "amount": "1000000000000000000",
  // price at which liquidation occurred
  "price": "50000000000000000000"
}
```

## Latest Candlestick

**Update speed: real-time**

```json
{
  "type": "latest_candlestick",
  "timestamp": 1234567890000,
  "product_id": 1,
  "granularity": 60,
  "open_x18": "50000000000000000000",
  "high_x18": "51000000000000000000",
  "low_x18": "49000000000000000000",
  "close_x18": "50500000000000000000",
  "volume": "1000000000000000000"
}
```

## Funding Payment

**Update speed: real-time at the time of payment (payments happen hourly).**

```json
{
  "type": "funding_payment",
  "timestamp": 1234567890000,
  "product_id": 1,
  // funding payment amount (positive = receive, negative = pay)
  "payment_amount": "1000000000000000000",
  // open interest at time of funding
  "open_interest": "50000000000000000000",
  // cumulative funding values, multiplied by 1e18
  "cumulative_funding_long_x18": "100000000000000000",
  "cumulative_funding_short_x18": "-100000000000000000",
  // time delta over which the funding payment was calculated
  "dt": 3600000
}
```

## Funding Rate

**Update speed: real-time (updates occur every 20 seconds).**

{% hint style="info" %}
**Note**: The `funding_rate_x18` and `update_time` values are identical to those returned by the [Funding Rate](https://docs.nado.xyz/developer-resources/api/archive-indexer/funding-rate) indexer endpoint.
{% endhint %}

```json
{
  "type": "funding_rate",
  // timestamp when the event was generated, in nanoseconds
  "timestamp": "1234567890123456789",
  "product_id": 1,
  // latest 24hr funding rate, multiplied by 1e18
  "funding_rate_x18": "50000000000000000",
  // timestamp when the funding rate was updated, in seconds
  "update_time": "1234567890"
}
```
