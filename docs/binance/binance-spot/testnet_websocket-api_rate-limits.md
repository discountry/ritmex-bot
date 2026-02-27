---
title: "Rate limits | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits"
fetched_at: "2026-02-26T10:38:11.792Z"
---
### Connection limits[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)

There is a limit of **300 connections per attempt every 5 minutes**.

The connection is per **IP address**.

### General information on rate limits[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)

-   Current API rate limits can be queried using the [`exchangeInfo`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits) request.
-   There are multiple rate limit types across multiple intervals.
-   Responses can indicate current rate limit status in the optional `rateLimits` field.
-   Requests fail with status `429` when unfilled order count or request rate limits are violated.

#### How to interpret rate limits[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)

A response with rate limit status may look like this:

```
{    "id": "7069b743-f477-4ae3-81db-db9b8df085d2",    "status": 200,    "result": {        "serverTime": 1656400526260    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 70        }    ]}
```

The `rateLimits` array describes all currently active rate limits affected by the request.

Name

Type

Mandatory

Description

`rateLimitType`

ENUM

YES

Rate limit type: `REQUEST_WEIGHT`, `ORDERS`

`interval`

ENUM

YES

Rate limit interval: `SECOND`, `MINUTE`, `HOUR`, `DAY`

`intervalNum`

INT

YES

Rate limit interval multiplier

`limit`

INT

YES

Request limit per interval

`count`

INT

YES

Current usage per interval

Rate limits are accounted by intervals.

For example, a `1 MINUTE` interval starts every minute. Request submitted at 00:01:23.456 counts towards the 00:01:00 minute's limit. Once the 00:02:00 minute starts, the count will reset to zero again.

Other intervals behave in a similar manner. For example, `1 DAY` rate limit resets at 00:00 UTC every day, and `10 SECOND` interval resets at 00, 10, 20... seconds of each minute.

APIs have multiple rate-limiting intervals. If you exhaust a shorter interval but the longer interval still allows requests, you will have to wait for the shorter interval to expire and reset. If you exhaust a longer interval, you will have to wait for that interval to reset, even if shorter rate limit count is zero.

#### How to show/hide rate limit information[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)

`rateLimits` field is included with every response by default.

However, rate limit information can be quite bulky. If you are not interested in detailed rate limit status of every request, the `rateLimits` field can be omitted from responses to reduce their size.

-   Optional `returnRateLimits` boolean parameter in request.
    
    Use `returnRateLimits` parameter to control whether to include `rateLimits` fields in response to individual requests.
    
    Default request and response:
    
    ```
    { "id": 1, "method": "time" }
    ```
    
    ```
    {    "id": 1,    "status": 200,    "result": { "serverTime": 1656400526260 },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 70        }    ]}
    ```
    
    Request and response without rate limit status:
    
    ```
    { "id": 2, "method": "time", "params": { "returnRateLimits": false } }
    ```
    
    ```
    { "id": 2, "status": 200, "result": { "serverTime": 1656400527891 } }
    ```
    
-   Optional `returnRateLimits` boolean parameter in connection URL.
    
    If you wish to omit `rateLimits` from all responses by default, use `returnRateLimits` parameter in the query string instead:
    
    ```
    wss://ws-api.binance.com:443/ws-api/v3?returnRateLimits=false
    ```
    
    This will make all requests made through this connection behave as if you have passed `"returnRateLimits": false`.
    
    If you _want_ to see rate limits for a particular request, you need to explicitly pass the `"returnRateLimits": true` parameter.
    

**Note:** Your requests are still rate limited if you hide the `rateLimits` field in responses.

### IP limits[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)

-   Every request has a certain **weight**, added to your limit as you perform requests.
    -   The heavier the request (e.g. querying data from multiple symbols), the more weight the request will cost.
    -   Connecting to WebSocket API costs 2 weight.
-   Current weight usage is indicated by the `REQUEST_WEIGHT` rate limit type.
-   Use the [`exchangeInfo`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits) request to keep track of the current weight limits.
-   Weight is accumulated **per IP address** and is shared by all connections from that address.
-   If you go over the weight limit, requests fail with status `429`.
    -   This status code indicates you should back off and stop spamming the API.
    -   Rate-limited responses include a `retryAfter` field, indicating when you can retry the request.
-   **Repeatedly violating rate limits and/or failing to back off after receiving 429s will result in an automated IP ban and you will be disconnected.**
    -   Requests from a banned IP address fail with status `418`.
    -   `retryAfter` field indicates the timestamp when the ban will be lifted.
-   IP bans are tracked and **scale in duration** for repeat offenders, **from 2 minutes to 3 days**.

Successful response indicating that in 1 minute you have used 70 weight out of your 6000 limit:

```
{    "id": "7069b743-f477-4ae3-81db-db9b8df085d2",    "status": 200,    "result": [],    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 70        }    ]}
```

Failed response indicating that you are banned and the ban will last until epoch `1659146400000`:

```
{    "id": "fc93a61a-a192-4cf4-bb2a-a8f0f0c51e06",    "status": 418,    "error": {        "code": -1003,        "msg": "Way too much request weight used; IP banned until 1659146400000. Please use WebSocket Streams for live updates to avoid bans.",        "data": {            "serverTime": 1659142907531,            "retryAfter": 1659146400000        }    },    "rateLimits": [        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 2411        }    ]}
```

### Unfilled Order Count[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)

-   Successfully placed orders update the `ORDERS` rate limit type.
-   Rejected or unsuccessful orders might or might not update the `ORDERS` rate limit type.
-   **Please note that if your orders are consistently filled by trades, you can continuously place orders on the API**. For more information, please see [Spot Unfilled Order Count Rules](https://developers.binance.com/docs/binance-spot-api-docs/faqs/order_count_decrement).
-   Use the [`account.rateLimits.orders`](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/account-requests) request to keep track of how many orders you have placed within this interval.
-   If you exceed this, requests fail with status `429`.
    -   This status code indicates you should back off and stop spamming the API.
    -   Responses that have a status `429` include a `retryAfter` field, indicating when you can retry the request.
-   This is maintained **per account** and is shared by all API keys of the account.

Successful response indicating that you have placed 12 orders in 10 seconds, and 4043 orders in the past 24 hours:

```
{    "id": "e2a85d9f-07a5-4f94-8d5f-789dc3deb097",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "orderId": 12510053279,        "orderListId": -1,        "clientOrderId": "a097fe6304b20a7e4fc436",        "transactTime": 1655716096505,        "price": "0.10000000",        "origQty": "10.00000000",        "executedQty": "0.00000000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.00000000",        "status": "NEW",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "BUY",        "workingTime": 1655716096505,        "selfTradePreventionMode": "NONE"    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 12        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 4043        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 321        }    ]}
```

-   [Connection limits](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)
-   [General information on rate limits](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)
-   [IP limits](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)
-   [Unfilled Order Count](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/rate-limits)
