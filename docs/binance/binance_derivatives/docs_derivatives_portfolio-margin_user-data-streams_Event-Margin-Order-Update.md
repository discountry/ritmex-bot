---
title: "Event Margin Order Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Order-Update"
fetched_at: "2026-01-27T05:28:24.113Z"
---
# Event: Margin Order Update

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Order-Update)

Margin orders are updated with the `executionReport` event.

**Execution types:**

-   NEW - The order has been accepted into the engine.
-   CANCELED - The order has been canceled by the user.
-   REJECTED - The order has been rejected and was not processed (This message appears only with Cancel Replace Orders wherein the new order placement is rejected but the request to cancel request succeeds.)
-   TRADE - Part of the order or all of the order's quantity has filled.
-   EXPIRED - The order was canceled according to the order type's rules (e.g. LIMIT FOK orders with no fill, LIMIT IOC or MARKET orders that partially fill) or by the exchange, (e.g. orders canceled during liquidation, orders canceled during maintenance).
-   TRADE\_PREVENTION - The order has expired due to STP trigger. Check the Public API Definitions for more relevant enum definitions.

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Order-Update)

`executionReport`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Order-Update)

```
{  "e": "executionReport",        // Event type  "E": 1499405658658,            // Event time  "s": "ETHBTC",                 // Symbol  "c": "mUvoqJxFIILMdfAW5iGSOW", // Client order ID  "S": "BUY",                    // Side  "o": "LIMIT",                  // Order type  "f": "GTC",                    // Time in force  "q": "1.00000000",             // Order quantity  "p": "0.10264410",             // Order price  "P": "0.00000000",             // Stop price  "d": 4,                        // Trailing Delta; This is only visible if the order was a trailing stop order.  "F": "0.00000000",             // Iceberg quantity; Will not be visible if not iceberg order  "g": -1,                       // OrderListId  "C": "",                       // Original client order ID; Only visible on cancellation of order, the ID of the order being canceled.  "x": "NEW",                    // Current execution type  "X": "NEW",                    // Current order status  "r": "NONE",                   // Order reject reason; Only visible if there is a rejection, will be an error code.  "i": 4293153,                  // Order ID  "l": "0.00000000",             // Last executed quantity  "z": "0.00000000",             // Cumulative filled quantity  "L": "0.00000000",             // Last executed price  "n": "0",                      // Commission amount  "N": null,                     // Commission asset; Only visible when there is a commission amount.  "T": 1499405658657,            // Transaction time  "t": -1,                       // Trade ID  "v": 3,                        // Prevented Match Id; This is only visible if the order expire due to STP trigger.  "I": 8641984,                  // updateId  "w": true,                     // Is the order on the book?  "m": false,                    // Is this trade the maker side?  "O": 1499405658657,            // Order creation time  "Z": "0.00000000",             // Cumulative quote asset transacted quantity  "Y": "0.00000000",             // Last quote asset transacted quantity (i.e. lastPrice * lastQty)  "Q": "0.00000000",             // Quote Order Quantity; This is only visible if indicated in the order  "D": 1668680518494,            // Trailing Time; This is only visible if the trailing stop order has been activated.  "j": 1,                        // Strategy ID; This is only visible if the strategyId parameter was provided upon order placement  "J": 1000000,                  // Strategy Type; This is only visible if the strategyType parameter was provided upon order placement  "W": 1499405658657,            // Working Time; This is only visible if the order has been placed on the book.  "V": "NONE",                   // selfTradePreventionMode  "u":1,                         // TradeGroupId; This is only visible if the account is part of a trade group and the order expired due to STP trigger.  "U":37,                        // CounterOrderId; This is only visible if the order expired due to STP trigger.  "A":"3.000000",                // Prevented Quantity; This is only visible if the order expired due to STP trigger.  "B":"3.000000"                 // Last Prevented Quantity; This is only visible if the order expired due to STP trigger.}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Order-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Order-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Order-Update)
