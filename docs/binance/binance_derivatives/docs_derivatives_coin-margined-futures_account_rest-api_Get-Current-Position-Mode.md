---
title: "Get Current Position Mode | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode"
fetched_at: "2026-01-27T05:28:00.641Z"
---
# Get Current Position Mode(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)

Get user's position mode (Hedge Mode or One-way Mode ) on _**EVERY symbol**_

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)

GET `/dapi/v1/positionSide/dual`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)

**30**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)

```
{	"dualSidePosition": true // "true": Hedge Mode; "false": One-way Mode}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Current-Position-Mode)
