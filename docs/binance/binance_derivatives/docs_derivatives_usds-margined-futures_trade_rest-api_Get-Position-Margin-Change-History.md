---
title: "Get Position Margin Change History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History"
fetched_at: "2026-01-27T05:28:30.844Z"
---
# Get Position Margin Change History (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

Get Position Margin Change History

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

GET `/fapi/v1/positionMargin/history`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

Name

Type

Mandatory

Description

symbol

STRING

YES

type

INT

NO

1: Add position margin，2: Reduce position margin

startTime

LONG

NO

endTime

LONG

NO

Default current time if not pass

limit

INT

NO

Default: 500

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Support querying future histories that are not older than 30 days
> -   The time between `startTime` and `endTime`can't be more than 30 days

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

```
[	{	  	"symbol": "BTCUSDT",	  	"type": 1,		"deltaType": "USER_ADJUST",		"amount": "23.36332311",	  	"asset": "USDT",	  	"time": 1578047897183,	  	"positionSide": "BOTH"	},	{		"symbol": "BTCUSDT",	  	"type": 1, 		"deltaType": "USER_ADJUST",		"amount": "100",	  	"asset": "USDT",	  	"time": 1578047900425,	  	"positionSide": "LONG" 	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
