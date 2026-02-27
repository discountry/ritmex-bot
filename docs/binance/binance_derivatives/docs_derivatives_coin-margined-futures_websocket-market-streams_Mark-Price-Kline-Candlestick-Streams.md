---
title: "Mark Price Kline Candlestick Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams"
fetched_at: "2026-01-27T05:28:08.861Z"
---
# Mark Price Kline/Candlestick Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)

Mark Price Kline/Candlestick Streams

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

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)

`<symbol>@markPriceKline_<interval>`

e.g. "btcusd\_200626@markPriceKline\_1m"

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)

**250ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)

```
{  "e":"markPrice_kline",		// Event Name  "E":1591267398004,			// Event Time  "ps":"BTCUSD",				// Pair  "k":{    "t":1591267380000,			// Kline start time    "T":1591267439999,			// Kline close time    "s":"BTCUSD_200626",		// Symbol    "i":"1m",					// Interval    "f":1591267380000,			// ignore    "L":1591267398000,			// ignore    "o":"9539.67161333",		// Open price    "c":"9540.82761333",		// Close price    "h":"9540.82761333",		// High price    "l":"9539.66961333",		// Low price    "v":"0",					// ignore    "n":19,						// Number of basic data    "x":false,					// Is this kline closed?    "q":"0",					// ignore    "V":"0",					// ignore    "Q":"0",					// ignore    "B":"0"						// ignore  }}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Kline-Candlestick-Streams)
