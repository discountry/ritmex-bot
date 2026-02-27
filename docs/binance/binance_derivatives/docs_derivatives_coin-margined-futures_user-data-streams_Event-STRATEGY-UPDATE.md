---
title: "Event Strategy Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-STRATEGY-UPDATE"
fetched_at: "2026-01-27T05:28:06.931Z"
---
# Event: STRATEGY\_UPDATE

## Event Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-STRATEGY-UPDATE)

`STRATEGY_UPDATE` update when a strategy is created/cancelled/expired, ...etc.

**Strategy Status**

-   NEW
-   WORKING
-   CANCELLED
-   EXPIRED

**opCode**

-   8001: The strategy params have been updated
-   8002: User cancelled the strategy
-   8003: User manually placed or cancelled an order
-   8004: The stop limit of this order reached
-   8005: User position liquidated
-   8006: Max open order limit reached
-   8007: New grid order
-   8008: Margin not enough
-   8009: Price out of bounds
-   8010: Market is closed or paused
-   8011: Close position failed, unable to fill
-   8012: Exceeded the maximum allowable notional value at current leverage
-   8013: Grid expired due to incomplete KYC verification or access from a restricted jurisdiction
-   8014: User can only place reduce only order
-   8015: User position empty or liquidated

## Event Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-STRATEGY-UPDATE)

`STRATEGY_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-STRATEGY-UPDATE)

```
{	"e": "STRATEGY_UPDATE", // Event Type	"T": 1669261797627, // Transaction Time	"E": 1669261797628, // Event Time	"su": {			"si": 176054594, // Strategy ID			"st": "GRID", // Strategy Type			"ss": "NEW", // Strategy Status			"s": "BTCUSDT", // Symbol			"ut": 1669261797627, // Update Time			"c": 8007 // opCode		}}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-STRATEGY-UPDATE)
-   [Event Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-STRATEGY-UPDATE)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-STRATEGY-UPDATE)
