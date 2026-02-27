---
title: "Position Information V3 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3"
fetched_at: "2026-01-27T05:28:31.409Z"
---
# Position Information V3 (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)

Get current position information(only symbol that has position or open orders will be returned).

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)

GET `/fapi/v3/positionRisk`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)

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

> Please use with user data stream `ACCOUNT_UPDATE` to meet your timeliness and accuracy needs.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)

> For One-way position mode:

```
[  {        "symbol": "ADAUSDT",        "positionSide": "BOTH",               // position side         "positionAmt": "30",        "entryPrice": "0.385",        "breakEvenPrice": "0.385077",        "markPrice": "0.41047590",        "unRealizedProfit": "0.76427700",     // unrealized profit          "liquidationPrice": "0",        "isolatedMargin": "0",        "notional": "12.31427700",        "marginAsset": "USDT",        "isolatedWallet": "0",        "initialMargin": "0.61571385",        // initial margin required with current mark price         "maintMargin": "0.08004280",          // maintenance margin required        "positionInitialMargin": "0.61571385",// initial margin required for positions with current mark price        "openOrderInitialMargin": "0",        // initial margin required for open orders with current mark price         "adl": 2,        "bidNotional": "0",                   // bids notional, ignore        "askNotional": "0",                   // ask notional, ignore        "updateTime": 1720736417660  }]
```

> For Hedge position mode:

```
[  {        "symbol": "ADAUSDT",        "positionSide": "LONG",               // position side         "positionAmt": "30",        "entryPrice": "0.385",        "breakEvenPrice": "0.385077",        "markPrice": "0.41047590",        "unRealizedProfit": "0.76427700",     // unrealized profit          "liquidationPrice": "0",        "isolatedMargin": "0",        "notional": "12.31427700",        "marginAsset": "USDT",        "isolatedWallet": "0",        "initialMargin": "0.61571385",        // initial margin required with current mark price         "maintMargin": "0.08004280",          // maintenance margin required        "positionInitialMargin": "0.61571385",// initial margin required for positions with current mark price        "openOrderInitialMargin": "0",        // initial margin required for open orders with current mark price         "adl": 2,        "bidNotional": "0",                   // bids notional, ignore        "askNotional": "0",                   // ask notional, ignore        "updateTime": 1720736417660  },  {        "symbol": "COMPUSDT",        "positionSide": "SHORT",        "positionAmt": "-1.000",        "entryPrice": "70.92841",        "breakEvenPrice": "70.900038636",        "markPrice": "49.72023376",        "unRealizedProfit": "21.20817624",        "liquidationPrice": "2260.56757210",        "isolatedMargin": "0",        "notional": "-49.72023376",        "marginAsset": "USDT",        "isolatedWallet": "0",        "initialMargin": "2.48601168",        "maintMargin": "0.49720233",        "positionInitialMargin": "2.48601168",        "openOrderInitialMargin": "0",        "adl": 2,        "bidNotional": "0",        "askNotional": "0",        "updateTime": 1708943511656  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3)
