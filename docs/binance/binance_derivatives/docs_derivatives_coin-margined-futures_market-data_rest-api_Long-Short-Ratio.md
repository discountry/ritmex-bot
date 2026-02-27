---
title: "Long Short Ratio | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio"
fetched_at: "2026-01-27T05:28:03.306Z"
---
# Long/Short Ratio

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)

Query symbol Long/Short Ratio

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)

GET `/futures/data/globalLongShortAccountRatio`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)

Name

Type

Mandatory

Description

pair

STRING

YES

BTCUSD

period

ENUM

YES

"5m","15m","30m","1h","2h","4h","6h","12h","1d"

limit

LONG

NO

Default 30,Max 500

startTime

LONG

NO

endTime

LONG

NO

> -   If startTime and endTime are not sent, the most recent data is returned.
> -   Only the data of the latest 30 days is available.

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)

```
[     {	  "pair": "BTCUSD",	  "longShortRatio": "0.1960",	  "longAccount": "0.6622",  //66.22%	  "shortAccount": "0.3378",  //33.78%	  "timestamp": 1583139600000   },   {     "pair": "BTCUSD",	  "longShortRatio": "1.9559",	  "longAccount": "0.6617",  	  "shortAccount": "0.3382",  	  "timestamp": 1583139900000	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Long-Short-Ratio)
