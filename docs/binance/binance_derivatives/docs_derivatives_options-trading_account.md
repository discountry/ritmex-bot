---
title: "Option Margin Account Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/account"
fetched_at: "2026-01-27T05:28:09.171Z"
---
# Option Margin Account Information (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/account)

Get current account information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/account)

GET `/eapi/v1/marginAccount`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/account)

**3**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/account)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/account)

```
{    "asset": [        {            "asset": "USDT",                     // Asset type            "marginBalance": "99998.87365244",   // Account balance            "equity": "99998.87365244",          // Account equity            "available": "96883.72734374",       // Available funds            "initialMargin": "3115.14630870",    // Initial margin            "maintMargin": "0.00000000",         // Maintenance margin            "unrealizedPNL": "0.00000000",       // Unrealized profit/loss            "adjustedEquity": "99998.87365244"   // margin balance + qualified Long Position Value        }    ],    "greek": [        {            "underlying": "BTCUSDT",    // Option Underlying            "delta": "0",               // Account delta            "theta": "0",               // Account theta            "gamma": "0",               // Account gamma            "vega": "0"                 // Account vega          }    ],    "time": 1762843368098,    "canTrade": true,    "canDeposit": true,    "canWithdraw": true,    "reduceOnly": false}   
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/account)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/account)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/account)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/account)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/account)
