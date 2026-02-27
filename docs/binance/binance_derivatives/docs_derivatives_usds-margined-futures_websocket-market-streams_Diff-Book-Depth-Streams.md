---
title: "Diff Book Depth Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams"
fetched_at: "2026-01-27T05:28:34.559Z"
---
# Diff. Book Depth Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

Bids and asks, pushed every 250 milliseconds, 500 milliseconds, 100 milliseconds (if existing)

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

`<symbol>@depth` OR `<symbol>@depth@500ms` OR `<symbol>@depth@100ms`

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

**250ms**, **500ms**, **100ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)

```
{  "e": "depthUpdate", // Event type  "E": 123456789,     // Event time  "T": 123456788,     // Transaction time   "s": "BTCUSDT",     // Symbol  "U": 157,           // First update ID in event  "u": 160,           // Final update ID in event  "pu": 149,          // Final update Id in last stream(ie `u` in last stream)  "b": [              // Bids to be updated    [      "0.0024",       // Price level to be updated      "10"            // Quantity    ]  ],  "a": [              // Asks to be updated    [      "0.0026",       // Price level to be updated      "100"          // Quantity    ]  ]}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams)
