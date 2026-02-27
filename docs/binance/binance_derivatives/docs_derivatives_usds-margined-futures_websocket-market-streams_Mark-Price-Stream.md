---
title: "Mark Price Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream"
fetched_at: "2026-01-27T05:28:35.181Z"
---
# Mark Price Stream

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)

Mark price and funding rate for a single symbol pushed every 3 seconds or every second.

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)

`<symbol>@markPrice` or `<symbol>@markPrice@1s`

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)

**3000ms** or **1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)

```
  {    "e": "markPriceUpdate",  	// Event type    "E": 1562305380000,      	// Event time    "s": "BTCUSDT",          	// Symbol    "p": "11794.15000000",   	// Mark price    "i": "11784.62659091",		// Index price    "P": "11784.25641265",		// Estimated Settle Price, only useful in the last hour before the settlement starts    "r": "0.00038167",       	// Funding rate    "T": 1562306400000       	// Next funding time  }
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream)
