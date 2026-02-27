---
title: "Futures Account Balance V2 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api"
fetched_at: "2026-01-27T05:28:26.166Z"
---
# Futures Account Balance V2(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)

Query account balance info

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)

`v2/account.balance`

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)

```
{    "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",    "method": "v2/account.balance",    "params": {        "apiKey": "xTaDyrmvA9XT2oBHHjy39zyPzKCvMdtH3b9q4xadkAg2dNSJXQGCxzui26L823W2",        "timestamp": 1702561978458,        "signature": "208bb94a26f99aa122b1319490ca9cb2798fccc81d9b6449521a26268d53217a"    }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)

```
{    "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",    "status": 200,    "result": [      {        "accountAlias": "SgsR",              // unique account code        "asset": "USDT",  	                // asset name        "balance": "122607.35137903",        // wallet balance        "crossWalletBalance": "23.72469206", // crossed wallet balance        "crossUnPnl": "0.00000000"           // unrealized profit of crossed positions        "availableBalance": "23.72469206",   // available balance        "maxWithdrawAmount": "23.72469206",  // maximum amount for transfer out        "marginAvailable": true,             // whether the asset can be used as margin in Multi-Assets mode        "updateTime": 1617939110373      }    ],    "rateLimits": [      {        "rateLimitType": "REQUEST_WEIGHT",        "interval": "MINUTE",        "intervalNum": 1,        "limit": 2400,        "count": 20      }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api)
