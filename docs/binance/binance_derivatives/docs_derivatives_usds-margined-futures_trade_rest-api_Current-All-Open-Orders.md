---
title: "Query Current All Open Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders"
fetched_at: "2026-01-27T05:28:30.646Z"
---
# Current All Open Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)

Get all open orders on a symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)

GET `/fapi/v1/openOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)

**1** for a single symbol; **40** when the symbol parameter is omitted

**Careful** when accessing this with no symbol.

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)

Name

Type

Mandatory

Description

symbol

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If the symbol is not sent, orders for all symbols will be returned in an array.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)

```
[  {  	"avgPrice": "0.00000",  	"clientOrderId": "abc",  	"cumQuote": "0",  	"executedQty": "0",  	"orderId": 1917641,  	"origQty": "0.40",  	"origType": "TRAILING_STOP_MARKET",  	"price": "0",  	"reduceOnly": false,  	"side": "BUY",  	"positionSide": "SHORT",  	"status": "NEW",  	"stopPrice": "9300",				// please ignore when order type is TRAILING_STOP_MARKET  	"closePosition": false,   // if Close-All  	"symbol": "BTCUSDT",  	"time": 1579276756075,				// order time  	"timeInForce": "GTC",  	"type": "TRAILING_STOP_MARKET",  	"activatePrice": "9020",			// activation price, only return with TRAILING_STOP_MARKET order  	"priceRate": "0.3",					// callback rate, only return with TRAILING_STOP_MARKET order  	"updateTime": 1579276756075,		// update time  	"workingType": "CONTRACT_PRICE",  	"priceProtect": false,            // if conditional order trigger is protected		"priceMatch": "NONE",              //price match mode    "selfTradePreventionMode": "NONE", //self trading preventation mode    "goodTillDate": 0      //order pre-set auot cancel time for TIF GTD order  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders)
