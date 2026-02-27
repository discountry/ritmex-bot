---
title: "Query Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order"
fetched_at: "2026-01-27T05:28:06.284Z"
---
# Query Order (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)

Check an order's status.

-   These orders will not be found:
    -   order status is `CANCELED` or `EXPIRED` **AND** order has NO filled trade **AND** created time + 3 days < current time
    -   order create time + 90 days < current time

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)

`order.status`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)

```
{    "id": "0ce5d070-a5e5-4ff2-b57f-1556741a4204",    "method": "order.status",    "params": {        "apiKey": "HMOchcfii9ZRZnhjp2XjGXhsOBd6msAhKz9joQaWwZ7arcJTlD2hGPHQj1lGdTjR",        "orderId": 328999071,        "symbol": "BTCUSD_PERP",        "timestamp": 1703441060152,        "signature": "ba48184fc38a71d03d2b5435bd67c1206e3191e989fe99bda1bc643a880dfdbf"    }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)

Name

Type

Mandatory

Description

symbol

STRING

YES

orderId

LONG

NO

origClientOrderId

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

Notes:

> -   Either `orderId` or `origClientOrderId` must be sent.
> -   `orderId` is self-increment for each specific `symbol`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)

```
{    "id": "0ce5d070-a5e5-4ff2-b57f-1556741a4204",    "status": 200,    "result": {        "orderId": 328999071,        "symbol": "BTCUSD_PERP",        "pair": "BTCUSD",        "status": "NEW",        "clientOrderId": "ArY8Ng1rln0s9x3fclmAHy",        "price": "58000",        "avgPrice": "0.00",        "origQty": "1",        "executedQty": "0",        "cumBase": "0",        "timeInForce": "GTC",        "type": "LIMIT",        "reduceOnly": false,        "closePosition": false,        "side": "BUY",        "positionSide": "LONG",        "stopPrice": "0",        "workingType": "CONTRACT_PRICE",        "priceProtect": false,        "origType": "LIMIT",        "selfTradePreventionMode": "EXPIRE_TAKER",        "time": 1733740063619,        "updateTime": 1733740063619,        "priceMatch": "NONE"    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 2400,            "count": 6        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Query-Order)
