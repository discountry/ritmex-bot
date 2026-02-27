---
title: "Um Account Trade List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List"
fetched_at: "2026-01-27T05:28:23.295Z"
---
# UM Account Trade List(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)

Get trades for a specific account and UM symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)

GET `/papi/v1/um/userTrades`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)

Name

Type

Mandatory

Description

symbol

STRING

YES

startTime

LONG

NO

endTime

LONG

NO

fromId

LONG

NO

Trade id to fetch from. Default gets most recent trades.

limit

INT

NO

Default 500; max 1000.

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If `startTime` and `endTime` are both not sent, then the last '7 days' data will be returned.
> -   The time between `startTime` and `endTime` cannot be longer than 7 days.
> -   The parameter `fromId` cannot be sent with `startTime` or `endTime`.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)

```
[    {        "symbol": "BTCUSDT",        "id": 67880589,        "orderId": 270093109,        "side": "SELL",        "price": "28511.00",        "qty": "0.010",        "realizedPnl": "2.58500000",        "quoteQty": "285.11000",        "commission": "-0.11404400",        "commissionAsset": "USDT",        "time": 1680688557875,        "buyer": false,        "maker": false,        "positionSide": "BOTH"    }] 
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List)
