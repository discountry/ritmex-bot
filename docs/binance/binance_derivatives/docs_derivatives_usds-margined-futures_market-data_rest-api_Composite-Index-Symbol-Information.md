---
title: "Composite Index Symbol Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information"
fetched_at: "2026-01-27T05:28:27.312Z"
---
# Composite Index Symbol Information

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)

Query composite index symbol information

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)

GET `/fapi/v1/indexInfo`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)

Name

Type

Mandatory

Description

symbol

STRING

NO

> -   Only for composite index symbols

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)

```
[	{ 		"symbol": "DEFIUSDT",		"time": 1589437530011,    // Current time		"component": "baseAsset", //Component asset		"baseAssetList":[			{				"baseAsset":"BAL",				"quoteAsset": "USDT",				"weightInQuantity":"1.04406228",				"weightInPercentage":"0.02783900"			},			{				"baseAsset":"BAND",				"quoteAsset": "USDT",				"weightInQuantity":"3.53782729",				"weightInPercentage":"0.03935200"			}		]	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Composite-Index-Symbol-Information)
