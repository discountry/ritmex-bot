---
title: "Continuous Contract Kline Candlestick Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams"
fetched_at: "2026-01-27T05:28:34.425Z"
---
# Continuous Contract Kline/Candlestick Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)

**Contract type:**

-   perpetual
-   current\_quarter
-   next\_quarter
-   tradifi\_perpetual

**Kline/Candlestick chart intervals:**

s -> seconds; m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

-   1s
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

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)

`<pair>_<contractType>@continuousKline_<interval>`

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)

**250ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)

```
{  "e":"continuous_kline",	// Event type  "E":1607443058651,		// Event time  "ps":"BTCUSDT",			// Pair  "ct":"PERPETUAL"			// Contract type  "k":{    "t":1607443020000,		// Kline start time    "T":1607443079999,		// Kline close time    "i":"1m",				// Interval    "f":116467658886,		// First updateId    "L":116468012423,		// Last updateId    "o":"18787.00",			// Open price    "c":"18804.04",			// Close price    "h":"18804.04",			// High price    "l":"18786.54",			// Low price    "v":"197.664",			// volume    "n": 543,				// Number of trades    "x":false,				// Is this kline closed?    "q":"3715253.19494",	// Quote asset volume    "V":"184.769",			// Taker buy volume    "Q":"3472925.84746",	//Taker buy quote asset volume    "B":"0"					// Ignore  }}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)
