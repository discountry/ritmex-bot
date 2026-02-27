---
title: "Position Information V2 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2"
fetched_at: "2026-01-27T05:28:32.326Z"
---
# Position Information V2 (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)

Get current position information(only symbol that has position or open orders will be returned).

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)

`v2/account.position`

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)

```
{   	"id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",    "method": "v2/account.position",    "params": {        "apiKey": "xTaDyrmvA9XT2oBHHjy39zyPzKCvMdtH3b9q4xadkAg2dNSJXQGCxzui26L823W2",        "symbol": "BTCUSDT",        "timestamp": 1702920680303,        "signature": "31ab02a51a3989b66c29d40fcdf78216978a60afc6d8dc1c753ae49fa3164a2a"    }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)

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

**Note**

> -   Please use with user data stream `ACCOUNT_UPDATE` to meet your timeliness and accuracy needs.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)

> For One-way position mode:

```
{  "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",  "status": 200,  "result": [    {	    "symbol": "BTCUSDT",  	    "positionSide": "BOTH",            // Position Side	    "positionAmt": "1.000",  	    "entryPrice": "0.00000",	    "breakEvenPrice": "0.0",  	    "markPrice": "6679.50671178",	    "unRealizedProfit": "0.00000000",  // Unrealized Profit	    "liquidationPrice": "0",  	    "isolatedMargin": "0.00000000",		    "notional": "0",	    "marginAsset": "USDT", 	    "isolatedWallet": "0",	    "initialMargin": "0",              // Initial Margin	    "maintMargin": "0",                // Maintainance Margin	    "positionInitialMargin": "0",      // Position Initial Margin	    "openOrderInitialMargin": "0",     // Open Order Initial Margin	    "adl": 0,	    "bidNotional": "0",  	    "askNotional": "0",  	    "updateTime": 0                    // Update Time    }],  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 20    }  ]}
```

> For Hedge position mode:

```
{  "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",  "status": 200,  "result": [   {	    "symbol": "BTCUSDT",  	    "positionSide": "LONG",            	    "positionAmt": "1.000",  	    "entryPrice": "0.00000",	    "breakEvenPrice": "0.0",  	    "markPrice": "6679.50671178",	    "unRealizedProfit": "0.00000000",  	    "liquidationPrice": "0",  	    "isolatedMargin": "0.00000000",		    "notional": "0",	    "marginAsset": "USDT", 	    "isolatedWallet": "0",	    "initialMargin": "0",   	    "maintMargin": "0",    	    "positionInitialMargin": "0",      	    "openOrderInitialMargin": "0",     	    "adl": 0,	    "bidNotional": "0",  	    "askNotional": "0",  	    "updateTime": 0    },    {	    "symbol": "BTCUSDT",  	    "positionSide": "SHORT",           	    "positionAmt": "1.000",  	    "entryPrice": "0.00000",	    "breakEvenPrice": "0.0",  	    "markPrice": "6679.50671178",	    "unRealizedProfit": "0.00000000",  	    "liquidationPrice": "0",  	    "isolatedMargin": "0.00000000",		    "notional": "0",	    "marginAsset": "USDT", 	    "isolatedWallet": "0",	    "initialMargin": "0",   	    "maintMargin": "0",     	    "positionInitialMargin": "0",      	    "openOrderInitialMargin": "0",     	    "adl": 0,	    "bidNotional": "0",  	    "askNotional": "0", 	    "updateTime": 0    }  ],  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 20    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/websocket-api/Position-Info-V2)
