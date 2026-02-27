---
title: "Query Delivery Price | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price"
fetched_at: "2026-01-27T05:28:27.559Z"
---
# Quarterly Contract Settlement Price

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)

Latest price for a symbol or symbols.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)

GET `/futures/data/delivery-price`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)

**0**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)

Name

Type

Mandatory

Description

pair

STRING

YES

e.g BTCUSDT

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)

```
[    {        "deliveryTime": 1695945600000,        "deliveryPrice": 27103.00000000    },    {        "deliveryTime": 1688083200000,        "deliveryPrice": 30733.60000000    },    {        "deliveryTime": 1680220800000,        "deliveryPrice": 27814.20000000    },    {        "deliveryTime": 1648166400000,        "deliveryPrice": 44066.30000000    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Delivery-Price)
