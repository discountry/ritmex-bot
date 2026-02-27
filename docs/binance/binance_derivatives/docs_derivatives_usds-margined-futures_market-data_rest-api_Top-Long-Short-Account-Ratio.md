---
title: "Top Trader Long Short Account Ratio | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio"
fetched_at: "2026-01-27T05:28:29.166Z"
---
# Top Trader Long/Short Ratio (Accounts)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)

The proportion of net long and net short accounts to total accounts of the top 20% users with the highest margin balance. Each account is counted once only. Long Account % = Accounts of top traders with net long positions / Total accounts of top traders with open positions Short Account % = Accounts of top traders with net short positions / Total accounts of top traders with open positions Long/Short Ratio (Accounts) = Long Account % / Short Account %

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)

GET `/futures/data/topLongShortAccountRatio`

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)

```
[    {          "symbol":"BTCUSDT",	      "longShortRatio":"1.8105",  // long/short account num ratio of top traders	      "longAccount": "0.6442",   // long account num ratio of top traders 	      "shortAccount":"0.3558",   // long account num ratio of top traders 	      "timestamp":"1583139600000"    },     {              "symbol":"BTCUSDT",	      "longShortRatio":"0.5576",	      "longAccount": "0.3580", 	      "shortAccount":"0.6420", 	                	      "timestamp":"1583139900000"             }  ]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Top-Long-Short-Account-Ratio)
