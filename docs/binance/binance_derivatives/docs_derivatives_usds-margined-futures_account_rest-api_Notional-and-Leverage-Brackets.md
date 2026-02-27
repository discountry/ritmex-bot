---
title: "Notional And Leverage Brackets | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets"
fetched_at: "2026-01-27T05:28:25.830Z"
---
# Notional and Leverage Brackets (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)

Query user notional and leverage bracket on speicfic symbol

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)

GET `/fapi/v1/leverageBracket`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)

> **Response:**

```
[    {        "symbol": "ETHUSDT",	    "notionalCoef": 1.50,  //user symbol bracket multiplier, only appears when user's symbol bracket is adjusted         "brackets": [            {                "bracket": 1,   // Notional bracket                "initialLeverage": 75,  // Max initial leverage for this bracket                "notionalCap": 10000,  // Cap notional of this bracket                "notionalFloor": 0,  // Notional threshold of this bracket                 "maintMarginRatio": 0.0065, // Maintenance ratio for this bracket                "cum": 0.0 // Auxiliary number for quick calculation                            },        ]    }]
```

> **OR** (if symbol sent)

```
{    "symbol": "ETHUSDT",    "notionalCoef": 1.50,    "brackets": [        {            "bracket": 1,            "initialLeverage": 75,            "notionalCap": 10000,            "notionalFloor": 0,            "maintMarginRatio": 0.0065,            "cum":0        },    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets)
