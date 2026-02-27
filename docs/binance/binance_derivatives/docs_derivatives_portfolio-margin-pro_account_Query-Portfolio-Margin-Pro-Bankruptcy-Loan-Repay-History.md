---
title: "Query Portfolio Margin Pro Bankruptcy Loan Repay History(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History"
fetched_at: "2026-01-27T05:28:14.946Z"
---
# Query Portfolio Margin Pro Bankruptcy Loan Repay History(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)

Query repay history of pmloan for portfolio margin pro.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)

GET `/sapi/v1/portfolio/pmloan-history`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)

**500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)

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

timestamp

LONG

YES

-   `startTime` and `endTime` cannot be longer than 360 days
-   If `startTime` and `endTime` not sent, return records of the last 30 days by default.
-   If `startTime`is sent and `endTime` is not sent, return records of \[startTime, startTime+30d\].
-   If `startTime` is not sent and `endTime` is sent, return records of \[endTime-30d, endTime\].

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)

```
{  "total": 3,  "rows": [    {      "asset": "USDT",      "amount": "404.80294503",      "repayTime": 1731336427804    },    {      "asset": "USDT",      "amount": "4620.41204574",      "repayTime": 1726125090016    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Portfolio-Margin-Pro-Bankruptcy-Loan-Repay-History)
