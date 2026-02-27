---
title: "Place Multiple Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders"
fetched_at: "2026-01-27T05:28:05.750Z"
---
# Place Multiple Orders(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)

Place multiple orders

-   Parameter rules are same with `New Order`
-   Batch orders are processed concurrently, and the order of matching is not guaranteed.
-   The order of returned contents for batch orders is the same as the order of the order list.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)

POST `/dapi/v1/batchOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)

Name

Type

Mandatory

Description

batchOrders

LIST<JSON>

YES

order list. Max 5 orders

recvWindow

LONG

NO

timestamp

LONG

YES

**Where `batchOrders` is the list of order parameters in JSON**

-   **Example:** /dapi/v1/batchOrders?batchOrders=\[{"type":"LIMIT","timeInForce":"GTC",  
    "symbol":"BTCUSD\_PERP","side":"BUY","price":"10001","quantity":"1"}\]

Name

Type

Mandatory

Description

symbol

STRING

YES

side

ENUM

YES

positionSide

ENUM

NO

Default `BOTH` for One-way Mode ; `LONG` or `SHORT` for Hedge Mode. It must be sent with Hedge Mode.

type

ENUM

YES

timeInForce

ENUM

NO

quantity

DECIMAL

YES

reduceOnly

STRING

NO

"true" or "false". default "false".

price

DECIMAL

NO

newClientOrderId

STRING

NO

A unique id among open orders. Automatically generated if not sent. Can only be string following the rule: `^[\.A-Z\:/a-z0-9_-]{1,36}$`

stopPrice

DECIMAL

NO

Used with `STOP/STOP_MARKET` or `TAKE_PROFIT/TAKE_PROFIT_MARKET` orders.

activationPrice

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, default as the latest price(supporting different `workingType`)

callbackRate

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, min 0.1, max 4 where 1 for 1%

workingType

ENUM

NO

stopPrice triggered by: "MARK\_PRICE", "CONTRACT\_PRICE". Default "CONTRACT\_PRICE"

priceProtect

STRING

NO

"TRUE" or "FALSE", default "FALSE". Used with `STOP/STOP_MARKET` or `TAKE_PROFIT/TAKE_PROFIT_MARKET` orders.

newOrderRespType

ENUM

NO

"ACK", "RESULT", default "ACK"

priceMatch

ENUM

NO

only avaliable for `LIMIT`/`STOP`/`TAKE_PROFIT` order; can be set to `OPPONENT`/ `OPPONENT_5`/ `OPPONENT_10`/ `OPPONENT_20`: /`QUEUE`/ `QUEUE_5`/ `QUEUE_10`/ `QUEUE_20`; Can't be passed together with `price`

selfTradePreventionMode

ENUM

NO

`EXPIRE_TAKER`:expire taker order when STP triggers/ `EXPIRE_MAKER`:expire taker order when STP triggers/ `EXPIRE_BOTH`:expire both orders when STP triggers; default `EXPIRE_MAKER`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)

```
[	{	 	"clientOrderId": "testOrder",	 	"cumQty": "0",	 	"cumBase": "0",	 	"executedQty": "0",	 	"orderId": 22542179,	 	"avgPrice": "0.0",	 	"origQty": "10",	 	"price": "0",	  	"reduceOnly": false,	  	"side": "BUY",	  	"positionSide": "SHORT",	  	"status": "NEW",	  	"stopPrice": "9300",		     // please ignore when order type is TRAILING_STOP_MARKET	  	"symbol": "BTCUSD_200925",	  	"pair": "BTCUSD",	  	"timeInForce": "GTC",	  	"type": "TRAILING_STOP_MARKET",	  	"origType": "TRAILING_STOP_MARKET",	  	"activatePrice": "9020",	     // activation price, only return with TRAILING_STOP_MARKET order	  	"priceRate": "0.3",			     // callback rate, only return with TRAILING_STOP_MARKET order	 	"updateTime": 1566818724722,	 	"workingType": "CONTRACT_PRICE",	 	"priceProtect": false,           // if conditional order trigger is protected	 	"priceMatch": "NONE",              //price match mode	 	"selfTradePreventionMode": "NONE"  //self trading preventation mode	},	{		"code": -2022, 		"msg": "ReduceOnly Order is rejected."	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Place-Multiple-Orders)
