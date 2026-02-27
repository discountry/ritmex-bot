---
title: "Query User Negative Balance Auto Exchange Record | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record"
fetched_at: "2026-01-27T05:28:18.683Z"
---
# Query User Negative Balance Auto Exchange Record (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)

Query user negative balance auto exchange record

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)

GET `/papi/v1/portfolio/negative-balance-exchange-record`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)

**100**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)

Name

Type

Mandatory

Description

startTime

LONG

YES

endTime

LONG

YES

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

**Note**

> -   Response in descending order
> -   The max interval between `startTime` and `endTime` is 3 months.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)

```
{  "total": 2,  "rows": [    {      "startTime": 1736263046841,      "endTime": 1736263248179,      "details": [        {          "asset": "ETH",          "negativeBalance": 18,  //negative balance amount          "negativeMaxThreshold": 5  //the max negative balance threshold        }      ]    },    {      "startTime": 1736184913252,      "endTime": 1736184965474,      "details": [        {          "asset": "BNB",          "negativeBalance": 1.10264488,          "negativeMaxThreshold": 0        }      ]    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Negative-Balance-Auto-Exchange-Record)
