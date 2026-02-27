---
title: "Kline Candlestick Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams"
fetched_at: "2026-01-27T05:28:13.565Z"
---
# Kline/Candlestick Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)

The Kline/Candlestick Stream push updates to the current klines/candlestick every 1000 milliseconds (if existing).

**Kline/Candlestick chart intervals:**

m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

"1m", "3m", "5m", "15m" "30m" "1h", "2h", "4h", "6h", "12h", "1d", "3d", "1w",

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)

`/market`

## Stream Name[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)

`<symbol>@kline_<interval>`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)

```
{    "e":"kline",                        // event type       "E":1638747660000,                  // event time       "s":"BTC-200630-9000-P",            // Option trading symbol       "k":{                                     "t":1638747660000,              // kline start time           "T":1638747719999,              // kline end time          "s":"BTC-200630-9000-P",        // Option trading symbol           "i":"1m",                       // candle period           "f":0,                          // first trade ID          "L":0,                          // last trade ID           "o":"1000",                     // open           "c":"1000",                     // close           "h":"1000",                     // high            "l":"1000",                     // low           "v":"0",                        // volume(in contracts)           "n":0,                          // number of trades           "x":false,                      // current candle has been completed Y/N           "q":"0",                        // completed trade amount   (in quote asset)                    "V":"0",                        // taker completed trade volume (in contracts)                     "Q":"0"                         // taker trade amount(in quote asset)       }}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)
-   [Stream Name](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Kline-Candlestick-Streams)
