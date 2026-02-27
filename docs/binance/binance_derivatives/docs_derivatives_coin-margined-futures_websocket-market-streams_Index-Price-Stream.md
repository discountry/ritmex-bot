---
title: "Index Price Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream"
fetched_at: "2026-01-27T05:28:08.396Z"
---
# Index Price Stream

## Stream Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)

Index Price Stream

## Stream Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)

`<pair>@indexPrice` OR `<pair>@indexPrice@1s`

## Update Speed[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)

**3000ms** OR **1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)

```
  {    "e": "indexPriceUpdate",  // Event type    "E": 1591261236000,       // Event time    "i": "BTCUSD",            // Pair    "p": "9636.57860000",     // Index Price  }
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)
-   [Stream Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)
-   [Update Speed](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Index-Price-Stream)
