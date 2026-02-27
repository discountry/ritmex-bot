---
title: "Response format | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/response-format"
fetched_at: "2026-02-26T10:38:12.057Z"
---
Responses are returned as JSON in **text frames**, one response per frame.

Example of successful response:

```
{    "id": "e2a85d9f-07a5-4f94-8d5f-789dc3deb097",    "status": 200,    "result": {        "symbol": "BTCUSDT",        "orderId": 12510053279,        "orderListId": -1,        "clientOrderId": "a097fe6304b20a7e4fc436",        "transactTime": 1655716096505,        "price": "0.10000000",        "origQty": "10.00000000",        "executedQty": "0.00000000",        "origQuoteOrderQty": "0.000000",        "cummulativeQuoteQty": "0.00000000",        "status": "NEW",        "timeInForce": "GTC",        "type": "LIMIT",        "side": "BUY",        "workingTime": 1655716096505,        "selfTradePreventionMode": "NONE"    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 12        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 4043        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 321        }    ]}
```

Example of failed response:

```
{    "id": "e2a85d9f-07a5-4f94-8d5f-789dc3deb097",    "status": 400,    "error": {        "code": -2010,        "msg": "Account has insufficient balance for requested action."    },    "rateLimits": [        {            "rateLimitType": "ORDERS",            "interval": "SECOND",            "intervalNum": 10,            "limit": 50,            "count": 13        },        {            "rateLimitType": "ORDERS",            "interval": "DAY",            "intervalNum": 1,            "limit": 160000,            "count": 4044        },        {            "rateLimitType": "REQUEST_WEIGHT",            "interval": "MINUTE",            "intervalNum": 1,            "limit": 6000,            "count": 322        }    ]}
```

Response fields:

Name

Type

Mandatory

Description

`id`

INT / STRING / `null`

YES

Same as in the original request

`status`

INT

YES

Response status. See [Status codes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/response-format)

`result`

OBJECT / ARRAY

YES

Response content. Present if request succeeded

`error`

OBJECT

Error description. Present if request failed

`rateLimits`

ARRAY

NO

Rate limiting status. See [Rate limits](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/response-format)

### Status codes[​](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/response-format)

Status codes in the `status` field are the same as in HTTP.

Here are some common status codes that you might encounter:

-   `200` indicates a successful response.
-   `4XX` status codes indicate invalid requests; the issue is on your side.
    -   `400` – your request failed, see `error` for the reason.
    -   `403` – you have been blocked by the Web Application Firewall. This can indicate a rate limit violation or a security block. See [https://www.binance.com/en/support/faq/detail/360004492232](https://www.binance.com/en/support/faq/detail/360004492232) for more details.
    -   `409` – your request partially failed but also partially succeeded, see `error` for details.
    -   `418` – you have been auto-banned for repeated violation of rate limits.
    -   `429` – you have exceeded API request rate limit, please slow down.
-   `5XX` status codes indicate internal errors; the issue is on Binance's side.
    -   **Important:** If a response contains 5xx status code, it **does not** necessarily mean that your request has failed. Execution status is _unknown_ and the request might have actually succeeded. Please use query methods to confirm the status. You might also want to establish a new WebSocket connection for that.

See [Error codes for Binance](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors) for a list of error codes and messages.

-   [Status codes](https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/response-format)
