---
title: "Change Position Mode | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode"
fetched_at: "2026-01-27T05:28:05.099Z"
---
# Change Position Mode(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)

Change user's position mode (Hedge Mode or One-way Mode ) on _**EVERY symbol**_

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)

POST `/dapi/v1/positionSide/dual`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)

```
{	"code": 200,	"msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Position-Mode)
