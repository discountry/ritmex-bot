---
title: "Compressed Aggregate Trades List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List"
fetched_at: "2026-01-27T05:28:27.321Z"
---
# Compressed/Aggregate Trades List

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)

Get compressed, aggregate market trades. Market trades that fill in 100ms with the same price and the same taking side will have the quantity aggregated.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)

GET `/fapi/v1/aggTrades`

**Note**:

> Retail Price Improvement(RPI) orders are aggregated and without special tags to be distinguished.

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)

20

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)

Name

Type

Mandatory

Description

symbol

STRING

YES

fromId

LONG

NO

ID to get aggregate trades from INCLUSIVE.

startTime

LONG

NO

Timestamp in ms to get aggregate trades from INCLUSIVE.

endTime

LONG

NO

Timestamp in ms to get aggregate trades until INCLUSIVE.

limit

INT

NO

Default 500; max 1000.

> -   support querying futures trade histories that are not older than one year
> -   If both `startTime` and `endTime` are sent, time between `startTime` and `endTime` must be less than 1 hour.
> -   If `fromId`, `startTime`, and `endTime` are not sent, the most recent aggregate trades will be returned.
> -   Only market trades will be aggregated and returned, which means the insurance fund trades and ADL trades won't be aggregated.
> -   Sending both `startTime`/`endTime` and `fromId` might cause response timeout, please send either `fromId` or `startTime`/`endTime`

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)

```
[  {    "a": 26129,         // Aggregate tradeId    "p": "0.01633102",  // Price    "q": "4.70443515",  // Quantity    "f": 27781,         // First tradeId    "l": 27781,         // Last tradeId    "T": 1498793709153, // Timestamp    "m": true,          // Was the buyer the maker?  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List)
