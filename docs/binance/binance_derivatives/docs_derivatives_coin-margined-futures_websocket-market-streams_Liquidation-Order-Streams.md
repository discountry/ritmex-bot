---
title: "Liquidation Order Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams"
fetched_at: "2026-01-27T05:28:08.663Z"
---
# Liquidation Order Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)

The Liquidation Order Snapshot Streams push force liquidation order information for specific symbol.

For each symbol，only the latest one liquidation order within 1000ms will be pushed as the snapshot. If no liquidation happens in the interval of 1000ms, no stream will be pushed.

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)

`<symbol>@forceOrder`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)

```
{	"e":"forceOrder",                   // Event Type	"E": 1591154240950,					// Event Time	"o":{		"s":"BTCUSD_200925", 		// Symbol		"ps": "BTCUSD",					// Pair		"S":"SELL",						// Side		"o":"LIMIT",					// Order Type		"f":"IOC",						// Time in Force		"q":"1",						// Original Quantity		"p":"9425.5",					// Price		"ap":"9496.5",					// Average Price		"X":"FILLED",					// Order Status		"l":"1",						// Order Last Filled Quantity		"z":"1",						// Order Filled Accumulated Quantity		"T": 1591154240949,				// Order Trade Time	}}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Liquidation-Order-Streams)
