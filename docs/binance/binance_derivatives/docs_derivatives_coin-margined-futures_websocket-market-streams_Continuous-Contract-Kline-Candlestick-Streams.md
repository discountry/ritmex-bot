---
title: "Continuous Contract Kline Candlestick Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams"
fetched_at: "2026-01-27T05:28:08.093Z"
---
# Continuous Contract Kline/Candlestick Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)

Kline update every second

**Contract type:**

-   perpetual
-   current\_quarter
-   next\_quarter

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

**Stream Name:**  
`<pair>_<contractType>@continuousKline_<interval>`

e.g. "btcusd\_next\_quarter@continuousKline\_1m"

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)

**250ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)

```
{  "e":"continuous_kline",	// Event type  "E":1591261542539,		// Event time  "ps":"BTCUSD",			// Pair  "ct":"NEXT_QUARTER"		// Contract type  "k":{    "t":1591261500000,		// Kline start time    "T":1591261559999,		// Kline close time    "i":"1m",				// Interval    "f":606400,				// First update ID    "L":606430,				// Last update ID    "o":"9638.9",			// Open price    "c":"9639.8",			// Close price    "h":"9639.8",			// High price    "l":"9638.6",			// Low price    "v":"156",				// volume    "n":31,					// Number of trades    "x":false,				// Is this kline closed?    "q":"1.61836886",		// Base asset volume    "V":"73",				// Taker buy volume    "Q":"0.75731156",		// Taker buy base asset volume    "B":"0"					// Ignore  }}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Continuous-Contract-Kline-Candlestick-Streams)
