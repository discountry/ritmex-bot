---
title: "Get Portfolio Margin Pro Balance Info(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info"
fetched_at: "2026-01-27T05:28:14.567Z"
---
# Get Portfolio Margin Pro Account Balance(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)

Query Portfolio Margin Pro account balance

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)

GET `/sapi/v1/portfolio/balance`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)

**20**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)

Name

Type

Mandatory

Description

asset

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)

```
[    {        "asset": "BTC",    // asset name        "totalWalletBalance": "100",    // wallet balance =  cross margin free + cross margin locked + UM wallet balance + CM wallet balance        "crossMarginAsset": "100",    // crossMarginAsset = crossMarginFree + crossMarginLocked        "crossMarginBorrowed": "0",    // principal of cross margin        "crossMarginFree": "100",    // free asset of cross margin        "crossMarginInterest": "0",    // interest of cross margin        "crossMarginLocked": "0",  //lock asset of cross margin        "umWalletBalance": "0",    // wallet balance of um        "umUnrealizedPNL": "0",     // unrealized profit of um         "cmWalletBalance": "0",    // wallet balance of cm        "cmUnrealizedPNL": "0",    // unrealized profit of cm        "updateTime": 0,        "negativeBalance": "0",        "optionWalletBalance": "0",  //only for PM PRO SPAN        "optionEquity": "0"  //only for PM PRO SPAN    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Balance-Info)
