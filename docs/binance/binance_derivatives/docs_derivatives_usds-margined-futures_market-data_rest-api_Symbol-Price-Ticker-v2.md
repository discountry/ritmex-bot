---
title: "Symbol Price Ticker V2 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2"
fetched_at: "2026-01-27T05:28:29.006Z"
---
# Symbol Price Ticker V2

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)

Latest price for a symbol or symbols.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)

GET `/fapi/v2/ticker/price`

**Weight:**

**1** for a single symbol;  
**2** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)

Name

Type

Mandatory

Description

symbol

STRING

NO

> -   If the symbol is not sent, prices for all symbols will be returned in an array.
> -   The field `X-MBX-USED-WEIGHT-1M` in response header is not accurate from this endpoint, please ignore.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)

```
{  "symbol": "BTCUSDT",  "price": "6000.01",  "time": 1589437530011   // Transaction time}
```

> OR

```
[	{  		"symbol": "BTCUSDT",  		"price": "6000.01",  		"time": 1589437530011	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker-v2)
