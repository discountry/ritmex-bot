---
title: "Cancel Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order"
fetched_at: "2026-01-27T05:28:30.347Z"
---
# Cancel Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)

Cancel an active order.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)

DELETE `/fapi/v1/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)

```
{ 	"clientOrderId": "myOrder1", 	"cumQty": "0", 	"cumQuote": "0", 	"executedQty": "0", 	"orderId": 283194212, 	"origQty": "11", 	"origType": "TRAILING_STOP_MARKET",  	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",  	"status": "CANCELED",  	"stopPrice": "9300",				// please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,   // if Close-All  	"symbol": "BTCUSDT",  	"timeInForce": "GTC",  	"type": "TRAILING_STOP_MARKET",  	"activatePrice": "9020",			// activation price, only return with TRAILING_STOP_MARKET order  	"priceRate": "0.3",					// callback rate, only return with TRAILING_STOP_MARKET order 	"updateTime": 1571110484038, 	"workingType": "CONTRACT_PRICE", 	"priceProtect": false,            // if conditional order trigger is protected		"priceMatch": "NONE",              //price match mode	"selfTradePreventionMode": "NONE", //self trading preventation mode	"goodTillDate": 1693207680000      //order pre-set auot cancel time for TIF GTD order}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order)
