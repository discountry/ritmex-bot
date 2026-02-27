---
title: "Event Order Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update"
fetched_at: "2026-01-27T05:28:12.741Z"
---
# Event: Order update

## Event Description[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)

When new order created, order status changed will push such event. event type is `ORDER_TRADE_UPDATE`.

**Side**

-   BUY
-   SELL

**Order Type**

-   LIMIT

**Execution Type**

-   NEW
-   CANCELED
-   EXPIRED
-   TRADE

**Order Status**

-   NEW
-   PARTIALLY\_FILLED
-   FILLED
-   CANCELED
-   EXPIRED

**Time in force**

-   GTC
-   IOC
-   FOK
-   GTX

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)

`/private`

## Event Name[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)

`ORDER_TRADE_UPDATE`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)

**50ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)

```
{  "e":"ORDER_TRADE_UPDATE",             // Event Type  "E":1568879465651,                    // Event Time  "T":1568879465650,                    // Transaction Time  "o":{                                    "s":"BTCUSDT",                      // Symbol    "c":"TEST",                         // Client Order Id      // special client order id:      // starts with "autoclose-": liquidation order      // "adl_autoclose": ADL auto close order    "S":"SELL",                          // Side    "o":"TRAILING_STOP_MARKET",          // Order Type    "f":"GTC",                           // Time in Force    "q":"0.001",                         // Original Quantity    "p":"0",                             // Original Price    "ap":"0",                            // Average Price    "x":"NEW",                           // Execution Type    "X":"NEW",                           // Order Status    "i":8886774,                         // Order Id    "l":"0",                             // Order Last Filled Quantity    "z":"0",                             // Order Filled Accumulated Quantity    "L":"0",                             // Last Filled Price    "N":"USDT",                          // Commission Asset    "n":"0",                             // Commission, negative means fee charge    "T":1568879465650,                   // Order Trade Time    "t":0,                               // Trade Id    "b":"0",                             // Bids qty    "a":"9.91",                          // Ask qty    "m":false,                           // Is this trade the maker side?    "R":false,                           // Is this reduce only    "ot":"TRAILING_STOP_MARKET",         // Original Order Type    "rp":"0",                            // Realized Profit of the trade  }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)
-   [Event Name](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Order-update)
