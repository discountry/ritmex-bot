---
title: "General Info | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info"
fetched_at: "2026-01-27T05:28:15.359Z"
---
# General Info

## General API Information[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   The following base endpoints are available:
    -   **[https://api.binance.com](https://api.binance.com/)**
    -   **[https://api1.binance.com](https://api1.binance.com/)**
    -   **[https://api2.binance.com](https://api2.binance.com/)**
    -   **[https://api3.binance.com](https://api3.binance.com/)**
    -   **[https://api4.binance.com](https://api4.binance.com/)**
-   The last 4 endpoints in the point above (`api1`\-`api4`) might give better performance but have less stability. Please use whichever works best for your setup.
-   All endpoints return either a JSON object or array.
-   Data is returned in **ascending** order. Oldest first, newest last.
-   All time and timestamp related fields are in **milliseconds**.
-   The base endpoint **[https://data-api.binance.vision](https://data-api.binance.vision/)** can be used to access the following API endpoints that have `NONE` as security type:
    -   [GET /api/v3/aggTrades](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/avgPrice](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/depth](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/exchangeInfo](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/klines](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/ping](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/ticker](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/ticker/24hr](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/ticker/bookTicker](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/ticker/price](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/time](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/trades](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [GET /api/v3/uiKlines](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

### HTTP Return Codes[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   HTTP `4XX` return codes are used for malformed requests; the issue is on the sender's side.
-   HTTP `403` return code is used when the WAF Limit (Web Application Firewall) has been violated.
-   HTTP `409` return code is used when a cancelReplace order partially succeeds. (e.g. if the cancellation of the order fails but the new order placement succeeds.)
-   HTTP `429` return code is used when breaking a request rate limit.
-   HTTP `418` return code is used when an IP has been auto-banned for continuing to send requests after receiving `429` codes.
-   HTTP `5XX` return codes are used for internal errors; the issue is on Binance's side. It is important to **NOT** treat this as a failure operation; the execution status is **UNKNOWN** and could have been a success.

### Error Codes and Messages[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   If there is an error, the API will return an error with a message of the reason.

> The error payload on API and SAPI is as follows:

```
{  "code": -1121,  "msg": "Invalid symbol."}
```

-   Specific error codes and messages defined in [Error Codes](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info).

### General Information on Endpoints[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   For `GET` endpoints, parameters must be sent as a `query string`.
-   For `POST`, `PUT`, and `DELETE` endpoints, the parameters may be sent as a `query string` or in the `request body` with content type `application/x-www-form-urlencoded`. You may mix parameters between both the `query string` and `request body` if you wish to do so.
-   Parameters may be sent in any order.
-   If a parameter sent in both the `query string` and `request body`, the `query string` parameter will be used.

---

## LIMITS[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

### General Info on Limits[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   The following `intervalLetter` values for headers:
    -   SECOND => S
    -   MINUTE => M
    -   HOUR => H
    -   DAY => D
-   `intervalNum` describes the amount of the interval. For example, `intervalNum` 5 with `intervalLetter` M means "Every 5 minutes".
-   The `/api/v3/exchangeInfo` `rateLimits` array contains objects related to the exchange's `RAW_REQUESTS`, `REQUEST_WEIGHT`, and `ORDERS` rate limits. These are further defined in the `ENUM definitions` section under `Rate limiters (rateLimitType)`.
-   A 429 will be returned when either request rate limit or order rate limit is violated.

### IP Limits[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   Every request will contain `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` in the response headers which has the current used weight for the IP for all request rate limiters defined.
-   Each route has a `weight` which determines for the number of requests each endpoint counts for. Heavier endpoints and endpoints that do operations on multiple symbols will have a heavier `weight`.
-   When a 429 is received, it's your obligation as an API to back off and not spam the API.
-   **Repeatedly violating rate limits and/or failing to back off after receiving 429s will result in an automated IP ban (HTTP status 418).**
-   IP bans are tracked and **scale in duration** for repeat offenders, **from 2 minutes to 3 days**.
-   A `Retry-After` header is sent with a 418 or 429 responses and will give the **number of seconds** required to wait, in the case of a 429, to prevent a ban, or, in the case of a 418, until the ban is over.
-   **The limits on the API are based on the IPs, not the API keys.**

### Order Rate Limits[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   Every successful order response will contain a `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)` header which has the current order count for the account for all order rate limiters defined.
    
-   When the order count exceeds the limit, you will receive a 429 error without the `Retry-After` header. Please check the Order Rate Limit rules using `GET api/v3/exchangeInfo` and wait for reactivation accordingly.
    
-   Rejected/unsuccessful orders are not guaranteed to have `X-MBX-ORDER-COUNT-**` headers in the response.
    
-   **The order rate limit is counted against each account**.
    
-   To monitor order count usage, refer to GET `api/v3/rateLimit/order`
    

### Websocket Limits[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   WebSocket connections have a limit of 5 incoming messages per second. A message is considered:
    -   A PING frame
    -   A PONG frame
    -   A JSON controlled message (e.g. subscribe, unsubscribe)
-   A connection that goes beyond the limit will be disconnected; IPs that are repeatedly disconnected may be banned.
-   A single connection can listen to a maximum of 1024 streams.
-   There is a limit of **300 connections per attempt every 5 minutes per IP**.

### /api/ and /sapi/ Limit Introduction[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

The `/api/*` and `/sapi/*` endpoints adopt either of two access limiting rules, IP limits or UID (account) limits.

-   Endpoints related to `/api/*`:
    
    -   According to the two modes of IP and UID (account) limit, each are independent.
    -   Endpoints share the 6000 per minute limit based on IP.
    -   Responses contain the header `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)`, defining the weight used by the current IP.
    -   Successful order responses contain the header `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)`, defining the order limit used by the UID.
-   Endpoints related to `/sapi/*`:
    
    -   Endpoints are marked according to IP or UID limit and their corresponding weight value.
    -   Each endpoint with IP limits has an independent 12000 per minute limit.
    -   Each endpoint with UID limits has an independent 180000 per minute limit.
    -   Responses from endpoints with IP limits contain the header `X-SAPI-USED-IP-WEIGHT-1M`, defining the weight used by the current IP.
    -   Responses from endpoints with UID limits contain the header `X-SAPI-USED-UID-WEIGHT-1M`, defining the weight used by the current UID.

---

## Data Sources[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   The API system is asynchronous, so some delay in the response is normal and expected.
-   Each endpoint has a data source indicating where the data is being retrieved, and thus which endpoints have the most up-to-date response.

These are the three sources, ordered by which is has the most up-to-date response to the one with potential delays in updates.

-   **Matching Engine** - the data is from the matching Engine
-   **Memory** - the data is from a server's local or external memory
-   **Database** - the data is taken directly from a database

## Endpoint security type[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   Each endpoint has a security type that determines how you will interact with it. This is stated next to the NAME of the endpoint.
    -   If no security type is stated, assume the security type is NONE.
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

MARGIN

Endpoint requires sending a valid API-Key and signature.

USER\_DATA

Endpoint requires sending a valid API-Key and signature.

USER\_STREAM

Endpoint requires sending a valid API-Key.

MARKET\_DATA

Endpoint requires sending a valid API-Key.

-   `TRADE`, `MARGIN` and `USER_DATA` endpoints are `SIGNED` endpoints.

---

## SIGNED (TRADE, USER\_DATA, AND MARGIN) Endpoint security[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   `SIGNED` endpoints require an additional parameter, `signature`, to be sent in the `query string` or `request body`.
-   Endpoints use `HMAC SHA256` signatures. The `HMAC SHA256 signature` is a keyed `HMAC SHA256` operation. Use your `secretKey` as the key and `totalParams` as the value for the HMAC operation.
-   The `signature` is **not case sensitive**.
-   `totalParams` is defined as the `query string` concatenated with the `request body`.

### Timing security[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   A `SIGNED` endpoint also requires a parameter, `timestamp`, to be sent which should be the millisecond timestamp of when the request was created and sent.
-   An additional parameter, `recvWindow`, may be sent to specify the number of milliseconds after `timestamp` the request is valid for. If `recvWindow` is not sent, **it defaults to 5000**.

> The logic is as follows:

```
  if (timestamp < (serverTime + 1000) && (serverTime - timestamp) <= recvWindow)  {    // process request  }   else   {    // reject request  }
```

**Serious trading is about timing.** Networks can be unstable and unreliable, which can lead to requests taking varying amounts of time to reach the servers. With `recvWindow`, you can specify that the request must be processed within a certain number of milliseconds or be rejected by the server.

### SIGNED Endpoint Examples for POST /api/v3/order - HMAC Keys[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

Here is a step-by-step example of how to send a vaild signed payload from the Linux command line using `echo`, `openssl`, and `curl`.

Key

Value

apiKey

vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A

secretKey

NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j

Parameter

Value

symbol

LTCBTC

side

BUY

type

LIMIT

timeInForce

GTC

quantity

1

price

0.1

recvWindow

5000

timestamp

1499827319559

**Example 1: As a request body**

> **Example 1**

> **HMAC SHA256 signature:**

```
    $ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"    (stdin)= c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71
```

> **curl command:**

```
    (HMAC SHA256)    $ curl -H "X-MBX-APIKEY: vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A" -X POST 'https://api.binance.com/api/v3/order' -d 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559&signature=c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71'    
```

-   **requestBody:**

symbol=LTCBTC  
&side=BUY  
&type=LIMIT  
&timeInForce=GTC  
&quantity=1  
&price=0.1  
&recvWindow=5000  
&timestamp=1499827319559

**Example 2: As a query string**

> **Example 2**

> **HMAC SHA256 signature:**

```
    $ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"    (stdin)= c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71    
```

> **curl command:**

```
    (HMAC SHA256)   $ curl -H "X-MBX-APIKEY: vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A" -X POST 'https://api.binance.com/api/v3/order?symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559&signature=c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71'    
```

-   **queryString:**

symbol=LTCBTC  
&side=BUY  
&type=LIMIT  
&timeInForce=GTC  
&quantity=1  
&price=0.1  
&recvWindow=5000  
&timestamp=1499827319559

**Example 3: Mixed query string and request body**

> **Example 3**

> **HMAC SHA256 signature:**

```
   $ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTCquantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"    (stdin)= 0fd168b8ddb4876a0358a8d14d0c9f3da0e9b20c5d52b2a00fcf7d1c602f9a77    
```

> **curl command:**

```
    (HMAC SHA256)    $ curl -H "X-MBX-APIKEY: vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A" -X POST 'https://api.binance.com/api/v3/order?symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC' -d 'quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559&signature=0fd168b8ddb4876a0358a8d14d0c9f3da0e9b20c5d52b2a00fcf7d1c602f9a77'
```

-   **queryString:**

symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC

-   **requestBody:**

quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559

Note that the signature is different in example 3. There is no & between "GTC" and "quantity=1".

### SIGNED Endpoint Example for POST /api/v3/order - RSA Keys[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)

-   This will be a step by step process how to create the signature payload to send a valid signed payload.
-   We support `PKCS#8` currently.
-   To get your API key, you need to upload your RSA Public Key to your account and a corresponding API key will be provided for you.

For this example, the private key will be referenced as `test-prv-key.pem`

Key

Value

apiKey

CAvIjXy3F44yW6Pou5k8Dy1swsYDWJZLeoK2r8G4cFDnE9nosRppc2eKc1T8TRTQ

Parameter

Value

symbol

BTCUSDT

side

SELL

type

LIMIT

timeInForce

GTC

quantity

1

price

0.2

recvWindow

5000

timestamp

1668481559918

> **Signature payload (with the listed parameters):**

```
symbol=BTCUSDT&side=SELL&type=LIMIT&timeInForce=GTC&quantity=1&price=0.2&timestamp=1668481559918&recvWindow=5000
```

**Step 1: Construct the payload**

Arrange the list of parameters into a string. Separate each parameter with a `&`.

**Step 2: Compute the signature:**

2.1 - Encode signature payload as ASCII data.

> **Step 2.2**

```
 $ echo -n 'symbol=BTCUSDT&side=SELL&type=LIMIT&timeInForce=GTC&quantity=1&price=0.2&timestamp=1668481559918&recvWindow=5000' | openssl dgst -sha256 -sign ./test-prv-key.pem
```

2.2 - Sign payload using RSASSA-PKCS1-v1\_5 algorithm with SHA-256 hash function.

> **Step 2.3**

```
$  echo -n 'symbol=BTCUSDT&side=SELL&type=LIMIT&timeInForce=GTC&quantity=1&price=0.2&timestamp=1668481559918&recvWindow=5000' | openssl dgst -sha256 -sign ./test-prv-key.pem | openssl enc -base64 -AHZ8HOjiJ1s/igS9JA+n7+7Ti/ihtkRF5BIWcPIEluJP6tlbFM/Bf44LfZka/iemtahZAZzcO9TnI5uaXh3++lrqtNonCwp6/245UFWkiW1elpgtVAmJPbogcAv6rSlokztAfWk296ZJXzRDYAtzGH0gq7CgSJKfH+XxaCmR0WcvlKjNQnp12/eKXJYO4tDap8UCBLuyxDnR7oJKLHQHJLP0r0EAVOOSIbrFang/1WOq+Jaq4Efc4XpnTgnwlBbWTmhWDR1pvS9iVEzcSYLHT/fNnMRxFc7u+j3qI//5yuGuu14KR0MuQKKCSpViieD+fIti46sxPTsjSemoUKp0oXA==
```

2.3 - Encode output as base64 string.

> **Step 2.4**

```
HZ8HOjiJ1s%2FigS9JA%2Bn7%2B7Ti%2FihtkRF5BIWcPIEluJP6tlbFM%2FBf44LfZka%2FiemtahZAZzcO9TnI5uaXh3%2B%2BlrqtNonCwp6%2F245UFWkiW1elpgtVAmJPbogcAv6rSlokztAfWk296ZJXzRDYAtzGH0gq7CgSJKfH%2BXxaCmR0WcvlKjNQnp12%2FeKXJYO4tDap8UCBLuyxDnR7oJKLHQHJLP0r0EAVOOSIbrFang%2F1WOq%2BJaq4Efc4XpnTgnwlBbWTmhWDR1pvS9iVEzcSYLHT%2FfNnMRxFc7u%2Bj3qI%2F%2F5yuGuu14KR0MuQKKCSpViieD%2BfIti46sxPTsjSemoUKp0oXA%3D%3D
```

2.4 - Since the signature may contain `/` and `=`, this could cause issues with sending the request. So the signature has to be URL encoded.

> **Step 2.5**

```
 curl -H "X-MBX-APIKEY: CAvIjXy3F44yW6Pou5k8Dy1swsYDWJZLeoK2r8G4cFDnE9nosRppc2eKc1T8TRTQ" -X POST 'https://api.binance.com/api/v3/order?symbol=BTCUSDT&side=SELL&type=LIMIT&timeInForce=GTC&quantity=1&price=0.2&timestamp=1668481559918recvWindow=5000&signature=HZ8HOjiJ1s%2FigS9JA%2Bn7%2B7Ti%2FihtkRF5BIWcPIEluJP6tlbFM%2FBf44LfZka%2FiemtahZAZzcO9TnI5uaXh3%2B%2BlrqtNonCwp6%2F245UFWkiW1elpgtVAmJPbogcAv6rSlokztAfWk296ZJXzRDYAtzGH0gq7CgSJKfH%2BXxaCmR0WcvlKjNQnp12%2FeKXJYO4tDap8UCBLuyxDnR7oJKLHQHJLP0r0EAVOOSIbrFang%2F1WOq%2BJaq4Efc4XpnTgnwlBbWTmhWDR1pvS9iVEzcSYLHT%2FfNnMRxFc7u%2Bj3qI%2F%2F5yuGuu14KR0MuQKKCSpViieD%2BfIti46sxPTsjSemoUKp0oXA%3D%3D'
```

2.5 - curl command

> **Bash script**

```
#!/usr/bin/env bash# Set up authentication:API_KEY="put your own API Key here"PRIVATE_KEY_PATH="test-prv-key.pem"# Set up the request:API_METHOD="POST"API_CALL="api/v3/order"API_PARAMS="symbol=BTCUSDT&side=SELL&type=LIMIT&timeInForce=GTC&quantity=1&price=0.2"# Sign the request:timestamp=$(date +%s000)api_params_with_timestamp="$API_PARAMS&timestamp=$timestamp"signature=$(echo -n "$api_params_with_timestamp" \            | openssl dgst -sha256 -sign "$PRIVATE_KEY_PATH" \            | openssl enc -base64 -A)# Send the request:curl -H "X-MBX-APIKEY: $API_KEY" -X "$API_METHOD" \    "https://api.binance.com/$API_CALL?$api_params_with_timestamp" \    --data-urlencode "signature=$signature"
```

A sample Bash script containing similar steps is available in the right side.

-   [General API Information](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [HTTP Return Codes](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [Error Codes and Messages](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [General Information on Endpoints](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
-   [LIMITS](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [General Info on Limits](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [IP Limits](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [Order Rate Limits](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [Websocket Limits](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [/api/ and /sapi/ Limit Introduction](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
-   [Data Sources](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
-   [Endpoint security type](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
-   [SIGNED (TRADE, USER\_DATA, AND MARGIN) Endpoint security](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [Timing security](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [SIGNED Endpoint Examples for POST /api/v3/order - HMAC Keys](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
    -   [SIGNED Endpoint Example for POST /api/v3/order - RSA Keys](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/general-info)
