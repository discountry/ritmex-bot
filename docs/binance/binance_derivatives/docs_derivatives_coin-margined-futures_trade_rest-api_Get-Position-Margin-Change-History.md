---
title: "Get Position Margin Change History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History"
fetched_at: "2026-01-27T05:28:05.356Z"
---
# Get Position Margin Change History(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

Get position margin change history

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

GET `/dapi/v1/positionMargin/history`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

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

1: Add position margin,2: Reduce position margin

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default: 50

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)

```
[	{		"amount": "23.36332311",	  	"asset": "BTC",	  	"symbol": "BTCUSD_200925",	  	"time": 1578047897183,	  	"type": 1,	  	"positionSide": "BOTH"	},	{		"amount": "100",	  	"asset": "BTC",	  	"symbol": "BTCUSD_200925",	  	"time": 1578047900425,	  	"type": 1,	  	"positionSide": "LONG"	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Get-Position-Margin-Change-History)
