---
title: "Margin Account Repay | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay"
fetched_at: "2026-01-27T05:28:20.562Z"
---
# Margin Account Repay(MARGIN)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)

Repay for a margin loan.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)

POST `/papi/v1/repayLoan`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)

**100**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)

Name

Type

Mandatory

Description

asset

STRING

YES

amount

DECIMAL

YES

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)

```
{    //transaction id    "tranId": 100000001}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay)
