---
title: "User Data Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream"
fetched_at: "2026-02-26T10:38:12.317Z"
---
# User Data Streams for Binance

## General information[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

-   Subscribe via the [WebSocket API](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests) using an API Key.
-   Both [SBE](https://developers.binance.com/docs/binance-spot-api-docs/faqs/sbe_faq) and JSON output are supported.
-   Account events are pushed in **real-time**.
-   All timestamps in JSON payloads are in **milliseconds by default**.
-   Events may contain non-ASCII characters encoded in UTF-8 if you own or trade any assets or symbols whose names contain non-ASCII characters.

## User Data Stream Events[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

### Account Update[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

`outboundAccountPosition` is sent any time an account balance has changed and contains the assets that were possibly changed by the event that generated the balance change.

```
{    "subscriptionId": 0,    "event": {        "e": "outboundAccountPosition",     // Event type        "E": 1564034571105,                 // Event Time        "u": 1564034571073,                 // Time of last account update        // Balances Array        "B": [            {                "a": "ETH",                 // Asset                "f": "10000.000000",        // Free                "l": "0.000000"             // Locked            }        ]    }}
```

### Balance Update[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

Balance Update occurs during the following:

-   Deposits or withdrawals from the account
-   Transfer of funds between accounts (e.g. Spot to Margin)

**Payload**

```
{    "subscriptionId": 0,    "event": {        "e": "balanceUpdate",     // Event Type        "E": 1573200697110,       // Event Time        "a": "BTC",               // Asset        "d": "100.00000000",      // Balance Delta        "T": 1573200697068        // Clear Time    }}
```

### Order Update[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

Orders are updated with the `executionReport` event.

**Payload:**

```
{    "subscriptionId": 0,    "event": {        "e": "executionReport",            // Event type        "E": 1499405658658,                // Event time        "s": "ETHBTC",                     // Symbol        "c": "mUvoqJxFIILMdfAW5iGSOW",     // Client order ID        "S": "BUY",                        // Side        "o": "LIMIT",                      // Order type        "f": "GTC",                        // Time in force        "q": "1.00000000",                 // Order quantity        "p": "0.10264410",                 // Order price        "P": "0.00000000",                 // Stop price        "F": "0.00000000",                 // Iceberg quantity        "g": -1,                           // OrderListId        "C": "",                           // Original client order ID; This is the ID of the order being canceled        "x": "NEW",                        // Current execution type        "X": "NEW",                        // Current order status        "r": "NONE",                       // Order reject reason; Please see Order Reject Reason (below) for more information.        "i": 4293153,                      // Order ID        "l": "0.00000000",                 // Last executed quantity        "z": "0.00000000",                 // Cumulative filled quantity        "L": "0.00000000",                 // Last executed price        "n": "0",                          // Commission amount        "N": null,                         // Commission asset        "T": 1499405658657,                // Transaction time        "t": -1,                           // Trade ID        "v": 3,                            // Prevented Match Id; This is only visible if the order expired due to STP        "I": 8641984,                      // Execution Id        "w": true,                         // Is the order on the book?        "m": false,                        // Is this trade the maker side?        "M": false,                        // Ignore        "O": 1499405658657,                // Order creation time        "Z": "0.00000000",                 // Cumulative quote asset transacted quantity        "Y": "0.00000000",                 // Last quote asset transacted quantity (i.e. lastPrice * lastQty)        "Q": "0.00000000",                 // Quote Order Quantity        "W": 1499405658657,                // Working Time; This is only visible if the order has been placed on the book.        "V": "NONE"                        // SelfTradePreventionMode    }}
```

**Note:** Average price can be found by doing `Z` divided by `z`.

#### Conditional Fields in Execution Report[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

These are fields that appear in the payload only if certain conditions are met.

For additional information on these parameters, please refer to the [Spot Glossary](https://developers.binance.com/docs/binance-spot-api-docs/faqs/spot_glossary).

Field

Name

Description

Examples

`d`

Trailing Delta

Appears only for trailing stop orders.

`"d": 4`

`D`

Trailing Time

`"D": 1668680518494`

`j`

Strategy Id

Appears only if the `strategyId` parameter was provided upon order placement.

`"j": 1`

`J`

Strategy Type

Appears only if the `strategyType` parameter was provided upon order placement.

`"J": 1000000`

`v`

Prevented Match Id

Appears only for orders that expired due to STP.

`"v": 3`

`A`

Prevented Quantity

`"A":"3.000000"`

`B`

Last Prevented Quantity

`"B":"3.000000"`

`u`

Trade Group Id

`"u":1`

`U`

Counter Order Id

`"U":37`

`Cs`

Counter Symbol

`"Cs": "BTCUSDT"`

`pl`

Prevented Execution Quantity

`"pl":"2.123456"`

`pL`

Prevented Execution Price

`"pL":"0.10000001"`

`pY`

Prevented Execution Quote Qty

`"pY":"0.21234562"`

`W`

Working Time

Appears when the order is working on the book

`"W": 1668683798379`

`b`

Match Type

Appears for orders that have allocations

`"b":"ONE_PARTY_TRADE_REPORT"`

`a`

Allocation ID

`"a":1234`

`k`

Working Floor

Appears for orders that potentially have allocations

`"k":"SOR"`

`uS`

UsedSor

Appears for orders that used SOR

`"uS":true`

`gP`

Pegged Price Type

Appears only for Pegged Orders

`"gP": "PRIMARY_PEG"`

`gOT`

Pegged offset Type

`"gOT": "PRICE_LEVEL"`

`gOV`

Pegged Offset Value

`"gOV": 5`

`gp`

Pegged Price

`"gp": "1.00000000"`

#### Order Reject Reason[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

For additional details, look up the Error Message in the [Errors](https://developers.binance.com/docs/binance-spot-api-docs/errors) documentation.

Rejection Reason (`r`)

Error Message

`NONE`

N/A (i.e. The order was not rejected.)

`INSUFFICIENT_BALANCES`

"Account has insufficient balance for requested action."

`STOP_PRICE_WOULD_TRIGGER_IMMEDIATELY`

"Order would trigger immediately."

`WOULD_MATCH_IMMEDIATELY`

"Order would immediately match and take."

`OCO_BAD_PRICES`

"The relationship of the prices for the orders is not correct."

If the order is an order list, an event named `ListStatus` will be sent in addition to the `executionReport` event.

**Payload**

```
{    "subscriptionId": 0,    "event": {        "e": "listStatus",                        // Event Type        "E": 1564035303637,                       // Event Time        "s": "ETHBTC",                            // Symbol        "g": 2,                                   // OrderListId        "c": "OCO",                               // Contingency Type        "l": "EXEC_STARTED",                      // List Status Type        "L": "EXECUTING",                         // List Order Status        "r": "NONE",                              // List Reject Reason        "C": "F4QN4G8DlFATFlIUQ0cjdD",            // List Client Order ID        "T": 1564035303625,                       // Transaction Time        // An array of objects        "O": [            {                "s": "ETHBTC",                    // Symbol                "i": 17,                          // OrderId                "c": "AJYsMjErWJesZvqlJCTUgL"     // ClientOrderId            },            {                "s": "ETHBTC",                "i": 18,                "c": "bfYPSQdLoqAJeNrOr9adzq"            }        ]    }}
```

**Execution types:**

-   `NEW` - The order has been accepted into the engine.
-   `CANCELED` - The order has been canceled by the user.
-   `REPLACED` - The order has been amended.
-   `REJECTED` - The order has been rejected and was not processed (e.g. Cancel Replace Orders wherein the new order placement is rejected but the request to cancel request succeeds.)
-   `TRADE` - Part of the order or all of the order's quantity has filled.
-   `EXPIRED` - The order was canceled according to the order type's rules (e.g. LIMIT FOK orders with no fill, LIMIT IOC or MARKET orders that partially fill) or by the exchange, (e.g. orders canceled during liquidation, orders canceled during maintenance).
-   `TRADE_PREVENTION` - The order has expired due to STP.

Check the [Enums page](https://developers.binance.com/docs/binance-spot-api-docs/enums) for more relevant enum definitions.

## Event Stream Terminated[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

`eventStreamTerminated` is sent when:

-   [A listen token subscription](https://developers.binance.com/docs/margin_trading/trade-data-stream/Listen-Token-Websocket-API) expires due to token expiration.
-   A [logon subscription](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests) ends after sending [`session.logout`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests) method.
-   The subscription is stopped via the [`userDataStream.unsubscribe`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests) method.

**Payload:**

```
{    "subscriptionId": 0,    "event": {        "e": "eventStreamTerminated",     // Event Type        "E": 1728973001334                // Event Time    }}
```

## External Lock Update[​](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)

`externalLockUpdate` is sent when part of your spot wallet balance is locked/unlocked by an external system, for example when used as margin collateral.

**Payload:**

```
{    "subscriptionId": 0,    "event": {        "e": "externalLockUpdate",     // Event Type        "E": 1581557507324,            // Event Time        "a": "NEO",                    // Asset        "d": "10.00000000",            // Delta        "T": 1581557507268             // Transaction Time    }}
```

-   [General information](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)
-   [User Data Stream Events](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)
    -   [Account Update](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)
    -   [Balance Update](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)
    -   [Order Update](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)
-   [Event Stream Terminated](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)
-   [External Lock Update](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream)
