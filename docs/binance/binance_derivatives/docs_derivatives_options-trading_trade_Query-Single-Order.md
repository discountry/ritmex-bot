---
title: "Query Single Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order"
fetched_at: "2026-01-27T05:28:12.131Z"
---
# Query Single Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)

Check an order status.

-   These orders will not be found:
    -   order status is `CANCELED` or `REJECTED`, **AND**
    -   order has NO filled trade, **AND**
    -   created time + 3 days < current time

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)

GET `/eapi/v1/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)

Name

Type

Mandatory

Description

symbol

STRING

YES

Option trading pair, e.g BTC-200730-9000-C

orderId

LONG

NO

Order id

clientOrderId

STRING

NO

User-defined order ID cannot be repeated in pending orders

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Either `orderId` or `clientOrderId` must be sent.

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)

```
{  "orderId": 4611875134427365377,     // System order id  "symbol": "BTC-200730-9000-C",      // Option trading pair  "price": "100",                     // Order Price  "quantity": "1",                    // Order Quantity  "executedQty": "0",                 // Number of executed quantity  "side": "BUY",                      // Buy/sell direction  "type": "LIMIT",                    // Order type  "timeInForce": "GTC",               // Time in force method  "reduceOnly": false,                // Order is reduce only Y/N  "createTime": 1592465880683,        // Order Time  "updateTime": 1566818724722,        // Update time  "status": "NEW",                    // Order status  "avgPrice": "0",                    // Average price of completed trade  "clientOrderId": "",                 // Client order ID  "priceScale": 2,  "quantityScale": 2,  "optionSide": "CALL",  "quoteAsset": "USDT",  "mmp": false}
```

> **No Order Response:**

```
{    "code": -2013,    "msg": "Order does not exist"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Single-Order)
