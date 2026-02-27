---
title: "Option Position Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information"
fetched_at: "2026-01-27T05:28:11.882Z"
---
# Option Position Information (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)

Get current position information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)

GET `/eapi/v1/position`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)

Name

Type

Mandatory

Description

symbol

STRING

NO

Option trading pair, e.g BTC-200730-9000-C

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)

```
[  {    "entryPrice": "1000",               // Average entry price    "symbol": "BTC-200730-9000-C",      // Option trading pair    "side": "SHORT",                    // Position direction    "quantity": "-0.1",                 // Number of positions (positive numbers represent long positions, negative number represent short positions)    "markValue": "105.00138",           // Current market value    "unrealizedPNL": "-5.00138",        // Unrealized profit/loss    "markPrice": "1050.0138",           // Mark price    "strikePrice": "9000",              // Strike price    "expiryDate": 1593511200000,         // Exercise time    "priceScale": 2,    "quantityScale": 2,    "optionSide": "CALL",               // option type    "quoteAsset": "USDT",               // quote asset    "time": 1762872654561,              // last update time    "bidQuantity": "0.0000",            // buy order qty       "askQuantity": "0.0000"             // sell order qty   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Option-Position-Information)
