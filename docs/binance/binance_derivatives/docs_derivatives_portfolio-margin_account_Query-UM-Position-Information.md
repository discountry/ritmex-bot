---
title: "Query Um Position Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information"
fetched_at: "2026-01-27T05:28:18.788Z"
---
# Query UM Position Information(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)

Get current UM position information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)

GET `/papi/v1/um/positionRisk`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)

**5**

**Parameters:**

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

**Note**

> -   Please use with user data stream `ACCOUNT_UPDATE` to meet your timeliness and accuracy needs.  
> -   for One-way Mode user, the response will only show the "BOTH" positions
> -   for Hedge Mode user, the response will show "LONG", and "SHORT" positions.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)

> -   For One-way position mode:

```
 [    {        "entryPrice": "0.00000",         "leverage": "10",         "markPrice": "6679.50671178",           "maxNotionalValue": "20000000",         "positionAmt": "0.000",         "notional": "0",        "symbol": "BTCUSDT",         "unRealizedProfit": "0.00000000",         "liquidationPrice": "6170.20509059",        "positionSide": "BOTH",         "updateTime": 1625474304765       }]
```

> Or For Hedge position mode(only return with position):

```
[    {        "symbol": "BTCUSDT",        "positionAmt": "0.001",        "entryPrice": "22185.2",        "markPrice": "21123.05052574",        "unRealizedProfit": "-1.06214947",        "liquidationPrice": "6170.20509059",        "leverage": "4",        "maxNotionalValue": "100000000",        "positionSide": "LONG",        "notional": "21.12305052",        "updateTime": 1655217461579    },    {        "symbol": "BTCUSDT",        "positionAmt": "0.000",        "entryPrice": "0.0",        "markPrice": "21123.05052574",        "unRealizedProfit": "0.00000000",        "liquidationPrice": "6170.20509059",        "leverage": "4",        "maxNotionalValue": "100000000",        "positionSide": "SHORT",        "notional": "0",        "updateTime": 0    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information)
