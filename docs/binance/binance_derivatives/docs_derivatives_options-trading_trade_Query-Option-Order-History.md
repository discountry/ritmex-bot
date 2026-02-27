---
title: "Query Option Order History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History"
fetched_at: "2026-01-27T05:28:12.093Z"
---
# Query Option Order History (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)

Query all finished orders within 5 days, finished status: CANCELLED FILLED REJECTED.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)

GET `/eapi/v1/historyOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)

**3**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)

Name

Type

Mandatory

Description

symbol

STRING

YES

Option trading pair

orderId

LONG

NO

Returns the orderId and subsequent orders, the most recent order is returned by default

startTime

LONG

NO

Start Time, e.g 1593511200000

endTime

LONG

NO

End Time, e.g 1593512200000

limit

INT

NO

Number of result sets returned Default:100 Max:1000

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)

```
[    {        "orderId": 4611922413427359795,        "symbol": "BTC-220715-2000-C",        "price": "18000.00000000",        "quantity": "-0.50000000",        "executedQty": "-0.50000000",        "side": "SELL",        "type": "LIMIT",        "timeInForce": "GTC",        "reduceOnly": false,        "createTime": 1657867694244,        "updateTime": 1657867888216,        "status": "FILLED",        "avgPrice": "18000.00000000",        "clientOrderId": "",        "priceScale": 2,        "quantityScale": 2,        "optionSide": "CALL",        "quoteAsset": "USDT",        "mmp": false    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Query-Option-Order-History)
