---
title: "Basis | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis"
fetched_at: "2026-01-27T05:28:02.535Z"
---
# Basis

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)

Query basis

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)

GET `/futures/data/basis`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)

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

CURRENT\_QUARTER, NEXT\_QUARTER, PERPETUAL

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)

```
[     {        "indexPrice": "29269.93972727",        "contractType": "CURRENT_QUARTER",        "basisRate": "0.0024",        "futuresPrice": "29341.3",        "annualizedBasisRate": "0.0283",        "basis": "71.36027273",        "pair": "BTCUSD",        "timestamp": 1653381600000   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Basis)
