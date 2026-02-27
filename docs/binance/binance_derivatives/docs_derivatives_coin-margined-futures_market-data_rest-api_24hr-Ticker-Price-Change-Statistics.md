---
title: "24hr Ticker Price Change Statistics | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics"
fetched_at: "2026-01-27T05:28:02.371Z"
---
# 24hr Ticker Price Change Statistics

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

24 hour rolling window price change statistics.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

GET `/dapi/v1/ticker/24hr`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

**1** for a single symbol, **40** when the symbol parameter is omitted **Careful** when accessing this with no symbol.

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

Name

Type

Mandatory

Description

symbol

STRING

NO

pair

STRING

NO

> -   Symbol and pair cannot be sent together
> -   If a pair is sent,tickers for all symbols of the pair will be returned
> -   If either a pair or symbol is sent, tickers for all symbols of all pairs will be returned

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)

```
[	{		"symbol": "BTCUSD_200925",	  	"pair": "BTCUSD",	  	"priceChange": "136.6",	  	"priceChangePercent": "1.436",	  	"weightedAvgPrice": "9547.3",	  	"lastPrice": "9651.6",	  	"lastQty": "1",	  	"openPrice": "9515.0",	  	"highPrice": "9687.0",	  	"lowPrice": "9499.5",	  	"volume": "494109",	  	"baseVolume": "5192.94797687",	  	"openTime": 1591170300000,	  	"closeTime": 1591256718418,	  	"firstId": 600507, // First tradeId	  	"lastId": 697803,  // Last tradeId	  	"count": 97297    // Trade count  	  	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics)
