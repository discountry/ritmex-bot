---
title: "Notional Bracket For Symbol | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol"
fetched_at: "2026-01-27T05:28:01.725Z"
---
# Notional Bracket for Symbol(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)

Get the symbol's notional bracket list.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)

GET `/dapi/v2/leverageBracket`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)

Name

Type

Mandatory

Description

symbol

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)

```
[    {        "symbol": "BTCUSD_PERP",        "notionalCoef": 1.50,  //user symbol bracket multiplier, only appears when user's symbol bracket is adjusted         "brackets": [            {                "bracket": 1,   // bracket level                "initialLeverage": 125,  // the maximum leverage                "qtyCap": 50,  // upper edge of base asset quantity                "qtylFloor": 0,  // lower edge of base asset quantity                "maintMarginRatio": 0.004 // maintenance margin rate				"cum": 0.0 // Auxiliary number for quick calculation             },        ]    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Symbol)
