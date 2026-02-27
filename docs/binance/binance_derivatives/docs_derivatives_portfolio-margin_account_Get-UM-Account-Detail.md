---
title: "Get Um Account Detail | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail"
fetched_at: "2026-01-27T05:28:17.350Z"
---
# Get UM Account Detail(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)

Get current UM account asset and position information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)

GET `/papi/v1/um/account`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)

```
{       "assets": [        {            "asset": "USDT",            // asset name            "crossWalletBalance": "23.72469206",      // wallet balance            "crossUnPnl": "0.00000000",    // unrealized profit            "maintMargin": "0.00000000",        // maintenance margin required            "initialMargin": "0.00000000",    // total initial margin required with current mark price             "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price            "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price            "updateTime": 1625474304765 // last update time         }    ],    "positions": [  // positions of all symbols in the market are returned        // only "BOTH" positions will be returned with One-way mode        // only "LONG" and "SHORT" positions will be returned with Hedge mode        {            "symbol": "BTCUSDT",    // symbol name            "initialMargin": "0",   // initial margin required with current mark price             "maintMargin": "0",     // maintenance margin required            "unrealizedProfit": "0.00000000",  // unrealized profit            "positionInitialMargin": "0",      // initial margin required for positions with current mark price            "openOrderInitialMargin": "0",     // initial margin required for open orders with current mark price            "leverage": "100",      // current initial leverage            "entryPrice": "0.00000",    // average entry price            "maxNotional": "250000",    // maximum available notional with current leverage            "bidNotional": "0",  // bids notional, ignore            "askNotional": "0",  // ask notional, ignore            "positionSide": "BOTH",     // position side            "positionAmt": "0",         // position amount            "updateTime": 0           // last update time        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail)
