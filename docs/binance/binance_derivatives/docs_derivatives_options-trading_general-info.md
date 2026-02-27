---
title: "General Info | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/general-info"
fetched_at: "2026-01-27T05:28:09.628Z"
---
# General Info

## General API Information[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   Some endpoints will require an API Key. Please refer to [this page](https://www.binance.com/en/support/articles/360002502072)
-   The base endpoint is: \*\*[https://eapi.binance.com](https://eapi.binance.com/)
-   All endpoints return either a JSON object or array.
-   Data is returned in ascending order. Oldest first, newest last.
-   All time and timestamp related fields are in milliseconds.

### Testnet API Information[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   Most of the endpoints can be used in the testnet platform.
-   The REST base url for **testnet** is "[https://testnet.binancefuture.com](https://testnet.binancefuture.com/)"
-   The Websocket base url for **testnet** is:
    -   High Performance Market Data url path:"wss://fstream.binancefuture.com/public/"
    -   Market Data url path: "wss://fstream.binancefuture.com/market/"
    -   Private Data url path: "wss://fstream.binancefuture.com/private/"
-   After generating an API key on the testnet, users can use this API key directly for testnet options trading.

### HTTP Return Codes[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   HTTP `4XX` return codes are used for for malformed requests; the issue is on the sender's side.
-   HTTP `403` return code is used when the WAF Limit (Web Application Firewall) has been violated.
-   HTTP `429` return code is used when breaking a request rate limit.
-   HTTP `418` return code is used when an IP has been auto-banned for continuing to send requests after receiving `429` codes.
-   HTTP `5XX` return codes are used for internal errors; the issue is on Binance's side.
-   HTTP `503` return code is used when:
    1.  If there is an error message **"Unknown error, please check your request or try again later."** returned in the response, the API successfully sent the request but not get a response within the timeout period.  
        It is important to **NOT** treat this as a failure operation; the execution status is **UNKNOWN** and could have been a success;
    2.  If there is an error message **"Service Unavailable."** returned in the response, it means this is a failure API operation and the service might be unavailable at the moment, you need to retry later.
    3.  If there is an error message **"Internal error; unable to process your request. Please try again."** returned in the response, it means this is a failure API operation and you can resend your request if you need.

### Error Codes and Messages[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   Any endpoint can return an ERROR

> **_The error payload is as follows:_**

```
{  "code": -1121,  "msg": "Invalid symbol."}
```

-   Specific error codes and messages defined in [Error Codes](https://developers.binance.com/docs/derivatives/options-trading/general-info).

### General Information on Endpoints[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   For `GET` endpoints, parameters must be sent as a `query string` without setting content type in the http headers.
-   For `POST`, `PUT`, and `DELETE` endpoints, the parameters may be sent as a `query string` or in the `request body` with content type `application/x-www-form-urlencoded`. You may mix parameters between both the `query string` and `request body` if you wish to do so.
-   Parameters may be sent in any order.
-   If a parameter sent in both the `query string` and `request body`, the `query string` parameter will be used.

## LIMITS[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   The `/eapi/v1/exchangeInfo` `rateLimits` array contains objects related to the exchange's `RAW_REQUEST`, `REQUEST_WEIGHT`, and `ORDER` rate limits. These are further defined in the `ENUM definitions` section under `Rate limiters (rateLimitType)`.
-   A `429` will be returned when either rate limit is violated.

### IP Limits[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   Every request will contain `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` in the response headers which has the current used weight for the IP for all request rate limiters defined.
-   Each route has a `weight` which determines for the number of requests each endpoint counts for. Heavier endpoints and endpoints that do operations on multiple symbols will have a heavier `weight`.
-   When a 429 is received, it's your obligation as an API to back off and not spam the API.
-   **Repeatedly violating rate limits and/or failing to back off after receiving 429s will result in an automated IP ban (HTTP status 418).**
-   IP bans are tracked and **scale in duration** for repeat offenders, **from 2 minutes to 3 days**.
-   **The limits on the API are based on the IPs, not the API keys.**

### Order Rate Limits[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   Every order response will contain a `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)` header which has the current order count for the account for all order rate limiters defined.
-   Rejected/unsuccessful orders are not guaranteed to have `X-MBX-ORDER-COUNT-**` headers in the response.
-   **The order rate limit is counted against each account**.

## Endpoint Security Type[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   Each endpoint has a security type that determines the how you will interact with it.
-   API-keys are passed into the Rest API via the `X-MBX-APIKEY` header.
-   API-keys and secret-keys **are case sensitive**.
-   API-keys can be configured to only access certain types of secure endpoints. For example, one API-key could be used for TRADE only, while another API-key can access everything except for TRADE routes.
-   By default, API-keys can access all secure routes.

Security Type

Description

NONE

Endpoint can be accessed freely.

TRADE

Endpoint requires sending a valid API-Key and signature.

USER\_DATA

Endpoint requires sending a valid API-Key and signature.

USER\_STREAM

Endpoint requires sending a valid API-Key.

MARKET\_DATA

Endpoint requires sending a valid API-Key.

-   `TRADE` and `USER_DATA` endpoints are `SIGNED` endpoints.

## SIGNED (TRADE and USER\_DATA) Endpoint Security[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   `SIGNED` endpoints require an additional parameter, `signature`, to be sent in the `query string` or `request body`.
-   Endpoints use `HMAC SHA256` signatures. The `HMAC SHA256 signature` is a keyed `HMAC SHA256` operation. Use your `secretKey` as the key and `totalParams` as the value for the HMAC operation.
-   The `signature` is **not case sensitive**.
-   Please make sure the `signature` is the end part of your `query string` or `request body`.
-   `totalParams` is defined as the `query string` concatenated with the `request body`.

### Timing Security[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

-   A `SIGNED` endpoint also requires a parameter, `timestamp`, to be sent which should be the millisecond timestamp of when the request was created and sent.
-   An additional parameter, `recvWindow`, may be sent to specify the number of milliseconds after `timestamp` the request is valid for. If `recvWindow` is not sent, **it defaults to 5000**.

> The logic is as follows:

```
if (timestamp < serverTime + 1000 && serverTime - timestamp <= recvWindow) {  // process request} else {  // reject request}
```

**Serious trading is about timing.** Networks can be unstable and unreliable, which can lead to requests taking varying amounts of time to reach the servers. With `recvWindow`, you can specify that the request must be processed within a certain number of milliseconds or be rejected by the server.

### SIGNED Endpoint Examples for POST /eapi/v1/order[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

Here is a step-by-step example of how to send a vaild signed payload from the Linux command line using `echo`, `openssl`, and `curl`.

Key

Value

apiKey

dbefbc809e3e83c283a984c3a1459732ea7db1360ca80c5c2c8867408d28cc83

secretKey

2b5eb11e18796d12d88f13dc27dbbd02c2cc51ff7059765ed9821957d82bb4d9

Parameter

Value

symbol

BTCUSDT

side

BUY

type

LIMIT

timeInForce

GTC

quantity

1

price

9000

recvWindow

5000

timestamp

1591702613943

#### Example 1: As a query string[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

> **Example 1**

> **HMAC SHA256 signature:**

```
    $ echo -n "symbol=BTC-210129-40000-C&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400" | openssl dgst -sha256 -hmac "YtP1BudNOWZE1ag5uzCkh4hIC7qSmQOu797r5EJBFGhxBYivjj8HIX0iiiPof5yG"    (stdin)= 7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7
```

> **curl command:**

```
    (HMAC SHA256)    $ curl -H "X-MBX-APIKEY: 22BjeOROKiXJ3NxbR3zjh3uoGcaflPu3VMyBXAg8Jj2J1xVSnY0eB4dzacdE9IWn" -X POST 'https://eapi.binance.com/eapi/v1/order' -d 'symbol=BTC-210129-40000-C&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400&signature=7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7'
```

-   **requestBody:**

symbol=BTC-210129-40000-C  
&side=BUY  
&type=LIMIT  
&timeInForce=GTC  
&quantity=1  
&price=2000  
&recvWindow=5000  
&timestamp=1611825601400

#### Example 2: As a request body[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

> **Example 2**

> **HMAC SHA256 signature:**

```
    $ echo -n "symbol=BTC-210129-40000-C&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400" | openssl dgst -sha256 -hmac "YtP1BudNOWZE1ag5uzCkh4hIC7qSmQOu797r5EJBFGhxBYivjj8HIX0iiiPof5yG"    (stdin)= 7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7
```

> **curl command:**

```
    (HMAC SHA256)   $ curl -H "X-MBX-APIKEY: 22BjeOROKiXJ3NxbR3zjh3uoGcaflPu3VMyBXAg8Jj2J1xVSnY0eB4dzacdE9IWn" -X POST 'https://eapi.binance.com/eapi/v1/order?symbol=BTC-210129-40000-C&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400&signature=7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7'
```

-   **queryString:**

symbol=BTC-210129-40000-C  
&side=BUY  
&type=LIMIT  
&timeInForce=GTC  
&quantity=1  
&price=2000  
&recvWindow=5000  
&timestamp=1611825601400

#### Example 3: Mixed query string and request body[​](https://developers.binance.com/docs/derivatives/options-trading/general-info)

> **Example 3**

> **HMAC SHA256 signature:**

```
   $ echo -n "symbol=BTC-210129-40000-C&side=BUY&type=LIMIT&timeInForce=GTCquantity=0.01&price=2000&recvWindow=5000&timestamp=1611825601400" | openssl dgst -sha256 -hmac "YtP1BudNOWZE1ag5uzCkh4hIC7qSmQOu797r5EJBFGhxBYivjj8HIX0iiiPof5yG"    (stdin)= fa6045c54fb02912b766442be1f66fab619217e551a4fb4f8a1ee000df914d8e
```

> **curl command:**

```
    (HMAC SHA256)    $ curl -H "X-MBX-APIKEY: 22BjeOROKiXJ3NxbR3zjh3uoGcaflPu3VMyBXAg8Jj2J1xVSnY0eB4dzacdE9IWn" -X POST 'https://eapi.binance.com/eapi/v1/order?symbol=BTC-210129-40000-C&side=BUY&type=LIMIT&timeInForce=GTC' -d 'quantity=0.01&price=2000&recvWindow=5000&timestamp=1611825601400&signature=fa6045c54fb02912b766442be1f66fab619217e551a4fb4f8a1ee000df914d8e'
```

-   **queryString:**

symbol=BTC-210129-40000-C&side=BUY&type=LIMIT&timeInForce=GTC

-   **requestBody:**

quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400

Note that the signature is different in example 3. There is no & between "GTC" and "quantity=1".

-   [General API Information](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [Testnet API Information](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [HTTP Return Codes](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [Error Codes and Messages](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [General Information on Endpoints](https://developers.binance.com/docs/derivatives/options-trading/general-info)
-   [LIMITS](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [IP Limits](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [Order Rate Limits](https://developers.binance.com/docs/derivatives/options-trading/general-info)
-   [Endpoint Security Type](https://developers.binance.com/docs/derivatives/options-trading/general-info)
-   [SIGNED (TRADE and USER\_DATA) Endpoint Security](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [Timing Security](https://developers.binance.com/docs/derivatives/options-trading/general-info)
    -   [SIGNED Endpoint Examples for POST /eapi/v1/order](https://developers.binance.com/docs/derivatives/options-trading/general-info)
