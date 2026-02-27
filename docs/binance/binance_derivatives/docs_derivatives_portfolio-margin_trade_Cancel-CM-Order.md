---
title: "Cancel Cm Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order"
fetched_at: "2026-01-27T05:28:20.014Z"
---
# Cancel CM Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)

Cancel an active LIMIT order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)

DELETE `/papi/v1/cm/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)

```
{    "avgPrice": "0.0",    "clientOrderId": "myOrder1",    "cumQty": "0",    "cumBase": "0",    "executedQty": "0",    "orderId": 283194212,    "origQty": "2",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",      "status": "CANCELED",              "symbol": "BTCUSD_200925",    "pair": "BTCUSD",    "timeInForce": "GTC",    "type": "LIMIT",    "updateTime": 1571110484038,}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order)
