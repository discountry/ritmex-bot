---
title: "Individual Symbol Book Ticker Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams"
fetched_at: "2026-01-27T05:28:08.403Z"
---
# Individual Symbol Book Ticker Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

Pushes any update to the best bid or ask's price or quantity in real-time for a specified symbol.

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

`<symbol>@bookTicker`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

**Real-time**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

```
{  "e":"bookTicker",			// Event type  "u":17242169,				// Order book update Id  "s":"BTCUSD_200626",		// Symbol  "ps":"BTCUSD",		    // Pair  "b":"9548.1",				// Best bid price  "B":"52",					// Best bid qty  "a":"9548.5",				// Best ask price  "A":"11",					// Best ask qty  "T":1591268628155,		// Transaction time  "E":1591268628166			// Event time}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
