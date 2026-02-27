---
title: "Cancel Multiple Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders"
fetched_at: "2026-01-27T05:28:30.189Z"
---
# Cancel Multiple Orders (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)

Cancel Multiple Orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)

DELETE `/fapi/v1/batchOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)

Name

Type

Mandatory

Description

symbol

STRING

YES

orderIdList

LIST<LONG>

NO

max length 10  
e.g. \[1234567,2345678\]

origClientOrderIdList

LIST<STRING>

NO

max length 10  
e.g. \["my\_id\_1","my\_id\_2"\], encode the double quotes. No space after comma.

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Either `orderIdList` or `origClientOrderIdList` must be sent.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)

```
[	{	 	"clientOrderId": "myOrder1",	 	"cumQty": "0",	 	"cumQuote": "0",	 	"executedQty": "0",	 	"orderId": 283194212,	 	"origQty": "11",	 	"origType": "TRAILING_STOP_MARKET",  		"price": "0",  		"reduceOnly": false,  		"side": "BUY",  		"positionSide": "SHORT",  		"status": "CANCELED",  		"stopPrice": "9300",				// please ignore when order type is TRAILING_STOP_MARKET  		"closePosition": false,   // if Close-All  		"symbol": "BTCUSDT",  		"timeInForce": "GTC",  		"type": "TRAILING_STOP_MARKET",  		"activatePrice": "9020",			// activation price, only return with TRAILING_STOP_MARKET order  		"priceRate": "0.3",					// callback rate, only return with TRAILING_STOP_MARKET order	 	"updateTime": 1571110484038,	 	"workingType": "CONTRACT_PRICE",	 	"priceProtect": false,            // if conditional order trigger is protected		 	"priceMatch": "NONE",              //price match mode	 	"selfTradePreventionMode": "NONE", //self trading preventation mode	 	"goodTillDate": 1693207680000      //order pre-set auot cancel time for TIF GTD order	},	{		"code": -2011,		"msg": "Unknown order sent."	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders)
