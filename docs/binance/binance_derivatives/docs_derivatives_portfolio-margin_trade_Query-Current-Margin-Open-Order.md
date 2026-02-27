---
title: "Query Current Margin Open Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order"
fetched_at: "2026-01-27T05:28:22.268Z"
---
# Query Current Margin Open Order (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)

Query Current Margin Open Order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)

GET `/papi/v1/margin/openOrders`

## Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)

**5**

## Parameters:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)

Name

Type

Mandatory

Description

symbol

STRING

YES

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

**Notes:**

-   If the `symbol` is not sent, orders for all symbols will be returned in an array.
-   When all symbols are returned, the number of requests counted against the rate limiter is equal to the number of symbols currently trading on the exchange.

## Response:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)

```
[   {       "clientOrderId": "qhcZw71gAkCCTv0t0k8LUK",       "cummulativeQuoteQty": "0.00000000",       "executedQty": "0.00000000",       "icebergQty": "0.00000000",       "isWorking": true,       "orderId": 211842552,       "origQty": "0.30000000",       "price": "0.00475010",       "side": "SELL",       "status": "NEW",       "stopPrice": "0.00000000",       "symbol": "BNBBTC",       "time": 1562040170089,       "timeInForce": "GTC",       "type": "LIMIT",       "updateTime": 1562040170089，       "accountId": 152950866,       "selfTradePreventionMode": "EXPIRE_TAKER",       "preventedMatchId": null,       "preventedQuantity": null    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)
-   [Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)
-   [Parameters:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)
-   [Response:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-Margin-Open-Order)
