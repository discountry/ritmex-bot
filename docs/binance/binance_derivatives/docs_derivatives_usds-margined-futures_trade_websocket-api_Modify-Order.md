---
title: "Modify Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order"
fetched_at: "2026-01-27T05:28:32.436Z"
---
# Modify Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)

Order modify function, currently only LIMIT order modification is supported, modified orders will be reordered in the match queue

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)

`order.modify`

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)

```
{    "id": "c8c271ba-de70-479e-870c-e64951c753d9",    "method": "order.modify",    "params": {        "apiKey": "HMOchcfiT9ZRZnhjp2XjGXhsOBd6msAhKz9joQaWwZ7arcJTlD2hGPHQj1lGdTjR",        "orderId": 328971409,        "origType": "LIMIT",        "positionSide": "SHORT",        "price": "43769.1",        "priceMatch": "NONE",        "quantity": "0.11",        "side": "SELL",        "symbol": "BTCUSDT",        "timestamp": 1703426755754,        "signature": "d30c9f0736a307f5a9988d4a40b688662d18324b17367d51421da5484e835923"    }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)

1 on 10s order rate limit(X-MBX-ORDER-COUNT-10S); 1 on 1min order rate limit(X-MBX-ORDER-COUNT-1M); 0 on IP rate limit(x-mbx-used-weight-1m)

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)

```
{    "id": "c8c271ba-de70-479e-870c-e64951c753d9",    "status": 200,    "result": {        "orderId": 328971409,        "symbol": "BTCUSDT",        "status": "NEW",        "clientOrderId": "xGHfltUMExx0TbQstQQfRX",        "price": "43769.10",        "avgPrice": "0.00",        "origQty": "0.110",        "executedQty": "0.000",        "cumQty": "0.000",        "cumQuote": "0.00000",        "timeInForce": "GTC",        "type": "LIMIT",        "reduceOnly": false,        "closePosition": false,        "side": "SELL",        "positionSide": "SHORT",        "stopPrice": "0.00",        "workingType": "CONTRACT_PRICE",        "priceProtect": false,        "origType": "LIMIT",        "priceMatch": "NONE",        "selfTradePreventionMode": "NONE",        "goodTillDate": 0,        "updateTime": 1703426756190    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 300,            "count": 1        },        {            "rateLimitType": "ORDERS",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 1200,            "count": 1        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 2400,            "count": 1        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Modify-Order)
