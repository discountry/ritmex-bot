---
title: "Account Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information"
fetched_at: "2026-01-27T05:28:26.229Z"
---
# Account Information(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)

Get current account information. User in single-asset/ multi-assets mode will see different value, see comments in response section for detail.

## Method[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)

`account.status`

## Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)

```
{    "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",    "method": "account.status",    "params": {        "apiKey": "xTaDyrmvA9XT2oBHHjy39zyPzKCvMdtH3b9q4xadkAg2dNSJXQGCxzui26L823W2",        "timestamp": 1702620814781,        "signature": "6bb98ef84170c70ba3d01f44261bfdf50fef374e551e590de22b5c3b729b1d8c"    }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)

> Single Asset Mode

```
{  "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",  "status": 200,  "result": {    "feeTier": 0,       // account commission tier     "canTrade": true,   // if can trade    "canDeposit": true,     // if can transfer in asset    "canWithdraw": true,    // if can transfer out asset    "updateTime": 0,        // reserved property, please ignore     "multiAssetsMargin": false,    "tradeGroupId": -1,    "totalInitialMargin": "0.00000000",    // total initial margin required with current mark price (useless with isolated positions), only for USDT asset    "totalMaintMargin": "0.00000000",     // total maintenance margin required, only for USDT asset    "totalWalletBalance": "23.72469206",     // total wallet balance, only for USDT asset    "totalUnrealizedProfit": "0.00000000",   // total unrealized profit, only for USDT asset    "totalMarginBalance": "23.72469206",     // total margin balance, only for USDT asset    "totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset    "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset    "totalCrossWalletBalance": "23.72469206",      // crossed wallet balance, only for USDT asset    "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions, only for USDT asset    "availableBalance": "23.72469206",       // available balance, only for USDT asset    "maxWithdrawAmount": "23.72469206"     // maximum amount for transfer out, only for USDT asset    "assets": [        {            "asset": "USDT",            // asset name            "walletBalance": "23.72469206",      // wallet balance            "unrealizedProfit": "0.00000000",    // unrealized profit            "marginBalance": "23.72469206",      // margin balance            "maintMargin": "0.00000000",        // maintenance margin required            "initialMargin": "0.00000000",    // total initial margin required with current mark price             "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price            "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price            "crossWalletBalance": "23.72469206",      // crossed wallet balance            "crossUnPnl": "0.00000000"       // unrealized profit of crossed positions            "availableBalance": "23.72469206",       // available balance            "maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out            "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode            "updateTime": 1625474304765 // last update time         },        {            "asset": "BUSD",            // asset name            "walletBalance": "103.12345678",      // wallet balance            "unrealizedProfit": "0.00000000",    // unrealized profit            "marginBalance": "103.12345678",      // margin balance            "maintMargin": "0.00000000",        // maintenance margin required            "initialMargin": "0.00000000",    // total initial margin required with current mark price             "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price            "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price            "crossWalletBalance": "103.12345678",      // crossed wallet balance            "crossUnPnl": "0.00000000"       // unrealized profit of crossed positions            "availableBalance": "103.12345678",       // available balance            "maxWithdrawAmount": "103.12345678",     // maximum amount for transfer out            "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode            "updateTime": 1625474304765 // last update time        }    ],    "positions": [  // positions of all symbols in the market are returned        // only "BOTH" positions will be returned with One-way mode        // only "LONG" and "SHORT" positions will be returned with Hedge mode        {            "symbol": "BTCUSDT",    // symbol name            "initialMargin": "0",   // initial margin required with current mark price             "maintMargin": "0",     // maintenance margin required            "unrealizedProfit": "0.00000000",  // unrealized profit            "positionInitialMargin": "0",      // initial margin required for positions with current mark price            "openOrderInitialMargin": "0",     // initial margin required for open orders with current mark price            "leverage": "100",      // current initial leverage            "isolated": true,       // if the position is isolated            "entryPrice": "0.00000",    // average entry price            "maxNotional": "250000",    // maximum available notional with current leverage            "bidNotional": "0",  // bids notional, ignore            "askNotional": "0",  // ask notional, ignore            "positionSide": "BOTH",     // position side            "positionAmt": "0",         // position amount            "updateTime": 0           // last update time        }    ]  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 20    }  ]}
```

> Multi-Asset Mode

```
{  "id": "605a6d20-6588-4cb9-afa0-b0ab087507ba",  "status": 200,  "result": {      "feeTier": 0,       // account commission tier       "canTrade": true,   // if can trade      "canDeposit": true,     // if can transfer in asset      "canWithdraw": true,    // if can transfer out asset      "updateTime": 0,        // reserved property, please ignore       "multiAssetsMargin": true,      "tradeGroupId": -1,      "totalInitialMargin": "0.00000000",    // the sum of USD value of all cross positions/open order initial margin      "totalMaintMargin": "0.00000000",     // the sum of USD value of all cross positions maintenance margin      "totalWalletBalance": "126.72469206",     // total wallet balance in USD      "totalUnrealizedProfit": "0.00000000",   // total unrealized profit in USD      "totalMarginBalance": "126.72469206",     // total margin balance in USD      "totalPositionInitialMargin": "0.00000000",    // the sum of USD value of all cross positions initial margin      "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price in USD      "totalCrossWalletBalance": "126.72469206",      // crossed wallet balance in USD      "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions in USD      "availableBalance": "126.72469206",       // available balance in USD      "maxWithdrawAmount": "126.72469206"     // maximum virtual amount for transfer out in USD      "assets": [          {              "asset": "USDT",            // asset name              "walletBalance": "23.72469206",      // wallet balance              "unrealizedProfit": "0.00000000",    // unrealized profit              "marginBalance": "23.72469206",      // margin balance              "maintMargin": "0.00000000",        // maintenance margin required              "initialMargin": "0.00000000",    // total initial margin required with current mark price               "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price              "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price              "crossWalletBalance": "23.72469206",      // crossed wallet balance              "crossUnPnl": "0.00000000"       // unrealized profit of crossed positions              "availableBalance": "126.72469206",       // available balance              "maxWithdrawAmount": "23.72469206",     // maximum amount for transfer out              "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode              "updateTime": 1625474304765 // last update time           },          {              "asset": "BUSD",            // asset name              "walletBalance": "103.12345678",      // wallet balance              "unrealizedProfit": "0.00000000",    // unrealized profit              "marginBalance": "103.12345678",      // margin balance              "maintMargin": "0.00000000",        // maintenance margin required              "initialMargin": "0.00000000",    // total initial margin required with current mark price               "positionInitialMargin": "0.00000000",    //initial margin required for positions with current mark price              "openOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price              "crossWalletBalance": "103.12345678",      // crossed wallet balance              "crossUnPnl": "0.00000000"       // unrealized profit of crossed positions              "availableBalance": "126.72469206",       // available balance              "maxWithdrawAmount": "103.12345678",     // maximum amount for transfer out              "marginAvailable": true,    // whether the asset can be used as margin in Multi-Assets mode              "updateTime": 1625474304765 // last update time          }      ],      "positions": [  // positions of all symbols in the market are returned          // only "BOTH" positions will be returned with One-way mode          // only "LONG" and "SHORT" positions will be returned with Hedge mode          {              "symbol": "BTCUSDT",    // symbol name              "initialMargin": "0",   // initial margin required with current mark price               "maintMargin": "0",     // maintenance margin required              "unrealizedProfit": "0.00000000",  // unrealized profit              "positionInitialMargin": "0",      // initial margin required for positions with current mark price              "openOrderInitialMargin": "0",     // initial margin required for open orders with current mark price              "leverage": "100",      // current initial leverage              "isolated": true,       // if the position is isolated              "entryPrice": "0.00000",    // average entry price              "breakEvenPrice": "0.0",    // average entry price              "maxNotional": "250000",    // maximum available notional with current leverage              "bidNotional": "0",  // bids notional, ignore              "askNotional": "0",  // ask notional, ignore              "positionSide": "BOTH",     // position side              "positionAmt": "0",         // position amount              "updateTime": 0           // last update time          }      ]  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 20    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)
-   [Method](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)
-   [Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/websocket-api/Account-Information)
