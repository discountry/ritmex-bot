---
title: "Option Mark Price | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price"
fetched_at: "2026-01-27T05:28:10.164Z"
---
# Option Mark Price

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)

Option mark price and greek info.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)

GET `/eapi/v1/mark`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)

Name

Type

Mandatory

Description

symbol

STRING

NO

Option trading pair, e.g BTC-200730-9000-C

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)

```
[  {    "symbol": "BTC-200730-9000-C",    "markPrice": "1343.2883",       // Mark price    "bidIV": "1.40000077",          // Implied volatility Buy    "askIV": "1.50000153",          // Implied volatility Sell    "markIV": "1.45000000"          // Implied volatility mark      "delta": "0.55937056",          // delta    "theta": "3739.82509871",       // theta    "gamma": "0.00010969",          // gamma    "vega": "978.58874732",         // vega    "highPriceLimit": "1618.241",   // Current highest buy price    "lowPriceLimit": "1068.3356"    // Current lowest sell price    "riskFreeInterest": "0.1"       // risk free rate  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Option-Mark-Price)
