---
title: "Multi Assets Mode Asset Index | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index"
fetched_at: "2026-01-27T05:28:28.308Z"
---
# Multi-Assets Mode Asset Index

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)

asset index for Multi-Assets mode

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)

GET `/fapi/v1/assetIndex`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)

**1** for a single symbol; **10** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)

Name

Type

Mandatory

Description

symbol

STRING

NO

Asset pair

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)

> **Response:**

```
{	"symbol": "ADAUSD",	"time": 1635740268004,	"index": "1.92957370",	"bidBuffer": "0.10000000", 	"askBuffer": "0.10000000", 	"bidRate": "1.73661633",	"askRate": "2.12253107",	"autoExchangeBidBuffer": "0.05000000",	"autoExchangeAskBuffer": "0.05000000",	"autoExchangeBidRate": "1.83309501",	"autoExchangeAskRate": "2.02605238"}
```

> Or(without symbol)

```
[	{		"symbol": "ADAUSD",		"time": 1635740268004,		"index": "1.92957370",		"bidBuffer": "0.10000000", 		"askBuffer": "0.10000000", 		"bidRate": "1.73661633",		"askRate": "2.12253107",		"autoExchangeBidBuffer": "0.05000000",		"autoExchangeAskBuffer": "0.05000000",		"autoExchangeBidRate": "1.83309501",		"autoExchangeAskRate": "2.02605238"	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Multi-Assets-Mode-Asset-Index)
