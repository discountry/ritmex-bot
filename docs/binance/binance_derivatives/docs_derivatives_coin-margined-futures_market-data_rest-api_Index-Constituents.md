---
title: "Query Index Price Constituents | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents"
fetched_at: "2026-01-27T05:28:03.049Z"
---
# Query Index Price Constituents

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)

Query index price constituents

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)

GET `/dapi/v1/constituents`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)

Name

Type

Mandatory

Description

symbol

STRING

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)

```
{    "symbol": "BTCUSD",    "time": 1697422647853,    "constituents": [        {            "exchange": "bitstamp",            "symbol": "btcusd"        },        {            "exchange": "coinbase",            "symbol": "BTC-USD"        },        {            "exchange": "kraken",            "symbol": "XBT/USD"        },        {            "exchange": "binance_cross",            "symbol": "BTCUSDC*index(USDCUSD)"        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Constituents)
