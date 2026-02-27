---
title: "All Market Tickers Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams"
fetched_at: "2026-01-27T05:28:07.963Z"
---
# All Market Tickers Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

24hr rolling window ticker statistics for all symbols. These are NOT the statistics of the UTC day, but a 24hr rolling window from requestTime to 24hrs before. Note that only tickers that have changed will be present in the array.

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

`!ticker@arr`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

```
[	{	  "e":"24hrTicker",				// Event type	  "E":1591268262453,			// Event time	  "s":"BTCUSD_200626",			// Symbol	  "ps":"BTCUSD",				// Pair	  "p":"-43.4",					// Price change	  "P":"-0.452",					// Price change percent	  "w":"0.00147974",				// Weighted average price	  "c":"9548.5",					// Last price	  "Q":"2",						// Last quantity	  "o":"9591.9",					// Open price	  "h":"10000.0",				// High price	  "l":"7000.0",					// Low price	  "v":"487850",					// Total traded volume	  "q":"32968676323.46222700",	// Total traded base asset volume	  "O":1591181820000,			// Statistics open time	  "C":1591268262442,			// Statistics close time	  "F":512014,					// First trade ID	  "L":615289,					// Last trade Id	  "n":103272					// Total number of trades	}]
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
