---
title: "Query All Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders"
fetched_at: "2026-01-27T05:28:04.567Z"
---
# All Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)

Get all account orders; active, canceled, or filled.

-   These orders will not be found:
    -   order status is CANCELED or EXPIRED AND order has NO filled trade AND created time + 3 days < current time
    -   order create time + 90 days < current time

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)

GET `/dapi/v1/allOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)

**20** with symbol, **40** with pair

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)

Name

Type

Mandatory

Description

symbol

STRING

NO

pair

STRING

NO

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

Default 50; max 100.

recvWindow

LONG

NO

timestamp

LONG

YES

**Notes:**

> -   Either `symbol` or `pair` must be sent.
> -   `pair` can't be sent with `orderId`
> -   If `orderId` is set, it will get orders >= that `orderId`. Otherwise most recent orders are returned.
> -   If orderId is set, it will get orders >= that orderId. Otherwise most recent orders are returned.
> -   The query time period must be less then 7 days( default as the recent 7 days).

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)

```
[  {   	"avgPrice": "0.0",  	"clientOrderId": "abc",  	"cumBase": "0",  	"executedQty": "0",  	"orderId": 1917641,  	"origQty": "0.40",  	"origType": "TRAILING_STOP_MARKET",  	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",  	"status": "NEW",  	"stopPrice": "9300",				// please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,   			// if Close-All  	"symbol": "BTCUSD_200925",  	"pair": "BTCUSD",  	"time": 1579276756075,				// order time  	"timeInForce": "GTC",  	"type": "TRAILING_STOP_MARKET",  	"activatePrice": "9020",			// activation price, only return with TRAILING_STOP_MARKET order  	"priceRate": "0.3",					// callback rate, only return with TRAILING_STOP_MARKET order  	"updateTime": 1579276756075,		// update time  	"workingType": "CONTRACT_PRICE",  	"priceProtect": false,              // if conditional order trigger is protected  	"priceMatch": "NONE",               //price match mode  	"selfTradePreventionMode": "NONE",  //self trading preventation mode  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/All-Orders)
