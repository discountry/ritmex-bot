---
title: "Partial Book Depth Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams"
fetched_at: "2026-01-27T05:28:35.291Z"
---
# Partial Book Depth Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

Top **<levels>** bids and asks, Valid **<levels>** are 5, 10, or 20.

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

`<symbol>@depth<levels>` OR `<symbol>@depth<levels>@500ms` OR `<symbol>@depth<levels>@100ms`.

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

**250ms**, **500ms** or **100ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)

```
{  "e": "depthUpdate", // Event type  "E": 1571889248277, // Event time  "T": 1571889248276, // Transaction time  "s": "BTCUSDT",  "U": 390497796,     // First update ID in event  "u": 390497878,     // Final update ID in event  "pu": 390497794,    // Final update Id in last stream(ie `u` in last stream)  "b": [              // Bids to be updated    [      "7403.89",      // Price Level to be updated      "0.002"         // Quantity    ],    [      "7403.90",      "3.906"    ],    [      "7404.00",      "1.428"    ],    [      "7404.85",      "5.239"    ],    [      "7405.43",      "2.562"    ]  ],  "a": [              // Asks to be updated    [      "7405.96",      // Price level to be      "3.340"         // Quantity    ],    [      "7406.63",      "4.525"    ],    [      "7407.08",      "2.475"    ],    [      "7407.15",      "4.800"    ],    [      "7407.20",      "0.175"    ]  ]}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Partial-Book-Depth-Streams)
