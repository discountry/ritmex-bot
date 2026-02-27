---
title: "Long Short Ratio | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio"
fetched_at: "2026-01-27T05:28:28.102Z"
---
# Long/Short Ratio

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)

Query symbol Long/Short Ratio

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)

GET `/futures/data/globalLongShortAccountRatio`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)

**0**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)

Name

Type

Mandatory

Description

symbol

STRING

YES

period

ENUM

YES

"5m","15m","30m","1h","2h","4h","6h","12h","1d"

limit

LONG

NO

default 30, max 500

startTime

LONG

NO

endTime

LONG

NO

> -   If startTime and endTime are not sent, the most recent data is returned.
> -   Only the data of the latest 30 days is available.
> -   IP rate limit 1000 requests/5min

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)

```
[    {          "symbol":"BTCUSDT",  // long/short account num ratio of all traders	      "longShortRatio":"0.1960",  //long account num ratio of all traders	      "longAccount": "0.6622",   // short account num ratio of all traders	      "shortAccount":"0.3378", 	      "timestamp":"1583139600000"         },          {                  "symbol":"BTCUSDT",	      "longShortRatio":"1.9559",	      "longAccount": "0.6617", 	      "shortAccount":"0.3382", 	                	      "timestamp":"1583139900000"	                       },   	    ]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio)
