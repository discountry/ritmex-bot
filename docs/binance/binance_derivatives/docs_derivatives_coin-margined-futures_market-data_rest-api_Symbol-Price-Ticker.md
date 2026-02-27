---
title: "Symbol Price Ticker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker"
fetched_at: "2026-01-27T05:28:04.184Z"
---
# Symbol Price Ticker

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

Latest price for a symbol or symbols.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

GET `/dapi/v1/ticker/price`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

**1** for a single symbol, **2** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

```
[	{  		"symbol": "BTCUSD_200626",	  		"ps": "9647.8",  			// pair   		"price": "9647.8",		  		"time": 1591257246176  	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
