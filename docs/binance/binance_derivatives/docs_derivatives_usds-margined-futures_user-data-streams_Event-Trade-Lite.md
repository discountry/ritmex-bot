---
title: "Event Trade Lite | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Trade-Lite"
fetched_at: "2026-01-27T05:28:33.389Z"
---
# Event: Trade Lite Update

## Event Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Trade-Lite)

Fast trade stream reduces data latency compared original `ORDER_TRADE_UPDATE` stream. However, it only pushes TRADE Execution Type, and fewer data fields.

## Event Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Trade-Lite)

`TRADE_LITE`

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Trade-Lite)

```
{  "e":"TRADE_LITE",             // Event Type  "E":1721895408092,            // Event Time  "T":1721895408214,            // Transaction Time                            "s":"BTCUSDT",                // Symbol  "q":"0.001",                  // Original Quantity  "p":"0",                      // Original Price  "m":false,                    // Is this trade the maker side?  "c":"z8hcUoOsqEdKMeKPSABslD", // Client Order Id      // special client order id:      // starts with "autoclose-": liquidation order      // "adl_autoclose": ADL auto close order      // "settlement_autoclose-": settlement order for delisting or delivery  "S":"BUY",                   // Side  "L":"64089.20",              // Last Filled Price  "l":"0.040",                 // Order Last Filled Quantity  "t":109100866,               // Trade Id  "i":8886774,                // Order Id}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Trade-Lite)
-   [Event Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Trade-Lite)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Trade-Lite)
