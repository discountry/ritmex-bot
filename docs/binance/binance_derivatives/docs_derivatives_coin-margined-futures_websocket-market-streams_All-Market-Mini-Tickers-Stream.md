---
title: "All Market Mini Tickers Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream"
fetched_at: "2026-01-27T05:28:07.845Z"
---
# All Market Mini Tickers Stream

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)

24hr rolling window mini-ticker statistics for all symbols. These are NOT the statistics of the UTC day, but a 24hr rolling window from requestTime to 24hrs before. Note that only tickers that have changed will be present in the array.

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)

`!miniTicker@arr`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)

```
[  	{	  "e":"24hrMiniTicker",			// Event type	  "E":1591267704450,			// Event time	  "s":"BTCUSD_200626",			// Symbol	  "ps":"BTCUSD",				// Pair	  "c":"9561.7",					// Close price	  "o":"9580.9",					// Open price	  "h":"10000.0",				// High price	  "l":"7000.0",					// Low price	  "v":"487476",					// Total traded volume	  "q":"33264343847.22378500"	// Total traded base asset volume	}]
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/All-Market-Mini-Tickers-Stream)
