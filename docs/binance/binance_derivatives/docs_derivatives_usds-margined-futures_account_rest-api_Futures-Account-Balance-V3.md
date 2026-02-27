---
title: "Futures Account Balance V3 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3"
fetched_at: "2026-01-27T05:28:24.939Z"
---
# Futures Account Balance V3 (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)

Query account balance info

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)

GET `/fapi/v3/balance`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)

```
[ {   "accountAlias": "SgsR",              // unique account code   "asset": "USDT",  	                // asset name   "balance": "122607.35137903",        // wallet balance   "crossWalletBalance": "23.72469206", // crossed wallet balance   "crossUnPnl": "0.00000000",           // unrealized profit of crossed positions   "availableBalance": "23.72469206",   // available balance   "maxWithdrawAmount": "23.72469206",  // maximum amount for transfer out   "marginAvailable": true,             // whether the asset can be used as margin in Multi-Assets mode   "updateTime": 1617939110373 }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V3)
