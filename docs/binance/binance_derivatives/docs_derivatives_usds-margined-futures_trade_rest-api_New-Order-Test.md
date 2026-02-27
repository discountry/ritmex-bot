---
title: "Test New Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test"
fetched_at: "2026-01-27T05:28:31.129Z"
---
# Test Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)

Testing order request, this order will not be submitted to matching engine

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)

POST `/fapi/v1/order/test`

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)

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

Default `BOTH` for One-way Mode ; `LONG` or `SHORT` for Hedge Mode. It must be sent in Hedge Mode.

type

ENUM

YES

timeInForce

ENUM

NO

quantity

DECIMAL

NO

Cannot be sent with `closePosition`\=`true`(Close-All)

reduceOnly

STRING

NO

"true" or "false". default "false". Cannot be sent in Hedge Mode; cannot be sent with `closePosition`\=`true`

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

closePosition

STRING

NO

`true`, `false`；Close-All，used with `STOP_MARKET` or `TAKE_PROFIT_MARKET`.

activationPrice

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, default as the latest price(supporting different `workingType`)

callbackRate

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, min 0.1, max 5 where 1 for 1%

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

`NONE`:No STP / `EXPIRE_TAKER`:expire taker order when STP triggers/ `EXPIRE_MAKER`:expire taker order when STP triggers/ `EXPIRE_BOTH`:expire both orders when STP triggers; default `NONE`

goodTillDate

LONG

NO

order cancel time for timeInForce `GTD`, mandatory when `timeInforce` set to `GTD`; order the timestamp only retains second-level precision, ms part will be ignored; The goodTillDate timestamp must be greater than the current time plus 600 seconds and smaller than 253402300799000

recvWindow

LONG

NO

timestamp

LONG

YES

Additional mandatory parameters based on `type`:

Type

Additional mandatory parameters

`LIMIT`

`timeInForce`, `quantity`, `price`

`MARKET`

`quantity`

`STOP/TAKE_PROFIT`

`quantity`, `price`, `stopPrice`

`STOP_MARKET/TAKE_PROFIT_MARKET`

`stopPrice`

`TRAILING_STOP_MARKET`

`callbackRate`

> -   Order with type `STOP`, parameter `timeInForce` can be sent ( default `GTC`).
>     
> -   Order with type `TAKE_PROFIT`, parameter `timeInForce` can be sent ( default `GTC`).
>     
> -   Condition orders will be triggered when:
>     
>     -   If parameter`priceProtect`is sent as true:
>         -   when price reaches the `stopPrice` ，the difference rate between "MARK\_PRICE" and "CONTRACT\_PRICE" cannot be larger than the "triggerProtect" of the symbol
>         -   "triggerProtect" of a symbol can be got from `GET /fapi/v1/exchangeInfo`
>     -   `STOP`, `STOP_MARKET`:
>         -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `stopPrice`
>         -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `stopPrice`
>     -   `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`:
>         -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `stopPrice`
>         -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `stopPrice`
>     -   `TRAILING_STOP_MARKET`:
>         -   BUY: the lowest price after order placed `<=` activationPrice`, and the latest price >`\= the lowest price \* (1 + `callbackRate`)
>         -   SELL: the highest price after order placed >= `activationPrice`, and the latest price <= the highest price \* (1 - `callbackRate`)
> -   For `TRAILING_STOP_MARKET`, if you got such error code.  
>     `{"code": -2021, "msg": "Order would immediately trigger."}`  
>     means that the parameters you send do not meet the following requirements:
>     
>     -   BUY: `activationPrice` should be smaller than latest price.
>     -   SELL: `activationPrice` should be larger than latest price.
> -   If `newOrderRespType` is sent as `RESULT` :
>     
>     -   `MARKET` order: the final FILLED result of the order will be return directly.
>     -   `LIMIT` order with special `timeInForce`: the final status result of the order(FILLED or EXPIRED) will be returned directly.
> -   `STOP_MARKET`, `TAKE_PROFIT_MARKET` with `closePosition`\=`true`:
>     
>     -   Follow the same rules for condition orders.
>     -   If triggered，**close all** current long position( if `SELL`) or current short position( if `BUY`).
>     -   Cannot be used with `quantity` paremeter
>     -   Cannot be used with `reduceOnly` parameter
>     -   In Hedge Mode,cannot be used with `BUY` orders in `LONG` position side. and cannot be used with `SELL` orders in `SHORT` position side
> -   `selfTradePreventionMode` is only effective when `timeInForce` set to `IOC` or `GTC` or `GTD`.
>     
> -   In extreme market conditions, timeInForce `GTD` order auto cancel time might be delayed comparing to `goodTillDate`
>     

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)

```
{ 	"clientOrderId": "testOrder", 	"cumQty": "0", 	"cumQuote": "0", 	"executedQty": "0", 	"orderId": 22542179, 	"avgPrice": "0.00000", 	"origQty": "10", 	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",  	"status": "NEW",  	"stopPrice": "9300",		// please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,   // if Close-All  	"symbol": "BTCUSDT",  	"timeInForce": "GTD",  	"type": "TRAILING_STOP_MARKET",  	"origType": "TRAILING_STOP_MARKET",  	"activatePrice": "9020",	// activation price, only return with TRAILING_STOP_MARKET order  	"priceRate": "0.3",			// callback rate, only return with TRAILING_STOP_MARKET order 	"updateTime": 1566818724722, 	"workingType": "CONTRACT_PRICE", 	"priceProtect": false,      // if conditional order trigger is protected	 	"priceMatch": "NONE",              //price match mode 	"selfTradePreventionMode": "NONE", //self trading preventation mode 	"goodTillDate": 1693207680000      //order pre-set auot cancel time for TIF GTD order}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order-Test)
