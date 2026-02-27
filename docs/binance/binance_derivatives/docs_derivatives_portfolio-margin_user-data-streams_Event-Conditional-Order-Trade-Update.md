---
title: "Event Conditional Order Trade Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Conditional-Order-Trade-Update"
fetched_at: "2026-01-27T05:28:23.557Z"
---
# Event: Conditional Order Trade Update

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Conditional-Order-Trade-Update)

When new order created, order status changed will push such event. event type is `CONDITIONAL_ORDER_TRADE_UPDATE`.

**Side**

-   BUY
-   SELL

**Conditional Order Type**

-   STOP
-   TAKE\_PROFIT
-   STOP\_MARKET
-   TAKE\_PROFIT\_MARKET
-   TRAILING\_STOP\_MARKET

**Execution Type**

-   NEW
-   CANCELED
-   CALCULATED - Liquidation Execution
-   EXPIRED
-   TRADE

**Order Status**

-   NEW
-   CANCELED
-   EXPIRED
-   TRIGGERED
-   FINISHED

**Time in force**

-   GTC
-   IOC
-   FOK
-   GTX

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Conditional-Order-Trade-Update)

`CONDITIONAL_ORDER_TRADE_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Conditional-Order-Trade-Update)

```
{    "e": "CONDITIONAL_ORDER_TRADE_UPDATE", // Event Type    "T": 1669262908216,                    // Transaction Time    "E": 1669262908218,                    // Event Time    "fs": "UM",                            // Event business unit    "so": {                         "s": "BTCUSDT",                // Symbol            "c":"TEST",                    // Strategy Client Order Id            "si": 176057039,               // Strategy ID            "S":"SELL",                    // Side            "st": "TRAILING_STOP_MARKET",  // Strategy Type            "f":"GTC",                     // Time in Force            "q":"0.001",                   //Quantity            "p":"0",                       //Price            "sp":"7103.04",                // Stop Price. Please ignore with TRAILING_STOP_MARKET order            "os":"NEW",                    // Strategy Order Status            "T":1568879465650,             // Order book Time            "ut": 1669262908216,           // Order update Time             "R":false,                     // Is this reduce only            "wt":"MARK_PRICE",             // Stop Price Working Type            "ps":"LONG",                   // Position Side            "cp":false,                    // If Close-All, pushed with conditional order            "AP":"7476.89",                // Activation Price, only pushed with TRAILING_STOP_MARKET order            "cr":"5.0",                    // Callback Rate, only puhed with TRAILING_STOP_MARKET order            "i":8886774,                   // Order Id            "V":"EXPIRE_TAKER",         // STP mode            "gtd":0        }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Conditional-Order-Trade-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Conditional-Order-Trade-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Conditional-Order-Trade-Update)
