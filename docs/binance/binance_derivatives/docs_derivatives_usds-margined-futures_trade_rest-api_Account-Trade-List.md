---
title: "Query Account Trade List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List"
fetched_at: "2026-01-27T05:28:29.884Z"
---
# Account Trade List (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)

Get trades for a specific account and symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)

GET `/fapi/v1/userTrades`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)

Name

Type

Mandatory

Description

symbol

STRING

YES

orderId

LONG

NO

This can only be used in combination with `symbol`

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

> -   If `startTime` and `endTime` are both not sent, then the last 7 days' data will be returned.
> -   The time between `startTime` and `endTime` cannot be longer than 7 days.
> -   The parameter `fromId` cannot be sent with `startTime` or `endTime`.
> -   Only support querying trade in the past 6 months

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)

```
[  {  	"buyer": false,  	"commission": "-0.07819010",  	"commissionAsset": "USDT",  	"id": 698759,  	"maker": false,  	"orderId": 25851813,  	"price": "7819.01",  	"qty": "0.002",  	"quoteQty": "15.63802",  	"realizedPnl": "-0.91539999",  	"side": "SELL",  	"positionSide": "SHORT",  	"symbol": "BTCUSDT",  	"time": 1569514978020  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List)
