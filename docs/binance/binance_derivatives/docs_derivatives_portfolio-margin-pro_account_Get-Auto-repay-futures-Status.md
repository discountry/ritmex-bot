---
title: "Get Auto repay futures Status(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status"
fetched_at: "2026-01-27T05:28:14.458Z"
---
# Get Auto-repay-futures Status(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)

Query Auto-repay-futures Status

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)

GET `/sapi/v1/portfolio/repay-futures-switch`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)

**30**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)

```
{    "autoRepay": true  //  "true" for turn on the auto-repay futures; "false" for turn off the auto-repay futures }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Auto-repay-futures-Status)
