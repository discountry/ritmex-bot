---
title: "Account Information V3 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3"
fetched_at: "2026-01-27T05:28:24.690Z"
---
# Account Information V3(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)

Get current account information. User in single-asset/ multi-assets mode will see different value, see comments in response section for detail.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)

GET `/fapi/v3/account`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)

> single-asset mode

```
{   	"totalInitialMargin": "0.00000000",            // total initial margin required with current mark price (useless with isolated positions), only for USDT asset	"totalMaintMargin": "0.00000000",  	           // total maintenance margin required, only for USDT asset	"totalWalletBalance": "103.12345678",           // total wallet balance, only for USDT asset	"totalUnrealizedProfit": "0.00000000",         // total unrealized profit, only for USDT asset	"totalMarginBalance": "103.12345678",           // total margin balance, only for USDT asset	"totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset	"totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset	"totalCrossWalletBalance": "103.12345678",      // crossed wallet balance, only for USDT asset	"totalCrossUnPnl": "0.00000000",	           // unrealized profit of crossed positions, only for USDT asset	"availableBalance": "103.12345678",             // available balance, only for USDT asset	"maxWithdrawAmount": "103.12345678"             // maximum amount for transfer out, only for USDT asset	"assets": [ // For assets that are quote assets, USDT/USDC/BTC		{			"asset": "USDT",			            // asset name			"walletBalance": "23.72469206",         // wallet balance			"unrealizedProfit": "0.00000000",       // unrealized profit			"marginBalance": "23.72469206",         // margin balance			"maintMargin": "0.00000000",	        // maintenance margin required			"initialMargin": "0.00000000",          // total initial margin required with current mark price 			"positionInitialMargin": "0.00000000",  // initial margin required for positions with current mark price			"openOrderInitialMargin": "0.00000000", // initial margin required for open orders with current mark price			"crossWalletBalance": "23.72469206",    // crossed wallet balance			"crossUnPnl": "0.00000000"              // unrealized profit of crossed positions			"availableBalance": "23.72469206",      // available balance			"maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out			"updateTime": 1625474304765             // last update time 		},    		{			"asset": "USDC",			            // asset name			"walletBalance": "103.12345678",         // wallet balance			"unrealizedProfit": "0.00000000",       // unrealized profit			"marginBalance": "103.12345678",         // margin balance			"maintMargin": "0.00000000",	        // maintenance margin required			"initialMargin": "0.00000000",          // total initial margin required with current mark price 			"positionInitialMargin": "0.00000000",  // initial margin required for positions with current mark price			"openOrderInitialMargin": "0.00000000", // initial margin required for open orders with current mark price			"crossWalletBalance": "103.12345678",    // crossed wallet balance			"crossUnPnl": "0.00000000"              // unrealized profit of crossed positions			"availableBalance": "126.72469206",      // available balance			"maxWithdrawAmount": "103.12345678",     // maximum amount for transfer out			"updateTime": 1625474304765             // last update time 		},        ],	"positions": [  // positions of all symbols user had position/ open orders are returned		            // only "BOTH" positions will be returned with One-way mode		            // only "LONG" and "SHORT" positions will be returned with Hedge mode   	  {           "symbol": "BTCUSDT",              "positionSide": "BOTH",            // position side            "positionAmt": "1.000",             "unrealizedProfit": "0.00000000",  // unrealized profit                 "isolatedMargin": "0.00000000",	           "notional": "0",           "isolatedWallet": "0",           "initialMargin": "0",              // initial margin required with current mark price            "maintMargin": "0",                // maintenance margin required           "updateTime": 0  	  } 	]}
```

> OR multi-assets mode

```
{   	"totalInitialMargin": "0.00000000",            // the sum of USD value of all cross positions/open order initial margin	"totalMaintMargin": "0.00000000",  	           // the sum of USD value of all cross positions maintenance margin	"totalWalletBalance": "126.72469206",          // total wallet balance in USD	"totalUnrealizedProfit": "0.00000000",         // total unrealized profit in USD	"totalMarginBalance": "126.72469206",          // total margin balance in USD	"totalPositionInitialMargin": "0.00000000",    // the sum of USD value of all cross positions initial margin	"totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price in USD	"totalCrossWalletBalance": "126.72469206",     // crossed wallet balance in USD	"totalCrossUnPnl": "0.00000000",	           // unrealized profit of crossed positions in USD	"availableBalance": "126.72469206",            // available balance in USD	"maxWithdrawAmount": "126.72469206"            // maximum virtual amount for transfer out in USD	"assets": [		{			"asset": "USDT",			         // asset name			"walletBalance": "23.72469206",      // wallet balance			"unrealizedProfit": "0.00000000",    // unrealized profit			"marginBalance": "23.72469206",      // margin balance			"maintMargin": "0.00000000",	     // maintenance margin required			"initialMargin": "0.00000000",       // total initial margin required with current mark price 			"positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price			"openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price			"crossWalletBalance": "23.72469206",      // crossed wallet balance			"crossUnPnl": "0.00000000"       // unrealized profit of crossed positions			"availableBalance": "126.72469206",       // available balance			"maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out			"updateTime": 1625474304765 // last update time 		},		{			"asset": "BUSD",			// asset name			"walletBalance": "103.12345678",      // wallet balance			"unrealizedProfit": "0.00000000",    // unrealized profit			"marginBalance": "103.12345678",      // margin balance			"maintMargin": "0.00000000",	    // maintenance margin required			"initialMargin": "0.00000000",    // total initial margin required with current mark price 			"positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price			"openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price			"crossWalletBalance": "103.12345678",      // crossed wallet balance			"crossUnPnl": "0.00000000"       // unrealized profit of crossed positions			"availableBalance": "126.72469206",       // available balance			"maxWithdrawAmount": "103.12345678",     // maximum amount for transfer out			"updateTime": 1625474304765 // last update time		}	], 	"positions": [  // positions of all symbols user had position are returned                    // only "BOTH" positions will be returned with One-way mode		            // only "LONG" and "SHORT" positions will be returned with Hedge mode   	  {           "symbol": "BTCUSDT",              "positionSide": "BOTH",            // position side            "positionAmt": "1.000",             "unrealizedProfit": "0.00000000",  // unrealized profit                 "isolatedMargin": "0.00000000",	           "notional": "0",           "isolatedWallet": "0",           "initialMargin": "0",              // initial margin required with current mark price            "maintMargin": "0",                // maintenance margin required           "updateTime": 0  	  } 	] }
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3)
