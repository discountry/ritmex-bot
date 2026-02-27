---
title: "Query Margin Loan Record | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record"
fetched_at: "2026-01-27T05:28:18.397Z"
---
# Query Margin Loan Record(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)

Query margin loan record

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)

GET `/papi/v1/margin/marginLoan`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)

**10**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)

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

the `tranId` in `POST/papi/v1/marginLoan`

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)

```
{  "rows": [    {        "txId": 12807067523,        "asset": "BNB",        "principal": "0.84624403",        "timestamp": 1555056425000,        "status": "CONFIRMED"   //one of PENDING (pending execution), CONFIRMED (successfully loaned), FAILED (execution failed, nothing happened to your account);    }  ],  "total": 1}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Loan-Record)
