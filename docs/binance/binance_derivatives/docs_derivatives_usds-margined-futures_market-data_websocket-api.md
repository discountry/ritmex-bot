---
title: "Order Book | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api"
fetched_at: "2026-01-27T05:28:29.442Z"
---
# Order Book

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)

Get current order book. Note that this request returns limited market depth. If you need to continuously monitor order book updates, please consider using Websocket Market Streams:

-   `<symbol>@depth<levels>`
-   `<symbol>@depth`

You can use `depth` request together with `<symbol>@depth` streams to maintain a local order book.

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)

`depth`

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)

```
{    "id": "51e2affb-0aba-4821-ba75-f2625006eb43",    "method": "depth",    "params": {      "symbol": "BTCUSDT"    }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)

Adjusted based on the limit:

Limit

Weight

5, 10, 20, 50

2

100

5

500

10

1000

20

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)

Name

Type

Mandatory

Description

symbol

STRING

YES

limit

INT

NO

Default 500; Valid limits:\[5, 10, 20, 50, 100, 500, 1000\]

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)

```
{  "id": "51e2affb-0aba-4821-ba75-f2625006eb43",  "status": 200,  "result": {    "lastUpdateId": 1027024,    "E": 1589436922972,   // Message output time    "T": 1589436922959,   // Transaction time    "bids": [      [        "4.00000000",     // PRICE        "431.00000000"    // QTY      ]    ],    "asks": [      [        "4.00000200",        "12.00000000"      ]    ]  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 5    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/websocket-api)
