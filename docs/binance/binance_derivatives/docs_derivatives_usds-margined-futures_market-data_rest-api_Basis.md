---
title: "Basis | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis"
fetched_at: "2026-01-27T05:28:27.065Z"
---
# Basis

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)

Query future basis

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)

GET `/futures/data/basis`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)

**0**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)

Name

Type

Mandatory

Description

pair

STRING

YES

BTCUSDT

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

YES

Default 30,Max 500

startTime

LONG

NO

endTime

LONG

NO

> -   If startTime and endTime are not sent, the most recent data is returned.
> -   Only the data of the latest 30 days is available.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)

```
[      {        "indexPrice": "34400.15945055",        "contractType": "PERPETUAL",        "basisRate": "0.0004",        "futuresPrice": "34414.10",        "annualizedBasisRate": "",        "basis": "13.94054945",        "pair": "BTCUSDT",        "timestamp": 1698742800000    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Basis)
