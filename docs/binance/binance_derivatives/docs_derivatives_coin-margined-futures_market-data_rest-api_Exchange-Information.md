---
title: "Exchange Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information"
fetched_at: "2026-01-27T05:28:03.009Z"
---
# Exchange Information

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)

Current exchange trading rules and symbol information

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)

GET `/dapi/v1/exchangeInfo`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)

1

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)

NONE

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)

```
{	"exchangeFilters": [], 	"rateLimits": [  		{ 			"interval": "MINUTE",    			"intervalNum": 1,    			"limit": 6000,    			"rateLimitType": "REQUEST_WEIGHT"    		},  		{  			"interval": "MINUTE",   			"intervalNum": 1,   			"limit": 6000,   			"rateLimitType": "ORDERS"   		}   	], 	"serverTime": 1565613908500, // Ignore please. If you want to check current server time, please check via "GET /dapi/v1/time" 	"symbols": [ // contract symbols 		{ 			"filters": [ 				{ 					"filterType": "PRICE_FILTER",      				"maxPrice": "100000",      				"minPrice": "0.1",      				"tickSize": "0.1"      			},    			{    				"filterType": "LOT_SIZE",      				"maxQty": "100000",      				"minQty": "1",      				"stepSize": "1"      			},    			{    				"filterType": "MARKET_LOT_SIZE",      				"maxQty": "100000",      				"minQty": "1",      				"stepSize": "1"      			},     			{    				"filterType": "MAX_NUM_ORDERS",     				"limit": 200  				},  				{    				"filterType": "PERCENT_PRICE",     				"multiplierUp": "1.0500",     				"multiplierDown": "0.9500",     				"multiplierDecimal": "4"  				}    		],   			"OrderType": [    				"LIMIT",    				"MARKET",    				"STOP",   				"TAKE_PROFIT",   				"TRAILING_STOP_MARKET"   			],   			"timeInForce": [   				"GTC",   				"IOC",   				"FOK",   				"GTX"   			],   			"liquidationFee": "0.010000",	// liquidation fee rate   			"marketTakeBound": "0.30",	// the max price difference rate( from mark price) a market order can make   			"symbol": "BTCUSD_200925", // contract symbol name   			"pair": "BTCUSD",  // underlying symbol   			"contractType": "CURRENT_QUARTER",    			"deliveryDate": 1601020800000,   			"onboardDate": 1590739200000,   			"contractStatus": "TRADING",    			"contractSize": 100,       			"quoteAsset": "USD",   			"baseAsset": "BTC",      			"marginAsset": "BTC",   			"pricePrecision": 1,	// please do not use it as tickSize		   	"quantityPrecision": 0,	// please do not use it as stepSize		   	"baseAssetPrecision": 8,		   	"quotePrecision": 8,		   	"equalQtyPrecision": 4,	 // ignore		   	"triggerProtect": "0.0500",	// threshold for algo order with "priceProtect"		   	"maintMarginPercent": "2.5000",  // ignore		   	"requiredMarginPercent": "5.0000",  // ignore		   	"underlyingType": "COIN", 		   	"underlyingSubType": []	   		}   	],	"timezone": "UTC"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Exchange-Information)
