---
title: "Index Kline Candlestick Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams"
fetched_at: "2026-01-27T05:28:08.345Z"
---
# Index Kline/Candlestick Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)

Index Kline/Candlestick Streams

**Kline/Candlestick chart intervals:**

m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

-   1m
-   3m
-   5m
-   15m
-   30m
-   1h
-   2h
-   4h
-   6h
-   8h
-   12h
-   1d
-   3d
-   1w
-   1M

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)

`<pair>@indexPriceKline_<interval>`

e.g. "btcusd@indexPriceKline\_1m"

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)

**250ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)

```
{  "e":"indexPrice_kline",		// Event Name  "E":1591267070033,			// Event Time  "ps":"BTCUSD",				// Pair  "k":{    "t":1591267020000,			// Kline start time    "T":1591267079999,			// Kline close time    "s":"0",					// ignore    "i":"1m",					// Interval    "f":1591267020000,			// ignore    "L":1591267070000,			// ignore    "o":"9542.21900000",		// Open price    "c":"9542.50440000",		// Close price    "h":"9542.71640000",		// High price    "l":"9542.21040000",		// Low price    "v":"0",					// ignore    "n":51,						// Number of basic data    "x":false,					// Is this kline closed?    "q":"0",					// ignore    "V":"0",					// ignore    "Q":"0",					// ignore    "B":"0"						// ignore  }}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Kline-Candlestick-Streams)
