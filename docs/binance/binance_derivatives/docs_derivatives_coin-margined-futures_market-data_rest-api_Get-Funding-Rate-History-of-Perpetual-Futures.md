---
title: "Get Funding Rate History Of Perpetual Futures | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures"
fetched_at: "2026-01-27T05:28:03.017Z"
---
# Get Funding Rate History of Perpetual Futures

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)

Get Funding Rate History of Perpetual Futures

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)

GET `/dapi/v1/fundingRate`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)

Name

Type

Mandatory

Description

symbol

STRING

YES

startTime

LONG

NO

Timestamp in ms to get funding rate from INCLUSIVE.

endTime

LONG

NO

Timestamp in ms to get funding rate until INCLUSIVE.

limit

INT

NO

Default 100; max 1000

> -   empty array will be returned for delivery symbols.

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)

```
[	{		"symbol": "BTCUSD_PERP",  		"fundingTime": 1596038400000,	  		"fundingRate": "-0.00300000"  	}, 	{ 		"symbol": "BTCUSD_PERP",  		"fundingTime": 1596067200000,  		"fundingRate": "-0.00300000"  	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Get-Funding-Rate-History-of-Perpetual-Futures)
