- The following base endpoints are available. Please use whichever works best for your setup:
	- **[https://api.binance.com](https://api.binance.com/)**
	- **[https://api-gcp.binance.com](https://api-gcp.binance.com/)**
	- **[https://api1.binance.com](https://api1.binance.com/)**
	- **[https://api2.binance.com](https://api2.binance.com/)**
	- **[https://api3.binance.com](https://api3.binance.com/)**
	- **[https://api4.binance.com](https://api4.binance.com/)**
- The last 4 endpoints in the point above (`api1` - `api4`) should give better performance but have less stability.
- Responses are in JSON by default. To receive responses in SBE, refer to the [SBE FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/sbe_faq) page.
- If your request contains a symbol name containing non-ASCII characters, then the response may contain non-ASCII characters encoded in UTF-8.
- Some endpoints may return asset and/or symbol names containing non-ASCII characters encoded in UTF-8 even if the request did not contain non-ASCII characters.
- Data is returned in **chronological order**, unless noted otherwise.
	- Without `startTime` or `endTime`, returns the most recent items up to the limit.
	- With `startTime`, returns oldest items from `startTime` up to the limit.
	- With `endTime`, returns most recent items up to `endTime` and the limit.
	- With both, behaves like `startTime` but does not exceed `endTime`.
- All time and timestamp related fields in the JSON responses are in **milliseconds by default.** To receive the information in microseconds, please add the header `X-MBX-TIME-UNIT:MICROSECOND` or `X-MBX-TIME-UNIT:microsecond`.
- We support HMAC, RSA, and Ed25519 keys. For more information, please see [API Key types](https://developers.binance.com/docs/binance-spot-api-docs/faqs/api_key_types).
- Timestamp parameters (e.g. `startTime`, `endTime`, `timestamp`) can be passed in milliseconds or microseconds.
- For APIs that only send public market data, please use the base endpoint **[https://data-api.binance.vision](https://data-api.binance.vision/)**. Please refer to [Market Data Only](https://developers.binance.com/docs/binance-spot-api-docs/faqs/market_data_only) page.
- If there are enums or terms you want clarification on, please see the [SPOT Glossary](https://developers.binance.com/docs/binance-spot-api-docs/faqs/spot_glossary) for more information.
- APIs have a timeout of 10 seconds when processing a request. If a response from the Matching Engine takes longer than this, the API responds with "Timeout waiting for response from backend server. Send status unknown; execution status unknown." [(-1007 TIMEOUT)](https://developers.binance.com/docs/binance-spot-api-docs/errors#-1007-timeout)
	- This does not always mean that the request failed in the Matching Engine.
	- If the status of the request has not appeared in [User Data Stream](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream), please perform an API query for its status.
- **Please avoid SQL keywords in requests** as they may trigger a security block by a WAF (Web Application Firewall) rule. See [https://www.binance.com/en/support/faq/detail/360004492232](https://www.binance.com/en/support/faq/detail/360004492232) for more details.
- If your request contains a symbol name containing non-ASCII characters, then the response may contain non-ASCII characters encoded in UTF-8.
- Some endpoints may return asset and/or symbol names containing non-ASCII characters encoded in UTF-8 even if the request did not contain non-ASCII characters.

Kline/Candlestick data
GET /api/v3/klines

Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.

Weight: 2

Parameters:

Name	Type	Mandatory	Description
symbol	STRING	YES	
interval	ENUM	YES	
startTime	LONG	NO	
endTime	LONG	NO	
timeZone	STRING	NO	Default: 0 (UTC)
limit	INT	NO	Default: 500; Maximum: 1000.
Supported kline intervals (case-sensitive):

Interval	interval value
seconds	1s
minutes	1m, 3m, 5m, 15m, 30m
hours	1h, 2h, 4h, 6h, 8h, 12h
days	1d, 3d
weeks	1w
months	1M
Notes:

If startTime and endTime are not sent, the most recent klines are returned.
Supported values for timeZone:
Hours and minutes (e.g. -1:00, 05:45)
Only hours (e.g. 0, 8, 4)
Accepted range is strictly [-12:00 to +14:00] inclusive
If timeZone provided, kline intervals are interpreted in that timezone instead of UTC.
Note that startTime and endTime are always interpreted in UTC, regardless of timeZone.
Data Source: Database

Response:

[
    [
        1499040000000,         // Kline open time
        "0.01634790",          // Open price
        "0.80000000",          // High price
        "0.01575800",          // Low price
        "0.01577100",          // Close price
        "148976.11427815",     // Volume
        1499644799999,         // Kline Close time
        "2434.19055334",       // Quote asset volume
        308,                   // Number of trades
        "1756.87402397",       // Taker buy base asset volume
        "28.46694368",         // Taker buy quote asset volume
        "0"                    // Unused field, ignore.
    ]
]


## WebSocket Streams for Binance

## General WSS information

- The base endpoint is: **wss://stream.binance.com:9443** or **wss://stream.binance.com:443**.
- Streams can be accessed either in a single raw stream or in a combined stream.
- Raw streams are accessed at **/ws/<streamName>**
- Combined streams are accessed at **/stream?streams=<streamName1>/<streamName2>/<streamName3>**
- Combined stream events are wrapped as follows: **{"stream":"<streamName>","data":<rawPayload>}**
- All symbols for streams are **lowercase**
- A single connection to **stream.binance.com** is only valid for 24 hours; expect to be disconnected at the 24 hour mark
- The WebSocket server will send a `ping frame` every 20 seconds.
	- If the WebSocket server does not receive a `pong frame` back from the connection within a minute the connection will be disconnected.
	- When you receive a ping, you must send a pong with a copy of ping's payload as soon as possible.
	- Unsolicited `pong frames` are allowed, but will not prevent disconnection. **It is recommended that the payload for these pong frames are empty.**
- The base endpoint **wss://data-stream.binance.vision** can be subscribed to receive **only** market data messages.  
	User data stream is **NOT** available from this URL.
- All time and timestamp related fields are **milliseconds by default**. To receive the information in microseconds, please add the parameter `timeUnit=MICROSECOND or timeUnit=microsecond` in the URL.
	- For example: `/stream?streams=btcusdt@trade&timeUnit=MICROSECOND`
- If your request contains a symbol name containing non-ASCII characters, then the stream events may contain non-ASCII characters encoded in UTF-8.
- \[All Market Mini Tickers Stream\](#all-market-mini-tickers-stream and [All Market Rolling Window Statistics Streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#all-market-rolling-window-statistics-streams) events may contain non-ASCII characters encoded in UTF-8.

## WebSocket Limits

- WebSocket connections have a limit of 5 incoming messages per second. A message is considered:
	- A PING frame
	- A PONG frame
	- A JSON controlled message (e.g. subscribe, unsubscribe)
- A connection that goes beyond the limit will be disconnected; IPs that are repeatedly disconnected may be banned.
- A single connection can listen to a maximum of 1024 streams.
- There is a limit of **300 connections per attempt every 5 minutes per IP**.

## Live Subscribing/Unsubscribing to streams

- The following data can be sent through the WebSocket instance in order to subscribe/unsubscribe from streams. Examples can be seen below.
- The `id` is used as an identifier to uniquely identify the messages going back and forth. The following formats are accepted:
	- 64-bit signed integer
	- alphanumeric strings; max length 36
	- `null`
- In the response, if the `result` received is `null` this means the request sent was a success for non-query requests (e.g. Subscribing/Unsubscribing).

### Subscribe to a stream

- Request
- Response
	```javascript
	{
	    "result": null,
	    "id": 1
	}
	```

### Unsubscribe to a stream

- Request
- Response
	```javascript
	{
	    "result": null,
	    "id": 312
	}
	```

### Listing Subscriptions

- Request
	```javascript
	{
	    "method": "LIST_SUBSCRIPTIONS",
	    "id": 3
	}
	```
- Response
	```javascript
	{
	    "result": ["btcusdt@aggTrade"],
	    "id": 3
	}
	```

### Setting Properties

Currently, the only property that can be set is whether `combined` stream payloads are enabled or not. The combined property is set to `false` when connecting using `/ws/` ("raw streams") and `true` when connecting using `/stream/`.

- Request
	```javascript
	{
	    "method": "SET_PROPERTY",
	    "params": ["combined", true],
	    "id": 5
	}
	```
- Response
	```javascript
	{
	    "result": null,
	    "id": 5
	}
	```

### Retrieving Properties

- Request
	```javascript
	{
	    "method": "GET_PROPERTY",
	    "params": ["combined"],
	    "id": 2
	}
	```
- Response
	```javascript
	{
	    "result": true, // Indicates that combined is set to true.
	    "id": 2
	}
	```

| Error Message | Description |
| --- | --- |
| {"code": 0, "msg": "Unknown property","id": %s} | Parameter used in the `SET_PROPERTY` or `GET_PROPERTY` was invalid |
| {"code": 1, "msg": "Invalid value type: expected Boolean"} | Value should only be `true` or `false` |
| {"code": 2, "msg": "Invalid request: property name must be a string"} | Property name provided was invalid |
| {"code": 2, "msg": "Invalid request: request ID must be an unsigned integer"} | Parameter `id` had to be provided or the value provided in the `id` parameter is an unsupported type |
| {"code": 2, "msg": "Invalid request: unknown variant %s, expected one of `SUBSCRIBE`, `UNSUBSCRIBE`, `LIST_SUBSCRIPTIONS`, `SET_PROPERTY`, `GET_PROPERTY` at line 1 column 28"} | Possible typo in the provided method or provided method was neither of the expected values |
| {"code": 2, "msg": "Invalid request: too many parameters"} | Unnecessary parameters provided in the data |
| {"code": 2, "msg": "Invalid request: property name must be a string"} | Property name was not provided |
| {"code": 2, "msg": "Invalid request: missing field `method` at line 1 column 73"} | `method` was not provided in the data |
| {"code":3,"msg":"Invalid JSON: expected value at line %s column %s"} | JSON data sent has incorrect syntax. |

## Detailed Stream information

## Aggregate Trade Streams

The Aggregate Trade Streams push trade information that is aggregated for a single taker order.

**Stream Name:** <symbol>@aggTrade

**Update Speed:** Real-time

**Payload:**

```javascript
{
    "e": "aggTrade",        // Event type
    "E": 1672515782136,     // Event time
    "s": "BNBBTC",          // Symbol
    "a": 12345,             // Aggregate trade ID
    "p": "0.001",           // Price
    "q": "100",             // Quantity
    "f": 100,               // First trade ID
    "l": 105,               // Last trade ID
    "T": 1672515782136,     // Trade time
    "m": true,              // Is the buyer the market maker?
    "M": true               // Ignore
}
```

## Trade Streams

The Trade Streams push raw trade information; each trade has a unique buyer and seller.

**Stream Name:** <symbol>@trade

**Update Speed:** Real-time

**Payload:**

```javascript
{
    "e": "trade",           // Event type
    "E": 1672515782136,     // Event time
    "s": "BNBBTC",          // Symbol
    "t": 12345,             // Trade ID
    "p": "0.001",           // Price
    "q": "100",             // Quantity
    "T": 1672515782136,     // Trade time
    "m": true,              // Is the buyer the market maker?
    "M": true               // Ignore
}
```

## Kline/Candlestick Streams for UTC

The Kline/Candlestick Stream push updates to the current klines/candlestick every second in `UTC+0` timezone

**Kline/Candlestick chart intervals:**

s-> seconds; m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

- 1s
- 1m
- 3m
- 5m
- 15m
- 30m
- 1h
- 2h
- 4h
- 6h
- 8h
- 12h
- 1d
- 3d
- 1w
- 1M

**Stream Name:** <symbol>@kline\_<interval>

**Update Speed:** 1000ms for `1s`, 2000ms for the other intervals

**Payload:**

```javascript
{
    "e": "kline",               // Event type
    "E": 1672515782136,         // Event time
    "s": "BNBBTC",              // Symbol
    "k": {
        "t": 1672515780000,     // Kline start time
        "T": 1672515839999,     // Kline close time
        "s": "BNBBTC",          // Symbol
        "i": "1m",              // Interval
        "f": 100,               // First trade ID
        "L": 200,               // Last trade ID
        "o": "0.0010",          // Open price
        "c": "0.0020",          // Close price
        "h": "0.0025",          // High price
        "l": "0.0015",          // Low price
        "v": "1000",            // Base asset volume
        "n": 100,               // Number of trades
        "x": false,             // Is this kline closed?
        "q": "1.0000",          // Quote asset volume
        "V": "500",             // Taker buy base asset volume
        "Q": "0.500",           // Taker buy quote asset volume
        "B": "123456"           // Ignore
    }
}
```

## Kline/Candlestick Streams with timezone offset

The Kline/Candlestick Stream push updates to the current klines/candlestick every second in `UTC+8` timezone

**Kline/Candlestick chart intervals:**

Supported intervals: See [`Kline/Candlestick chart intervals`](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#kline-intervals)

**UTC+8 timezone offset:**

- Kline intervals open and close in the `UTC+8` timezone. For example the `1d` klines will open at the beginning of the `UTC+8` day, and close at the end of the `UTC+8` day.
- Note that `E` (event time), `t` (start time) and `T` (close time) in the payload are Unix timestamps, which are always interpreted in UTC.

**Stream Name:** <symbol>@kline\_<interval>@+08:00

**Update Speed:** 1000ms for `1s`, 2000ms for the other intervals

**Payload:**

```javascript
{
    "e": "kline",               // Event type
    "E": 1672515782136,         // Event time
    "s": "BNBBTC",              // Symbol
    "k": {
        "t": 1672515780000,     // Kline start time
        "T": 1672515839999,     // Kline close time
        "s": "BNBBTC",          // Symbol
        "i": "1m",              // Interval
        "f": 100,               // First trade ID
        "L": 200,               // Last trade ID
        "o": "0.0010",          // Open price
        "c": "0.0020",          // Close price
        "h": "0.0025",          // High price
        "l": "0.0015",          // Low price
        "v": "1000",            // Base asset volume
        "n": 100,               // Number of trades
        "x": false,             // Is this kline closed?
        "q": "1.0000",          // Quote asset volume
        "V": "500",             // Taker buy base asset volume
        "Q": "0.500",           // Taker buy quote asset volume
        "B": "123456"           // Ignore
    }
}
```