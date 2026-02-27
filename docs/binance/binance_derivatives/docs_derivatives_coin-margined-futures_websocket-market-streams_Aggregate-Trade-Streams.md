---
title: "Aggregate Trade Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams"
fetched_at: "2026-01-27T05:28:07.577Z"
---
# Aggregate Trade Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)

The Aggregate Trade Streams push market trade information that is aggregated for fills with same price and taking side every 100 milliseconds.

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)

`<symbol>@aggTrade`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)

**100ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)

```
{  "e":"aggTrade",		// Event type  "E":1591261134288,	// Event time  "a":424951,			// Aggregate trade ID  "s":"BTCUSD_200626",	// Symbol  "p":"9643.5",			// Price  "q":"2",				// Quantity  "f":606073,			// First trade ID  "l":606073,			// Last trade ID  "T":1591261134199,	// Trade time  "m":false				// Is the buyer the market maker?}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Aggregate-Trade-Streams)
