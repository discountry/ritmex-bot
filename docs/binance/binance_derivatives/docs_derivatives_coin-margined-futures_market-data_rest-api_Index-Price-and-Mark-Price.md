---
title: "Index Price And Mark Price | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price"
fetched_at: "2026-01-27T05:28:03.276Z"
---
# Index Price and Mark Price

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)

Query index price and mark price

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)

GET `/dapi/v1/premiumIndex`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)

**10**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)

Name

Type

Mandatory

Description

symbol

STRING

NO

pair

STRING

NO

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)

> with symbol

```
[	{		"symbol": "BTCUSD_PERP",  		"pair": "BTCUSD",  		"markPrice": "11029.69574559",	// mark price  		"indexPrice": "10979.14437500",	// index price  		"estimatedSettlePrice": "10981.74168236",  // Estimated Settle Price, only useful in the last hour before the settlement starts.  		"lastFundingRate": "0.00071003",	 // the lasted funding rate, for perpetual contract symbols only. For delivery symbols, "" will be shown.  		"interestRate": "0.00010000",		// the base asset interest rate, for perpetual contract symbols only. For delivery symbols, "" will be shown.  		"nextFundingTime": 1596096000000,	 // For perpetual contract symbols only. For delivery symbols, 0 will be shown  		"time": 1596094042000  	}, 	{ 		"symbol": "BTCUSD_200925",	 		"pair": "BTCUSD",  		"markPrice": "12077.01343750",  		"indexPrice": "10979.10312500",  		"estimatedSettlePrice": "10981.74168236",  		"lastFundingRate": "",  		"interestRate": "",	  		"nextFundingTime": 0,  		"time": 1596094042000  	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price)
