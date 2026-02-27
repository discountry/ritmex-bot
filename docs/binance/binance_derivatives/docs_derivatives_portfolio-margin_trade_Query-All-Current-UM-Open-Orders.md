---
title: "Query All Current Um Open Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders"
fetched_at: "2026-01-27T05:28:21.615Z"
---
# Query All Current UM Open Orders(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)

Get all open orders on a symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)

GET `/papi/v1/um/openOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)

**1** for a single symbol; **40** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)

Name

Type

Mandatory

Description

symbol

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If the symbol is not sent, orders for all symbols will be returned in an array.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)

```
[  {    "avgPrice": "0.00000",    "clientOrderId": "abc",    "cumQuote": "0",    "executedQty": "0",    "orderId": 1917641,    "origQty": "0.40",    "origType": "LIMIT",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "status": "NEW",    "symbol": "BTCUSDT",    "time": 1579276756075,              // order time    "timeInForce": "GTC",    "type": "LIMIT",    "updateTime": 1579276756075，       // update time     "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 0,    "priceMatch": "NONE"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders)
