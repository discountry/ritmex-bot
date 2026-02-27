---
title: "Futures Account Balance | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance"
fetched_at: "2026-01-27T05:28:00.720Z"
---
# Futures Account Balance (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)

Check futures account balance

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)

GET `/dapi/v1/balance`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)

```
[ 	{ 		"accountAlias": "SgsR",    // unique account code 		"asset": "BTC", 		"balance": "0.00250000", 		"withdrawAvailable": "0.00250000", 		"crossWalletBalance": "0.00241969",  		"crossUnPnl": "0.00000000",  		"availableBalance": "0.00241969", 		"updateTime": 1592468353979	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Futures-Account-Balance)
