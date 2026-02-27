---
title: "Fund Auto collection(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection"
fetched_at: "2026-01-27T05:28:14.299Z"
---
# Fund Auto-collection(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)

Transfers all assets from Futures Account to Margin account

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)

POST `/sapi/v1/portfolio/auto-collection`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)

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

> -   The BNB would not be collected from UM-PM account to the Portfolio Margin account.
> -   You can only use this function 500 times per hour in a rolling manner.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)

```
{    "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Fund-Auto-collection)
