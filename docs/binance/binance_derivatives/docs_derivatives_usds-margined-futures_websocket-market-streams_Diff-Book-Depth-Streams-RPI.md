---
title: "RPI Diff Book Depth Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI"
fetched_at: "2026-01-27T05:28:34.603Z"
---
# RPI Diff. Book Depth Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)

Bids and asks including RPI orders, pushed every 500 milliseconds

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)

`<symbol>@rpiDepth@500ms`

**Note**:

> RPI(Retail Price Improvement) orders are included and aggreated in the response message. When the quantity of a price level to be updated is equal to 0, it means either all quotations for this price have been filled/canceled, or the quantity of crossed RPI orders for this price are hidden

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)

**500ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)

```
{  "e": "depthUpdate", // Event type  "E": 123456789,     // Event time  "T": 123456788,     // Transaction time   "s": "BTCUSDT",     // Symbol  "U": 157,           // First update ID in event  "u": 160,           // Final update ID in event  "pu": 149,          // Final update Id in last stream(ie `u` in last stream)  "b": [              // Bids to be updated    [      "0.0024",       // Price level to be updated      "10"            // Quantity    ]  ],  "a": [              // Asks to be updated    [      "0.0026",       // Price level to be updated      "100"          // Quantity    ]  ]}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Diff-Book-Depth-Streams-RPI)
