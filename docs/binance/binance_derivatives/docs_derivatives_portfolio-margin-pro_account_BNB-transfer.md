---
title: "BNB transfer(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer"
fetched_at: "2026-01-27T05:28:14.170Z"
---
# BNB transfer(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)

BNB transfer can be between Margin Account and USDM Account

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)

POST `/sapi/v1/portfolio/bnb-transfer`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)

Name

Type

Mandatory

Description

amount

DECIMAL

YES

transferSide

STRING

YES

"TO\_UM","FROM\_UM"

recvWindow

LONG

NO

timestamp

LONG

YES

> -   You can only use this function 2 times per 10 minutes in a rolling manner

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)

```
{     "tranId": 100000001} 
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/BNB-transfer)
