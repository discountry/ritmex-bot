---
title: "Recent Trades List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List"
fetched_at: "2026-01-27T05:28:10.168Z"
---
# Recent Trades List

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)

Get recent market trades

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)

GET `/eapi/v1/trades`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)

Name

Type

Mandatory

Description

symbol

STRING

YES

Option trading pair, e.g BTC-200730-9000-C

limit

INT

NO

Number of records Default:100 Max:500

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)

```
[    {        "id": 2323857420768529130,        "tradeId": 1,                    // TradeId        "symbol": "BTC-251123-126000-C", // Completed trade price        "price": "1300",                 // Completed trade quantity        "qty": "0.1",                    // Completed trade quantity        "quoteQty": "130",               // Completed trade amount        "side": -1,                      // Completed trade direction（-1 Sell，1 Buy）        "time": 1762780453623            // Time     }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Trades-List)
