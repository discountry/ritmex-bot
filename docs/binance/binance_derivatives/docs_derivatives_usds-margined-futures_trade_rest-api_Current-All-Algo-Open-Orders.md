---
title: "Current All Algo Open Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders"
fetched_at: "2026-01-27T05:28:30.610Z"
---
# Current All Algo Open Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)

Get all algo open orders on a symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)

GET `/fapi/v1/openAlgoOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)

**1** for a single symbol; **40** when the symbol parameter is omitted

**Careful** when accessing this with no symbol.

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)

Name

Type

Mandatory

Description

algoType

STRING

NO

symbol

STRING

NO

algoId

LONG

NO

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If the symbol is not sent, orders for all symbols will be returned in an array.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)

```
[   {       "algoId": 2148627,       "clientAlgoId": "MRumok0dkhrP4kCm12AHaB",       "algoType": "CONDITIONAL",       "orderType": "TAKE_PROFIT",       "symbol": "BNBUSDT",       "side": "SELL",       "positionSide": "BOTH",       "timeInForce": "GTC",       "quantity": "0.01",       "algoStatus": "NEW",       "actualOrderId": "",       "actualPrice": "0.00000",       "triggerPrice": "750.000",       "price": "750.000",       "icebergQuantity": null,       "tpTriggerPrice": "0.000",       "tpPrice": "0.000",	   "slTriggerPrice": "0.000",	   "slPrice": "0.000",       "tpOrderType": "",       "selfTradePreventionMode": "EXPIRE_MAKER",       "workingType": "CONTRACT_PRICE",       "priceMatch": "NONE",       "closePosition": false,       "priceProtect": false,       "reduceOnly": false,       "createTime": 1750514941540,       "updateTime": 1750514941540,       "triggerTime": 0,       "goodTillDate": 0   }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Algo-Open-Orders)
