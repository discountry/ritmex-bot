---
title: "Trading Session Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream"
fetched_at: "2026-01-27T05:28:35.491Z"
---
# Trading Session Stream

## Stream Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)

Trading session information for the underlying assets of TradFi Perpetual contracts—covering the U.S. equity market and the commodity market—is updated every second. Trading session information for different underlying markets is pushed in separate messages. Session types for the equity market include "PRE\_MARKET", "REGULAR", "AFTER\_MARKET", "OVERNIGHT", and "NO\_TRADING". Session types for the commodity market include "REGULAR" and "NO\_TRADING".

## Stream Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)

`tradingSession`

## Update Speed[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)

**1s**

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)

```
  {    "e": "EquityUpdate",  	// Event type, can also be CommodityUpdate    "E": 1765244143062,     // Event time    "t": 1765242000000,   	// Session start time    "T": 1765270800000,		  // Session end time    "S": "OVERNIGHT"        // Session type  }
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)
-   [Stream Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)
-   [Update Speed](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Trading-Session-Stream)
