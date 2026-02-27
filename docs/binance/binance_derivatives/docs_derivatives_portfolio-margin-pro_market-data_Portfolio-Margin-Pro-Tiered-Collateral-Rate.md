---
title: "Portfolio Margin Pro Tiered Collateral Rate(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate"
fetched_at: "2026-01-27T05:28:15.673Z"
---
# Portfolio Margin Pro Tiered Collateral Rate(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)

Portfolio Margin PRO Tiered Collateral Rate

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)

GET `/sapi/v2/portfolio/collateralRate`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)

**50**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)

```
[    {        "asset": "BNB",        "collateralInfo": [            {            "tierFloor": "0.0000",            "tierCap": "1000.0000",            "collateralRate": "1.0000",            "cum":"0.0000"    //account equity quick addition number            },            {            "tierFloor": "1000.0000",            "tierCap": "2000.0000",            "collateralRate": "0.9000",            "cum":"0.0000"            }        ]    },    {        "asset": "USDT",        "collateralInfo": [            {                "tierFloor": "0.0000",                "tierCap": "1000.0000",                "collateralRate": "1.0000",                "cum":"0.0000"            },            {                "tierFloor": "1000.0000",                "tierCap": "2000.0000",                "collateralRate": "0.9999",                "cum":"0.0000"            }        ]    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data/Portfolio-Margin-Pro-Tiered-Collateral-Rate)
