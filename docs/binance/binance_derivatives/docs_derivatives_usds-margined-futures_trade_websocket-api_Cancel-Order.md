---
title: "Cancel Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order"
fetched_at: "2026-01-27T05:28:32.079Z"
---
# Cancel Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)

Cancel an active order.

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)

`order.cancel`

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)

```
{   	"id": "5633b6a2-90a9-4192-83e7-925c90b6a2fd",    "method": "order.cancel",     "params": {       "apiKey": "HsOehcfih8ZRxnhjp2XjGXhsOBd6msAhKz9joQaWwZ7arcJTlD2hGOGQj1lGdTjR",       "orderId": 283194212,       "symbol": "BTCUSDT",       "timestamp": 1703439070722,       "signature": "b09c49815b4e3f1f6098cd9fbe26a933a9af79803deaaaae03c29f719c08a8a8"     }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)

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

> -   Either `orderId` or `origClientOrderId` must be sent.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)

```
{  "id": "5633b6a2-90a9-4192-83e7-925c90b6a2fd",  "status": 200,  "result": {    "clientOrderId": "myOrder1",    "cumQty": "0",    "cumQuote": "0",    "executedQty": "0",    "orderId": 283194212,    "origQty": "11",    "origType": "TRAILING_STOP_MARKET",    "price": "0",    "reduceOnly": false,    "side": "BUY",    "positionSide": "SHORT",    "status": "CANCELED",    "stopPrice": "9300",                    "closePosition": false,      "symbol": "BTCUSDT",    "timeInForce": "GTC",    "type": "TRAILING_STOP_MARKET",    "activatePrice": "9020",                "priceRate": "0.3",                    "updateTime": 1571110484038,    "workingType": "CONTRACT_PRICE",    "priceProtect": false,               "priceMatch": "NONE",                  "selfTradePreventionMode": "NONE",    "goodTillDate": 0                   },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 1    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Cancel-Order)
