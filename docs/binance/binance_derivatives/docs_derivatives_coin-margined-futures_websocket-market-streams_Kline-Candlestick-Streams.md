---
title: "Kline Candlestick Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams"
fetched_at: "2026-01-27T05:28:08.653Z"
---
# Kline/Candlestick Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)

The Kline/Candlestick Stream push updates to the current klines/candlestick every 250 milliseconds (if existing).

**Kline/Candlestick chart intervals:** m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

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

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)

`<symbol>@kline_<interval>`

e.g. "btcusd\_200626@kline\_1m"

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)

**250ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)

```
{  "e":"kline",				// Event type  "E":1591261542539,		// Event time  "s":"BTCUSD_200626",		// Symbol  "k":{    "t":1591261500000,		// Kline start time    "T":1591261559999,		// Kline close time    "s":"BTCUSD_200626",	// Symbol    "i":"1m",				// Interval    "f":606400,				// First trade ID    "L":606430,				// Last trade ID    "o":"9638.9",			// Open price    "c":"9639.8",			// Close price    "h":"9639.8",			// High price    "l":"9638.6",			// Low price    "v":"156",				// volume    "n":31,					// Number of trades    "x":false,				// Is this kline closed?    "q":"1.61836886",		// Base asset volume    "V":"73",				// Taker buy volume    "Q":"0.75731156",		// Taker buy base asset volume    "B":"0"					// Ignore  }}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Kline-Candlestick-Streams)
