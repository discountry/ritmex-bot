---
title: "Symbol Price Ticker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker"
fetched_at: "2026-01-27T05:28:29.671Z"
---
# Symbol Price Ticker

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)

Latest price for a symbol or symbols.

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)

`ticker.price`

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)

```
{   	"id": "9d32157c-a556-4d27-9866-66760a174b57",    "method": "ticker.price",    "params": {        "symbol": "BTCUSDT"    }}
```

**Weight:**

**1** for a single symbol;  
**2** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)

Name

Type

Mandatory

Description

symbol

STRING

NO

> -   If the symbol is not sent, prices for all symbols will be returned in an array.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)

```
{  "id": "9d32157c-a556-4d27-9866-66760a174b57",  "status": 200,  "result": {	"symbol": "BTCUSDT",	"price": "6000.01",	"time": 1589437530011   // Transaction time  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 2    }  ]}
```

> OR

```
{  "id": "9d32157c-a556-4d27-9866-66760a174b57",  "status": 200,  "result": [	{    	"symbol": "BTCUSDT",      	"price": "6000.01",      	"time": 1589437530011  	}  ],  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 2    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Price-Ticker)
