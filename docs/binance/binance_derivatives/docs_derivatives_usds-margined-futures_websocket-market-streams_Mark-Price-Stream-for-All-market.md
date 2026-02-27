---
title: "Mark Price Stream For All Market | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market"
fetched_at: "2026-01-27T05:28:35.382Z"
---
# Mark Price Stream for All market

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)

Mark price and funding rate for all symbols pushed every 3 seconds or every second.

**Note**:

> TradFi symbols will be pushed through a seperate message.

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)

`!markPrice@arr` or `!markPrice@arr@1s`

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)

**3000ms** or **1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)

```
[   {    "e": "markPriceUpdate",  	// Event type    "E": 1562305380000,      	// Event time    "s": "BTCUSDT",          	// Symbol    "p": "11185.87786614",   	// Mark price    "i": "11784.62659091"		// Index price    "P": "11784.25641265",		// Estimated Settle Price, only useful in the last hour before the settlement starts    "r": "0.00030000",       	// Funding rate    "T": 1562306400000       	// Next funding time  }]
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Mark-Price-Stream-for-All-market)
