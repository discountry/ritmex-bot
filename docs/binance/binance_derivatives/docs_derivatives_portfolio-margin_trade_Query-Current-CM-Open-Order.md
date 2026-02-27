---
title: "Query Current Cm Open Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order"
fetched_at: "2026-01-27T05:28:22.270Z"
---
# Query Current CM Open Order (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)

Query current CM open order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)

GET `/papi/v1/cm/openOrder`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)

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
> -   If the queried order has been filled or cancelled, the error message "Order does not exist" will be returned.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)

```
[    {        "avgPrice": "0.0",                      "clientOrderId": "abc",                     "cumBase": "0",                             "executedQty": "0",                         "orderId": 1917641,                         "origQty": "0.40",                              "origType": "LIMIT",        "price": "0",        "reduceOnly": false,        "side": "BUY",        "positionSide": "SHORT",        "status": "NEW",        "symbol": "BTCUSD_200925",        "pair": "BTCUSD"        "time": 1579276756075,              // order time        "timeInForce": "GTC",        "type": "LIMIT",        "updateTime": 1579276756075        // update time    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order)
