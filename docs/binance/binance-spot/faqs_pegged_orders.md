---
title: "Pegged Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders"
fetched_at: "2026-02-26T10:38:07.900Z"
---
# Pegged orders

**Disclaimer**:

-   This explanation only applies to the SPOT Exchange.
-   The symbols and values used here are fictional and do not imply anything about the actual setup on the live exchange.
-   For simplicity, the examples in this document do not include commission.

## What are pegged orders?[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

Pegged orders are essentially **limit orders** with the price derived from the order book.

For example, instead of using a specific price (e.g. SELL 1 BTC for at least 100,000 USDC) you can send orders like “SELL 1 BTC at the best asking price” to queue your order after the orders on the book at the highest price, or “BUY 1 BTC for 100,000 USDT or best offer, IOC” to cherry-pick the sellers at the lowest price, and only that price.

Pegged orders offer a way for market makers to match the best price with minimal latency, while retail users can get quick fills at the best price with minimal slippage.

Pegged orders are also known as “best bid-offer” or BBO orders.

## How can I send a pegged order?[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

Please refer to the following table:

API

Request

Parameters

REST API

`POST /api/v3/order`

`pegPriceType`:

-   `PRIMARY` — best price on the same side of the order book
-   `MARKET` — best price on the opposite side of the order book

`pegOffsetType` and `pegOffsetValue PRICE_LEVEL` — offset by existing price levels, deeper into the order book

For order lists: (Please see the API documentation for more details.)

-   OCO are using `above*` and `below*` prefixes.
-   OTO are using `working*` and `pending*` prefixes.
-   OTOCO are using `working*`, `pendingAbove*`, and `pendingBelow*` prefixes.

`POST /api/v3/orderList/*`  

`POST /api/v3/cancelReplace`

WebSocket API

`order.place`

`orderList.place.*`  

`order.cancelReplace`

FIX API

NewOrderSingle `<D>`

`OrdType=PEGGED`, `<PegInstructions>` component block, `PeggedPrice` field.

NewOrderList `<E>`

OrderCancelRequestAndNewOrderSingle `<XCN>`

Currently, [Smart Order Routing (SOR)](https://developers.binance.com/docs/binance-spot-api-docs/faqs/sor_faq) does not support pegged orders.

This sample REST API response shows that for pegged orders, `peggedPrice` reflects the selected price, while `price` is the original order price (zero if not set).

```
{    "symbol": "BTCUSDT",    "orderId": 18,    "orderListId": -1,    "clientOrderId": "q1fKs4Y7wgE61WSFMYRFKo",    "transactTime": 1750313780050,    "price": "0.00000000",    "pegPriceType": "PRIMARY_PEG",    "peggedPrice": "0.04000000",    "origQty": "1.00000000",    "executedQty": "0.00000000",    "origQuoteOrderQty": "0.00000000",    "cummulativeQuoteQty": "0.00000000",    "status": "NEW",    "timeInForce": "GTC",    "type": "LIMIT",    "side": "BUY",    "workingTime": 1750313780050,    "fills": [],    "selfTradePreventionMode": "NONE"}
```

## What order types support pegged orders?[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

All order types, with the exception of `MARKET` orders, are supported by this feature.

Since both `STOP_LOSS` and `TAKE_PROFIT` orders place a `MARKET` order once the stop condition is met, these order types cannot be pegged.

### Limit orders[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

Pegged limit orders immediately enter the market at the current best price:

-   `LIMIT`
    -   With `pegPriceType=PRIMARY_PEG` only `timeInForce=GTC` is allowed.
-   `LIMIT_MAKER`
    -   Only `pegPriceType=PRIMARY_PEG` is allowed.

### Stop-limit orders[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

Pegged stop-limit orders enter the market at the best price when price movement triggers the stop order (via stop price or trailing stop):

-   `STOP_LOSS_LIMIT`
-   `TAKE_PROFIT_LIMIT`

That is, stop orders use the best price at the time when they are triggered, which is different from the price when the stop order is placed. Only the limit price can be pegged, not the stop price.

### OCO[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

OCO order lists may use peg instructions.

-   Any order in OCO can be pegged: both above and below orders, or only one of them.
-   Pegged orders enter at the best price when they are placed on the book:
    -   `LIMIT_MAKER` order enters immediately at the current best price
    -   `STOP_LOSS_LIMIT` and `TAKE_PROFIT_LIMIT` enter at the best price when they are triggered
-   `STOP_LOSS` and `TAKE_PROFIT` orders cannot be pegged.

### OTO and OTOCO[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

OTO order lists may use peg instructions as well.

-   Any order in OTO can be pegged: both working and pending orders, or only one of them.
-   Pegged working order enters immediately at the current best price.
-   Pegged pending limit order enters at the best price after the working order has been filled.
-   Pegged pending stop-limit order enters at the best price when it is triggered.

OTOCO order lists may contain pegged orders as well, similar to OTO and OCO.

## Which symbols allow pegged orders?[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

Please refer to Exchange Information requests and look for the field `pegInstructionsAllowed`. If set to true, pegged orders can be used with the symbol.

## Which Filters are applicable to pegged orders?[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)

Pegged orders are required to pass all applicable filters with the selected price:

-   `PRICE_FILTER`
-   `PERCENT_PRICE` and `PERCENT_PRICE_BY_SIDE`
-   `NOTIONAL` and `MIN_NOTIONAL` (considering the `quantity`)

If a pegged order specifies `price`, it must pass validation at both `price` and `peggedPrice`.

Contingent pegged orders as well as pegged pending orders of OTO order lists are (re)validated at the trigger time and may be rejected later.

-   [What are pegged orders?](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
-   [How can I send a pegged order?](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
-   [What order types support pegged orders?](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
    -   [Limit orders](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
    -   [Stop-limit orders](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
    -   [OCO](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
    -   [OTO and OTOCO](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
-   [Which symbols allow pegged orders?](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
-   [Which Filters are applicable to pegged orders?](https://developers.binance.com/docs/binance-spot-api-docs/faqs/pegged_orders)
