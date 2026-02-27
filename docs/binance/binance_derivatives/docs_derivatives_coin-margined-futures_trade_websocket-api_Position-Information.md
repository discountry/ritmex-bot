---
title: "Position Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information"
fetched_at: "2026-01-27T05:28:06.392Z"
---
# Position Information(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)

Get current position information.

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)

`account.position`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)

```
{  "id": "233b8741-a96d-48e8-8ce1-160f43548aeb",  "method": "account.position",  "params": {    "apiKey": "",    "pair": "BTCUSD",    "timestamp": 1727825241779,    "signature": "0f04368b2d22aafd0ggc8809ea34297eff602272917b5f01267db4efbc1c9422"   }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)

Name

Type

Mandatory

Description

marginAsset

STRING

NO

pair

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)

```
{    "id": "233b8741-a96d-48e8-8ce1-160f43548aeb",    "status": 200,    "result": [        {            "symbol": "BTCUSD_PERP",            "positionAmt": "0",            "entryPrice": "0.00000000",            "markPrice": "62297.60417296",            "unRealizedProfit": "0.00000000",            "liquidationPrice": "0",            "leverage": "7",            "maxQty": "100",            "marginType": "cross",            "isolatedMargin": "0.00000000",            "isAutoAddMargin": "false",            "positionSide": "BOTH",            "notionalValue": "0",            "isolatedWallet": "0",            "updateTime": 1726731195634,            "breakEvenPrice": "0.00000000"        },      // ... ...    ],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 2400,            "count": 10        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/websocket-api/Position-Information)
