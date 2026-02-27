---
title: "Taker Buy Sell Volume | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume"
fetched_at: "2026-01-27T05:28:04.064Z"
---
# Taker Buy/Sell Volume

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)

Taker Buy Volume: the total volume of buy orders filled by takers within the period. Taker Sell Volume: the total volume of sell orders filled by takers within the period.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)

GET `/futures/data/takerBuySellVol`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)

```
[     {	  "pair": "BTCUSD",	  "contractType": "CURRENT_QUARTER",	  "takerBuyVol": "387",  //unit: cont	  "takerSellVol": "248",  //unit: cont	  "takerBuyVolValue": "2342.1220", //unit: base asset	  "takerSellVolValue": "4213.9800", //unit: base asset	  "timestamp": 1591261042378   },   {     "pair": "BTCUSD",	  "contractType": "CURRENT_QUARTER",	  "takerBuyVol": "234",  //unit: cont	  "takerSellVol": "121",  //unit: cont	  "takerBuyVolValue": "4563.1320", //unit: base asset	  "takerSellVolValue": "3313.3940", //unit: base asset	  "timestamp": 1585615200000   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Taker-Buy-Sell-Volume)
