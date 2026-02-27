---
title: "New Um Conditional Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order"
fetched_at: "2026-01-27T05:28:21.207Z"
---
# New UM Conditional Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)

Place new UM conditional order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)

POST `/papi/v1/um/conditional/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)

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

strategyType

ENUM

YES

"STOP", "STOP\_MARKET", "TAKE\_PROFIT", "TAKE\_PROFIT\_MARKET", and "TRAILING\_STOP\_MARKET"

timeInForce

ENUM

NO

quantity

DECIMAL

NO

reduceOnly

STRING

NO

"true" or "false". default "false". Cannot be sent in Hedge Mode ; cannot be sent with `closePosition`\=`true`

price

DECIMAL

NO

workingType

ENUM

NO

stopPrice triggered by: "MARK\_PRICE", "CONTRACT\_PRICE". Default "CONTRACT\_PRICE"

priceProtect

STRING

NO

"TRUE" or "FALSE", default "FALSE". Used with `STOP/STOP_MARKET` or `TAKE_PROFIT/TAKE_PROFIT_MARKET` orders

newClientStrategyId

STRING

NO

A unique id among open orders. Automatically generated if not sent. Can only be string following the rule: `^[\.A-Z\:/a-z0-9_-]{1,32}$`

stopPrice

DECIMAL

NO

Used with `STOP/STOP_MARKET` or `TAKE_PROFIT/TAKE_PROFIT_MARKET` orders.

activationPrice

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, default as the mark price

callbackRate

DECIMAL

NO

Used with `TRAILING_STOP_MARKET` orders, min 0.1, max 5 where 1 for 1%

priceMatch

ENUM

NO

only avaliable for `LIMIT`/`STOP`/`TAKE_PROFIT` order; can be set to `OPPONENT`/ `OPPONENT_5`/ `OPPONENT_10`/ `OPPONENT_20`: /`QUEUE`/ `QUEUE_5`/ `QUEUE_10`/ `QUEUE_20`; Can't be passed together with `price`

selfTradePreventionMode

ENUM

NO

`NONE`:No STP / `EXPIRE_TAKER`:expire taker order when STP triggers/ `EXPIRE_MAKER`:expire taker order when STP triggers/ `EXPIRE_BOTH`:expire both orders when STP triggers

goodTillDate

LONG

NO

order cancel time for timeInForce `GTD`, mandatory when `timeInforce` set to `GTD`; order the timestamp only retains second-level precision, ms part will be ignored; The goodTillDate timestamp must be greater than the current time plus 600 seconds and smaller than 253402300799000Mode. It must be sent in Hedge Mode.

recvWindow

LONG

NO

timestamp

LONG

YES

Additional mandatory parameters based on type:

Type

Additional mandatory parameters

`STOP/TAKE_PROFIT`

`quantity`, `price`, `stopPrice`

`STOP_MARKET/TAKE_PROFIT_MARKET`

`stopPrice`

`TRAILING_STOP_MARKET`

`callbackRate`

-   Order with type `STOP/TAKE_PROFIT`, parameter `timeInForce` can be sent ( default `GTC`).
    
-   Condition orders will be triggered when:
    
    -   `STOP`, `STOP_MARKET`:
        -   BUY: "MARK\_PRICE" >= `stopPrice`
        -   SELL: "MARK\_PRICE" <= `stopPrice`
    -   `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`:
        -   BUY: "MARK\_PRICE" <= `stopPrice`
        -   SELL: "MARK\_PRICE" >= `stopPrice`
    -   `TRAILING_STOP_MARKET`:
        -   BUY: the lowest mark price after order placed `<=` activationPrice`, and the latest mark price >`\= the lowest mark price \* (1 + `callbackRate`)
        -   SELL: the highest mark price after order placed >= `activationPrice`, and the latest mark price <= the highest mark price \* (1 - `callbackRate`)
-   For `TRAILING_STOP_MARKET`, if you got such error code. `{"code": -2021, "msg": "Order would immediately trigger."}` means that the parameters you send do not meet the following requirements:
    
    -   BUY: `activationPrice` should be smaller than latest mark price.
    -   SELL: `activationPrice` should be larger than latest mark price.
-   Condition orders will be triggered when:
    
    -   If parameter`priceProtect`is sent as true:
        -   when price reaches the `stopPrice` ，the difference rate between "MARK\_PRICE" and "CONTRACT\_PRICE" cannot be larger than the "triggerProtect" of the symbol
        -   "triggerProtect" of a symbol can be got from `GET /fapi/v1/exchangeInfo`
    -   `STOP`, `STOP_MARKET`:
        -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `stopPrice`
        -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `stopPrice`
    -   `TAKE_PROFIT`, `TAKE_PROFIT_MARKET`:
        -   BUY: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") <= `stopPrice`
        -   SELL: latest price ("MARK\_PRICE" or "CONTRACT\_PRICE") >= `stopPrice`
-   `selfTradePreventionMode` is only effective when `timeInForce` set to `IOC` or `GTC` or `GTD`.
    
-   In extreme market conditions, timeInForce `GTD` order auto cancel time might be delayed comparing to `goodTillDate`
    

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)

```
{    "newClientStrategyId": "testOrder",    "strategyId":123445,    "strategyStatus":"NEW",    "strategyType": "TRAILING_STOP_MARKET",     "origQty": "10",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "stopPrice": "9300",        // please ignore when order type is TRAILING_STOP_MARKET    "symbol": "BTCUSDT",    "timeInForce": "GTD",    "activatePrice": "9020",    // activation price, only return with TRAILING_STOP_MARKET order    "priceRate": "0.3",         // callback rate, only return with TRAILING_STOP_MARKET order    "bookTime": 1566818724710,  // order place time    "updateTime": 1566818724722    "workingType":"CONTRACT_PRICE",    "priceProtect": false,    "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 1693207680000,      //order pre-set auot cancel time for TIF GTD order     "priceMatch": "NONE"  }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order)
