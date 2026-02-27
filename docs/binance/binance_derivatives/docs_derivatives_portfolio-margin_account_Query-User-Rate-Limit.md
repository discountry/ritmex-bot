---
title: "Query User Rate Limit | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit"
fetched_at: "2026-01-27T05:28:18.901Z"
---
# Query User Rate Limit (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)

Query User Rate Limit

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)

GET `/papi/v1/rateLimit/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)

```
[  {        "rateLimitType": "ORDERS",        "interval": "MINUTE",        "intervalNum": 1,        "limit": 1200    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-User-Rate-Limit)
