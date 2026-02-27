---
title: "Mark Price | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price"
fetched_at: "2026-01-27T05:28:28.104Z"
---
# Mark Price

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)

Mark Price and Funding Rate

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)

GET `/fapi/v1/premiumIndex`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)

**1** with symbol, **10** without symbol

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)

Name

Type

Mandatory

Description

symbol

STRING

NO

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)

> **Response:**

```
{	"symbol": "BTCUSDT",	"markPrice": "11793.63104562",	// mark price	"indexPrice": "11781.80495970",	// index price	"estimatedSettlePrice": "11781.16138815", // Estimated Settle Price, only useful in the last hour before the settlement starts.	"lastFundingRate": "0.00038246",  // This is the Latest funding rate	"interestRate": "0.00010000",	"nextFundingTime": 1597392000000,	"time": 1597370495002}
```

> **OR (when symbol not sent)**

```
[	{	    "symbol": "BTCUSDT",	    "markPrice": "11793.63104562",	// mark price	    "indexPrice": "11781.80495970",	// index price	    "estimatedSettlePrice": "11781.16138815", // Estimated Settle Price, only useful in the last hour before the settlement starts.	    "lastFundingRate": "0.00038246",  // This is the Latest funding rate	    "interestRate": "0.00010000",	    "nextFundingTime": 1597392000000,	    "time": 1597370495002	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price)
