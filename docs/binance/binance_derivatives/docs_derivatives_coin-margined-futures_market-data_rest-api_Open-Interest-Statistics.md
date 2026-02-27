---
title: "Open Interest Statistics | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics"
fetched_at: "2026-01-27T05:28:03.665Z"
---
# Open Interest Statistics

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)

Query open interest stats

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)

GET `/futures/data/openInterestHist`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)

Name

Type

Mandatory

Description

pair

STRING

YES

BTCUSD

contractType

ENUM

YES

ALL, CURRENT\_QUARTER, NEXT\_QUARTER, PERPETUAL

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)

```
[     {	  "pair": "BTCUSD",	  "contractType": "CURRENT_QUARTER",	  "sumOpenInterest": "20403",  //unit: cont	  "sumOpenInterestValue": "176196512.23400000", //unit: base asset	  "timestamp": 1591261042378   },   {     "pair": "BTCUSD",	  "contractType": "CURRENT_QUARTER",	  "sumOpenInterest": "20401",  	  "sumOpenInterestValue": "176178704.98700000", 	  "timestamp": 1583128200000   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Open-Interest-Statistics)
