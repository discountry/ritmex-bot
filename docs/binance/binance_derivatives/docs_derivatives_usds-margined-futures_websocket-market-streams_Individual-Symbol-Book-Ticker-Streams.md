---
title: "Individual Symbol Book Ticker Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams"
fetched_at: "2026-01-27T05:28:34.806Z"
---
# Individual Symbol Book Ticker Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

Pushes any update to the best bid or ask's price or quantity in real-time for a specified symbol.

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

`<symbol>@bookTicker`

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

**Real-time**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)

```
{  "e":"bookTicker",			// event type  "u":400900217,     		// order book updateId  "E": 1568014460893,  		// event time  "T": 1568014460891,  		// transaction time  "s":"BNBUSDT",     		// symbol  "b":"25.35190000", 		// best bid price  "B":"31.21000000", 		// best bid qty  "a":"25.36520000", 		// best ask price  "A":"40.66000000"  		// best ask qty}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Individual-Symbol-Book-Ticker-Streams)
