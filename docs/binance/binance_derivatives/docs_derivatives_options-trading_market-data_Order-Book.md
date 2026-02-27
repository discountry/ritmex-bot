---
title: "Order Book | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book"
fetched_at: "2026-01-27T05:28:10.166Z"
---
# Order Book

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)

Check orderbook depth on specific symbol

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)

GET `/eapi/v1/depth`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)

limit

weight

5, 10, 20, 50

1

100

5

500

10

1000

20

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)

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

Default:100 Max:1000.Optional value:\[10, 20, 50, 100, 500, 1000\]

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)

```
{    "bids": [            // Buy order        [            "1000.000",  // Price            "0.1000"     // Quantity        ]    ],    "asks": [            // Sell order        [            "1900.000",  // Price            "0.1000"     // Quantity        ]    ],    "T": 1762780909676,  // transaction time    "lastUpdateId": 361  // update id}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Order-Book)
