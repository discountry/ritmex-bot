---
title: "Position Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information"
fetched_at: "2026-01-27T05:28:05.731Z"
---
# Position Information(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)

Get current account information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)

GET `/dapi/v1/positionRisk`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)

Name

Type

Mandatory

Description

marginAsset

STRING

NO

pair

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If neither `marginAsset` nor `pair` is sent, positions of all symbols with `TRADING` status will be returned.
> -   for One-way Mode user, the response will only show the "BOTH" positions
> -   for Hedge Mode user, the response will show "BOTH", "LONG", and "SHORT" positions.

**Note**

> Please use with user data stream `ACCOUNT_UPDATE` to meet your timeliness and accuracy needs.

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)

```
[    {        "symbol": "BTCUSD_201225",        "positionAmt": "0",        "entryPrice": "0.0",        "breakEvenPrice": "0.0",  // break-even price        "markPrice": "0.00000000",        "unRealizedProfit": "0.00000000",        "liquidationPrice": "0",        "leverage": "125",        "maxQty": "50",  // maximum quantity of base asset        "marginType": "cross",        "isolatedMargin": "0.00000000",        "isAutoAddMargin": "false",        "positionSide": "BOTH",        "updateTime": 0    },    {        "symbol": "BTCUSD_201225",        "positionAmt": "1",        "entryPrice": "11707.70000003",        "breakEvenPrice": "11707.80000005",  // break-even price        "markPrice": "11788.66626667",        "unRealizedProfit": "0.00005866",        "liquidationPrice": "11667.63509587",        "leverage": "125",        "maxQty": "50",        "marginType": "cross",        "isolatedMargin": "0.00000000",        "isAutoAddMargin": "false",        "positionSide": "LONG",        "updateTime": 1627026881327     },    {        "symbol": "BTCUSD_201225",        "positionAmt": "0",        "entryPrice": "0.0",        "breakEvenPrice": "0.0",  // break-even price        "markPrice": "0.00000000",        "unRealizedProfit": "0.00000000",        "liquidationPrice": "0",        "leverage": "125",        "maxQty": "50",        "marginType": "cross",        "isolatedMargin": "0.00000000",        "isAutoAddMargin": "false",        "positionSide": "SHORT",        "updateTime":1627026881327  }] 
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Position-Information)
