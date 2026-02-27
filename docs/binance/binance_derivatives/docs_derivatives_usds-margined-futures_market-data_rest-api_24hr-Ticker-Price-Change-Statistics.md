---
title: "24hr Ticker Price Change Statistics | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics"
fetched_at: "2026-01-27T05:28:27.162Z"
---
# 24hr Ticker Price Change Statistics

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

24 hour rolling window price change statistics.  
**Careful** when accessing this with no symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

GET `/fapi/v1/ticker/24hr`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

**1** for a single symbol;  
**40** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

Name

Type

Mandatory

Description

symbol

STRING

NO

> -   If the symbol is not sent, tickers for all symbols will be returned in an array.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

> **Response:**

```
{  "symbol": "BTCUSDT",  "priceChange": "-94.99999800",  "priceChangePercent": "-95.960",  "weightedAvgPrice": "0.29628482",  "lastPrice": "4.00000200",  "lastQty": "200.00000000",  "openPrice": "99.00000000",  "highPrice": "100.00000000",  "lowPrice": "0.10000000",  "volume": "8913.30000000",  "quoteVolume": "15.30000000",  "openTime": 1499783499040,  "closeTime": 1499869899040,  "firstId": 28385,   // First tradeId  "lastId": 28460,    // Last tradeId  "count": 76         // Trade count}
```

> OR

```
[	{  		"symbol": "BTCUSDT",  		"priceChange": "-94.99999800",  		"priceChangePercent": "-95.960",  		"weightedAvgPrice": "0.29628482",  		"lastPrice": "4.00000200",  		"lastQty": "200.00000000",  		"openPrice": "99.00000000",  		"highPrice": "100.00000000",  		"lowPrice": "0.10000000",  		"volume": "8913.30000000",  		"quoteVolume": "15.30000000",  		"openTime": 1499783499040,  		"closeTime": 1499869899040,  		"firstId": 28385,   // First tradeId  		"lastId": 28460,    // Last tradeId  		"count": 76         // Trade count	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
