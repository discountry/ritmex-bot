---
title: "Query Trading Schedule | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule"
fetched_at: "2026-01-27T05:28:29.276Z"
---
# Trading Schedule

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)

Trading session schedules for the underlying assets of TradFi Perps are provided for a one-week period starting from the day prior to the query time, covering both the U.S. equity and commodity markets. Equity market session types include "PRE\_MARKET", "REGULAR", "AFTER\_MARKET", "OVERNIGHT", and "NO\_TRADING", while commodity market session types include "REGULAR" and "NO\_TRADING".

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)

GET `/fapi/v1/tradingSchedule`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)

NONE

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)

```
{  "updateTime": 1761286643918,  "marketSchedules": {    "EQUITY": {      "sessions": [        {          "startTime": 1761177600000,          "endTime": 1761206400000,          "type": "OVERNIGHT"        },        {          "startTime": 1761206400000,          "endTime": 1761226200000,          "type": "PRE_MARKET"        }       ]    },    "COMMODITY": {      "sessions": [        {          "startTime": 1761724800000,          "endTime": 1761744600000,          "type": "NO_TRADING"        },        {          "startTime": 1761744600000,          "endTime": 1761768000000,          "type": "REGULAR"        }      ]    }  }}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Trading-Schedule)
