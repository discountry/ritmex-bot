---
title: "Place Multiple Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders"
fetched_at: "2026-01-27T05:28:11.943Z"
---
# Place Multiple Orders(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)

Send multiple option orders.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)

POST `/eapi/v1/batchOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)

Name

Type

Mandatory

Description

orders

LIST

YES

order list. Max 10 orders

recvWindow

LONG

NO

timestamp

LONG

YES

**Where `orders` is the list of order parameters in JSON:**

-   **example:** /eapi/v1/batchOrders?orders=\[{"symbol":"BTC-210115-35000-C", "price":"100","quantity":"0.0002","side":"BUY","type":"LIMIT"}\]

Name

Type

Mandatory

Description

symbol

STRING

YES

Option trading pair, e.g BTC-200730-9000-C

side

ENUM

YES

Buy/sell direction: SELL, BUY

type

ENUM

YES

Order Type: LIMIT (Only support LIMIT)

quantity

DECIMAL

YES

Order Quantity

price

DECIMAL

NO

Order Price

timeInForce

ENUM

NO

Time in force method（Default GTC）

reduceOnly

BOOLEAN

NO

Reduce Only（Default false）

postOnly

BOOLEAN

NO

Post Only（Default false）

newOrderRespType

ENUM

NO

"ACK", "RESULT", Default "ACK"

clientOrderId

STRING

NO

User-defined order ID cannot be repeated in pending orders

isMmp

BOOLEAN

NO

is market maker protection order, true/false

 

Some parameters are mandatory depending on the order type as follows:

Type

Mandatory parameters

LIMIT

timeInForce, quantity, price

> -   Parameter rules are same with New Order
> -   Batch orders are processed concurrently, and the order of matching is not guaranteed.

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)

```
[    {         "orderId": 4611875134427365377,     // System order number         "symbol": "BTC-200730-9000-C",      // Option trading pair         "price": "100",                     // Order Price         "quantity": "1",                    // Order Quantity         "executedQty": "0",                 // Number of executed quantity         "side": "BUY",                      // Buy/sell direction         "type": "LIMIT",                    // Order type         "timeInForce": "GTC",               // Time in force method         "reduceOnly": false,                // Order is reduce only Y/N         "createTime": 1592465880683,        // Order Time         "updateTime": 1566818724722,        // Update time         "status": "NEW",                    // Order status         "avgPrice": "0",                    // Average price of completed trade         "source": "API",         "clientOrderId": "",                 // Client order ID         "priceScale": 2,         "quantityScale": 2,         "optionSide": "CALL",         "quoteAsset": "USDT",         "mmp": false    }   ]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Place-Multiple-Orders)
