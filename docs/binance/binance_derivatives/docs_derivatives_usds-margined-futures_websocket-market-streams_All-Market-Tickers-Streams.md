---
title: "All Market Tickers Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams"
fetched_at: "2026-01-27T05:28:34.201Z"
---
# All Market Tickers Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

24hr rolling window ticker statistics for all symbols. These are NOT the statistics of the UTC day, but a 24hr rolling window from requestTime to 24hrs before. Note that only tickers that have changed will be present in the array.

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

`!ticker@arr`

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)

```
[	{	  "e": "24hrTicker",  // Event type	  "E": 123456789,     // Event time	  "s": "BTCUSDT",     // Symbol	  "p": "0.0015",      // Price change	  "P": "250.00",      // Price change percent	  "w": "0.0018",      // Weighted average price	  "c": "0.0025",      // Last price	  "Q": "10",          // Last quantity	  "o": "0.0010",      // Open price	  "h": "0.0025",      // High price	  "l": "0.0010",      // Low price	  "v": "10000",       // Total traded base asset volume	  "q": "18",          // Total traded quote asset volume	  "O": 0,             // Statistics open time	  "C": 86400000,      // Statistics close time	  "F": 0,             // First trade ID	  "L": 18150,         // Last trade Id	  "n": 18151          // Total number of trades	}]
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Market-Tickers-Streams)
