---
title: "Query Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order"
fetched_at: "2026-01-27T05:28:05.913Z"
---
# Query Order (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)

Check an order's status.

-   These orders will not be found:
    -   order status is CANCELED or EXPIRED AND order has NO filled trade AND created time + 3 days < current time
    -   order create time + 90 days < current time

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)

GET `/dapi/v1/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)

```
{  	"avgPrice": "0.0",  	"clientOrderId": "abc",  	"cumBase": "0",  	"executedQty": "0",  	"orderId": 1917641,  	"origQty": "0.40",  	"origType": "TRAILING_STOP_MARKET",  	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",  	"status": "NEW",  	"stopPrice": "9300",				// please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,   			// if Close-All  	"symbol": "BTCUSD_200925",  	"pair": "BTCUSD",  	"time": 1579276756075,				// order time  	"timeInForce": "GTC",  	"type": "TRAILING_STOP_MARKET",  	"activatePrice": "9020",			// activation price, only return with TRAILING_STOP_MARKET order  	"priceRate": "0.3",					// callback rate, only return with TRAILING_STOP_MARKET order  	"updateTime": 1579276756075,		// update time  	"workingType": "CONTRACT_PRICE",  	"priceProtect": false,              // if conditional order trigger is protected  	"priceMatch": "NONE",               //price match mode  	"selfTradePreventionMode": "NONE"   //self trading preventation mode}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Query-Order)
