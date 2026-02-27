---
title: "Index Price Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams"
fetched_at: "2026-01-27T05:28:13.468Z"
---
# Index Price Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)

Underlying(e.g ETHUSDT) index stream.

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)

`/market`

**Stream Name:**  
`!index@arr`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)

```
[    {        "e":"indexPrice",        "E":1763092572229,        "s":"ETHUSDT",        "p":"3224.51976744"    },    {        "e": "indexPrice",     // event type        "E": 1763092572229,    // time        "s": "BTCUSDT",        // underlying symbol        "p": "99102.32326087"  // index price    }]
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Index-Price-Streams)
