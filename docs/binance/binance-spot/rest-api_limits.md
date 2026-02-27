---
title: "LIMITS | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits"
fetched_at: "2026-02-26T10:38:08.971Z"
---
### General Info on Limits[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits)

-   The following `intervalLetter` values for headers:
    -   SECOND => S
    -   MINUTE => M
    -   HOUR => H
    -   DAY => D
-   `intervalNum` describes the amount of the interval. For example, `intervalNum` 5 with `intervalLetter` M means "Every 5 minutes".
-   The `/api/v3/exchangeInfo` `rateLimits` array contains objects related to the exchange's `RAW_REQUESTS`, `REQUEST_WEIGHT`, and `ORDERS` rate limits. These are further defined in the `ENUM definitions` section under `Rate limiters (rateLimitType)`.
-   Requests fail with HTTP status code 429 when you exceed the request rate limit.

### IP Limits[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits)

-   Every request will contain `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` in the response headers which has the current used weight for the IP for all request rate limiters defined.
-   Each route has a `weight` which determines for the number of requests each endpoint counts for. Heavier endpoints and endpoints that do operations on multiple symbols will have a heavier `weight`.
-   When a 429 is received, it's your obligation as an API to back off and not spam the API.
-   **Repeatedly violating rate limits and/or failing to back off after receiving 429s will result in an automated IP ban (HTTP status 418).**
-   IP bans are tracked and **scale in duration** for repeat offenders, **from 2 minutes to 3 days**.
-   A `Retry-After` header is sent with a 418 or 429 responses and will give the **number of seconds** required to wait, in the case of a 429, to prevent a ban, or, in the case of a 418, until the ban is over.
-   **The limits on the API are based on the IPs, not the API keys.**

### Unfilled Order Count[​](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits)

-   Every successful order response will contain a `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)` header indicating how many orders you have placed for that interval.  
      
    To monitor this, refer to [`GET api/v3/rateLimit/order`](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/account-endpoints).
-   Rejected/unsuccessful orders are not guaranteed to have `X-MBX-ORDER-COUNT-**` headers in the response.
-   If you have exceeded this, you will receive a 429 error with the `Retry-After` header.
-   **Please note that if your orders are consistently filled by trades, you can continuously place orders on the API**. For more information, please see [Spot Unfilled Order Count Rules](https://developers.binance.com/docs/binance-spot-api-docs/faqs/order_count_decrement).
-   **The number of unfilled orders is tracked for each account.**

-   [General Info on Limits](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits)
-   [IP Limits](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits)
-   [Unfilled Order Count](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/limits)
