---
title: "Query Order Rate Limit | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit"
fetched_at: "2026-01-27T05:28:25.914Z"
---
# Query User Rate Limit (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)

Query User Rate Limit

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)

GET `/fapi/v1/rateLimit/order`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)

```
[  {    "rateLimitType": "ORDERS",    "interval": "SECOND",    "intervalNum": 10,    "limit": 10000,  },  {    "rateLimitType": "ORDERS",    "interval": "MINUTE",    "intervalNum": 1,    "limit": 20000,  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Query-Rate-Limit)
