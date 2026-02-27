---
title: "Query Um Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order"
fetched_at: "2026-01-27T05:28:22.941Z"
---
# Query UM Order (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)

Check an UM order's status.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)

GET `/papi/v1/um/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)

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

origClientOrderId

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

Notes:

> -   These orders will not be found:
> -   Either `orderId` or `origClientOrderId` must be sent.
>     -   order status is `CANCELED` or `EXPIRED`, **AND**
>     -   order has NO filled trade, **AND**
>     -   created time + 3 days < current time

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)

```
{    "avgPrice": "0.00000",    "clientOrderId": "abc",    "cumQuote": "0",    "executedQty": "0",    "orderId": 1917641,    "origQty": "0.40",    "origType": "LIMIT",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "status": "NEW",    "symbol": "BTCUSDT",    "time": 1579276756075,              // order time    "timeInForce": "GTC",    "type": "LIMIT",    "updateTime": 1579276756075,        // update time    "selfTradePreventionMode": "NONE",     "goodTillDate": 0,    "priceMatch": "NONE"  }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order)
