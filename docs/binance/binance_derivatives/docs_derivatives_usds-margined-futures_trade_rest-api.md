---
title: "New Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api"
fetched_at: "2026-01-27T05:28:29.833Z"
---
# New Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)

Send in a new order.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)

POST `/fapi/v1/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)

1 on 10s order rate limit(X-MBX-ORDER-COUNT-10S); 1 on 1min order rate limit(X-MBX-ORDER-COUNT-1M); 0 on IP rate limit(x-mbx-used-weight-1m)

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)

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

reduceOnly

STRING

NO

"true" or "false". default "false". Cannot be sent in Hedge Mode

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

`EXPIRE_TAKER`:expire taker order when STP triggers/ `EXPIRE_MAKER`:expire taker order when STP triggers/ `EXPIRE_BOTH`:expire both orders when STP triggers; default `EXPIRE_MAKER`

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

> -   If `newOrderRespType` is sent as `RESULT` :
>     -   `MARKET` order: the final FILLED result of the order will be return directly.
>     -   `LIMIT` order with special `timeInForce`: the final status result of the order(FILLED or EXPIRED) will be returned directly.
> -   `selfTradePreventionMode` is only effective when `timeInForce` set to `IOC` or `GTC` or `GTD`.
> -   In extreme market conditions, timeInForce `GTD` order auto cancel time might be delayed comparing to `goodTillDate`

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)

```
{ 	"clientOrderId": "testOrder", 	"cumQty": "0", 	"cumQuote": "0", 	"executedQty": "0", 	"orderId": 22542179, 	"avgPrice": "0.00000", 	"origQty": "10", 	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",  	"status": "NEW",  	"stopPrice": "9300",		// please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,   // if Close-All  	"symbol": "BTCUSDT",  	"timeInForce": "GTD",  	"type": "TRAILING_STOP_MARKET",  	"origType": "TRAILING_STOP_MARKET", 	"updateTime": 1566818724722, 	"workingType": "CONTRACT_PRICE", 	"priceProtect": false,      // if conditional order trigger is protected	 	"priceMatch": "NONE",              //price match mode 	"selfTradePreventionMode": "NONE", //self trading preventation mode 	"goodTillDate": 1693207680000      //order pre-set auot cancel time for TIF GTD order}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api)
