---
title: "Get Cm Account Detail | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail"
fetched_at: "2026-01-27T05:28:16.809Z"
---
# Get CM Account Detail(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)

Get current CM account asset and position information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)

GET `/papi/v1/cm/account`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)

```
{    "assets": [        {            "asset": "BTC",  // asset name             "crossWalletBalance": "0.00241969",  // total wallet balance            "crossUnPnl": "0.00000000",  // unrealized profit or loss            "maintMargin": "0.00000000",    // maintenance margin            "initialMargin": "0.00000000",  // total intial margin required with the latest mark price            "positionInitialMargin": "0.00000000",  // positions" margin required with the latest mark price            "openOrderInitialMargin": "0.00000000",  // open orders" intial margin required with the latest mark price            "updateTime": 1625474304765 // last update time           }     ],     "positions": [         {            "symbol": "BTCUSD_201225",            "positionAmt":"0",  // position amount            "initialMargin": "0",            "maintMargin": "0",            "unrealizedProfit": "0.00000000",            "positionInitialMargin": "0",            "openOrderInitialMargin": "0",            "leverage": "125",            "positionSide": "BOTH", // BOTH means that it is the position of One-way Mode              "entryPrice": "0.0",            "maxQty": "50",  // maximum quantity of base asset            "updateTime": 0        }     ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail)
