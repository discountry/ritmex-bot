---
title: "Query Current Open Option Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders"
fetched_at: "2026-01-27T05:28:12.099Z"
---
# Query Current Open Option Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)

Query current all open orders, status: ACCEPTED PARTIALLY\_FILLED

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)

GET `/eapi/v1/openOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)

**1** for a single symbol; **40** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)

Name

Type

Mandatory

Description

symbol

STRING

NO

return all orders if don't pass, Option trading pair, e.g BTC-200730-9000-C,

orderId

LONG

NO

Returns the orderId and subsequent orders, the most recent order is returned by default

startTime

LONG

NO

Start Time

endTime

LONG

NO

End Time

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)

```
[  {    "orderId": 4611875134427365377,     // System order number    "symbol": "BTC-200730-9000-C",      // Option trading pair    "price": "100",                     // Order Price    "quantity": "1",                    // Order Quantity    "executedQty": "0",                 // Number of completed trades    "side": "BUY",                      // Buy/sell direction    "type": "LIMIT",                    // Order type    "timeInForce": "GTC",               // Time in force method    "reduceOnly": false,                // Order is reduce only Y/N    "createTime": 1592465880683,        // Order Time    "updateTime": 1592465880683,        // Update Time    "status": "NEW",                    // Order status    "avgPrice": "0",                    // Average price of completed trade    "clientOrderId": "",                 // Client order ID             "priceScale": 2,    "quantityScale": 2,    "optionSide": "CALL",    "quoteAsset": "USDT",    "mmp": false  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Current-Open-Option-Orders)
