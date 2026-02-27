---
title: "Query Portfolio Margin Asset Index Price(MARKET_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data"
fetched_at: "2026-01-27T05:28:15.500Z"
---
# Query Portfolio Margin Asset Index Price (MARKET\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)

Query Portfolio Margin Asset Index Price

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)

GET `/sapi/v1/portfolio/asset-index-price`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)

**1** if send asset or **50** if not send asset

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)

Name

Type

Mandatory

Description

asset

STRING

NO

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)

```
[   {       "asset": "BTC",       "assetIndexPrice": "28251.9136906",  // in USD       "time": 1683518338121   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/market-data)
