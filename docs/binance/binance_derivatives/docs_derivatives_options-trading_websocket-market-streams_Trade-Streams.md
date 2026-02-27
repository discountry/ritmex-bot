---
title: "Trade Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams"
fetched_at: "2026-01-27T05:28:13.910Z"
---
# Trade Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)

The Trade Streams push raw trade information for specific symbol or underlying asset. E.g.[btcusdt@optionTrade](wss://fstream.binance.com/public/stream?streams=btcusdt@optionTrade)

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)

`/public`

## Stream Name[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)

`<symbol>@optionTrade` or `<underlying>@optionTrade`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)

**50ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)

```
{    "e": "trade",                  // event type       "E": 1762856064204,            // event time       "T": 1762856064203,            // trade completed time        "s": "BTC-251123-126000-C",    // Option trading symbol        "t": 4,                        // trade ID       "p": "1300.000",               // price    "q": "0.1000",                 // quantity, always positive    "X": "MARKET",                 // trade type enum, "MARKET" for Orderbook trading, "BLOCK" for Block trade	    "S": "BUY",                    // direction       "m": false                     // Is the buyer the market maker?}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Trade-Streams)
