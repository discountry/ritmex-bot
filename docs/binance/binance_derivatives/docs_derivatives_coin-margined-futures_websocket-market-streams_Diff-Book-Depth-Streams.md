---
title: "Diff Book Depth Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams"
fetched_at: "2026-01-27T05:28:08.101Z"
---
# Diff. Book Depth Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

Bids and asks, pushed every 250 milliseconds, 500 milliseconds, or 100 milliseconds

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

`<symbol>@depth` OR `<symbol>@depth@500ms` OR `<symbol>@depth@100ms`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

**250ms** or **500ms** or **100ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

```
{  "e": "depthUpdate",			// Event type  "E": 1591270260907,			// Event time  "T": 1591270260891,			// Transction time  "s": "BTCUSD_200626",			// Symbol  "ps": "BTCUSD",				// Pair  "U": 17285681,				// First update ID in event  "u": 17285702,				// Final update ID in event  "pu": 17285675,				// Final update Id in last stream(ie `u` in last stream)  "b": [						// Bids to be updated    [      "9517.6",					// Price level to be updated      "10"						// Quantity    ]  ],  "a": [						// Asks to be updated    [      "9518.5",					// Price level to be updated      "45"						// Quantity    ]  ]}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
