---
title: "Query ADL risk rating | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk"
fetched_at: "2026-01-27T05:28:27.056Z"
---
# ADL Risk

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)

Query the symbol-level ADL risk rating. The ADL risk rating measures the likelihood of ADL during liquidation, and the rating takes into account the insurance fund balance, position concentration on the symbol, order book depth, price volatility, average leverage, unrealized PnL, and margin utilization at the symbol level. The rating can be high, medium and low, and is updated every 30 minutes.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)

GET `/fapi/v1/symbolAdlRisk`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)

Name

Type

Mandatory

Description

symbol

STRING

NO

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)

> **Response:**

```
{	"symbol": "BTCUSDT",	"adlRisk": "low",  // ADL Risk rating	"updateTime": 1597370495002}
```

> **OR (when symbol not sent)**

```
[	{	    "symbol": "BTCUSDT",	    "adlRisk": "low",  // ADL Risk rating	    "updateTime": 1597370495002	},	{	    "symbol": "ETHUSDT",	    "adlRisk": "high", // ADL Risk rating	    "updateTime": 1597370495004	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/ADL-Risk)
