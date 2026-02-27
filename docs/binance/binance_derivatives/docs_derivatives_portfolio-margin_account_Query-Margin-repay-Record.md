---
title: "Query Margin Repay Record | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record"
fetched_at: "2026-01-27T05:28:18.718Z"
---
# Query Margin repay Record(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)

Query margin repay record.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)

GET `/papi/v1/margin/repayLoan`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)

**10**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)

Name

Type

Mandatory

Description

asset

STRING

YES

txId

LONG

NO

the tranId in `POST/papi/v1/repayLoan`

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

archived

STRING

NO

Default: `false`. Set to `true` for archived data from 6 months ago

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

> -   txId or startTime must be sent. txId takes precedence.
> -   Response in descending order
> -   The max interval between `startTime` and `endTime` is 30 days.
> -   If `startTime` and `endTime` not sent, return records of the last 7 days by default
> -   Set `archived` to `true` to query data from 6 months ago

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)

```
{     "rows": [         {                "amount": "14.00000000",   //Total amount repaid                "asset": "BNB",                   "interest": "0.01866667",    //Interest repaid                "principal": "13.98133333",   //Principal repaid                "status": "CONFIRMED",   //one of PENDING (pending execution), CONFIRMED (successfully execution), FAILED (execution failed, nothing happened to your account)                "timestamp": 1563438204000,                "txId": 2970933056         }     ],     "total": 1}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-repay-Record)
