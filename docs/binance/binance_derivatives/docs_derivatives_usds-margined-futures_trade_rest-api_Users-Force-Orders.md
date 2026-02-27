---
title: "Query Users Force Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders"
fetched_at: "2026-01-27T05:28:31.799Z"
---
# User's Force Orders (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)

Query user's Force Orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)

GET `/fapi/v1/forceOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)

**20** with symbol, **50** without symbol

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)

Name

Type

Mandatory

Description

symbol

STRING

NO

autoCloseType

ENUM

NO

"LIQUIDATION" for liquidation orders, "ADL" for ADL orders.

startTime

LONG

NO

endTime

LONG

NO

limit

INT

NO

Default 50; max 100.

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If "autoCloseType" is not sent, orders with both of the types will be returned
> -   If "startTime" is not sent, data within 7 days before "endTime" can be queried

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)

```
[  {  	"orderId": 6071832819,   	"symbol": "BTCUSDT",   	"status": "FILLED",   	"clientOrderId": "autoclose-1596107620040000020",   	"price": "10871.09",   	"avgPrice": "10913.21000",   	"origQty": "0.001",   	"executedQty": "0.001",   	"cumQuote": "10.91321",   	"timeInForce": "IOC",   	"type": "LIMIT",   	"reduceOnly": false,   	"closePosition": false,   	"side": "SELL",   	"positionSide": "BOTH",   	"stopPrice": "0",   	"workingType": "CONTRACT_PRICE",   	"origType": "LIMIT",   	"time": 1596107620044,   	"updateTime": 1596107620087  }  {   	"orderId": 6072734303,    	"symbol": "BTCUSDT",    	"status": "FILLED",    	"clientOrderId": "adl_autoclose",    	"price": "11023.14",    	"avgPrice": "10979.82000",    	"origQty": "0.001",    	"executedQty": "0.001",    	"cumQuote": "10.97982",    	"timeInForce": "GTC",    	"type": "LIMIT",    	"reduceOnly": false,    	"closePosition": false,    	"side": "BUY",    	"positionSide": "SHORT",    	"stopPrice": "0",    	"workingType": "CONTRACT_PRICE",    	"origType": "LIMIT",    	"time": 1596110725059,    	"updateTime": 1596110725071  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders)
