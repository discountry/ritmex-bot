---
title: "General Information on Endpoints | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-information-on-endpoints"
fetched_at: "2026-02-26T10:38:08.909Z"
---
-   For `GET` endpoints, parameters must be sent as a `query string`.
-   For `POST`, `PUT`, and `DELETE` endpoints, the parameters may be sent as a `query string` or in the `request body` with content type `application/x-www-form-urlencoded`. You may mix parameters between both the `query string` and `request body` if you wish to do so.
-   Parameters may be sent in any order.
-   If a parameter sent in both the `query string` and `request body`, the `query string` parameter will be used.
