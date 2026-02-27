---
title: "Query Users Margin Force Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders"
fetched_at: "2026-01-27T05:28:23.043Z"
---
# Query User's Margin Force Orders(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)

Query user's margin force orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)

GET `/papi/v1/margin/forceOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)

Name

Type

Mandatory

Description

startTime

LONG

NO

endTime

LONG

NO

current

LONG

NO

Currently querying page. Start from 1. Default:1

size

LONG

NO

Default:10 Max:100

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)

```
{    "rows": [        {            "avgPrice": "0.00388359",            "executedQty": "31.39000000",            "orderId": 180015097,            "price": "0.00388110",            "qty": "31.39000000",            "side": "SELL",            "symbol": "BNBBTC",            "timeInForce": "GTC",            "updatedTime": 1558941374745        }    ],    "total": 1}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-Margin-Force-Orders)
