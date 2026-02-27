---
title: "All Book Tickers Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream"
fetched_at: "2026-01-27T05:28:33.951Z"
---
# All Book Tickers Stream

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)

Pushes any update to the best bid or ask's price or quantity in real-time for all symbols.

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)

`!bookTicker`

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)

**5s**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)

```
{  "e":"bookTicker",			// event type  "u":400900217,     		// order book updateId  "E": 1568014460893,  	// event time  "T": 1568014460891,  	// transaction time  "s":"BNBUSDT",     		// symbol  "b":"25.35190000", 		// best bid price  "B":"31.21000000", 		// best bid qty  "a":"25.36520000", 		// best ask price  "A":"40.66000000"  		// best ask qty}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/All-Book-Tickers-Stream)
