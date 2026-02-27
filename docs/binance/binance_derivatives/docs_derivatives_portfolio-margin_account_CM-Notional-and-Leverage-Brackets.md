---
title: "Cm Notional And Leverage Brackets | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets"
fetched_at: "2026-01-27T05:28:16.279Z"
---
# CM Notional and Leverage Brackets(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)

Query CM notional and leverage brackets

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)

GET `/papi/v1/cm/leverageBracket`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)

```
[    {        "symbol": "BTCUSD_PERP",        "brackets": [            {                "bracket": 1,   // bracket level                "initialLeverage": 125,  // the maximum leverage                "qtyCap": 50,  // upper edge of base asset quantity                "qtyFloor": 0,  // lower edge of base asset quantity                "maintMarginRatio": 0.004, // maintenance margin rate                "cum": 0.0 // Auxiliary number for quick calculation             },        ]    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets)
