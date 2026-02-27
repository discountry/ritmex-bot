---
title: "Composite Index Symbol Information Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams"
fetched_at: "2026-01-27T05:28:34.354Z"
---
# Composite Index Symbol Information Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)

Composite index information for index symbols pushed every second.

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)

`<symbol>@compositeIndex`

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)

```
{  "e":"compositeIndex",		// Event type  "E":1602310596000,		// Event time  "s":"DEFIUSDT",			// Symbol  "p":"554.41604065",		// Price  "C":"baseAsset",  "c":[      				// Composition  	{  		"b":"BAL",			// Base asset  		"q":"USDT",         // Quote asset  		"w":"1.04884844",	// Weight in quantity  		"W":"0.01457800",   // Weight in percentage  		"i":"24.33521021"   // Index price  	},  	{  		"b":"BAND",  		"q":"USDT" ,  		"w":"3.53782729",  		"W":"0.03935200",  		"i":"7.26420084"    }  ]}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Composite-Index-Symbol-Information-Streams)
