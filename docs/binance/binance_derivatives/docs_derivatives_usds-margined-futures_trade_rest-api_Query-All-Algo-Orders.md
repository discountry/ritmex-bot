---
title: "Query All Algo Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders"
fetched_at: "2026-01-27T05:28:31.539Z"
---
# Query All Algo Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)

Get all algo orders; active, CANCELED, TRIGGERED or FINISHED .

-   These orders will not be found:
    -   order status is `CANCELED` or `EXPIRED` **AND** order has NO filled trade **AND** created time + 3 days < current time
    -   order create time + 90 days < current time

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)

GET `/fapi/v1/allAlgoOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)

Name

Type

Mandatory

Description

symbol

STRING

YES

algoId

LONG

NO

startTime

LONG

NO

endTime

LONG

NO

page

INT

NO

limit

INT

NO

Default 500; max 1000.

recvWindow

LONG

NO

timestamp

LONG

YES

**Notes:**

> -   If `algoId` is set, it will get orders >= that `algoId`. Otherwise most recent orders are returned.
> -   The query time period must be less then 7 days( default as the recent 7 days).

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)

```
[   {       "algoId": 2146760,       "clientAlgoId": "6B2I9XVcJpCjqPAJ4YoFX7",       "algoType": "CONDITIONAL",       "orderType": "TAKE_PROFIT",       "symbol": "BNBUSDT",       "side": "SELL",       "positionSide": "BOTH",       "timeInForce": "GTC",       "quantity": "0.01",       "algoStatus": "CANCELED",       "actualOrderId": "",       "actualPrice": "0.00000",       "triggerPrice": "750.000",       "price": "750.000",       "icebergQuantity": null,       "tpTriggerPrice": "0.000",       "tpPrice": "0.000",       "slTriggerPrice": "0.000",       "slPrice": "0.000",       "tpOrderType": "",       "selfTradePreventionMode": "EXPIRE_MAKER",       "workingType": "CONTRACT_PRICE",       "priceMatch": "NONE",       "closePosition": false,       "priceProtect": false,       "reduceOnly": false,       "createTime": 1750485492076,       "updateTime": 1750514545091,       "triggerTime": 0,       "goodTillDate": 0   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-All-Algo-Orders)
