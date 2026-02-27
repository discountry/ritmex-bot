---
title: "Place Multiple Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders"
fetched_at: "2026-01-27T05:28:31.223Z"
---
# Place Multiple Orders(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)

Place Multiple Orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)

POST `/fapi/v1/batchOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)

5 on 10s order rate limit(X-MBX-ORDER-COUNT-10S); 1 on 1min order rate limit(X-MBX-ORDER-COUNT-1M); 5 on IP rate limit(x-mbx-used-weight-1m);

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)

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

-   **Example:** /fapi/v1/batchOrders?batchOrders=\[{"type":"LIMIT","timeInForce":"GTC",  
    "symbol":"BTCUSDT","side":"BUY","price":"10001","quantity":"0.001"}\]

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

`EXPIRE_TAKER`:expire taker order when STP triggers/ `EXPIRE_MAKER`:expire taker order when STP triggers/ `EXPIRE_BOTH`:expire both orders when STP triggers; default `NONE`

goodTillDate

LONG

NO

order cancel time for timeInForce `GTD`, mandatory when `timeInforce` set to `GTD`; order the timestamp only retains second-level precision, ms part will be ignored; The goodTillDate timestamp must be greater than the current time plus 600 seconds and smaller than 253402300799000

> -   Paremeter rules are same with `New Order`
> -   Batch orders are processed concurrently, and the order of matching is not guaranteed.
> -   The order of returned contents for batch orders is the same as the order of the order list.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)

```
[	{	 	"clientOrderId": "testOrder",	 	"cumQty": "0",	 	"cumQuote": "0",	 	"executedQty": "0",	 	"orderId": 22542179,	 	"avgPrice": "0.00000",	 	"origQty": "10",	 	"price": "0",	  	"reduceOnly": false,	  	"side": "BUY",	  	"positionSide": "SHORT",	  	"status": "NEW",	  	"stopPrice": "0",	 	"closePosition": false,	  	"symbol": "BTCUSDT",	  	"timeInForce": "GTC",	  	"type": "TRAILING_STOP_MARKET",	  	"origType": "TRAILING_STOP_MARKET",	  	"updateTime": 1566818724722,	 	"workingType": "CONTRACT_PRICE",	 	"priceProtect": false,      // if conditional order trigger is protected			"priceMatch": "NONE",              //price match mode		"selfTradePreventionMode": "NONE", //self trading preventation mode		"goodTillDate": 1693207680000      //order pre-set auto cancel time for TIF GTD order	},	{		"code": -2022, 		"msg": "ReduceOnly Order is rejected."	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders)
