---
title: "Get Um Account Detail V2 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2"
fetched_at: "2026-01-27T05:28:17.433Z"
---
# Get UM Account Detail V2(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)

Get current UM account asset and position information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)

GET `/papi/v2/um/account`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)

```
{       "assets": [        {            "asset": "USDT",            // asset name            "crossWalletBalance": "23.72469206",      // wallet balance            "crossUnPnl": "0.00000000",    // unrealized profit            "maintMargin": "0.00000000",        // maintenance margin required            "initialMargin": "0.00000000",    // total initial margin required with current mark price             "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price            "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price            "updateTime": 1625474304765 // last update time         }    ],    "positions": [  // positions of all symbols in the market are returned        // only "BOTH" positions will be returned with One-way mode        // only "LONG" and "SHORT" positions will be returned with Hedge mode        {            "symbol": "BTCUSDT",    // symbol name            "initialMargin": "0",   // initial margin required with current mark price             "maintMargin": "0",     // maintenance margin required            "unrealizedProfit": "0.00000000",  // unrealized profit            "positionSide": "BOTH",     // position side            "positionAmt": "0",         // position amount            "updateTime": 0,           // last update time            "notional": "86.98650000"        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail-V2)
