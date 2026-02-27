---
title: "Symbol Order Book Ticker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker"
fetched_at: "2026-01-27T05:28:29.431Z"
---
# Symbol Order Book Ticker

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)

Best price/qty on the order book for a symbol or symbols.

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)

`ticker.book`

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)

```
{    "id": "9d32157c-a556-4d27-9866-66760a174b57",    "method": "ticker.book",    "params": {        "symbol": "BTCUSDT"    }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)

**2** for a single symbol;  
**5** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)

Name

Type

Mandatory

Description

symbol

STRING

NO

> -   If the symbol is not sent, bookTickers for all symbols will be returned in an array.
> -   The field `X-MBX-USED-WEIGHT-1M` in response header is not accurate from this endpoint, please ignore.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)

```
{  "id": "9d32157c-a556-4d27-9866-66760a174b57",  "status": 200,  "result": {    "lastUpdateId": 1027024,    "symbol": "BTCUSDT",    "bidPrice": "4.00000000",    "bidQty": "431.00000000",    "askPrice": "4.00000200",    "askQty": "9.00000000",    "time": 1589437530011   // Transaction time  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 2    }  ]}
```

> OR

```
{  "id": "9d32157c-a556-4d27-9866-66760a174b57",  "status": 200,  "result": [    {      "lastUpdateId": 1027024,      "symbol": "BTCUSDT",      "bidPrice": "4.00000000",      "bidQty": "431.00000000",      "askPrice": "4.00000200",      "askQty": "9.00000000",      "time": 1589437530011    }  ],  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 2    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api/Symbol-Order-Book-Ticker)
