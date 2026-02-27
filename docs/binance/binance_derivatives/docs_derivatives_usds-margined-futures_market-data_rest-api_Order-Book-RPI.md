---
title: "RPI Order Book | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI"
fetched_at: "2026-01-27T05:28:28.603Z"
---
# RPI Order Book

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)

Query symbol orderbook with RPI orders

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)

GET `/fapi/v1/rpiDepth`

**Note**:

> RPI(Retail Price Improvement) orders are included and aggreated in the response message. Crossed price levels are hidden and invisible.

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)

Adjusted based on the limit:

Limit

Weight

1000

20

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)

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

Default 1000; Valid limits:\[1000\]

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)

```
{  "lastUpdateId": 1027024,  "E": 1589436922972,   // Message output time  "T": 1589436922959,   // Transaction time  "bids": [    [      "4.00000000",     // PRICE      "431.00000000"    // QTY    ]  ],  "asks": [    [      "4.00000200",      "12.00000000"    ]  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book-RPI)
