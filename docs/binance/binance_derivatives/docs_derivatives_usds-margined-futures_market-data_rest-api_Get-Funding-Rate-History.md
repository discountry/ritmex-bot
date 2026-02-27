---
title: "Get Funding Rate History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History"
fetched_at: "2026-01-27T05:28:27.721Z"
---
# Get Funding Rate History

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)

Get Funding Rate History

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)

GET `/fapi/v1/fundingRate`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)

share 500/5min/IP rate limit with GET /fapi/v1/fundingInfo

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)

Name

Type

Mandatory

Description

symbol

STRING

NO

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

> -   If `startTime` and `endTime` are not sent, the most recent 200 records are returned.
> -   If the number of data between `startTime` and `endTime` is larger than `limit`, return as `startTime` + `limit`.
> -   In ascending order.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)

```
[	{    	"symbol": "BTCUSDT",    	"fundingRate": "-0.03750000",    	"fundingTime": 1570608000000,		"markPrice": "34287.54619963"   // mark price associated with a particular funding fee charge	},	{   		"symbol": "BTCUSDT",    	"fundingRate": "0.00010000",    	"fundingTime": 1570636800000,		"markPrice": "34287.54619963" 	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History)
