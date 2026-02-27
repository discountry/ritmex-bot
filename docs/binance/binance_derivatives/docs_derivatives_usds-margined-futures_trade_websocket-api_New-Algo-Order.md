---
title: "New Algo Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order"
fetched_at: "2026-01-27T05:28:32.273Z"
---
# New Algo Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)

Send in a new algo order.

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)

`algoOrder.place`

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)

```
{	"id": "7731f6b5-8d5e-419c-a424-016b0a5fe8d7",	"method": "algoOrder.place",	"params": {		"algoType": "CONDITIONAL",		"apiKey": "autoApiKey7mM4kPWaRuTUypdTEZKG8U8tDjO64xdBJBrmE1nXU2XSwdxGPyXcYx",		"newOrderRespType": "RESULT",		"positionSide": "SHORT",		"price": "160000",		"quantity": "1",		"recvWindow": "99999999",		"side": "SELL",		"symbol": "BTCUSDT",		"timeInForce": "GTC",		"timestamp": 1762506268690,		"triggerprice": 120000,		"type": "TAKE_PROFIT",		"signature": "ec6e529c69fd8193b19484907bc713114eae06259fcab9728dafd5910f9cac5a"	}}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)

**0**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)

Name

Type

Mandatory

Description

algoType

ENUM

YES

Only support `CONDITIONAL`

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

For `CONDITIONAL` algoType, `STOP_MARKET`/`TAKE_PROFIT_MARKET`/`STOP`/`TAKE_PROFIT`/`TRAILING_STOP_MARKET` as order type

timeInForce

ENUM

NO

`IOC` or `GTC` or `FOK`, default `GTC`

quantity

DECIMAL

NO

Cannot be sent with `closePosition`\=`true`(Close-All)

price

DECIMAL

NO

triggerPrice

DECIMAL

NO

workingType

ENUM

NO

triggerPrice triggered by: `MARK_PRICE`, `CONTRACT_PRICE`. Default `CONTRACT_PRICE`

priceMatch

ENUM

NO

only avaliable for `LIMIT`/`STOP`/`TAKE_PROFIT` order; can be set to `OPPONENT`/ `OPPONENT_5`/ `OPPONENT_10`/ `OPPONENT_20`: /`QUEUE`/ `QUEUE_5`/ `QUEUE_10`/ `QUEUE_20`; Can't be passed together with `price`

closePosition

STRING

NO

true, false；Close-All，used with `STOP_MARKET` or `TAKE_PROFIT_MARKET`.

priceProtect

STRING

NO

"TRUE" or "FALSE", default "FALSE". Used with `STOP_MARKET` or `TAKE_PROFIT_MARKET` order. when price reaches the triggerPrice ，the difference rate between "MARK\_PRICE" and "CONTRACT\_PRICE" cannot be larger than the Price Protection Threshold of the symbol.

reduceOnly

STRING

NO

"true" or "false". default "false". Cannot be sent in Hedge Mode; cannot be sent with `closePosition`\=`true`

activatePrice

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, default as the latest price(supporting different `workingType`)

callbackRate

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, min 0.1, max 10 where 1 for 1%

clientAlgoId

STRING

NO

A unique id among open orders. Automatically generated if not sent. Can only be string following the rule: `^[\.A-Z\:/a-z0-9_-]{1,36}$`

newOrderRespType

ENUM

NO

"ACK", "RESULT", default "ACK"

selfTradePreventionMode

ENUM

NO

`EXPIRE_TAKER`:expire taker order when STP triggers/ `EXPIRE_MAKER`:expire taker order when STP triggers/ `EXPIRE_BOTH`:expire both orders when STP triggers; default `NONE`

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

> -   Condition orders will be triggered when:
>     
>     -   If parameter`priceProtect`is sent as true:
>         -   when price reaches the `triggerPrice` ，the difference rate between "MARK\_PRICE" and "CONTRACT\_PRICE" cannot be larger than the "triggerProtect" of the symbol
>         -   "triggerProtect" of a symbol can be got from `GET /fapi/v1/exchangeInfo`
>     -   `STOP`, `STOP_MARKET`:
>         -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `triggerPrice`
>         -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `triggerPrice`
>     -   `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`:
>         -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `triggerPrice`
>         -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `triggerPrice`
>     -   `TRAILING_STOP_MARKET`:
>         -   BUY: the lowest price after order placed <= `activatePrice`, and the latest price >= the lowest price \* (1 + `callbackRate`)
>         -   SELL: the highest price after order placed >= `activatePrice`, and the latest price <= the highest price \* (1 - `callbackRate`)
> -   For `TRAILING_STOP_MARKET`, if you got such error code.  
>     `{"code": -2021, "msg": "Order would immediately trigger."}`  
>     means that the parameters you send do not meet the following requirements:
>     
>     -   BUY: `activatePrice` should be smaller than latest price.
>     -   SELL: `activatePrice` should be larger than latest price.
> -   `STOP_MARKET`, `TAKE_PROFIT_MARKET` with `closePosition`\=`true`:
>     
>     -   Follow the same rules for condition orders.
>     -   If triggered，**close all** current long position( if `SELL`) or current short position( if `BUY`).
>     -   Cannot be used with `quantity` paremeter
>     -   Cannot be used with `reduceOnly` parameter
>     -   In Hedge Mode,cannot be used with `BUY` orders in `LONG` position side. and cannot be used with `SELL` orders in `SHORT` position side
> -   `selfTradePreventionMode` is only effective when `timeInForce` set to `IOC` or `GTC` or `GTD`.
>     

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)

```
{  "id": "06c9dbd8-ccbf-4ecf-a29c-fe31495ac73f",  "status": 200,  "result": {    "algoId": 3000000000003505,    "clientAlgoId": "0Xkl1p621E4EryvufmYre1",    "algoType": "CONDITIONAL",    "orderType": "TAKE_PROFIT",    "symbol": "BTCUSDT",    "side": "SELL",    "positionSide": "SHORT",    "timeInForce": "GTC",    "quantity": "1.000",    "algoStatus": "NEW",    "triggerPrice": "120000.00",    "price": "160000.00",    "icebergQuantity": null,    "selfTradePreventionMode": "EXPIRE_MAKER",    "workingType": "CONTRACT_PRICE",    "priceMatch": "NONE",    "closePosition": false,    "priceProtect": false,    "reduceOnly": false,    "createTime": 1762507264142,    "updateTime": 1762507264143,    "triggerTime": 0,    "goodTillDate": 0  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 1    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/New-Algo-Order)
