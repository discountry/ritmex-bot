---
title: "Mark Price Of All Symbols Of A Pair | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair"
fetched_at: "2026-01-27T05:28:08.926Z"
---
# Mark Price of All Symbols of a Pair

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)

Mark Price of All Symbols of a Pair

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)

`<pair>@markPrice` OR `<pair>@markPrice@1s`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)

**3000ms** OR **1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)

```
[   {    "e":"markPriceUpdate",	// Event type    "E":1596095725000,		// Event time    "s":"BTCUSD_201225",	// Symbol    "p":"10934.62615417",	// Mark Price    "P":"10962.17178236",	// Estimated Settle Price, only useful in the last hour before the settlement starts.	"i":"10933.62615417",   // Index Price     "r":"",					// funding rate for perpetual symbol, "" will be shown for delivery symbol    "T":0					// next funding time for perpetual symbol, 0 will be shown for delivery symbol  },  {    "e":"markPriceUpdate",    "E":1596095725000,    "s":"BTCUSD_PERP",    "p":"11012.31359011",    "P":"10962.17178236",	"i":"10933.62615417",   // Index Price     "r":"0.00000000",    "T":1596096000000  }]
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Mark-Price-of-All-Symbols-of-a-Pair)
