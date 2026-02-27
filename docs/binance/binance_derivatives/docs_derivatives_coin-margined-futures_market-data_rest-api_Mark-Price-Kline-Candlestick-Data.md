---
title: "Mark Price Kline Candlestick Data | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data"
fetched_at: "2026-01-27T05:28:03.523Z"
---
# Mark Price Kline/Candlestick Data

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)

Kline/candlestick bars for the mark price of a symbol. Klines are uniquely identified by their open time.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)

GET `/dapi/v1/markPriceKlines`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)

based on parameter `LIMIT`

LIMIT

weight

\[1,100)

1

\[100, 500)

2

\[500, 1000\]

5

> 1000 | 10

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)

Name

Type

Mandatory

Description

symbol

STRING

YES

interval

ENUM

YES

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default 500; max 1500.

> -   The difference between `startTime` and `endTime` can only be up to 200 days
> -   Between `startTime` and `endTime`, the most recent `limit` data from `endTime` will be returned:
>     -   If `startTime` and `endTime` are not sent, current timestamp will be set as `endTime`, and the most recent data will be returned.
>     -   If `startTime` is sent only, the timestamp of 200 days after `startTime` will be set as `endTime`(up to the current time)
>     -   If `endTime` is sent only, the timestamp of 200 days before `endTime` will be set as `startTime`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)

```
[  [    1591256460000,     		// Open time    "9653.29201333",    	// Open    "9654.56401333",     	// High    "9653.07367333",     	// Low    "9653.07367333",     	// Close (or latest price)    "0	", 					// Ignore    1591256519999,      	// Close time    "0",    				// Ignore    60,                	 	// Number of bisic data    "0",    				// Ignore    "0",      			 	// Ignore    "0" 					// Ignore  ]]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data)
