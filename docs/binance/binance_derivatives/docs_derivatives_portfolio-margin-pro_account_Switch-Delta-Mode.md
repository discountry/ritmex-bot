---
title: "Switch Delta Mode(TRADE) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode"
fetched_at: "2026-01-27T05:28:15.089Z"
---
# Switch Delta Mode(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)

Switch the Delta mode for existing PM PRO / PM RETAIL accounts.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)

POST `/sapi/v1/portfolio/delta-mode`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)

Name

Type

Mandatory

Description

deltaEnabled

STRING

YES

`true` to enable Delta mode; `false` to disable Delta mode

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)

```
{    "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Switch-Delta-Mode)
