---
title: "Um Notional And Leverage Brackets | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets"
fetched_at: "2026-01-27T05:28:18.978Z"
---
# UM Notional and Leverage Brackets (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)

Query UM notional and leverage brackets

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)

`GET /papi/v1/um/leverageBracket`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)

```
[    {        "symbol": "ETHUSDT",        "notionalCoef": "4.0",        "brackets": [            {                "bracket": 1,   // Notional bracket                "initialLeverage": 75,  // Max initial leverage for this bracket                "notionalCap": 10000,  // Cap notional of this bracket                "notionalFloor": 0,  // Notional threshold of this bracket                 "maintMarginRatio": 0.0065, // Maintenance ratio for this bracket                "cum":0 // Auxiliary number for quick calculation             },        ]    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets)
