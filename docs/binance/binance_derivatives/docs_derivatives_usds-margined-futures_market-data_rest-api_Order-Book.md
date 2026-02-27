---
title: "Order Book | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book"
fetched_at: "2026-01-27T05:28:28.692Z"
---
# Order Book

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)

Query symbol orderbook

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)

GET `/fapi/v1/depth`

**Note**:

> Retail Price Improvement(RPI) orders are not visible and excluded in the response message.

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)

Adjusted based on the limit:

Limit

Weight

5, 10, 20, 50

2

100

5

500

10

1000

20

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)

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

Default 500; Valid limits:\[5, 10, 20, 50, 100, 500, 1000\]

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)

```
{  "lastUpdateId": 1027024,  "E": 1589436922972,   // Message output time  "T": 1589436922959,   // Transaction time  "bids": [    [      "4.00000000",     // PRICE      "431.00000000"    // QTY    ]  ],  "asks": [    [      "4.00000200",      "12.00000000"    ]  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book)
