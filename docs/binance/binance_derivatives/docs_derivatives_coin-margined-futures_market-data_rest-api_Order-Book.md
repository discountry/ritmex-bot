---
title: "Order Book | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book"
fetched_at: "2026-01-27T05:28:03.777Z"
---
# Order Book

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)

Query orderbook on specific symbol

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)

GET `/dapi/v1/depth`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)

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

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)

```
{  "lastUpdateId": 16769853,  "symbol": "BTCUSD_PERP", // Symbol  "pair": "BTCUSD",		 // Pair  "E": 1591250106370,   // Message output time  "T": 1591250106368,   // Transaction time  "bids": [    [      "9638.0",     	// PRICE      "431"    			// QTY    ]  ],  "asks": [    [      "9638.2",      "12"    ]  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Order-Book)
