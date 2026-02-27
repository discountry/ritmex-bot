---
title: "Query Users Cm Force Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders"
fetched_at: "2026-01-27T05:28:23.121Z"
---
# Query User's CM Force Orders(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)

Query User's CM Force Orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)

GET `/papi/v1/cm/forceOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)

**20** with symbol, **50** without symbol

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)

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

"LIQUIDATION" for liquidation orders, "ADL" for ADL orders.

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

> -   If "autoCloseType" is not sent, orders with both of the types will be returned
> -   If "startTime" is not sent, data within 7 days before "endTime" can be queried

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)

```
[  {    "orderId": 165123080,    "symbol": "BTCUSD_200925",    "pair": "BTCUSD",    "status": "FILLED",    "clientOrderId": "autoclose-1596542005017000006",    "price": "11326.9",    "avgPrice": "11326.9",    "origQty": "1",    "executedQty": "1",    "cumBase": "0.00882854",    "timeInForce": "IOC",    "type": "LIMIT",    "reduceOnly": false,    "side": "SELL",    "positionSide": "BOTH",    "origType": "LIMIT",    "time": 1596542005019,    "updateTime": 1596542005050  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders)
