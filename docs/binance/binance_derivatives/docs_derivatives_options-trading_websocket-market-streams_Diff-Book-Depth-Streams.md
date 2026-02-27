---
title: "Diff Book Depth Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams"
fetched_at: "2026-01-27T05:28:13.257Z"
---
# Diff Book Depth Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)

Bids and asks, pushed every 500 milliseconds, 100 milliseconds (if existing)

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)

`/public`

## Stream Name[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)

`<symbol>@depth@100ms` or `<symbol>@depth@500ms`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)

**100ms** or **500ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)

```
{    "e": "depthUpdate",            // event type     "E": 1762866729459,            // event time    "T": 1762866729358,            // transaction time     "s": "BTC-251123-126000-C",    // Option symbol      "U": 465,                      // First update ID in event    "u": 465,                      // Final update ID in event    "pu": 464,                     // Final update Id in last stream(ie `u` in last stream)    "b": [                         // Buy order           [            "1100.000",            // Price            "0.6000"               // quantity        ]            ],    "a": [                         // Sell order           [            "1300.000",            "0.6000"        ]    ]}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Diff-Book-Depth-Streams)
