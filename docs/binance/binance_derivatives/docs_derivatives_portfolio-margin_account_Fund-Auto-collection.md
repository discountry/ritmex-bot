---
title: "Fund Auto Collection | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection"
fetched_at: "2026-01-27T05:28:16.667Z"
---
# Fund Auto-collection(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)

Fund collection for Portfolio Margin

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)

`POST /papi/v1/auto-collection`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)

**750**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

> -   The BNB would not be collected from UM-PM account to the Portfolio Margin account.
> -   You can only use this function 500 times per hour in a rolling manner.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)

```
{    "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Auto-collection)
