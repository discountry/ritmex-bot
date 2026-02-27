---
title: "Symbol Order Book Ticker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker"
fetched_at: "2026-01-27T05:28:28.911Z"
---
# Symbol Order Book Ticker

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

Best price/qty on the order book for a symbol or symbols.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

GET `/fapi/v1/ticker/bookTicker`

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

**2** for a single symbol;  
**5** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

Name

Type

Mandatory

Description

symbol

STRING

NO

> -   If the symbol is not sent, bookTickers for all symbols will be returned in an array.
> -   The field `X-MBX-USED-WEIGHT-1M` in response header is not accurate from this endpoint, please ignore.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)

```
{  "symbol": "BTCUSDT",  "bidPrice": "4.00000000",  "bidQty": "431.00000000",  "askPrice": "4.00000200",  "askQty": "9.00000000",  "time": 1589437530011   // Transaction time}
```

> OR

```
[	{  		"symbol": "BTCUSDT",  		"bidPrice": "4.00000000",  		"bidQty": "431.00000000",  		"askPrice": "4.00000200",  		"askQty": "9.00000000",  		"time": 1589437530011	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker)
