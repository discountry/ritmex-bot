---
title: "BookTicker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker"
fetched_at: "2026-01-27T05:28:13.247Z"
---
# Individual Symbol Book Ticker Streams

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)

Pushes any update to the best bid or ask's price or quantity in real-time for a specified symbol.

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)

`/public`

## Stream Name[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)

`<symbol>@bookTicker`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)

**Real-Time**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)

```
{        "e": "bookTicker",             // event type        "u": 2472,                     // order book updateId        "s": "BTC-251226-110000-C",    // symbol        "b": "5000.000",               // best bid price        "B": "0.2000",                 // bid bid quantity        "a": "5100.000",               // best ask price        "A": "0.1000",                 // best ask quantity        "T": 1763041762942,            // transaction time        "E": 1763041762942             // event time}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)
-   [Stream Name](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Bookticker)
