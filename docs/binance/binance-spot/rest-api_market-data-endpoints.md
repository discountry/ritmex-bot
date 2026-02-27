---
title: "Market Data endpoints | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints"
fetched_at: "2026-02-26T10:38:09.201Z"
---
### Order book[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/depth
```

**Weight:** Adjusted based on the limit:

Limit

Request Weight

1-100

5

101-500

25

501-1000

50

1001-5000

250

**Parameters:**

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

Default: 100; Maximum: 5000.  
If limit > 5000, only 5000 entries will be returned.

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
A status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
Valid values: `TRADING`, `HALT`, `BREAK`

**Data Source:** Memory

**Response:**

```
{    "lastUpdateId": 1027024,    "bids": [        [            "4.00000000",      // PRICE            "431.00000000"     // QTY        ]    ],    "asks": [["4.00000200", "12.00000000"]]}
```

### Recent trades list[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/trades
```

Get recent trades.

**Weight:** 25

**Parameters:**

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

Default: 500; Maximum: 1000.

**Data Source:** Memory

**Response:**

```
[    {        "id": 28457,        "price": "4.00000100",        "qty": "12.00000000",        "quoteQty": "48.000012",        "time": 1499865549590,        "isBuyerMaker": true,        "isBestMatch": true    }]
```

### Old trade lookup[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/historicalTrades
```

Get older trades.

**Weight:** 25

**Parameters:**

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

Default: 500; Maximum: 1000.

fromId

LONG

NO

TradeId to fetch from. Default gets most recent trades.

**Data Source:** Database

**Response:**

```
[    {        "id": 28457,        "price": "4.00000100",        "qty": "12.00000000",        "quoteQty": "48.000012",        "time": 1499865549590,        "isBuyerMaker": true,        "isBestMatch": true    }]
```

### Compressed/Aggregate trades list[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/aggTrades
```

Get compressed, aggregate trades. Trades that fill at the time, from the same taker order, with the same price will have the quantity aggregated.

**Weight:** 4

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

fromId

LONG

NO

ID to get aggregate trades from INCLUSIVE.

startTime

LONG

NO

Timestamp in ms to get aggregate trades from INCLUSIVE.

endTime

LONG

NO

Timestamp in ms to get aggregate trades until INCLUSIVE.

limit

INT

NO

Default: 500; Maximum: 1000.

-   If fromId, startTime, and endTime are not sent, the most recent aggregate trades will be returned.

**Data Source:** Database

**Response:**

```
[    {        "a": 26129,             // Aggregate tradeId        "p": "0.01633102",      // Price        "q": "4.70443515",      // Quantity        "f": 27781,             // First tradeId        "l": 27781,             // Last tradeId        "T": 1498793709153,     // Timestamp        "m": true,              // Was the buyer the maker?        "M": true               // Was the trade the best price match?    }]
```

### Kline/Candlestick data[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/klines
```

Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.

**Weight:** 2

**Parameters:**

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

timeZone

STRING

NO

Default: 0 (UTC)

limit

INT

NO

Default: 500; Maximum: 1000.

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

**Notes:**

-   If `startTime` and `endTime` are not sent, the most recent klines are returned.
-   Supported values for `timeZone`:
    -   Hours and minutes (e.g. `-1:00`, `05:45`)
    -   Only hours (e.g. `0`, `8`, `4`)
    -   Accepted range is strictly \[-12:00 to +14:00\] inclusive
-   If `timeZone` provided, kline intervals are interpreted in that timezone instead of UTC.
-   Note that `startTime` and `endTime` are always interpreted in UTC, regardless of `timeZone`.

**Data Source:** Database

**Response:**

```
[    [        1499040000000,         // Kline open time        "0.01634790",          // Open price        "0.80000000",          // High price        "0.01575800",          // Low price        "0.01577100",          // Close price        "148976.11427815",     // Volume        1499644799999,         // Kline Close time        "2434.19055334",       // Quote asset volume        308,                   // Number of trades        "1756.87402397",       // Taker buy base asset volume        "28.46694368",         // Taker buy quote asset volume        "0"                    // Unused field, ignore.    ]]
```

### UIKlines[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/uiKlines
```

The request is similar to klines having the same parameters and response.

`uiKlines` return modified kline data, optimized for presentation of candlestick charts.

**Weight:** 2

**Parameters:**

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

See [`klines`](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

startTime

LONG

NO

endTime

LONG

NO

timeZone

STRING

NO

Default: 0 (UTC)

limit

INT

NO

Default: 500; Maximum: 1000.

-   If `startTime` and `endTime` are not sent, the most recent klines are returned.
-   Supported values for `timeZone`:
    -   Hours and minutes (e.g. `-1:00`, `05:45`)
    -   Only hours (e.g. `0`, `8`, `4`)
    -   Accepted range is strictly \[-12:00 to +14:00\] inclusive
-   If `timeZone` provided, kline intervals are interpreted in that timezone instead of UTC.
-   Note that `startTime` and `endTime` are always interpreted in UTC, regardless of `timeZone`.

**Data Source:** Database

**Response:**

```
[    [        1499040000000,         // Kline open time        "0.01634790",          // Open price        "0.80000000",          // High price        "0.01575800",          // Low price        "0.01577100",          // Close price        "148976.11427815",     // Volume        1499644799999,         // Kline close time        "2434.19055334",       // Quote asset volume        308,                   // Number of trades        "1756.87402397",       // Taker buy base asset volume        "28.46694368",         // Taker buy quote asset volume        "0"                    // Unused field. Ignore.    ]]
```

### Current average price[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/avgPrice
```

Current average price for a symbol.

**Weight:** 2

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

**Data Source:** Memory

**Response:**

```
{    "mins": 5,                     // Average price interval (in minutes)    "price": "9.35751834",         // Average price    "closeTime": 1694061154503     // Last trade time}
```

### 24hr ticker price change statistics[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/ticker/24hr
```

24 hour rolling window price change statistics. **Careful** when accessing this with no symbol.

**Weight:**

Parameter

Symbols Provided

Weight

symbol

1

2

symbol parameter is omitted

80

symbols

1-20

2

21-100

40

101 or more

80

symbols parameter is omitted

80

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

NO

Parameter symbol and symbols cannot be used in combination.  
If neither parameter is sent, tickers for all symbols will be returned in an array.  
  
Examples of accepted format for the symbols parameter: \["BTCUSDT","BNBUSDT"\]  
or  
%5B%22BTCUSDT%22,%22BNBUSDT%22%5D

symbols

STRING

NO

type

ENUM

NO

Supported values: FULL or MINI.  
If none provided, the default is FULL

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple or all symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

**Data Source:** Memory

**Response - FULL:**

```
{    "symbol": "BNBBTC",    "priceChange": "-94.99999800",    "priceChangePercent": "-95.960",    "weightedAvgPrice": "0.29628482",    "prevClosePrice": "0.10002000",    "lastPrice": "4.00000200",    "lastQty": "200.00000000",    "bidPrice": "4.00000000",    "bidQty": "100.00000000",    "askPrice": "4.00000200",    "askQty": "100.00000000",    "openPrice": "99.00000000",    "highPrice": "100.00000000",    "lowPrice": "0.10000000",    "volume": "8913.30000000",    "quoteVolume": "15.30000000",    "openTime": 1499783499040,    "closeTime": 1499869899040,    "firstId": 28385,     // First tradeId    "lastId": 28460,      // Last tradeId    "count": 76           // Trade count}
```

OR

```
[    {        "symbol": "BNBBTC",        "priceChange": "-94.99999800",        "priceChangePercent": "-95.960",        "weightedAvgPrice": "0.29628482",        "prevClosePrice": "0.10002000",        "lastPrice": "4.00000200",        "lastQty": "200.00000000",        "bidPrice": "4.00000000",        "bidQty": "100.00000000",        "askPrice": "4.00000200",        "askQty": "100.00000000",        "openPrice": "99.00000000",        "highPrice": "100.00000000",        "lowPrice": "0.10000000",        "volume": "8913.30000000",        "quoteVolume": "15.30000000",        "openTime": 1499783499040,        "closeTime": 1499869899040,        "firstId": 28385,     // First tradeId        "lastId": 28460,      // Last tradeId        "count": 76           // Trade count    }]
```

**Response - MINI:**

```
{    "symbol": "BNBBTC",               // Symbol Name    "openPrice": "99.00000000",       // Opening price of the Interval    "highPrice": "100.00000000",      // Highest price in the interval    "lowPrice": "0.10000000",         // Lowest  price in the interval    "lastPrice": "4.00000200",        // Closing price of the interval    "volume": "8913.30000000",        // Total trade volume (in base asset)    "quoteVolume": "15.30000000",     // Total trade volume (in quote asset)    "openTime": 1499783499040,        // Start of the ticker interval    "closeTime": 1499869899040,       // End of the ticker interval    "firstId": 28385,                 // First tradeId considered    "lastId": 28460,                  // Last tradeId considered    "count": 76                       // Total trade count}
```

OR

```
[    {        "symbol": "BNBBTC",        "openPrice": "99.00000000",        "highPrice": "100.00000000",        "lowPrice": "0.10000000",        "lastPrice": "4.00000200",        "volume": "8913.30000000",        "quoteVolume": "15.30000000",        "openTime": 1499783499040,        "closeTime": 1499869899040,        "firstId": 28385,        "lastId": 28460,        "count": 76    },    {        "symbol": "LTCBTC",        "openPrice": "0.07000000",        "highPrice": "0.07000000",        "lowPrice": "0.07000000",        "lastPrice": "0.07000000",        "volume": "11.00000000",        "quoteVolume": "0.77000000",        "openTime": 1656908192899,        "closeTime": 1656994592899,        "firstId": 0,        "lastId": 10,        "count": 11    }]
```

### Trading Day Ticker[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/ticker/tradingDay
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

symbol

STRING

YES

Either symbol or symbols must be provided  
  
Examples of accepted format for the symbols parameter:  
\["BTCUSDT","BNBUSDT"\]  
or  
%5B%22BTCUSDT%22,%22BNBUSDT%22%5D  
  
The maximum number of symbols allowed in a request is 100.

symbols

timeZone

STRING

NO

Default: 0 (UTC)

type

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

**Response - FULL:**

With `symbol`:

```
{    "symbol": "BTCUSDT",    "priceChange": "-83.13000000",            // Absolute price change    "priceChangePercent": "-0.317",           // Relative price change in percent    "weightedAvgPrice": "26234.58803036",     // quoteVolume / volume    "openPrice": "26304.80000000",    "highPrice": "26397.46000000",    "lowPrice": "26088.34000000",    "lastPrice": "26221.67000000",    "volume": "18495.35066000",               // Volume in base asset    "quoteVolume": "485217905.04210480",      // Volume in quote asset    "openTime": 1695686400000,    "closeTime": 1695772799999,    "firstId": 3220151555,                    // Trade ID of the first trade in the interval    "lastId": 3220849281,                     // Trade ID of the last trade in the interval    "count": 697727                           // Number of trades in the interval}
```

With `symbols`:

```
[    {        "symbol": "BTCUSDT",        "priceChange": "-83.13000000",        "priceChangePercent": "-0.317",        "weightedAvgPrice": "26234.58803036",        "openPrice": "26304.80000000",        "highPrice": "26397.46000000",        "lowPrice": "26088.34000000",        "lastPrice": "26221.67000000",        "volume": "18495.35066000",        "quoteVolume": "485217905.04210480",        "openTime": 1695686400000,        "closeTime": 1695772799999,        "firstId": 3220151555,        "lastId": 3220849281,        "count": 697727    },    {        "symbol": "BNBUSDT",        "priceChange": "2.60000000",        "priceChangePercent": "1.238",        "weightedAvgPrice": "211.92276958",        "openPrice": "210.00000000",        "highPrice": "213.70000000",        "lowPrice": "209.70000000",        "lastPrice": "212.60000000",        "volume": "280709.58900000",        "quoteVolume": "59488753.54750000",        "openTime": 1695686400000,        "closeTime": 1695772799999,        "firstId": 672397461,        "lastId": 672496158,        "count": 98698    }]
```

**Response - MINI:**

With `symbol`:

```
{    "symbol": "BTCUSDT",    "openPrice": "26304.80000000",    "highPrice": "26397.46000000",    "lowPrice": "26088.34000000",    "lastPrice": "26221.67000000",    "volume": "18495.35066000",              // Volume in base asset    "quoteVolume": "485217905.04210480",     // Volume in quote asset    "openTime": 1695686400000,    "closeTime": 1695772799999,    "firstId": 3220151555,                   // Trade ID of the first trade in the interval    "lastId": 3220849281,                    // Trade ID of the last trade in the interval    "count": 697727                          // Number of trades in the interval}
```

With `symbols`:

```
[    {        "symbol": "BTCUSDT",        "openPrice": "26304.80000000",        "highPrice": "26397.46000000",        "lowPrice": "26088.34000000",        "lastPrice": "26221.67000000",        "volume": "18495.35066000",        "quoteVolume": "485217905.04210480",        "openTime": 1695686400000,        "closeTime": 1695772799999,        "firstId": 3220151555,        "lastId": 3220849281,        "count": 697727    },    {        "symbol": "BNBUSDT",        "openPrice": "210.00000000",        "highPrice": "213.70000000",        "lowPrice": "209.70000000",        "lastPrice": "212.60000000",        "volume": "280709.58900000",        "quoteVolume": "59488753.54750000",        "openTime": 1695686400000,        "closeTime": 1695772799999,        "firstId": 672397461,        "lastId": 672496158,        "count": 98698    }]
```

### Symbol price ticker[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/ticker/price
```

Latest price for a symbol or symbols.

**Weight:**

Parameter

Symbols Provided

Weight

symbol

1

2

symbol parameter is omitted

4

symbols

Any

4

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

NO

Parameter symbol and symbols cannot be used in combination.  
If neither parameter is sent, prices for all symbols will be returned in an array.  
  
Examples of accepted format for the symbols parameter: \["BTCUSDT","BNBUSDT"\]  
or  
%5B%22BTCUSDT%22,%22BNBUSDT%22%5D

symbols

STRING

NO

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple or all symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

**Data Source:** Memory

**Response:**

```
{    "symbol": "LTCBTC",    "price": "4.00000200"}
```

OR

```
[    {        "symbol": "LTCBTC",        "price": "4.00000200"    },    {        "symbol": "ETHBTC",        "price": "0.07946600"    }]
```

### Symbol order book ticker[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/ticker/bookTicker
```

Best price/qty on the order book for a symbol or symbols.

**Weight:**

Parameter

Symbols Provided

Weight

symbol

1

2

symbol parameter is omitted

4

symbols

Any

4

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

NO

Parameter symbol and symbols cannot be used in combination.  
If neither parameter is sent, bookTickers for all symbols will be returned in an array.  
  
Examples of accepted format for the symbols parameter: \["BTCUSDT","BNBUSDT"\]  
or  
%5B%22BTCUSDT%22,%22BNBUSDT%22%5D

symbols

STRING

NO

symbolStatus

ENUM

NO

Filters for symbols that have this `tradingStatus`.  
For a single symbol, a status mismatch returns error `-1220 SYMBOL_DOES_NOT_MATCH_STATUS`.  
For multiple or all symbols, non-matching ones are simply excluded from the response.  
Valid values: `TRADING`, `HALT`, `BREAK`

**Data Source:** Memory

**Response:**

```
{    "symbol": "LTCBTC",    "bidPrice": "4.00000000",    "bidQty": "431.00000000",    "askPrice": "4.00000200",    "askQty": "9.00000000"}
```

OR

```
[    {        "symbol": "LTCBTC",        "bidPrice": "4.00000000",        "bidQty": "431.00000000",        "askPrice": "4.00000200",        "askQty": "9.00000000"    },    {        "symbol": "ETHBTC",        "bidPrice": "0.07946700",        "bidQty": "9.00000000",        "askPrice": "100000.00000000",        "askQty": "1000.00000000"    }]
```

### Rolling window price change statistics[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

```
GET /api/v3/ticker
```

**Note:** This endpoint is different from the `GET /api/v3/ticker/24hr` endpoint.

The window used to compute statistics will be no more than 59999ms from the requested `windowSize`.

`openTime` for `/api/v3/ticker` always starts on a minute, while the `closeTime` is the current time of the request. As such, the effective window will be up to 59999ms wider than `windowSize`.

E.g. If the `closeTime` is 1641287867099 (January 04, 2022 09:17:47:099 UTC) , and the `windowSize` is `1d`. the `openTime` will be: 1641201420000 (January 3, 2022, 09:17:00)

**Weight:**

4 for each requested symbol regardless of windowSize.  
  
The weight for this request will cap at 200 once the number of `symbols` in the request is more than 50.

**Parameters:**

Name

Type

Mandatory

Description

symbol

STRING

YES

Either symbol or symbols must be provided  
  
Examples of accepted format for the symbols parameter:  
\["BTCUSDT","BNBUSDT"\]  
or  
%5B%22BTCUSDT%22,%22BNBUSDT%22%5D  
  
The maximum number of symbols allowed in a request is 100.

symbols

windowSize

ENUM

NO

Defaults to 1d if no parameter provided  
Supported windowSize values:  
1m,2m....59m for minutes  
1h, 2h....23h - for hours  
1d...7d - for days  
  
Units cannot be combined (e.g. 1d2h is not allowed)

type

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

**Data Source:** Database

**Response - FULL:**

When using `symbol`:

```
{    "symbol": "BNBBTC",    "priceChange": "-8.00000000",         // Absolute price change    "priceChangePercent": "-88.889",      // Relative price change in percent    "weightedAvgPrice": "2.60427807",     // QuoteVolume / Volume    "openPrice": "9.00000000",    "highPrice": "9.00000000",    "lowPrice": "1.00000000",    "lastPrice": "1.00000000",    "volume": "187.00000000",    "quoteVolume": "487.00000000",        // Sum of (price * volume) for all trades    "openTime": 1641859200000,            // Open time for ticker window    "closeTime": 1642031999999,           // Close time for ticker window    "firstId": 0,                         // Trade IDs    "lastId": 60,    "count": 61                           // Number of trades in the interval}
```

or

When using `symbols`:

```
[    {        "symbol": "BTCUSDT",        "priceChange": "-154.13000000",           // Absolute price change        "priceChangePercent": "-0.740",           // Relative price change in percent        "weightedAvgPrice": "20677.46305250",     // QuoteVolume / Volume        "openPrice": "20825.27000000",        "highPrice": "20972.46000000",        "lowPrice": "20327.92000000",        "lastPrice": "20671.14000000",        "volume": "72.65112300",        "quoteVolume": "1502240.91155513",        // Sum of (price * volume) for all trades        "openTime": 1655432400000,                // Open time for ticker window        "closeTime": 1655446835460,               // Close time for ticker window        "firstId": 11147809,                      // Trade IDs        "lastId": 11149775,        "count": 1967                             // Number of trades in the interval    },    {        "symbol": "BNBBTC",        "priceChange": "0.00008530",        "priceChangePercent": "0.823",        "weightedAvgPrice": "0.01043129",        "openPrice": "0.01036170",        "highPrice": "0.01049850",        "lowPrice": "0.01033870",        "lastPrice": "0.01044700",        "volume": "166.67000000",        "quoteVolume": "1.73858301",        "openTime": 1655432400000,        "closeTime": 1655446835460,        "firstId": 2351674,        "lastId": 2352034,        "count": 361    }]
```

**Response - MINI:**

When using `symbol`:

```
{    "symbol": "LTCBTC",    "openPrice": "0.10000000",    "highPrice": "2.00000000",    "lowPrice": "0.10000000",    "lastPrice": "2.00000000",    "volume": "39.00000000",    "quoteVolume": "13.40000000",     // Sum of (price * volume) for all trades    "openTime": 1656986580000,        // Open time for ticker window    "closeTime": 1657001016795,       // Close time for ticker window    "firstId": 0,                     // Trade IDs    "lastId": 34,    "count": 35                       // Number of trades in the interval}
```

OR

When using `symbols`:

```
[    {        "symbol": "BNBBTC",        "openPrice": "0.10000000",        "highPrice": "2.00000000",        "lowPrice": "0.10000000",        "lastPrice": "2.00000000",        "volume": "39.00000000",        "quoteVolume": "13.40000000",     // Sum of (price * volume) for all trades        "openTime": 1656986880000,        // Open time for ticker window        "closeTime": 1657001297799,       // Close time for ticker window        "firstId": 0,                     // Trade IDs        "lastId": 34,        "count": 35                       // Number of trades in the interval    },    {        "symbol": "LTCBTC",        "openPrice": "0.07000000",        "highPrice": "0.07000000",        "lowPrice": "0.07000000",        "lastPrice": "0.07000000",        "volume": "33.00000000",        "quoteVolume": "2.31000000",        "openTime": 1656986880000,        "closeTime": 1657001297799,        "firstId": 0,        "lastId": 32,        "count": 33    }]
```

-   [Order book](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Recent trades list](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Old trade lookup](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Compressed/Aggregate trades list](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Kline/Candlestick data](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [UIKlines](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Current average price](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [24hr ticker price change statistics](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Trading Day Ticker](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Symbol price ticker](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Symbol order book ticker](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [Rolling window price change statistics](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
