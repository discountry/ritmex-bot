---
title: "Query Current Um Open Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order"
fetched_at: "2026-01-27T05:28:22.461Z"
---
# Query Current UM Open Order(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)

Query current UM open order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)

GET `/papi/v1/um/openOrder`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)

```
{    "avgPrice": "0.00000",                  "clientOrderId": "abc",                 "cumQuote": "0",                            "executedQty": "0",                     "orderId": 1917641,                     "origQty": "0.40",                          "origType": "LIMIT",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "status": "NEW",    "symbol": "BTCUSDT",    "time": 1579276756075,              // order time    "timeInForce": "GTC",    "type": "LIMIT",                 "updateTime": 1579276756075，    "selfTradePreventionMode": "NONE",     "goodTillDate": 0,    "priceMatch": "NONE"            }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order)
