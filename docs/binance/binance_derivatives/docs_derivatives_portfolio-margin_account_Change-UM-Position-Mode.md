---
title: "Change Um Position Mode | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode"
fetched_at: "2026-01-27T05:28:16.461Z"
---
# Change UM Position Mode(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)

Change user's position mode (Hedge Mode or One-way Mode ) on EVERY symbol in UM

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)

POST `/papi/v1/um/positionSide/dual`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)

```
{    "code": 200,    "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Position-Mode)
