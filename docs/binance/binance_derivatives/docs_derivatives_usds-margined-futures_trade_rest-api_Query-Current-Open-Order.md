---
title: "Query Current Open Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order"
fetched_at: "2026-01-27T05:28:31.660Z"
---
# Query Current Open Order (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)

Query open order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)

GET `/fapi/v1/openOrder`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)

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

> -   Either`orderId` or `origClientOrderId` must be sent
> -   If the queried order has been filled or cancelled, the error message "Order does not exist" will be returned.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)

```
{  	"avgPrice": "0.00000",				  	"clientOrderId": "abc",				  	"cumQuote": "0",						  	"executedQty": "0",					  	"orderId": 1917641,					  	"origQty": "0.40",						  	"origType": "TRAILING_STOP_MARKET",  	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",  	"status": "NEW",  	"stopPrice": "9300",				// please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,   			// if Close-All  	"symbol": "BTCUSDT",  	"time": 1579276756075,				// order time  	"timeInForce": "GTC",  	"type": "TRAILING_STOP_MARKET",  	"activatePrice": "9020",			// activation price, only return with TRAILING_STOP_MARKET order  	"priceRate": "0.3",					// callback rate, only return with TRAILING_STOP_MARKET order						  	"updateTime": 1579276756075,		  	"workingType": "CONTRACT_PRICE",  	"priceProtect": false,            // if conditional order trigger is protected		"priceMatch": "NONE",              //price match mode    "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 0      //order pre-set auot cancel time for TIF GTD order}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order)
