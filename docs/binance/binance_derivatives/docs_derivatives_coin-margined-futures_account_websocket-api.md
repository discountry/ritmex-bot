---
title: "Futures Account Balance | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api"
fetched_at: "2026-01-27T05:28:01.946Z"
---
# Futures Account Balance(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)

Query account balance info

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)

`account.balance`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)

```
{  "id": "9328e612-1560-4108-979e-283bf85b5acb",  "method": "account.balance",  "params": {    "apiKey": "",    "timestamp": 1727810404936,    "signature": "0f04368b2d22aafd0ggc8809ea34297eff602272917b5f01267db4efbc1c9422"   }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)

```
{  "id": "9328e612-1560-4108-979e-283bf85b5acb",  "status": 200,  "result": [    {      "accountAlias": "fWAuTiuXoCuXmY",      "asset": "WLD",      "balance": "0.00000000",      "withdrawAvailable": "0.00000000",      "crossWalletBalance": "0.00000000",      "crossUnPnl": "0.00000000",      "availableBalance": "0.00000000",      "updateTime": 0    },    // ... ...  ],  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 10    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api)
