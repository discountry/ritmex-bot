---
title: "Cancel Um Conditional Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order"
fetched_at: "2026-01-27T05:28:20.262Z"
---
# Cancel UM Conditional Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)

Cancel UM Conditional Order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)

DELETE `/papi/v1/um/conditional/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)

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

> -   Either `strategyId` or `newClientStrategyId` must be sent.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)

```
{    "newClientStrategyId": "myOrder1",    "strategyId":123445,    "strategyStatus":"CANCELED",    "strategyType": "TRAILING_STOP_MARKET",      "origQty": "11",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET    "symbol": "BTCUSDT",    "timeInForce": "GTC",    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order    "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order    "bookTime": 1566818724710,    "updateTime": 1566818724722,    "workingType":"CONTRACT_PRICE",    "priceProtect": false,    "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 0,    "priceMatch": "NONE"      }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order)
