---
title: "Account Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information"
fetched_at: "2026-01-27T05:28:02.105Z"
---
# Account Information(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)

Get current account information. User in single-asset/ multi-assets mode will see different value, see comments in response section for detail.

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)

`account.status`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)

```
{  "id": "baaec739-c5cf-4920-b448-c0b9c5431410",  "method": "account.status",  "params": {    "apiKey": "",    "timestamp": 1727785087742,    "signature": "0f04368b2d22aafd0ggc8809ea34297eff602272917b5f01267db4efbc1c9422"   }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)

```
{  "id": "baaec739-c5cf-4920-b448-c0b9c5431410",  "status": 200,  "result": {    "feeTier": 0,    "canTrade": true,    "canDeposit": true,    "canWithdraw": true,    "updateTime": 0,    "assets": [      {        "asset": "WLD",        "walletBalance": "0.00000000",        "unrealizedProfit": "0.00000000",        "marginBalance": "0.00000000",        "maintMargin": "0.00000000",        "initialMargin": "0.00000000",        "positionInitialMargin": "0.00000000",        "openOrderInitialMargin": "0.00000000",        "maxWithdrawAmount": "0.00000000",        "crossWalletBalance": "0.00000000",        "crossUnPnl": "0.00000000",        "availableBalance": "0.00000000",        "updateTime": 0      },      // ... ...    ],    "positions": [      {        "symbol": "ETHUSD_220930",        "initialMargin": "0",        "maintMargin": "0",        "unrealizedProfit": "0.00000000",        "positionInitialMargin": "0",        "openOrderInitialMargin": "0",        "leverage": "7",        "isolated": false,        "positionSide": "BOTH",        "entryPrice": "0.00000000",        "maxQty": "1000",        "notionalValue": "0",        "isolatedWallet": "0",        "updateTime": 0,        "positionAmt": "0",        "breakEvenPrice": "0.00000000"      },      // ... ...    ]  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 10    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/websocket-api/Account-Information)
