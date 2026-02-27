---
title: "Cancel Cm Conditional Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order"
fetched_at: "2026-01-27T05:28:19.884Z"
---
# Cancel CM Conditional Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)

Cancel CM Conditional Order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)

DELETE `/papi/v1/cm/conditional/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)

```
{    "newClientStrategyId": "myOrder1",    "strategyId":123445,    "strategyStatus":"CANCELED",    "strategyType": "TRAILING_STOP_MARKET",      "origQty": "11",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "stopPrice": "9300",                // please ignore when order type is TRAILING_STOP_MARKET    "symbol": "BTCUSD",    "timeInForce": "GTC",    "activatePrice": "9020",            // activation price, only return with TRAILING_STOP_MARKET order    "priceRate": "0.3",                 // callback rate, only return with TRAILING_STOP_MARKET order    "bookTime": 1566818724710,    "updateTime": 1566818724722,    "workingType":"CONTRACT_PRICE",    "priceProtect": false    }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order)
