---
title: "Event Futures Order Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Order-update"
fetched_at: "2026-01-27T05:28:23.846Z"
---
# Event: Futures Order update

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Order-update)

When new order created, order status changed will push such event. event type is `ORDER_TRADE_UPDATE`.

**Side**

-   BUY
-   SELL

**Order Type**

-   MARKET
-   LIMIT
-   LIQUIDATION

**Execution Type**

-   NEW
-   CANCELED
-   CALCULATED - Liquidation Execution
-   EXPIRED
-   TRADE

**Order Status**

-   NEW
-   PARTIALLY\_FILLED
-   FILLED
-   CANCELED
-   EXPIRED
-   EXPIRED\_IN\_MATCH

**Time in force**

-   GTC
-   IOC
-   FOK
-   GTX

**Liquidation and ADL:**

-   If user gets liquidated due to insufficient margin balance:
    -   c shows as "autoclose-XXX"，X shows as "NEW"
-   If user has enough margin balance but gets ADL:
    -   c shows as “adl\_autoclose”，X shows as “NEW”

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Order-update)

`ORDER_TRADE_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Order-update)

```
{  "e":"ORDER_TRADE_UPDATE",     // Event Type    "fs": "UM",                   // Event business unit. 'UM' for USDS-M futures and 'CM' for COIN-M futures  "E":1568879465651,            // Event Time  "T":1568879465650,            // Transaction Time  "i":"",                   // Account Alias,ignore for UM  "o":{                                "s":"BTCUSDT",              // Symbol    "c":"TEST",                 // Client Order Id      // special client order id:      // starts with "autoclose-": liquidation order      // "adl_autoclose": ADL auto close order      // "settlement_autoclose-": settlement order for delisting or delivery    "S":"SELL",                 // Side    "o":"MARKET", // Order Type    "f":"GTC",                  // Time in Force    "q":"0.001",                // Original Quantity    "p":"0",                    // Original Price    "ap":"0",                   // Average Price    "sp":"7103.04",					    // Ignore    "x":"NEW",                  // Execution Type    "X":"NEW",                  // Order Status    "i":8886774,                // Order Id    "l":"0",                    // Order Last Filled Quantity    "z":"0",                    // Order Filled Accumulated Quantity    "L":"0",                    // Last Filled Price    "N":"USDT",             // Commission Asset, will not push if no commission    "n":"0",                // Commission, will not push if no commission    "T":1568879465650,          // Order Trade Time    "t":0,                      // Trade Id    "b":"0",                    // Bids Notional    "a":"9.91",                 // Ask Notional    "m":false,                  // Is this trade the maker side?    "R":false,                  // Is this reduce only    "ps":"LONG",                // Position Side    "rp":"0",                   // Realized Profit of the trade    "st":"C_TAKE_PROFIT",       // Strategy type, only pushed with conditional order triggered    "si":12893,                  // StrategyId,only pushed with conditional order triggered    "V":"EXPIRE_TAKER",         // STP mode    "gtd":0    }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Order-update)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Order-update)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Order-update)
