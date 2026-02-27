---
title: "Change Auto Repay Futures Status | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status"
fetched_at: "2026-01-27T05:28:16.171Z"
---
# Change Auto-repay-futures Status(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)

Change Auto-repay-futures Status

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)

POST `/papi/v1/repay-futures-switch`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)

**750**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)

Name

Type

Mandatory

Description

autoRepay

STRING

YES

Default: `true`; `false` for turn off the auto-repay futures negative balance function

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)

```
{    "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-Auto-repay-futures-Status)
