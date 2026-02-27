---
title: "Modify Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order"
fetched_at: "2026-01-27T05:28:06.318Z"
---
# Modify Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)

Order modify function, currently only LIMIT order modification is supported, modified orders will be reordered in the match queue

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)

`order.modify`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)

```
{  "id": "88601d02-bd0d-430d-8733-2708a569ebda",  "method": "order.modify",  "params": {    "apiKey": "",    "orderId": 333245211,    "price": "51000",    "quantity": 1,    "side": "BUY",    "symbol": "BTCUSD_PERP",    "timestamp": 1728415697189,    "signature": "0f04368b2d22aafd0ggc8809ea34297eff602272917b5f01267db4efbc1c9422"   }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)

1 on 10s order rate limit(X-MBX-ORDER-COUNT-10S); 1 on 1min order rate limit(X-MBX-ORDER-COUNT-1M); 1 on IP rate limit(x-mbx-used-weight-1m)

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)

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

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Either `orderId` or `origClientOrderId` must be sent, and the `orderId` will prevail if both are sent.
> -   Both `quantity` and `price` must be sent, which is different from dapi modify order endpoint.
> -   When the new `quantity` or `price` doesn't satisfy PRICE\_FILTER / PERCENT\_FILTER / LOT\_SIZE, amendment will be rejected and the order will stay as it is.
> -   However the order will be cancelled by the amendment in the following situations:
>     -   when the order is in partially filled status and the new `quantity` <= `executedQty`
>     -   When the order is `GTX` and the new price will cause it to be executed immediately
> -   One order can only be modfied for less than 10000 times

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)

```
{  "id": "88601d02-bd0d-430d-8733-2708a569ebda",  "status": 200,  "result": {      "orderId": 333245211,      "symbol": "BTCUSD_PERP",      "pair": "BTCUSD",      "status": "NEW",      "clientOrderId": "5SztZiGFAxgAqw4J9EN9fA",      "price": "51000",      "avgPrice": "0.00",      "origQty": "1",      "executedQty": "0",      "cumQty": "0",      "cumBase": "0",      "timeInForce": "GTC",      "type": "LIMIT",      "reduceOnly": false,      "closePosition": false,      "side": "BUY",      "positionSide": "BOTH",      "stopPrice": "0",      "workingType": "CONTRACT_PRICE",      "priceProtect": false,      "origType": "LIMIT",      "updateTime": 1728415765493  },  "rateLimits": [      {          "rateLimitType": "REQUEST_WEIGHT",          "interval": "MINUTE",          "intervalNum": 1,          "limit": 2400,          "count": 6      },      {          "rateLimitType": "ORDERS",          "interval": "MINUTE",          "intervalNum": 1,          "limit": 1200,          "count": 1      }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Modify-Order)
