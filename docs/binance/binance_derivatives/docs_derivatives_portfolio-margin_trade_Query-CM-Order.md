---
title: "Query Cm Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order"
fetched_at: "2026-01-27T05:28:22.121Z"
---
# Query CM Order(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)

Check an CM order's status.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)

GET `/papi/v1/cm/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)

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

> -   Either `orderId` or `origClientOrderId` must be sent.
> -   These orders will not be found:
>     -   order status is `CANCELED` or `EXPIRED`, **AND**
>     -   order has NO filled trade, **AND**
>     -   created time + 3 days < current time

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)

```
{    "avgPrice": "0.0",    "clientOrderId": "abc",    "cumBase": "0",    "executedQty": "0",    "orderId": 1917641,    "origQty": "0.40",    "origType": "LIMIT",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "status": "NEW",    "symbol": "BTCUSD_200925",    "pair": "BTCUSD",    "positionSide": "SHORT",    "time": 1579276756075,             // order time    "timeInForce": "GTC",    "type": "LIMIT",    "updateTime": 1579276756075        // update time}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order)
