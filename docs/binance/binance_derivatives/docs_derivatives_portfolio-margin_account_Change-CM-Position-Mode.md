---
title: "Change Cm Position Mode | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode"
fetched_at: "2026-01-27T05:28:16.544Z"
---
# Change CM Position Mode(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)

Change user's position mode (Hedge Mode or One-way Mode ) on EVERY symbol in CM

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)

POST `/papi/v1/cm/positionSide/dual`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)

Name

Type

Mandatory

Description

dualSidePosition

STRING

YES

"true": Hedge Mode; "false": One-way Mode

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)

```
{    "code": 200,    "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Position-Mode)
