---
title: "New Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api"
fetched_at: "2026-01-27T05:28:06.014Z"
---
# New Order(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)

Send in a new order.

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)

`order.place`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)

```
{  "id": "60fa4366-f96e-42fe-a82b-f819952c6db4",  "method": "order.place",  "params": {    "apiKey": "",    "price": "50000",    "quantity": 1,    "side": "BUY",    "symbol": "BTCUSD_PERP",    "timeInForce": "GTC",    "timestamp": 1728413737111,    "type": "LIMIT",    "signature": "0f04368b2d22aafd0ggc8809ea34297eff602272917b5f01267db4efbc1c9422"	}}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)

**0**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)

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

BUY or SELL

positionSide

ENUM

NO

Default `BOTH` for One-way Mode; `LONG` or `SHORT` for Hedge Mode. It must be sent in Hedge Mode.

type

ENUM

YES

`LIMIT`, `MARKET`, `STOP`, `STOP_MARKET`, `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`, `TRAILING_STOP_MARKET`

timeInForce

ENUM

NO

quantity

DECIMAL

NO

Quantity measured by contract number, Cannot be sent with `closePosition`\=`true`

reduceOnly

STRING

NO

`true` or `false`. default `false`. Cannot be sent in Hedge Mode; cannot be sent with `closePosition`\=`true` (Close-All)

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

Used with `TRAILING_STOP_MARKET` orders, default as the latest price(supporting different workingType)

callbackRate

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, min 0.1, max 10 where 1 for 1%

workingType

ENUM

NO

stopPrice triggered by: "MARK\_PRICE", "CONTRACT\_PRICE". Default "CONTRACT\_PRICE"

priceProtect

ENUM

NO

"TRUE" or "FALSE", default "FALSE". Used with `STOP/STOP_MARKET` or `TAKE_PROFIT/TAKE_PROFIT_MARKET` orders.

newOrderRespType

ENUM

NO

`ACK`,`RESULT`, default `ACK`

priceMatch

ENUM

NO

only available for `LIMIT`/`STOP`/`TAKE_PROFIT` order; can be set to `OPPONENT`/ `OPPONENT_5`/ `OPPONENT_10`/ `OPPONENT_20`: /`QUEUE`/ `QUEUE_5`/ `QUEUE_10`/ `QUEUE_20`; Can't be passed together with `price`

selfTradePreventionMode

ENUM

NO

`NONE`: No STP / `EXPIRE_TAKER`:expire taker order when STP triggers/ `EXPIRE_MAKER`:expire taker order when STP triggers/ `EXPIRE_BOTH`:expire both orders when STP triggers; default `NONE`

recvWindow

INT

NO

timestamp

INT

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

-   Order with type `STOP`, parameter `timeInForce` can be sent ( default `GTC`).
-   Order with type `TAKE_PROFIT`, parameter `timeInForce` can be sent ( default `GTC`).
-   Condition orders will be triggered when:
    -   If parameter `priceProtect` is sent as true:
        -   when price reaches the `stopPrice`，the difference rate between "MARK\_PRICE" and "CONTRACT\_PRICE" cannot be larger than the "triggerProtect" of the symbol
        -   "triggerProtect" of a symbol can be got from `GET /dapi/v1/exchangeInfo`
    -   `STOP`, `STOP_MARKET`:
        -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `stopPrice`
        -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `stopPrice`
    -   `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`:
        -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `stopPrice`
        -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `stopPrice`
    -   `TRAILING_STOP_MARKET`:
        -   BUY: the lowest price after order placed <= `activationPrice`, and the latest price >= the lowest price \* (1 + `callbackRate`)
        -   SELL: the highest price after order placed >= `activationPrice`, and the latest price <= the highest price \* (1 - `callbackRate`)
    -   For `TRAILING_STOP_MARKET`, if you got such error code. `{"code": -2021, "msg": "Order would immediately trigger."}` means that the parameters you send do not meet the following requirements:
        -   BUY: `activationPrice` should be smaller than latest price.
        -   SELL: `activationPrice` should be larger than latest price.
    -   If `newOrderRespType` is sent as `RESULT`:
        -   `MARKET` order: the final FILLED result of the order will be return directly.
        -   `LIMIT` order with special `timeInForce`: the final status result of the order(FILLED or EXPIRED) will be returned directly.
    -   `STOP_MARKET`, `TAKE_PROFIT_MARKET` with `closePosition=true`:
        -   Follow the same rules for condition orders.
        -   If triggered，**close all** current long position(if `SELL`) or current short position(if `BUY`).
        -   Cannot be used with `quantity` parameter
        -   Cannot be used with `reduceOnly` parameter
        -   In Hedge Mode, cannot be used with `BUY` orders in `LONG` position side. and cannot be used with `SELL` orders in `SHORT` position side

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)

```
{  "id": "60fa4366-f96e-42fe-a82b-f819952c6db4",  "status": 200,  "result": {      "orderId": 333245211,      "symbol": "BTCUSD_PERP",      "pair": "BTCUSD",      "status": "NEW",      "clientOrderId": "5SztZiGFAxgAqw4J9EN9fA",      "price": "50000",      "avgPrice": "0.00",      "origQty": "1",      "executedQty": "0",      "cumQty": "0",      "cumBase": "0",      "timeInForce": "GTC",      "type": "LIMIT",      "reduceOnly": false,      "closePosition": false,      "side": "BUY",      "positionSide": "BOTH",      "stopPrice": "0",      "workingType": "CONTRACT_PRICE",      "priceProtect": false,      "origType": "LIMIT",      "updateTime": 1728413795125  },  "rateLimits": [      {          "rateLimitType": "REQUEST_WEIGHT",          "interval": "MINUTE",          "intervalNum": 1,          "limit": 2400,          "count": 6      },      {          "rateLimitType": "ORDERS",          "interval": "MINUTE",          "intervalNum": 1,          "limit": 1200,          "count": 1      }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api)
