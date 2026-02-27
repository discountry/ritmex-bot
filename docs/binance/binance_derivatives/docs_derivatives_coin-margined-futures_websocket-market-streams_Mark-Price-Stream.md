---
title: "Mark Price Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream"
fetched_at: "2026-01-27T05:28:08.918Z"
---
# Mark Price Stream

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)

Mark price update stream

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)

`<symbol>@markPrice` OR `<symbol>@markPrice@1s`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)

**3000ms** OR **1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)

```
{	"e":"markPriceUpdate",	// Event type  	"E":1596095725000,		// Event time   	"s":"BTCUSD_201225",	// Symbol  	"p":"10934.62615417",	// Mark Price  	"P":"10962.17178236",	// Estimated Settle Price, only useful in the last hour before the settlement starts.	"i":"10933.62615417",   // Index Price   	"r":"",					// funding rate for perpetual symbol, "" will be shown for delivery symbol  	"T":0					// next funding time for perpetual symbol, 0 will be shown for delivery symbol}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-Stream)
