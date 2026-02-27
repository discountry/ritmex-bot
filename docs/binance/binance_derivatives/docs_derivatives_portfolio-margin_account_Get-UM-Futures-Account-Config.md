---
title: "Get Um Futures Account Configuration | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config"
fetched_at: "2026-01-27T05:28:17.674Z"
---
# UM Futures Account Configuration(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)

Query UM Futures account configuration

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)

GET `/papi/v1/um/accountConfig`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)

```
{       "feeTier": 0,               // account commission tier     "canTrade": true,           // if can trade    "canDeposit": true,         // if can transfer in asset    "canWithdraw": true,        // if can transfer out asset    "dualSidePosition": true,    "updateTime": 1724416653850,            // reserved property, please ignore     "multiAssetsMargin": false,    "tradeGroupId": -1}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Account-Config)
