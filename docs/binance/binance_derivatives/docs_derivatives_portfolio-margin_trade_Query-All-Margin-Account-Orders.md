---
title: "Query All Margin Account Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders"
fetched_at: "2026-01-27T05:28:21.635Z"
---
# Query All Margin Account Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)

Query All Margin Account Orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)

GET `/papi/v1/margin/allOrders`

## Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)

**100**

## Parameters:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)

Name

Type

Mandatory

Description

symbol

STRING

YES

orderId

LONG

NO

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default 500; max 500.

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

**Notes:**

-   If `orderId` is set, it will get orders >= that `orderId`. Otherwise most recent orders are returned.
-   For some historical orders cummulativeQuoteQty will be < 0, meaning the data is not available at this time.

## Response:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)

```
[      {          "clientOrderId": "D2KDy4DIeS56PvkM13f8cP",          "cummulativeQuoteQty": "0.00000000",          "executedQty": "0.00000000",          "icebergQty": "0.00000000",          "isWorking": false,          "orderId": 41295,          "origQty": "5.31000000",          "price": "0.22500000",          "side": "SELL",          "status": "CANCELED",          "stopPrice": "0.18000000",          "symbol": "BNBBTC",          "time": 1565769338806,          "timeInForce": "GTC",          "type": "TAKE_PROFIT_LIMIT",          "updateTime": 1565769342148，          "accountId": 152950866,          "selfTradePreventionMode": "EXPIRE_TAKER",          "preventedMatchId": null,          "preventedQuantity": null      }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)
-   [Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)
-   [Parameters:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)
-   [Response:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Margin-Account-Orders)
