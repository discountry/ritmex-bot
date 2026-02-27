---
title: "Market data requests | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests"
fetched_at: "2026-02-26T10:38:11.870Z"
---
### Order book[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "51e2affb-0aba-4821-ba75-f2625006eb43",    "method": "depth",    "params": {        "symbol": "BNBBTC",        "limit": 5    }}
```

Get current order book.

Note that this request returns limited market depth.

If you need to continuously monitor order book updates, please consider using WebSocket Streams:

-   [`<symbol>@depth<levels>`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)
-   [`<symbol>@depth`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

You can use `depth` request together with `<symbol>@depth` streams to [maintain a local order book](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams).

**Weight:** Adjusted based on the limit:

Limit

Weight

1–100

5

101–500

25

501–1000

50

1001–5000

250

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`limit`

INT

NO

Default: 100; Maximum: 5000

`symbolStatus`

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
A status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`  
Valid values: `TRADING`, `HALT`, `BREAK`

**Data Source:** Memory

**Response:**

```
{    "id": "51e2affb-0aba-4821-ba75-f2625006eb43",    "status": 200,    "result": {        "lastUpdateId": 2731179239,        // Bid levels are sorted from highest to lowest price.        "bids": [            [                "0.01379900",     // Price                "3.43200000"      // Quantity            ],            ["0.01379800", "3.24300000"],            ["0.01379700", "10.45500000"],            ["0.01379600", "3.82100000"],            ["0.01379500", "10.26200000"]        ],        // Ask levels are sorted from lowest to highest price.        "asks": [            ["0.01380000", "5.91700000"],            ["0.01380100", "6.01400000"],            ["0.01380200", "0.26800000"],            ["0.01380300", "0.33800000"],            ["0.01380400", "0.26800000"]        ]    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

### Recent trades[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "409a20bd-253d-41db-a6dd-687862a5882f",    "method": "trades.recent",    "params": {        "symbol": "BNBBTC",        "limit": 1    }}
```

Get recent trades.

If you need access to real-time trading activity, please consider using WebSocket Streams:

-   [`<symbol>@trade`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

**Weight:** 25

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`limit`

INT

NO

Default: 500; Maximum: 1000

**Data Source:** Memory

**Response:**

```
{    "id": "409a20bd-253d-41db-a6dd-687862a5882f",    "status": 200,    "result": [        {            "id": 194686783,            "price": "0.01361000",            "qty": "0.01400000",            "quoteQty": "0.00019054",            "time": 1660009530807,            "isBuyerMaker": true,            "isBestMatch": true        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

### Historical trades[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "cffc9c7d-4efc-4ce0-b587-6b87448f052a",    "method": "trades.historical",    "params": {        "symbol": "BNBBTC",        "fromId": 0,        "limit": 1    }}
```

Get historical trades.

**Weight:** 25

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`fromId`

INT

NO

Trade ID to begin at

`limit`

INT

NO

Default: 500; Maximum: 1000

Notes:

-   If `fromId` is not specified, the most recent trades are returned.

**Data Source:** Database

**Response:**

```
{    "id": "cffc9c7d-4efc-4ce0-b587-6b87448f052a",    "status": 200,    "result": [        {            "id": 0,            "price": "0.00005000",            "qty": "40.00000000",            "quoteQty": "0.00200000",            "time": 1500004800376,            "isBuyerMaker": true,            "isBestMatch": true        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 10        }    ]}
```

### Aggregate trades[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "189da436-d4bd-48ca-9f95-9f613d621717",    "method": "trades.aggregate",    "params": {        "symbol": "BNBBTC",        "fromId": 50000000,        "limit": 1    }}
```

Get aggregate trades.

An _aggregate trade_ (aggtrade) represents one or more individual trades. Trades that fill at the same time, from the same taker order, with the same price – those trades are collected into an aggregate trade with total quantity of the individual trades.

If you need access to real-time trading activity, please consider using WebSocket Streams:

-   [`<symbol>@aggTrade`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

If you need historical aggregate trade data, please consider using [data.binance.vision](https://github.com/binance/binance-public-data).

**Weight:** 4

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`fromId`

INT

NO

Aggregate trade ID to begin at

`startTime`

LONG

NO

`endTime`

LONG

NO

`limit`

INT

NO

Default: 500; Maximum: 1000

Notes:

-   If `fromId` is specified, return aggtrades with aggregate trade ID >= `fromId`.
    
    Use `fromId` and `limit` to page through all aggtrades.
    
-   If `startTime` and/or `endTime` are specified, aggtrades are filtered by execution time (`T`).
    
    `fromId` cannot be used together with `startTime` and `endTime`.
    
-   If no condition is specified, the most recent aggregate trades are returned.
    

**Data Source:** Database

**Response:**

```
{    "id": "189da436-d4bd-48ca-9f95-9f613d621717",    "status": 200,    "result": [        {            "a": 50000000,          // Aggregate trade ID            "p": "0.00274100",      // Price            "q": "57.19000000",     // Quantity            "f": 59120167,          // First trade ID            "l": 59120170,          // Last trade ID            "T": 1565877971222,     // Timestamp            "m": true,              // Was the buyer the maker?            "M": true               // Was the trade the best price match?        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

### Klines[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "1dbbeb56-8eea-466a-8f6e-86bdcfa2fc0b",    "method": "klines",    "params": {        "symbol": "BNBBTC",        "interval": "1h",        "startTime": 1655969280000,        "limit": 1    }}
```

Get klines (candlestick bars).

Klines are uniquely identified by their open & close time.

If you need access to real-time kline updates, please consider using WebSocket Streams:

-   [`<symbol>@kline_<interval>`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

If you need historical kline data, please consider using [data.binance.vision](https://github.com/binance/binance-public-data).

**Weight:** 2

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`interval`

ENUM

YES

`startTime`

LONG

NO

`endTime`

LONG

NO

`timeZone`

STRING

NO

Default: 0 (UTC)

`limit`

INT

NO

Default: 500; Maximum: 1000

Supported kline intervals (case-sensitive):

Interval

`interval` value

seconds

`1s`

minutes

`1m`, `3m`, `5m`, `15m`, `30m`

hours

`1h`, `2h`, `4h`, `6h`, `8h`, `12h`

days

`1d`, `3d`

weeks

`1w`

months

`1M`

Notes:

-   If `startTime`, `endTime` are not specified, the most recent klines are returned.
-   Supported values for `timeZone`:
    -   Hours and minutes (e.g. `-1:00`, `05:45`)
    -   Only hours (e.g. `0`, `8`, `4`)
    -   Accepted range is strictly \[-12:00 to +14:00\] inclusive
-   If `timeZone` provided, kline intervals are interpreted in that timezone instead of UTC.
-   Note that `startTime` and `endTime` are always interpreted in UTC, regardless of timeZone.

**Data Source:** Database

**Response:**

```
{    "id": "1dbbeb56-8eea-466a-8f6e-86bdcfa2fc0b",    "status": 200,    "result": [        [            1655971200000,       // Kline open time            "0.01086000",        // Open price            "0.01086600",        // High price            "0.01083600",        // Low price            "0.01083800",        // Close price            "2290.53800000",     // Volume            1655974799999,       // Kline close time            "24.85074442",       // Quote asset volume            2283,                // Number of trades            "1171.64000000",     // Taker buy base asset volume            "12.71225884",       // Taker buy quote asset volume            "0"                  // Unused field, ignore        ]    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

### UI Klines[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "b137468a-fb20-4c06-bd6b-625148eec958",    "method": "uiKlines",    "params": {        "symbol": "BNBBTC",        "interval": "1h",        "startTime": 1655969280000,        "limit": 1    }}
```

Get klines (candlestick bars) optimized for presentation.

This request is similar to [`klines`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests), having the same parameters and response. `uiKlines` return modified kline data, optimized for presentation of candlestick charts.

**Weight:** 2

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

`interval`

ENUM

YES

See [`klines`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

`startTime`

LONG

NO

`endTime`

LONG

NO

`timeZone`

STRING

NO

Default: 0 (UTC)

`limit`

INT

NO

Default: 500; Maximum: 1000

Notes:

-   If `startTime`, `endTime` are not specified, the most recent klines are returned.
-   Supported values for `timeZone`:
    -   Hours and minutes (e.g. `-1:00`, `05:45`)
    -   Only hours (e.g. `0`, `8`, `4`)
    -   Accepted range is strictly \[-12:00 to +14:00\] inclusive
-   If `timeZone` provided, kline intervals are interpreted in that timezone instead of UTC.
-   Note that `startTime` and `endTime` are always interpreted in UTC, regardless of timeZone.

**Data Source:** Database

**Response:**

```
{    "id": "b137468a-fb20-4c06-bd6b-625148eec958",    "status": 200,    "result": [        [            1655971200000,       // Kline open time            "0.01086000",        // Open price            "0.01086600",        // High price            "0.01083600",        // Low price            "0.01083800",        // Close price            "2290.53800000",     // Volume            1655974799999,       // Kline close time            "24.85074442",       // Quote asset volume            2283,                // Number of trades            "1171.64000000",     // Taker buy base asset volume            "12.71225884",       // Taker buy quote asset volume            "0"                  // Unused field, ignore        ]    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

### Current average price[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "ddbfb65f-9ebf-42ec-8240-8f0f91de0867",    "method": "avgPrice",    "params": {        "symbol": "BNBBTC"    }}
```

Get current average price for a symbol.

**Weight:** 2

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

**Data Source:** Memory

**Response:**

```
{    "id": "ddbfb65f-9ebf-42ec-8240-8f0f91de0867",    "status": 200,    "result": {        "mins": 5,                     // Average price interval (in minutes)        "price": "9.35751834",         // Average price        "closeTime": 1694061154503     // Last trade time    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

### 24hr ticker price change statistics[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "93fb61ef-89f8-4d6e-b022-4f035a3fadad",    "method": "ticker.24hr",    "params": {        "symbol": "BNBBTC"    }}
```

Get 24-hour rolling window price change statistics.

If you need to continuously monitor trading statistics, please consider using WebSocket Streams:

-   [`<symbol>@ticker`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)
-   [`<symbol>@miniTicker`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams) or [`!miniTicker@arr`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

If you need different window sizes, use the [`ticker`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests) request.

**Weight:** Adjusted based on the number of requested symbols:

Symbols

Weight

1–20

2

21–100

40

101 or more

80

all symbols

80

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

NO

Query ticker for a single symbol

`symbols`

ARRAY of STRING

Query ticker for multiple symbols

`type`

ENUM

NO

Ticker type: `FULL` (default) or `MINI`

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple or all symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

Notes:

-   `symbol` and `symbols` cannot be used together.
    
-   If no symbol is specified, returns information about all symbols currently trading on the exchange.
    

**Data Source:** Memory

**Response:**

`FULL` type, for a single symbol:

```
{    "id": "93fb61ef-89f8-4d6e-b022-4f035a3fadad",    "status": 200,    "result": {        "symbol": "BNBBTC",        "priceChange": "0.00013900",        "priceChangePercent": "1.020",        "weightedAvgPrice": "0.01382453",        "prevClosePrice": "0.01362800",        "lastPrice": "0.01376700",        "lastQty": "1.78800000",        "bidPrice": "0.01376700",        "bidQty": "4.64600000",        "askPrice": "0.01376800",        "askQty": "14.31400000",        "openPrice": "0.01362800",        "highPrice": "0.01414900",        "lowPrice": "0.01346600",        "volume": "69412.40500000",        "quoteVolume": "959.59411487",        "openTime": 1660014164909,        "closeTime": 1660100564909,        "firstId": 194696115,     // First trade ID        "lastId": 194968287,      // Last trade ID        "count": 272173           // Number of trades    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

`MINI` type, for a single symbol:

```
{    "id": "9fa2a91b-3fca-4ed7-a9ad-58e3b67483de",    "status": 200,    "result": {        "symbol": "BNBBTC",        "openPrice": "0.01362800",        "highPrice": "0.01414900",        "lowPrice": "0.01346600",        "lastPrice": "0.01376700",        "volume": "69412.40500000",        "quoteVolume": "959.59411487",        "openTime": 1660014164909,        "closeTime": 1660100564909,        "firstId": 194696115,     // First trade ID        "lastId": 194968287,      // Last trade ID        "count": 272173           // Number of trades    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

If more than one symbol is requested, response returns an array:

```
{    "id": "901be0d9-fd3b-45e4-acd6-10c580d03430",    "status": 200,    "result": [        {            "symbol": "BNBBTC",            "priceChange": "0.00016500",            "priceChangePercent": "1.213",            "weightedAvgPrice": "0.01382508",            "prevClosePrice": "0.01360800",            "lastPrice": "0.01377200",            "lastQty": "1.01400000",            "bidPrice": "0.01377100",            "bidQty": "7.55700000",            "askPrice": "0.01377200",            "askQty": "4.37900000",            "openPrice": "0.01360700",            "highPrice": "0.01414900",            "lowPrice": "0.01346600",            "volume": "69376.27900000",            "quoteVolume": "959.13277091",            "openTime": 1660014615517,            "closeTime": 1660101015517,            "firstId": 194697254,            "lastId": 194969483,            "count": 272230        },        {            "symbol": "BTCUSDT",            "priceChange": "-938.06000000",            "priceChangePercent": "-3.938",            "weightedAvgPrice": "23265.34432003",            "prevClosePrice": "23819.17000000",            "lastPrice": "22880.91000000",            "lastQty": "0.00536000",            "bidPrice": "22880.40000000",            "bidQty": "0.00424000",            "askPrice": "22880.91000000",            "askQty": "0.04276000",            "openPrice": "23818.97000000",            "highPrice": "23933.25000000",            "lowPrice": "22664.69000000",            "volume": "153508.37606000",            "quoteVolume": "3571425225.04441220",            "openTime": 1660014615977,            "closeTime": 1660101015977,            "firstId": 1592019902,            "lastId": 1597301762,            "count": 5281861        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

### Trading Day Ticker[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "method": "ticker.tradingDay",    "params": {        "symbols": ["BNBBTC", "BTCUSDT"],        "timeZone": "00:00"    }}
```

Price change statistics for a trading day.

**Weight:**

4 for each requested symbol.  
  
The weight for this request will cap at 200 once the number of `symbols` in the request is more than 50.

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

Query ticker of a single symbol

`symbols`

ARRAY of STRING

Query ticker for multiple symbols

`timeZone`

STRING

NO

Default: 0 (UTC)

`type`

ENUM

NO

Supported values: FULL or MINI.  
If none provided, the default is FULL

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

**Notes:**

-   Supported values for `timeZone`:
    -   Hours and minutes (e.g. `-1:00`, `05:45`)
    -   Only hours (e.g. `0`, `8`, `4`)

**Data Source:** Database

**Response: - FULL**

With `symbol`:

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "priceChange": "-83.13000000",            // Absolute price change        "priceChangePercent": "-0.317",           // Relative price change in percent        "weightedAvgPrice": "26234.58803036",     // quoteVolume / volume        "openPrice": "26304.80000000",        "highPrice": "26397.46000000",        "lowPrice": "26088.34000000",        "lastPrice": "26221.67000000",        "volume": "18495.35066000",               // Volume in base asset        "quoteVolume": "485217905.04210480",        "openTime": 1695686400000,        "closeTime": 1695772799999,        "firstId": 3220151555,        "lastId": 3220849281,        "count": 697727    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

With `symbols`:

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "priceChange": "-83.13000000",            "priceChangePercent": "-0.317",            "weightedAvgPrice": "26234.58803036",            "openPrice": "26304.80000000",            "highPrice": "26397.46000000",            "lowPrice": "26088.34000000",            "lastPrice": "26221.67000000",            "volume": "18495.35066000",            "quoteVolume": "485217905.04210480",            "openTime": 1695686400000,            "closeTime": 1695772799999,            "firstId": 3220151555,            "lastId": 3220849281,            "count": 697727        },        {            "symbol": "BNBUSDT",            "priceChange": "2.60000000",            "priceChangePercent": "1.238",            "weightedAvgPrice": "211.92276958",            "openPrice": "210.00000000",            "highPrice": "213.70000000",            "lowPrice": "209.70000000",            "lastPrice": "212.60000000",            "volume": "280709.58900000",            "quoteVolume": "59488753.54750000",            "openTime": 1695686400000,            "closeTime": 1695772799999,            "firstId": 672397461,            "lastId": 672496158,            "count": 98698        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 8        }    ]}
```

**Response: - MINI**

With `symbol`:

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "openPrice": "26304.80000000",        "highPrice": "26397.46000000",        "lowPrice": "26088.34000000",        "lastPrice": "26221.67000000",        "volume": "18495.35066000",              // Volume in base asset        "quoteVolume": "485217905.04210480",     // Volume in quote asset        "openTime": 1695686400000,        "closeTime": 1695772799999,        "firstId": 3220151555,                   // Trade ID of the first trade in the interval        "lastId": 3220849281,                    // Trade ID of the last trade in the interval        "count": 697727                          // Number of trades in the interval    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

With `symbols`:

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "status": 200,    "result": [        {            "symbol": "BTCUSDT",            "openPrice": "26304.80000000",            "highPrice": "26397.46000000",            "lowPrice": "26088.34000000",            "lastPrice": "26221.67000000",            "volume": "18495.35066000",            "quoteVolume": "485217905.04210480",            "openTime": 1695686400000,            "closeTime": 1695772799999,            "firstId": 3220151555,            "lastId": 3220849281,            "count": 697727        },        {            "symbol": "BNBUSDT",            "openPrice": "210.00000000",            "highPrice": "213.70000000",            "lowPrice": "209.70000000",            "lastPrice": "212.60000000",            "volume": "280709.58900000",            "quoteVolume": "59488753.54750000",            "openTime": 1695686400000,            "closeTime": 1695772799999,            "firstId": 672397461,            "lastId": 672496158,            "count": 98698        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 8        }    ]}
```

### Rolling window price change statistics[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "method": "ticker",    "params": {        "symbols": ["BNBBTC", "BTCUSDT"],        "windowSize": "7d"    }}
```

Get rolling window price change statistics with a custom window.

This request is similar to [`ticker.24hr`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests), but statistics are computed on demand using the arbitrary window you specify.

**Note:** Window size precision is limited to 1 minute. While the `closeTime` is the current time of the request, `openTime` always start on a minute boundary. As such, the effective window might be up to 59999 ms wider than the requested `windowSize`.

Window computation example

For example, a request for `"windowSize": "7d"` might result in the following window:

```
{    "openTime": 1659580020000,    "closeTime": 1660184865291}
```

Time of the request – `closeTime` – is 1660184865291 (August 11, 2022 02:27:45.291). Requested window size should put the `openTime` 7 days before that – August 4, 02:27:45.291 – but due to limited precision it ends up a bit earlier: 1659580020000 (August 4, 2022 02:27:00), exactly at the start of a minute.

If you need to continuously monitor trading statistics, please consider using WebSocket Streams:

-   [`<symbol>@ticker_<window_size>`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams) or [`!ticker_<window-size>@arr`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

**Weight:** Adjusted based on the number of requested symbols:

Symbols

Weight

1–50

4 per symbol

51–100

200

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

YES

Query ticker of a single symbol

`symbols`

ARRAY of STRING

Query ticker for multiple symbols

`type`

ENUM

NO

Ticker type: `FULL` (default) or `MINI`

`windowSize`

ENUM

NO

Default `1d`

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

Supported window sizes:

Unit

`windowSize` value

minutes

`1m`, `2m` ... `59m`

hours

`1h`, `2h` ... `23h`

days

`1d`, `2d` ... `7d`

Notes:

-   Either `symbol` or `symbols` must be specified.
    
-   Maximum number of symbols in one request: 200.
    
-   Window size units cannot be combined. E.g., `1d 2h` is not supported.
    

**Data Source:** Database

**Response:**

`FULL` type, for a single symbol:

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "status": 200,    "result": {        "symbol": "BNBBTC",        "priceChange": "0.00061500",        "priceChangePercent": "4.735",        "weightedAvgPrice": "0.01368242",        "openPrice": "0.01298900",        "highPrice": "0.01418800",        "lowPrice": "0.01296000",        "lastPrice": "0.01360400",        "volume": "587179.23900000",        "quoteVolume": "8034.03382165",        "openTime": 1659580020000,        "closeTime": 1660184865291,        "firstId": 192977765,     // First trade ID        "lastId": 195365758,      // Last trade ID        "count": 2387994          // Number of trades    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

`MINI` type, for a single symbol:

```
{    "id": "bdb7c503-542c-495c-b797-4d2ee2e91173",    "status": 200,    "result": {        "symbol": "BNBBTC",        "openPrice": "0.01298900",        "highPrice": "0.01418800",        "lowPrice": "0.01296000",        "lastPrice": "0.01360400",        "volume": "587179.23900000",        "quoteVolume": "8034.03382165",        "openTime": 1659580020000,        "closeTime": 1660184865291,        "firstId": 192977765,     // First trade ID        "lastId": 195365758,      // Last trade ID        "count": 2387994          // Number of trades    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

If more than one symbol is requested, response returns an array:

```
{    "id": "f4b3b507-c8f2-442a-81a6-b2f12daa030f",    "status": 200,    "result": [        {            "symbol": "BNBBTC",            "priceChange": "0.00061500",            "priceChangePercent": "4.735",            "weightedAvgPrice": "0.01368242",            "openPrice": "0.01298900",            "highPrice": "0.01418800",            "lowPrice": "0.01296000",            "lastPrice": "0.01360400",            "volume": "587169.48600000",            "quoteVolume": "8033.90114517",            "openTime": 1659580020000,            "closeTime": 1660184820927,            "firstId": 192977765,            "lastId": 195365700,            "count": 2387936        },        {            "symbol": "BTCUSDT",            "priceChange": "1182.92000000",            "priceChangePercent": "5.113",            "weightedAvgPrice": "23349.27074846",            "openPrice": "23135.33000000",            "highPrice": "24491.22000000",            "lowPrice": "22400.00000000",            "lastPrice": "24318.25000000",            "volume": "1039498.10978000",            "quoteVolume": "24271522807.76838630",            "openTime": 1659580020000,            "closeTime": 1660184820927,            "firstId": 1568787779,            "lastId": 1604337406,            "count": 35549628        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 8        }    ]}
```

### Symbol price ticker[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "043a7cf2-bde3-4888-9604-c8ac41fcba4d",    "method": "ticker.price",    "params": {        "symbol": "BNBBTC"    }}
```

Get the latest market price for a symbol.

If you need access to real-time price updates, please consider using WebSocket Streams:

-   [`<symbol>@aggTrade`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)
-   [`<symbol>@trade`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

**Weight:** Adjusted based on the number of requested symbols:

Parameter

Weight

`symbol`

2

`symbols`

4

none

4

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

NO

Query price for a single symbol

`symbols`

ARRAY of STRING

Query price for multiple symbols

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple or all symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

Notes:

-   `symbol` and `symbols` cannot be used together.
    
-   If no symbol is specified, returns information about all symbols currently trading on the exchange.
    

**Data Source:** Memory

**Response:**

```
{    "id": "043a7cf2-bde3-4888-9604-c8ac41fcba4d",    "status": 200,    "result": {        "symbol": "BNBBTC",        "price": "0.01361900"    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

If more than one symbol is requested, response returns an array:

```
{    "id": "e739e673-24c8-4adf-9cfa-b81f30330b09",    "status": 200,    "result": [        {            "symbol": "BNBBTC",            "price": "0.01363700"        },        {            "symbol": "BTCUSDT",            "price": "24267.15000000"        },        {            "symbol": "BNBBUSD",            "price": "331.10000000"        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

### Symbol order book ticker[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)

```
{    "id": "057deb3a-2990-41d1-b58b-98ea0f09e1b4",    "method": "ticker.book",    "params": {        "symbols": ["BNBBTC", "BTCUSDT"]    }}
```

Get the current best price and quantity on the order book.

If you need access to real-time order book ticker updates, please consider using WebSocket Streams:

-   [`<symbol>@bookTicker`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/web-socket-streams)

**Weight:** Adjusted based on the number of requested symbols:

Parameter

Weight

`symbol`

2

`symbols`

4

none

4

**Parameters:**

Name

Type

Mandatory

Description

`symbol`

STRING

NO

Query ticker for a single symbol

`symbols`

ARRAY of STRING

Query ticker for multiple symbols

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple or all symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

Notes:

-   `symbol` and `symbols` cannot be used together.
    
-   If no symbol is specified, returns information about all symbols currently trading on the exchange.
    

**Data Source:** Memory

**Response:**

```
{    "id": "9d32157c-a556-4d27-9866-66760a174b57",    "status": 200,    "result": {        "symbol": "BNBBTC",        "bidPrice": "0.01358000",        "bidQty": "12.53400000",        "askPrice": "0.01358100",        "askQty": "17.83700000"    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2        }    ]}
```

If more than one symbol is requested, response returns an array:

```
{    "id": "057deb3a-2990-41d1-b58b-98ea0f09e1b4",    "status": 200,    "result": [        {            "symbol": "BNBBTC",            "bidPrice": "0.01358000",            "bidQty": "12.53400000",            "askPrice": "0.01358100",            "askQty": "17.83700000"        },        {            "symbol": "BTCUSDT",            "bidPrice": "23980.49000000",            "bidQty": "0.01000000",            "askPrice": "23981.31000000",            "askQty": "0.01512000"        }    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 4        }    ]}
```

-   [Order book](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Recent trades](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Historical trades](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Aggregate trades](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Klines](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [UI Klines](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Current average price](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [24hr ticker price change statistics](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Trading Day Ticker](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Rolling window price change statistics](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Symbol price ticker](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
-   [Symbol order book ticker](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/market-data-requests)
