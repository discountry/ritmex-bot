---
title: "Old Trades Lookup | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup"
fetched_at: "2026-01-27T05:28:03.656Z"
---
# Old Trades Lookup(MARKET\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)

Get older market historical trades.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)

GET `/dapi/v1/historicalTrades`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)

**20**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)

Name

Type

Mandatory

Description

symbol

STRING

YES

limit

INT

NO

Default 100; max 500.

fromId

LONG

NO

TradeId to fetch from. Default gets most recent trades.

> -   Market trades means trades filled in the order book. Only market trades will be returned, which means the insurance fund trades and ADL trades won't be returned.

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)

```
[  {    "id": 595103,    "price": "9642.2",    "qty": "1",    "baseQty": "0.01037108",    "time": 1499865549590,    "isBuyerMaker": true,  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Old-Trades-Lookup)
