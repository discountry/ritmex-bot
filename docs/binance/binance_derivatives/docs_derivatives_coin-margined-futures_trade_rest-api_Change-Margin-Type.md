---
title: "Change Margin Type | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type"
fetched_at: "2026-01-27T05:28:05.211Z"
---
# Change Margin Type (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)

Change user's margin type in the specific symbol market.For Hedge Mode, LONG and SHORT positions of one symbol use the same margin type.  
With ISOLATED margin type, margins of the LONG and SHORT positions are isolated from each other.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)

POST `/dapi/v1/marginType`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)

Name

Type

Mandatory

Description

symbol

STRING

YES

marginType

ENUM

YES

ISOLATED, CROSSED

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)

```
{	"code": 200,	"msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Margin-Type)
