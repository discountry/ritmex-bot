---
title: "Query Portfolio Margin Pro Bankruptcy Loan Amount(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount"
fetched_at: "2026-01-27T05:28:14.824Z"
---
# Query Portfolio Margin Pro Bankruptcy Loan Amount(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)

Query Portfolio Margin Pro Bankruptcy Loan Amount

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)

GET `/sapi/v1/portfolio/pmLoan`

## Request Weight(UID)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)

**500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If there’s no classic portfolio margin bankruptcy loan, the amount would be 0

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)

```
{   "asset": "BUSD",      "amount":  "579.45", // portfolio margin bankruptcy loan amount in BUSD}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)
-   [Request Weight(UID)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Bankruptcy-Loan-Amount)
