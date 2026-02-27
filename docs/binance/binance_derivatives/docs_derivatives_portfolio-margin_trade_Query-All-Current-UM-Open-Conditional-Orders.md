---
title: "Query All Current Um Open Conditional Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders"
fetched_at: "2026-01-27T05:28:21.506Z"
---
# Query All Current UM Open Conditional Orders(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)

Get all open conditional orders on a symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)

`GET /papi/v1/um/conditional/openOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)

**1** for a single symbol; **40** when the symbol parameter is omitted **Careful** when accessing this with no symbol.

**Parameters:**

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)

```
[  {    "newClientStrategyId": "abc",     "strategyId":123445,    "strategyStatus":"NEW",    "strategyType": "TRAILING_STOP_MARKET",        "origQty": "0.40",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET    "symbol": "BTCUSDT",     "bookTime": 1566818724710,              // order time     "updateTime": 1566818724722,    "timeInForce": "GTC",    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order    "priceRate": "0.3",               // callback rate, only return with TRAILING_STOP_MARKET order     "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 0,    "priceMatch": "NONE"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders)
