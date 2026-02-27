---
title: "Partial Book Depth Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams"
fetched_at: "2026-01-27T05:28:09.054Z"
---
# Partial Book Depth Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

Top **<levels>** bids and asks, Valid **<levels>** are 5, 10, or 20.

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

`<symbol>@depth<levels>` OR `<symbol>@depth<levels>@500ms` OR `<symbol>@depth<levels>@100ms`.

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

**250ms**, **500ms** or **100ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

```
{  "e":"depthUpdate",		// Event type  "E":1591269996801,		// Event time  "T":1591269996646,		// Transaction time  "s":"BTCUSD_200626",		// Symbol  "ps":"BTCUSD",			// Pair  "U":17276694,  "u":17276701,  "pu":17276678,  "b":[						// Bids to be updated    [      "9523.0",				// Price Level      "5"					// Quantity    ],    [      "9522.8",      "8"    ],    [      "9522.6",      "2"    ],    [      "9522.4",      "1"    ],    [      "9522.0",      "5"    ]  ],  "a":[						// Asks to be updated    [      "9524.6",				// Price level to be      "2"					// Quantity    ],    [      "9524.7",      "3"    ],    [      "9524.9",      "16"    ],    [      "9525.1",      "10"    ],    [      "9525.3",      "6"    ]  ]}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
