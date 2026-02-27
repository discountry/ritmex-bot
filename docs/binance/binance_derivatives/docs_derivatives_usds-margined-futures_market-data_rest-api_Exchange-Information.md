---
title: "Exchange Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information"
fetched_at: "2026-01-27T05:28:27.572Z"
---
# Exchange Information

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)

Current exchange trading rules and symbol information

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)

GET `/fapi/v1/exchangeInfo`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)

NONE

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)

```
{	"exchangeFilters": [], 	"rateLimits": [ 		{ 			"interval": "MINUTE",   			"intervalNum": 1,   			"limit": 2400,   			"rateLimitType": "REQUEST_WEIGHT"    		},  		{  			"interval": "MINUTE",   			"intervalNum": 1,   			"limit": 1200,   			"rateLimitType": "ORDERS"   		}   	], 	"serverTime": 1565613908500,    // Ignore please. If you want to check current server time, please check via "GET /fapi/v1/time" 	"assets": [ // assets information 		{ 			"asset": "BTC",   			"marginAvailable": true, // whether the asset can be used as margin in Multi-Assets mode   			"autoAssetExchange": "-0.10" // auto-exchange threshold in Multi-Assets margin mode   		}, 		{ 			"asset": "USDT",   			"marginAvailable": true,   			"autoAssetExchange": "0"   		}, 		{ 			"asset": "BNB",   			"marginAvailable": false,   			"autoAssetExchange": null   		}   	], 	"symbols": [ 		{ 			"symbol": "BLZUSDT", 			"pair": "BLZUSDT", 			"contractType": "PERPETUAL", 			"deliveryDate": 4133404800000, 			"onboardDate": 1598252400000, 			"status": "TRADING", 			"maintMarginPercent": "2.5000",   // ignore 			"requiredMarginPercent": "5.0000",  // ignore 			"baseAsset": "BLZ",  			"quoteAsset": "USDT", 			"marginAsset": "USDT", 			"pricePrecision": 5,	// please do not use it as tickSize 			"quantityPrecision": 0, // please do not use it as stepSize 			"baseAssetPrecision": 8, 			"quotePrecision": 8,  			"underlyingType": "COIN", 			"underlyingSubType": ["STORAGE"], 			"settlePlan": 0, 			"triggerProtect": "0.15", // threshold for algo order with "priceProtect" 			"filters": [ 				{ 					"filterType": "PRICE_FILTER",     				"maxPrice": "300",     				"minPrice": "0.0001",      				"tickSize": "0.0001"     			},    			{    				"filterType": "LOT_SIZE",      				"maxQty": "10000000",     				"minQty": "1",     				"stepSize": "1"     			},    			{    				"filterType": "MARKET_LOT_SIZE",     				"maxQty": "590119",     				"minQty": "1",     				"stepSize": "1"     			},     			{    				"filterType": "MAX_NUM_ORDERS",    				"limit": 200  				},  				{  					"filterType": "MIN_NOTIONAL",  					"notional": "5.0",   				},  				{    				"filterType": "PERCENT_PRICE",    				"multiplierUp": "1.1500",    				"multiplierDown": "0.8500",    				"multiplierDecimal": "4"    			}   			], 			"OrderType": [   				"LIMIT",   				"MARKET",   				"STOP",   				"STOP_MARKET",   				"TAKE_PROFIT",   				"TAKE_PROFIT_MARKET",   				"TRAILING_STOP_MARKET"    			],   			"timeInForce": [   				"GTC",    				"IOC",    				"FOK",    				"GTX"  			], 			"liquidationFee": "0.010000",	// liquidation fee rate   			"marketTakeBound": "0.30",	// the max price difference rate( from mark price) a market order can make 		}   	],	"timezone": "UTC" }
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information)
