---
title: "Margin Account Trade List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List"
fetched_at: "2026-01-27T05:28:20.852Z"
---
# Margin Account Trade List (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)

Margin Account Trade List

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)

GET `/papi/v1/margin/myTrades`

## Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)

**5**

## Parameters:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)

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

startTime

LONG

NO

endTime

LONG

NO

fromId

LONG

NO

TradeId to fetch from. Default gets most recent trades.

limit

INT

NO

Default 500; max 1000.

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

**Notes:**

-   If `fromId` is set, it will get trades >= that `fromId`. Otherwise most recent trades are returned.
-   Less than 24 hours between `startTime` and `endTime`.

## Response:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)

```
[    {        "commission": "0.00006000",        "commissionAsset": "BTC",        "id": 34,        "isBestMatch": true,        "isBuyer": false,        "isMaker": false,        "orderId": 39324,        "price": "0.02000000",        "qty": "3.00000000",        "symbol": "BNBBTC",        "time": 1561973357171    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)
-   [Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)
-   [Parameters:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)
-   [Response:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Trade-List)
