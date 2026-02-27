---
title: "Notional Bracket For Pair | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair"
fetched_at: "2026-01-27T05:28:01.714Z"
---
# Notional Bracket for Pair(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)

**Not recommended to continue using this v1 endpoint**

Get the pair's default notional bracket list, may return ambiguous values when there have been multiple different `symbol` brackets under the `pair`, suggest using the following `GET /dapi/v2/leverageBracket` query instead to get the specific `symbol` notional bracket list.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)

GET `/dapi/v1/leverageBracket`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)

Name

Type

Mandatory

Description

pair

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)

```
[    {        "pair": "BTCUSD",        "brackets": [            {                "bracket": 1,   // bracket level                "initialLeverage": 125,  // the maximum leverage                "qtyCap": 50,  // upper edge of base asset quantity                "qtylFloor": 0,  // lower edge of base asset quantity                "maintMarginRatio": 0.004 // maintenance margin rate				"cum": 0.0  // Auxiliary number for quick calculation             },        ]    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Notional-Bracket-for-Pair)
