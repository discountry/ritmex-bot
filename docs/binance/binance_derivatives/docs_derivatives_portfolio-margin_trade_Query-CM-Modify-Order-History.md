---
title: "Query Cm Modify Order History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History"
fetched_at: "2026-01-27T05:28:21.946Z"
---
# Query CM Modify Order History(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)

Get order modification history

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)

GET `/papi/v1/cm/orderAmendment`

## Request Weight(Order)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)

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

startTime

LONG

NO

Timestamp in ms to get modification history from INCLUSIVE

endTime

LONG

NO

Timestamp in ms to get modification history until INCLUSIVE

limit

INT

NO

Default 50, max 100

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Either `orderId` or `origClientOrderId` must be sent, and the `orderId` will prevail if both are sent.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)

```
[    {        "amendmentId": 5363,    // Order modification ID        "symbol": "BTCUSD_PERP",        "pair": "BTCUSD",        "orderId": 20072994037,        "clientOrderId": "LJ9R4QZDihCaS8UAOOLpgW",        "time": 1629184560899,  // Order modification time        "amendment": {            "price": {                "before": "30004",                "after": "30003.2"            },            "origQty": {                "before": "1",                "after": "1"            },            "count": 3  // Order modification count, representing the number of times the order has been modified        }    },    {        "amendmentId": 5361,        "symbol": "BTCUSD_PERP",        "pair": "BTCUSD",        "orderId": 20072994037,        "clientOrderId": "LJ9R4QZDihCaS8UAOOLpgW",        "time": 1629184533946,        "amendment": {            "price": {                "before": "30005",                "after": "30004"            },            "origQty": {                "before": "1",                "after": "1"            },            "count": 2        }    },    {        "amendmentId": 5325,        "symbol": "BTCUSD_PERP",        "pair": "BTCUSD",        "orderId": 20072994037,        "clientOrderId": "LJ9R4QZDihCaS8UAOOLpgW",        "time": 1629182711787,        "amendment": {            "price": {                "before": "30002",                "after": "30005"            },            "origQty": {                "before": "1",                "after": "1"            },            "count": 1        }    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)
-   [Request Weight(Order)](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Modify-Order-History)
