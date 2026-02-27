---
title: "Change Initial Leverage | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage"
fetched_at: "2026-01-27T05:28:04.988Z"
---
# Change Initial Leverage (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)

Change user's initial leverage in the specific symbol market.  
For Hedge Mode, LONG and SHORT positions of one symbol use the same initial leverage and share a total notional value.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)

POST `/dapi/v1/leverage`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)

Name

Type

Mandatory

Description

symbol

STRING

YES

leverage

INT

YES

target initial leverage: int from 1 to 125

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)

```
{ 	"leverage": 21, 	"maxQty": "1000",  // maximum quantity of base asset 	"symbol": "BTCUSD_200925"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Change-Initial-Leverage)
