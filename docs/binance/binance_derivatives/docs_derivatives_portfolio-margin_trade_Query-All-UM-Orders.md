---
title: "Query All Um Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders"
fetched_at: "2026-01-27T05:28:21.755Z"
---
# Query All UM Orders(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)

Get all account UM orders; active, canceled, or filled.

-   These orders will not be found:
    -   order status is `CANCELED` or `EXPIRED`, **AND**
    -   order has NO filled trade, **AND**
    -   created time + 3 days < current time

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)

GET `/papi/v1/um/allOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)

Name

Type

Mandatory

Description

symbol

STRING

YES

orderId

LONG

NO

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default 500; max 1000.

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If `orderId` is set, it will get orders >= that orderId. Otherwise most recent orders are returned.
> -   The query time period must be less then 7 days( default as the recent 7 days).

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)

```
[  {    "avgPrice": "0.00000",    "clientOrderId": "abc",    "cumQuote": "0",    "executedQty": "0",    "orderId": 1917641,    "origQty": "0.40",    "origType": "LIMIT",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "status": "NEW",    "symbol": "BTCUSDT",    "time": 1579276756075,              // order time    "timeInForce": "GTC",    "type": "LIMIT",    "updateTime": 1579276756075,        // update time      "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 0,    "priceMatch": "NONE"   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders)
