---
title: "Historical Exercise Records | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records"
fetched_at: "2026-01-27T05:28:09.828Z"
---
# Historical Exercise Records

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)

Get historical exercise records.

-   REALISTIC\_VALUE\_STRICKEN -> Exercised
-   EXTRINSIC\_VALUE\_EXPIRED -> Expired OTM

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)

GET `/eapi/v1/exerciseHistory`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)

**3**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)

Name

Type

Mandatory

Description

underlying

STRING

NO

Underlying index like BTCUSDT

startTime

LONG

NO

Start Time

endTime

LONG

NO

End Time

limit

INT

NO

Number of records Default:100 Max:100

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)

```
[  {     "symbol": "BTC-220121-60000-P",            // symbol      "strikePrice": "60000",                    // strike price    "realStrikePrice": "38844.69652571",       // real strike price    "expiryDate": 1642752000000,               // Exercise time    "strikeResult": "REALISTIC_VALUE_STRICKEN" // strike result  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Historical-Exercise-Records)
