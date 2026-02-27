---
title: "Account Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information"
fetched_at: "2026-01-27T05:28:00.542Z"
---
# Account Information (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)

Get current account information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)

GET `/dapi/v1/account`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

> -   for One-way Mode user, the "positions" will only show the "BOTH" positions
> -   for Hedge Mode user, the "positions" will show "BOTH", "LONG", and "SHORT" positions.

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)

```
{	"assets": [		{			"asset": "BTC",  // asset name    			"walletBalance": "0.00241969",  // total wallet balance   			"unrealizedProfit": "0.00000000",  // unrealized profit or loss   			"marginBalance": "0.00241969",  // margin balance   			"maintMargin": "0.00000000",	// maintenance margin   			"initialMargin": "0.00000000",  // total intial margin required with the latest mark price   			"positionInitialMargin": "0.00000000",  // positions" margin required with the latest mark price   			"openOrderInitialMargin": "0.00000000",  // open orders" intial margin required with the latest mark price   			"maxWithdrawAmount": "0.00241969",  // available amount for transfer out   			"crossWalletBalance": "0.00241969",  // wallet balance for crossed margin   			"crossUnPnl": "0.00000000",  // total unrealized profit or loss of crossed positions   			"availableBalance": "0.00241969", // available margin balance			"updateTime": 1625474304765 //update time   		}	 ],	 "positions": [		 {		 	"symbol": "BTCUSD_201225",		 	"positionAmt":"0",	// position amount   			"initialMargin": "0",   			"maintMargin": "0",   			"unrealizedProfit": "0.00000000",   			"positionInitialMargin": "0",   			"openOrderInitialMargin": "0",   			"leverage": "125",   			"isolated": false,   			"positionSide": "BOTH", // BOTH means that it is the position of One-way Mode     			"entryPrice": "0.0",   			"breakEvenPrice": "0.0",  // break-even price   			"maxQty": "50",  // maximum quantity of base asset   			"updateTime": 0   		},  		{  			"symbol": "BTCUSD_201225",		 	"positionAmt":"0",   			"initialMargin": "0",   			"maintMargin": "0",   			"unrealizedProfit": "0.00000000",   			"positionInitialMargin": "0",   			"openOrderInitialMargin": "0",   			"leverage": "125",   			"isolated": false,   			"positionSide": "LONG",  // LONG or SHORT means that it is the position of Hedge Mode    			"entryPrice": "0.0",   			"breakEvenPrice": "0.0",  // break-even price   			"maxQty": "50",   			"updateTime": 0   		},  		{  			"symbol": "BTCUSD_201225",		 	"positionAmt":"0",   			"initialMargin": "0",   			"maintMargin": "0",   			"unrealizedProfit": "0.00000000",   			"positionInitialMargin": "0",   			"openOrderInitialMargin": "0",   			"leverage": "125",   			"isolated": false,   			"positionSide": "SHORT",  // LONG or SHORT means that it is the position of Hedge Mode    			"entryPrice": "0.0",   			"breakEvenPrice": "0.0",  // break-even price   			"maxQty": "50",			"notionalValue": "0",   			"updateTime":1627026881327   		}	 ],	 "canDeposit": true,	 "canTrade": true,	 "canWithdraw": true,	 "feeTier": 2,	 "updateTime": 0}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Account-Information)
