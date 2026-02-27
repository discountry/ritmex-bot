---
title: "Recent Block Trades List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List"
fetched_at: "2026-01-27T05:28:10.331Z"
---
# Recent Block Trades List

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)

Get recent block trades

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)

GET `/eapi/v1/blockTrades`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)

Name

Type

Mandatory

 Description

symbol

STRING

NO

Option trading pair, e.g. BTC-200730-9000-C

limit

INT

NO

Number of records; Default: 100 and Max: 500

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)

```
[	{		"id": 1125899906901081078,		"tradeId": 389,		"symbol": "ETH-250725-1200-P",		"price": "342.40",		"qty": "-2167.20",		"quoteQty": "-4.90",		"side": -1,		"time": 1733950676483	},	{		"id": 1125899906901080972,		"tradeId": 161,		"symbol": "XRP-250904-0.086-P",		"price": "3.0",		"qty": "-6.0",		"quoteQty": "-2.02",		"side": -1,		"time": 1733950488444	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Recent-Block-Trade-List)
