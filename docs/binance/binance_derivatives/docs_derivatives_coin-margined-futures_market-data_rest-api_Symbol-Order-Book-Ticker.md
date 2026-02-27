---
title: "Symbol Order Book Ticker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker"
fetched_at: "2026-01-27T05:28:03.926Z"
---
# Symbol Order Book Ticker

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

Best price/qty on the order book for a symbol or symbols.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

GET `/dapi/v1/ticker/bookTicker`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

**2** for a single symbol, **5** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

```
[	{	    "lastUpdateId": 1027024,  		"symbol": "BTCUSD_200626",  		"pair": "BTCUSD",  		"bidPrice": "9650.1",  		"bidQty": "16",  		"askPrice": "9650.3",  		"askQty": "7",  		"time": 1591257300345	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
