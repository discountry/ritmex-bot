---
title: "Self Trade Prevention | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq"
fetched_at: "2026-01-27T05:28:26.817Z"
---
# Self Trade Prevention (STP) FAQ

## What is Self Trade Prevention?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

Self Trade Prevention (or STP) prevents orders of users, or the user's `tradeGroupId` to match against their own.

## What defines a self-trade?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

A self-trade can occur in either scenario:

-   The order traded against the same account.
-   The order traded against an account with the same `tradeGroupId`.

## What happens when STP is triggered?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

There are three possible modes for what the system will do if an order could create a self-trade.

`EXPIRE_TAKER` - This mode prevents a trade by immediately expiring the taker order's remaining quantity.

`EXPIRE_MAKER` - This mode prevents a trade by immediately expiring the potential maker order's remaining quantity.

`EXPIRE_BOTH` - This mode prevents a trade by immediately expiring both the taker and the potential maker orders' remaining quantities.

The STP event will occur depending on the STP mode of the **taker order**.  
Thus, the STP mode of an order that goes on the book is no longer relevant and will be ignored for all future order processing.

## Where do I set STP mode for an order?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

STP can only be set using field `selfTradePreventionMode` through API endpoints below:

-   POST `/fapi/v1/order`
-   POST `/fapi/v1/batchOrders`

## What is a Trade Group Id?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

Different accounts with the same `tradeGroupId` are considered part of the same "trade group". Orders submitted by members of a trade group are eligible for STP according to the taker-order's STP mode.

A user can confirm if their accounts are under the same `tradeGroupId` from the API either from `GET /fapi/v1/accountConfig` (REST API).

If the value is `-1`, then the `tradeGroupId` has not been set for that account, so the STP may only take place between orders of the same account.

We will release feature for user to group subaccounts to same `tradeGroupId` on website in future updates.

## How do I know which symbol uses STP?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

Placing orders on all symbols in `GET fapi/v1/exchangeInfo` can set `selfTradePreventionMode`.

## What order types support STP?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

`LIMIT`/`MARKET`/`STOP`/`TAKE_PROFIT`/`STOP_MARKET`/`TAKE_PROFIT_MARKET`/`TRAILING_STOP_MARKET` all supports STP when Time in force(timeInForce) set to `GTC`/ `IOC`/ `GTD`. STP won't take effect for Time in force(timeInForce) `FOK` or `GTX`

## Does Modify order support STP?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

No. Modify order that has reset `selfTradePreventionMode` to `NONE`

## How do I know if an order expired due to STP?[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

The order will have the status `EXPIRED_IN_MATCH`.

In user data stream event `ORDER_TRADE_UPDATE`, field `X` would be `EXPIRED_IN_MATCH` if order is expired due to STP

```
{  "e":"ORDER_TRADE_UPDATE",      // Event Type  "E":1568879465651,             // Event Time  "T":1568879465650,             // Transaction Time  "o":{                                 "s":"BTCUSDT",               // Symbol    "c":"TEST",                  // Client Order Id      // special client order id:      // starts with "autoclose-": liquidation order      // "adl_autoclose": ADL auto close order      // "settlement_autoclose-": settlement order for delisting or delivery    "S":"SELL",                  // Side    "o":"TRAILING_STOP_MARKET",  // Order Type    "f":"GTC",                   // Time in Force    "q":"0.001",                 // Original Quantity    "p":"0",                     // Original Price    "ap":"0",                    // Average Price    "sp":"7103.04",              // Stop Price. Please ignore with TRAILING_STOP_MARKET order    "x":"EXPIRED",               // Execution Type    "X":"EXPIRED_IN_MATCH",      // Order Status    "i":8886774,                 // Order Id    "l":"0",                     // Order Last Filled Quantity    "z":"0",                     // Order Filled Accumulated Quantity    "L":"0",                     // Last Filled Price    "N":"USDT",                  // Commission Asset, will not push if no commission    "n":"0",                     // Commission, will not push if no commission    "T":1568879465650,           // Order Trade Time    "t":0,                       // Trade Id    "b":"0",                     // Bids Notional    "a":"9.91",                  // Ask Notional    "m":false,                   // Is this trade the maker side?    "R":false,                   // Is this reduce only    "wt":"CONTRACT_PRICE",       // Stop Price Working Type    "ot":"TRAILING_STOP_MARKET", // Original Order Type    "ps":"LONG",                 // Position Side    "cp":false,                  // If Close-All, pushed with conditional order    "AP":"7476.89",              // Activation Price, only puhed with TRAILING_STOP_MARKET order    "cr":"5.0",                  // Callback Rate, only puhed with TRAILING_STOP_MARKET order    "pP": false,                 // ignore    "si": 0,                     // ignore    "ss": 0,                     // ignore    "rp":"0",                    // Realized Profit of the trade    "V": "EXPIRE_MAKER",         // selfTradePreventionMode    "pm":"QUEUE",                // price match type    "gtd":1768879465650          // good till date   }}
```

## STP Examples:[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)

For all these cases, assume that all orders for these examples are made on the same account.

**Scenario A- A user sends an order with `EXPIRE_MAKER` that would match with their orders that are already on the book.**

```
Maker Order 1: symbol=BTCUSDT side=BUY  type=LIMIT quantity=1 price=20002 selfTradePreventionMode=EXPIRE_MAKERMaker Order 2: symbol=BTCUSDT side=BUY  type=LIMIT quantity=1 price=20001 selfTradePreventionMode=EXPIRE_MAKERTaker Order 1: symbol=BTCUSDT side=SELL type=LIMIT quantity=1 price=20000 selfTradePreventionMode=EXPIRE_MAKER
```

**Result**: The orders that were on the book will expire due to STP, and the taker order will go on the book.

Maker Order 1

```
{    "orderId": 292864710,    "symbol": "BTCUSDT",    "status": "FILLED",    "clientOrderId": "testMaker1",    "price": "20002",    "avgPrice": "20002",    "origQty": "1",    "executedQty": "1",    "cumQuote": "20002",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "BUY",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

Maker Order 2

```
{    "orderId": 292864711,    "symbol": "BTCUSDT",    "status": "EXPIRED_IN_MATCH",    "clientOrderId": "testMaker2",    "price": "20001",    "avgPrice": "0.0000",    "origQty": "1",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "BUY",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

Output of the Taker Order

```
{    "orderId": 292864712,    "symbol": "BTCUSDT",    "status": "PARTIALLY_FILLED",    "clientOrderId": "testTaker1",    "price": "20000",    "avgPrice": "20002",    "origQty": "2",    "executedQty": "1",    "cumQuote": "20002",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "SELL",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

**Scenario B - A user sends an order with `EXPIRE_TAKER` that would match with their orders already on the book.**

```
Maker Order 1: symbol=BTCUSDT side=BUY  type=LIMIT quantity=1 price=20002  selfTradePreventionMode=EXPIRE_MAKERMaker Order 2: symbol=BTCUSDT side=BUY  type=LIMIT quantity=1 price=20001  selfTradePreventionMode=EXPIRE_MAKERTaker Order 1: symbol=BTCUSDT side=SELL type=LIMIT quantity=2 price=3      selfTradePreventionMode=EXPIRE_TAKER
```

**Result**: The orders already on the book will remain, while the taker order will expire.

Maker Order 1

```
{    "orderId": 292864710,    "symbol": "BTCUSDT",    "status": "FILLED",    "clientOrderId": "testMaker1",    "price": "20002",    "avgPrice": "0.0000",    "origQty": "1",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "BUY",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

Maker Order 2

```
{    "orderId": 292864711,    "symbol": "BTCUSDT",    "status": "EXPIRED_IN_MATCH",    "clientOrderId": "testMaker2",    "price": "20001",    "avgPrice": "0.0000",    "origQty": "1",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "BUY",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

Output of the Taker order

```
{    "orderId": 292864712,    "symbol": "BTCUSDT",    "status": "EXPIRED_IN_MATCH",    "clientOrderId": "testTaker1",    "price": "20000",    "avgPrice": "0.0000",    "origQty": "3",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "SELL",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_TAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

**Scenario C- A user has an order on the book, and then sends an order with `EXPIRE_BOTH` that would match with the existing order.**

```
Maker Order: symbol=BTCUSDT side=BUY  type=LIMIT quantity=1 price=20002 selfTradePreventionMode=EXPIRE_MAKERTaker Order: symbol=BTCUSDT side=SELL type=LIMIT quantity=3 price=20000 selfTradePreventionMode=EXPIRE_BOTH
```

**Result:** Both orders will expire.

Maker Order

```
{    "orderId": 292864710,    "symbol": "BTCUSDT",    "status": "EXPIRED_IN_MATCH",    "clientOrderId": "testMaker1",    "price": "20002",    "avgPrice": "0.0000",    "origQty": "1",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "BUY",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

Taker Order

```
{    "orderId": 292864712,    "symbol": "BTCUSDT",    "status": "EXPIRED_IN_MATCH",    "clientOrderId": "testTaker1",    "price": "20000",    "avgPrice": "0.0000",    "origQty": "3",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "SELL",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_BOTH",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

**Scenario D - A user has an order on the book with `EXPIRE_MAKER`, and then sends a new order with `EXPIRE_TAKER` which would match with the existing order.**

```
Maker Order: symbol=BTCUSDT side=BUY  type=LIMIT quantity=1 price=1 selfTradePreventionMode=EXPIRE_MAKERTaker Order: symbol=BTCUSDT side=SELL type=LIMIT quantity=1 price=1 selfTradePreventionMode=EXPIRE_TAKER
```

**Result**: The taker order's STP mode will be used, so the taker order will be expired.

Maker Order

```
{    "orderId": 292864710,    "symbol": "BTCUSDT",    "status": "NEW",    "clientOrderId": "testMaker1",    "price": "20002",    "avgPrice": "0.0000",    "origQty": "1",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "BUY",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

Taker Order

```
{    "orderId": 292864712,    "symbol": "BTCUSDT",    "status": "EXPIRED_IN_MATCH",    "clientOrderId": "testTaker1",    "price": "20000",    "avgPrice": "0.0000",    "origQty": "3",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "SELL",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_TAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

**Scenario E - A user sends a market order with `EXPIRE_MAKER` which would match with an existing order.**

```
Maker Order: symbol=ABCDEF side=BUY  type=LIMIT  quantity=1 price=1  selfTradePreventionMode=EXPIRE_MAKERTaker Order: symbol=ABCDEF side=SELL type=MARKET quantity=3          selfTradePreventionMode=EXPIRE_MAKER
```

**Result**: The existing order expires with the status `EXPIRED_IN_MATCH`, due to STP. The new order also expires but with status `EXPIRED`, due to low liquidity on the order book.

Maker Order

```
{    "orderId": 292864710,    "symbol": "BTCUSDT",    "status": "EXPIRED_IN_MATCH",    "clientOrderId": "testMaker1",    "price": "20002",    "avgPrice": "0.0000",    "origQty": "1",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "BUY",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

Taker Order

```
{    "orderId": 292864712,    "symbol": "BTCUSDT",    "status": "EXPIRED",    "clientOrderId": "testTaker1",    "price": "20000",    "avgPrice": "0.0000",    "origQty": "3",    "executedQty": "0",    "cumQuote": "0",    "timeInForce": "GTC",    "type": "LIMIT",    "reduceOnly": false,    "closePosition": false,    "side": "SELL",    "positionSide": "BOTH",    "stopPrice": "0",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "selfTradePreventionMode": "EXPIRE_MAKER",    "goodTillDate": "null",    "priceProtect": false,    "origType": "LIMIT",    "time": 1692849639460,    "updateTime": 1692849639460}
```

-   [What is Self Trade Prevention?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [What defines a self-trade?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [What happens when STP is triggered?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [Where do I set STP mode for an order?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [What is a Trade Group Id?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [How do I know which symbol uses STP?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [What order types support STP?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [Does Modify order support STP?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [How do I know if an order expired due to STP?](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
-   [STP Examples:](https://developers.binance.com/docs/derivatives/usds-margined-futures/faq/stp-faq)
