---
title: "Query All Um Conditional Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders"
fetched_at: "2026-01-27T05:28:21.780Z"
---
# Query All UM Conditional Orders(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)

Query All UM Conditional Orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)

GET `/papi/v1/um/conditional/allOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)

**1** for a single symbol; **40** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)

Name

Type

Mandatory

Description

symbol

STRING

NO

strategyId

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

> -   These orders will not be found:
>     -   order strategyStatus is `CANCELED` or `EXPIRED`, **AND**
>     -   order has NO filled trade, **AND**
>     -   created time + 7 days < current time
> -   The query time period must be less than 7 days( default as the recent 7 days).

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)

```
[  {    "newClientStrategyId": "abc",     "strategyId":123445,    "strategyStatus":"TRIGGERED",    "strategyType": "TRAILING_STOP_MARKET",      "origQty": "0.40",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET    "symbol": "BTCUSDT",     "orderId":12132343435,     //Normal orderID after trigger if appliable, only have when the strategy is triggered    "status": "NEW",             //Normal order status after trigger if appliable, only have when the strategy is triggered          "bookTime": 1566818724710,              // order time     "updateTime": 1566818724722,    "triggerTime": 1566818724750,      "timeInForce": "GTC",    "type": "MARKET",     //Normal order type after trigger if appliable    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order    "priceRate": "0.3",                // callback rate, only return with TRAILING_STOP_MARKET order    "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 0,    "priceMatch": "NONE"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders)
