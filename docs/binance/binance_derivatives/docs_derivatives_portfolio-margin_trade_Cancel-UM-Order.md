---
title: "Cancel Um Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order"
fetched_at: "2026-01-27T05:28:20.267Z"
---
# Cancel UM Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)

Cancel an active UM LIMIT order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)

DELETE `/papi/v1/um/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)

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

> -   Either `orderId` or `origClientOrderId` must be sent.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)

```
{    "avgPrice": "0.00000",    "clientOrderId": "myOrder1",    "cumQty": "0",    "cumQuote": "0",    "executedQty": "0",    "orderId": 4611875134427365377,    "origQty": "0.40",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "status": "CANCELED",    "symbol": "BTCUSDT",    "timeInForce": "GTC",    "type": "LIMIT",    "updateTime": 1571110484038,    "selfTradePreventionMode": "NONE",     "goodTillDate": 0,    "priceMatch": "NONE"  }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order)
