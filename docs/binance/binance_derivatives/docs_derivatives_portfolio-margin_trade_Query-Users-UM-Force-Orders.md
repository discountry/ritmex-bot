---
title: "Query Users Um Force Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders"
fetched_at: "2026-01-27T05:28:23.185Z"
---
# Query User's UM Force Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)

Query User's UM Force Orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)

GET `/papi/v1/um/forceOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)

**20** with symbol, **50** without symbol

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)

Name

Type

Mandatory

Description

symbol

STRING

NO

autoCloseType

ENUM

NO

`LIQUIDATION` for liquidation orders, `ADL` for ADL orders.

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default 50; max 100.

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

> -   If `autoCloseType` is not sent, orders with both of the types will be returned
> -   If `startTime` is not sent, data within 7 days before `endTime` can be queried

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)

```
[  {    "orderId": 6071832819,     "symbol": "BTCUSDT",     "status": "FILLED",     "clientOrderId": "autoclose-1596107620040000020",     "price": "10871.09",     "avgPrice": "10913.21000",     "origQty": "0.001",     "executedQty": "0.001",     "cumQuote": "10.91321",     "timeInForce": "IOC",     "type": "LIMIT",     "reduceOnly": false,     "side": "SELL",     "positionSide": "BOTH",     "origType": "LIMIT",     "time": 1596107620044,     "updateTime": 1596107620087  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders)
