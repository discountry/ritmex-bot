---
title: "Query Index Price Constituents | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents"
fetched_at: "2026-01-27T05:28:27.850Z"
---
# Query Index Price Constituents

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)

Query index price constituents

**Note**:

> Prices from constituents of TradFi perps will be hiden and displayed as -1.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)

GET `/fapi/v1/constituents`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)

**2**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)

Name

Type

Mandatory

Description

symbol

STRING

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)

```
{    "symbol": "BTCUSDT",    "time": 1745401553408,    "constituents": [        {            "exchange": "binance",            "symbol": "BTCUSDT",            "price": "94057.03000000",            "weight": "0.51282051"        },        {            "exchange": "coinbase",            "symbol": "BTC-USDT",            "price": "94140.58000000",            "weight": "0.15384615"        },        {            "exchange": "gateio",            "symbol": "BTC_USDT",            "price": "94060.10000000",            "weight": "0.02564103"        },        {            "exchange": "kucoin",            "symbol": "BTC-USDT",            "price": "94096.70000000",            "weight": "0.07692308"        },        {            "exchange": "mxc",            "symbol": "BTCUSDT",            "price": "94057.02000000",            "weight": "0.07692308"        },        {            "exchange": "bitget",            "symbol": "BTCUSDT",            "price": "94064.03000000",            "weight": "0.07692308"        },        {            "exchange": "bybit",            "symbol": "BTCUSDT",            "price": "94067.90000000",            "weight": "0.07692308"        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Constituents)
