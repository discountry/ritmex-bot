---
title: "Symbol Price Ticker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker"
fetched_at: "2026-01-27T05:28:10.415Z"
---
# Index Price

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)

Get spot index price for option underlying.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)

GET `/eapi/v1/index`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)

Name

Type

Mandatory

Description

underlying

STRING

YES

Spot pair（Option contract underlying asset, e.g BTCUSDT)

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)

```
{   "time": 1656647305000,   "indexPrice": "105917.75" // Current index price}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Symbol-Price-Ticker)
