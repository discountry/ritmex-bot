---
title: "Get Portfolio Margin Pro Account Info(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account"
fetched_at: "2026-01-27T05:28:14.043Z"
---
# Get Portfolio Margin Pro Account Info(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)

Get Portfolio Margin Pro Account Info

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)

GET `/sapi/v1/portfolio/account`

## Request Weight(UID)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)

```
{        "uniMMR": "5167.92171923",        // Classic Portfolio margin account maintenance margin rate        "accountEquity": "122607.35137903",  // Account equity, unit：USD        "actualEquity": "142607.35137903",   // Actual equity, unit：USD        "accountMaintMargin": "23.72469206", // Classic Portfolio margin account maintenance margin, unit：USD        "accountInitialMargin": "47.44938412", // Ignored for PM PRO and PM PRO SPAN        "totalAvailableBalance" : "122,559.90199491",// Ignored for PM PRO and PM PRO SPAN        "accountStatus": "NORMAL",   // Classic Portfolio margin account status:"NORMAL", "MARGIN_CALL", "SUPPLY_MARGIN", "REDUCE_ONLY", "ACTIVE_LIQUIDATION", "FORCE_LIQUIDATION", "BANKRUPTED"        "accountType": "PM_1"     //PM_1 for PM PRO, PM_2 for PM, PM_3 for PM PRO SPAN }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)
-   [Request Weight(UID)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account)
