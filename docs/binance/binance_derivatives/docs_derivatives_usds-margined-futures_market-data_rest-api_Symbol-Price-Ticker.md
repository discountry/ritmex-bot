---
title: "Symbol Price Ticker(Deprecated) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker"
fetched_at: "2026-01-27T05:28:28.950Z"
---
# Symbol Price Ticker(Deprecated)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

Latest price for a symbol or symbols.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

GET `/fapi/v1/ticker/price`

**Weight:**

**1** for a single symbol;  
**2** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

Name

Type

Mandatory

Description

symbol

STRING

NO

> -   If the symbol is not sent, prices for all symbols will be returned in an array.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)

```
{  "symbol": "BTCUSDT",  "price": "6000.01",  "time": 1589437530011   // Transaction time}
```

> OR

```
[	{  		"symbol": "BTCUSDT",  		"price": "6000.01",  		"time": 1589437530011	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker)
