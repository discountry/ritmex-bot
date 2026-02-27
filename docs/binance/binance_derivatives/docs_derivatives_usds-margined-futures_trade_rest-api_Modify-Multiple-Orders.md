---
title: "Modify Multiple Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders"
fetched_at: "2026-01-27T05:28:30.963Z"
---
# Modify Multiple Orders(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)

Modify Multiple Orders (TRADE)

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)

PUT `/fapi/v1/batchOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)

5 on 10s order rate limit(X-MBX-ORDER-COUNT-10S); 1 on 1min order rate limit(X-MBX-ORDER-COUNT-1M); 5 on IP rate limit(x-mbx-used-weight-1m);

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)

Name

Type

Mandatory

Description

batchOrders

list<JSON>

YES

order list. Max 5 orders

recvWindow

LONG

NO

timestamp

LONG

YES

**Where `batchOrders` is the list of order parameters in JSON**

Name

Type

Mandatory

Description

orderId

LONG

NO

origClientOrderId

STRING

NO

symbol

STRING

YES

side

ENUM

YES

`SELL`, `BUY`

quantity

DECIMAL

YES

Order quantity, cannot be sent with `closePosition=true`

price

DECIMAL

YES

priceMatch

ENUM

NO

only avaliable for `LIMIT`/`STOP`/`TAKE_PROFIT` order; can be set to `OPPONENT`/ `OPPONENT_5`/ `OPPONENT_10`/ `OPPONENT_20`: /`QUEUE`/ `QUEUE_5`/ `QUEUE_10`/ `QUEUE_20`; Can't be passed together with `price`

stopPrice

DECIMAL

NO

stop price, only `STOP`, `STOP_MARKET`, `TAKE_PROFIT`, `TAKE_PROFIT_MARKET` need

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Parameter rules are same with `Modify Order`
> -   Batch modify orders are processed concurrently, and the order of matching is not guaranteed.
> -   The order of returned contents for batch modify orders is the same as the order of the order list.
> -   One order can only be modfied for less than 10000 times

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)

```
[	{		"orderId": 20072994037,		"symbol": "BTCUSDT",		"pair": "BTCUSDT",		"status": "NEW",		"clientOrderId": "LJ9R4QZDihCaS8UAOOLpgW",		"price": "30005",		"avgPrice": "0.0",		"origQty": "1",		"executedQty": "0",		"cumQty": "0",		"cumBase": "0",		"timeInForce": "GTC",		"type": "LIMIT",		"reduceOnly": false,		"closePosition": false,		"side": "BUY",		"positionSide": "LONG",		"stopPrice": "0",		"workingType": "CONTRACT_PRICE",		"priceProtect": false,		"origType": "LIMIT",        "priceMatch": "NONE",              //price match mode        "selfTradePreventionMode": "NONE", //self trading preventation mode        "goodTillDate": 0,                 //order pre-set auot cancel time for TIF GTD order		"updateTime": 1629182711600	},	{		"code": -2022, 		"msg": "ReduceOnly Order is rejected."	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Multiple-Orders)
