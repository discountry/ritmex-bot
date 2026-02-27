---
title: "New Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api"
fetched_at: "2026-01-27T05:28:04.582Z"
---
# New Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)

Send in a new order.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)

POST `/dapi/v1/order`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)

1 on 1min order rate limit(X-MBX-ORDER-COUNT-1M)  
0 on IP rate limit(x-mbx-used-weight-1m)

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)

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

quantity measured by contract number, Cannot be sent with `closePosition`\=`true`

reduceOnly

STRING

NO

"true" or "false". default "false". Cannot be sent in Hedge Mode; cannot be sent with `closePosition`\=`true`(Close-All)

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

`true`, `false`；Close-All,used with `STOP_MARKET` or `TAKE_PROFIT_MARKET`.

activationPrice

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, default as the latest price(supporting different `workingType`)

callbackRate

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, min 0.1, max 10 where 1 for 1%

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

`price`, `stopPrice`

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
>         -   "triggerProtect" of a symbol can be got from `GET /dapi/v1/exchangeInfo`
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
>     -   If triggered,**close all** current long position( if `SELL`) or current short position( if `BUY`).
>     -   Cannot be used with `quantity` parameter
>     -   Cannot be used with `reduceOnly` parameter
>     -   In Hedge Mode,cannot be used with `BUY` orders in `LONG` position side. and cannot be used with `SELL` orders in `SHORT` position side
> -   `selfTradePreventionMode` is only effective when `timeInForce` set to `IOC` or `GTC`.
>     

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)

```
{ 	"clientOrderId": "testOrder", 	"cumQty": "0", 	"cumBase": "0", 	"executedQty": "0", 	"orderId": 22542179, 	"avgPrice": "0.0", 	"origQty": "10",  	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",   	"status": "NEW",  	"stopPrice": "9300",			   // please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,  		   // if Close-All  	"symbol": "BTCUSD_200925",  	"pair": "BTCUSD",  	"timeInForce": "GTC",  	"type": "TRAILING_STOP_MARKET",  	"origType": "TRAILING_STOP_MARKET",  	"activatePrice": "9020",			// activation price, only return with TRAILING_STOP_MARKET order  	"priceRate": "0.3",					// callback rate, only return with TRAILING_STOP_MARKET order 	"updateTime": 1566818724722, 	"workingType": "CONTRACT_PRICE", 	"priceProtect": false,              // if conditional order trigger is protected	"priceMatch": "NONE",               //price match mode 	"selfTradePreventionMode": "NONE",  //self trading preventation mode}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api)
