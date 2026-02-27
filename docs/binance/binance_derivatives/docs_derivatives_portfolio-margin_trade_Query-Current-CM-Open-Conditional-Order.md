---
title: "Query Current Cm Open Conditional Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order"
fetched_at: "2026-01-27T05:28:22.206Z"
---
# Query Current CM Open Conditional Order(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)

Query Current CM Open Conditional Order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)

GET `/papi/v1/cm/conditional/openOrder`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)

Name

Type

Mandatory

Description

symbol

STRING

YES

strategyId

LONG

NO

newClientStrategyId

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

Notes:

> -   Either `strategyId` or `newClientStrategyId` must be sent.
> -   If the queried order has been triggered, cancelled or expired, the error message "Order does not exist" will be returned.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)

```
{                "newClientStrategyId": "abc",     "strategyId":123445,    "strategyStatus":"NEW",    "strategyType": "TRAILING_STOP_MARKET",                                    "origQty": "0.40",                          "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET    "symbol": "BTCUSD",    "bookTime": 1566818724710,              // order time     "updateTime": 1566818724722,    "timeInForce": "GTC",    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order    "priceRate": "0.3"                 // callback rate, only return with TRAILING_STOP_MARKET order                 }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order)
