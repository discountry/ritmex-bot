---
title: "General Info | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/general-info"
fetched_at: "2026-01-27T05:28:19.234Z"
---
# General Info

## General API Information[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   The base endpoint is: **[https://papi.binance.com](https://papi.binance.com/)**
-   All endpoints return either a JSON object or raw primitive.
-   Data is returned in ascending order. Oldest first, newest last.
-   All time and timestamp related fields are in UTC milliseconds.
-   All data types adopt definition in JAVA.

### HTTP Return Codes[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   HTTP `4XX` return codes are used for for malformed requests; the issue is on the sender's side.
-   HTTP `403` return code is used when the WAF Limit (Web Application Firewall) has been violated.
-   HTTP `429` return code is used when breaking a request rate limit.
-   HTTP `418` return code is used when an IP has been auto-banned for continuing to send requests after receiving `429` codes.
-   HTTP `5XX` return codes are used for internal errors; the issue is on Binance's side.
    1.  If there is an error message "Request occur unknown error.", please retry later.
-   HTTP `503` return code is used when:
    1.  If there is an error message "Unknown error, please check your request or try again later." returned in the response, the API successfully sent the request but not get a response within the timeout period.It is important to NOT treat this as a failure operation; the execution status is UNKNOWN and could have been a success;
    2.  If there is an error message "Service Unavailable." returned in the response, it means this is a failure API operation and the service might be unavailable at the moment, you need to retry later.
    3.  If there is an error message "Internal error; unable to process your request. Please try again." returned in the response, it means this is a failure API operation and you can resend your request if you need.
    4.  If the response contains the error message **"Request throttled by system-level protection. Reduce-only/close-position orders are exempt. Please try again." (-1008)**, This indicates the node has exceeded its maximum concurrency and is temporarily throttled. Close-position, reduce-only, and cancel orders are exempt and will not receive this error.

### HTTP 503 Status: Message Variants & Handling[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

---

#### A. “Unknown error, please check your request or try again later.” (Execution status **unknown**)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   **Meaning**: Request accepted but no response before timeout; **execution may have succeeded**.
-   **Handling**:
    -   **Do not treat as immediate failure**; first verify via **WebSocket updates** or **orderId queries** to avoid duplicates.
    -   During peaks, prefer **single orders** over batch to reduce uncertainty.
-   **Rate-limit counting**: **May or may not** count, check header to verify rate limit info

---

#### B. “Service Unavailable.” (Failure)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   **Meaning**: Service temporarily unavailable; **100% failure**.
-   **Handling**: **Retry with exponential backoff** (e.g., 200ms → 400ms → 800ms, max 3–5 attempts).
-   **Rate-limit counting**: **not counted**

---

##### C. “Request throttled by system-level protection. Reduce-only/close-position orders are exempt. Please try again.” (**\-1008**, Failure)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   **Meaning**: System overload; **100% failure**.
-   **Handling**: **Retry with backoff** and **reduce concurrency**;
-   **Applicable endpoints**:
    -   `POST /fapi/v1/order` / `POST /dapi/v1/order` / `POST /papi/v1/order`
    -   `POST /fapi/v1/batchOrders` / `POST /dapi/v1/batchOrders` / `POST papi/v1/batchOrders`
-   **Rate-limit counting**: **Not counted** (overload protection).
-   **Exception integrated here**: When a request **reduces exposure** (Reduce-only / Close-position: `closePosition = true`, or `positionSide = BOTH` with `reduceOnly = true`, or `LONG+SELL`, or `SHORT+BUY`), it is **not affected or prioritized under -1008** to ensure risk reduction.
    -   Covered endpoints: `POST /fapi/v1/order`、`POST /dapi/v1/order`、`POST /papi/v1/order`、`POST /fapi/v1/batchOrders`、`POST /dapi/v1/batchOrders`、`POST /papi/v1/batchOrders` (when parameters satisfy the condition)

### Error Codes and Messages[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   Any endpoint can return an ERROR
-   Specific error codes and messages defined in Error Codes.

### General Information on Endpoints[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   For `GET` endpoints, parameters must be sent as a `query string`.
-   For `POST`, `PUT`, and `DELETE` endpoints, the parameters may be sent as a `query string` or in the `request body` with content type `application/x-www-form-urlencoded`. You may mix parameters between both the `query string` and `request body` if you wish to do so.
-   Parameters may be sent in any order.
-   If a parameter sent in both the `query string` and `request body`, the `query string` parameter will be used.

## LIMITS[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   A `429` will be returned when either rate limit is violated.

### IP Limits[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   Every request will contain `X-MBX-USED-WEIGHT-(intervalNum)(intervalLetter)` in the response headers which has the current used weight for the IP for all request rate limiters defined.
-   Each route has a `weight` which determines for the number of requests each endpoint counts for. Heavier endpoints and endpoints that do operations on multiple symbols will have a heavier `weight`.
-   When a `429` is received, it's your obligation as an API to back off and not spam the API.
-   **Repeatedly violating rate limits and/or failing to back off after receiving 429s will result in an automated IP ban (HTTP status 418).**
-   IP bans are tracked and **scale in duration** for repeat offenders, **from 2 minutes to 3 days**.
-   **The limits on the API are based on the IPs, not the API keys.**
-   Portfolio Margin IP Limit is 6000/min.

### Order Rate Limits[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   Every order response will contain a `X-MBX-ORDER-COUNT-(intervalNum)(intervalLetter)` header which has the current order count for the account for all order rate limiters defined.
-   Rejected/unsuccessful orders are not guaranteed to have `X-MBX-ORDER-COUNT-**` headers in the response.
-   **The order rate limit is counted against each account**.
-   Portfolio Margin Order Limits are 1200/min.

## Endpoint Security Type[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   Each endpoint has a security type that determines the how you will interact with it.
-   API-keys are passed into the Rest API via the `X-MBX-APIKEY` header.
-   API-keys and secret-keys are **case sensitive**.
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

Endpoint requires sending a valid API-Key and signature.

## SIGNED (TRADE and USER\_DATA) Endpoint Security[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   `SIGNED` endpoints require an additional parameter, signature, to be sent in the `query string` or `request body`.
-   Endpoints use `HMAC SHA256` signatures. The `HMAC SHA256` signature is a keyed `HMAC SHA256` operation. Use your `secretKey` as the key and `totalParams` as the value for the HMAC operation.
-   The `signature` is not case sensitive.
-   Please make sure the `signature` is the end part of your `query string` or `request body`.
-   `totalParam`s is defined as the `query string` concatenated with the `request body`.

### Timing security[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   A `SIGNED` endpoint also requires a parameter, `timestamp`, to be sent which should be the millisecond timestamp of when the request was created and sent.
-   An additional parameter, `recvWindow`, may be sent to specify the number of milliseconds after `timestamp` the request is valid for. If `recvWindow` is not sent, **it defaults to 5000**. `recvWindow` cannot exceed 60000.
-   If the server determines that the timestamp sent by the client is more than one second in the future of the server time, the request will also be rejected.

**Serious trading is about timing.** Networks can be unstable and unreliable, which can lead to requests taking varying amounts of time to reach the servers. With `recvWindow`, you can specify that the request must be processed within a certain number of milliseconds or be rejected by the server.

### SIGNED Endpoint Examples for POST /papi/v1/um/order[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

Here is a step-by-step example of how to send a valid signed payload from the Linux command line using `echo`, `openssl`, and `curl`.

Key

Value

apiKey

22BjeOROKiXJ3NxbR3zjh3uoGcaflPu3VMyBXAg8Jj2J1xVSnY0eB4dzacdE9IWn

secretKey

YtP1BudNOWZE1ag5uzCkh4hIC7qSmQOu797r5EJBFGhxBYivjj8HIX0iiiPof5yG

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

2000

recvWindow

5000

timestamp

1611825601400

#### Example 1: As a request body[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

> **Example 1**

> **HMAC SHA256 signature:**

```
    $ echo -n "symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400" | openssl dgst -sha256 -hmac "YtP1BudNOWZE1ag5uzCkh4hIC7qSmQOu797r5EJBFGhxBYivjj8HIX0iiiPof5yG"    (stdin)= 7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7
```

> **curl command:**

```
    (HMAC SHA256)    $ curl -H "X-MBX-APIKEY: 22BjeOROKiXJ3NxbR3zjh3uoGcaflPu3VMyBXAg8Jj2J1xVSnY0eB4dzacdE9IWn" -X POST 'https://papi.binance.com/papi/v1/order' -d 'symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400&signature=7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7'    
```

-   **requestBody:**

symbol=BTCUSDT &side=BUY  
&type=LIMIT  
&timeInForce=GTC  
&quantity=1  
&price=2000  
&recvWindow=5000  
&timestamp=1611825601400

#### Example 2: As a query string[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

> **Example 2**

> **HMAC SHA256 signature:**

```
    $ echo -n "symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400" | openssl dgst -sha256 -hmac "YtP1BudNOWZE1ag5uzCkh4hIC7qSmQOu797r5EJBFGhxBYivjj8HIX0iiiPof5yG"    (stdin)= 7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7
```

> **curl command:**

```
    (HMAC SHA256)   $ curl -H "X-MBX-APIKEY: 22BjeOROKiXJ3NxbR3zjh3uoGcaflPu3VMyBXAg8Jj2J1xVSnY0eB4dzacdE9IWn" -X POST 'https://papi.binance.com/papi/v1/order?symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400&signature=7c12045972f6140e765e0f2b67d28099718df805732676494238f50be830a7d7'
```

-   **queryString:**
    
    symbol=BTCUSDT  
    &side=BUY  
    &type=LIMIT  
    &timeInForce=GTC  
    &quantity=1  
    &price=2000  
    &recvWindow=5000  
    &timestamp=1611825601400
    

#### Example 3: Mixed query string and request body[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

> **Example 3**

> **HMAC SHA256 signature:**

```
   $ echo -n "symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTCquantity=0.01&price=2000&recvWindow=5000&timestamp=1611825601400" | openssl dgst -sha256 -hmac "YtP1BudNOWZE1ag5uzCkh4hIC7qSmQOu797r5EJBFGhxBYivjj8HIX0iiiPof5yG"    (stdin)= fa6045c54fb02912b766442be1f66fab619217e551a4fb4f8a1ee000df914d8e 
```

> **curl command:**

```
    (HMAC SHA256)    $ curl -H "X-MBX-APIKEY: 22BjeOROKiXJ3NxbR3zjh3uoGcaflPu3VMyBXAg8Jj2J1xVSnY0eB4dzacdE9IWn" -X POST 'https://papi.binance.com/papi/v1/order?symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC' -d 'quantity=0.01&price=2000&recvWindow=5000&timestamp=1611825601400&signature=fa6045c54fb02912b766442be1f66fab619217e551a4fb4f8a1ee000df914d8e'
```

-   **queryString:**

symbol=BTCUSDT&side=BUY&type=LIMIT&timeInForce=GTC

-   **requestBody:**

quantity=1&price=2000&recvWindow=5000&timestamp=1611825601400

Note that the signature is different in example 3. There is no & between "GTC" and "quantity=1".

### RSA Keys - SIGNED Endpoint Examples for POST /papi/v1/um/order[​](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)

-   This will be a step by step process how to create the signature payload to send a valid signed payload.
-   We support `PKCS#8` currently.
-   To get your API key, you need to upload your RSA Public Key to your account and a corresponding API key will be provided for you.

For this example, the private key will be referenced as `test-prv-key.pem`

Key

Value

apiKey

vE3BDAL1gP1UaexugRLtteaAHg3UO8Nza20uexEuW1Kh3tVwQfFHdAiyjjY428o2

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

2000

recvWindow

5000

timestamp

1611825601400

**Step 1: Construct the payload**

Arrange the list of parameters into a string. Separate each parameter with a `&`.

**Step 2: Compute the signature:**

2.1 - Encode signature payload as ASCII data.

> **Step 2.2**

```
 $ echo -n 'timestamp=1671090801999&recvWindow=9999999&symbol=BTCUSDT&side=SELL&type=MARKET&quantity=1.23' | openssl dgst -keyform PEM -sha256 -sign ./test-prv-key.pem
```

2.2 - Sign payload using RSASSA-PKCS1-v1\_5 algorithm with SHA-256 hash function.

> **Step 2.3**

```
$ echo -n 'timestamp=1671090801999&recvWindow=9999999&symbol=BTCUSDT&side=SELL&type=MARKET&quantity=1.23' | openssl dgst -keyform PEM -sha256 -sign ./test-prv-key.pem | openssl enc -base64aap36wD5loVXizxvvPI3wz9Cjqwmb3KVbxoym0XeWG1jZq8umqrnSk8H8dkLQeySjgVY91Ufs%2BBGCW%2B4sZjQEpgAfjM76riNxjlD3coGGEsPsT2lG39R%2F1q72zpDs8pYcQ4A692NgHO1zXcgScTGgdkjp%2Brp2bcddKjyz5XBrBM%3D
```

2.3 - Encode output as base64 string.

> **Step 2.4**

```
$  echo -n 'timestamp=1671090801999&recvWindow=9999999&symbol=BTCUSDT&side=SELL&type=MARKET&quantity=1.23' | openssl dgst -keyform PEM -sha256 -sign ./test-prv-key.pem | openssl enc -base64 | tr -d '\n'aap36wD5loVXizxvvPI3wz9Cjqwmb3KVbxoym0XeWG1jZq8umqrnSk8H8dkLQeySjgVY91Ufs%2BBGCW%2B4sZjQEpgAfjM76riNxjlD3coGGEsPsT2lG39R%2F1q72zpDs8pYcQ4A692NgHO1zXcgScTGgdkjp%2Brp2bcddKjyz5XBrBM%3D
```

2.4 - Delete any newlines in the signature.

> **Step 2.5**

```
aap36wD5loVXizxvvPI3wz9Cjqwmb3KVbxoym0XeWG1jZq8umqrnSk8H8dkLQeySjgVY91Ufs%2BBGCW%2B4sZjQEpgAfjM76riNxjlD3coGGEsPsT2lG39R%2F1q72zpDs8pYcQ4A692NgHO1zXcgScTGgdkjp%2Brp2bcddKjyz5XBrBM%3D
```

2.5 - Since the signature may contain `/` and `=`, this could cause issues with sending the request. So the signature has to be URL encoded.

> **Step 2.6**

```
 curl -H "X-MBX-APIKEY: vE3BDAL1gP1UaexugRLtteaAHg3UO8Nza20uexEuW1Kh3tVwQfFHdAiyjjY428o2" -X POST 'https://papi.binance.com/papi/v1/um/order?timestamp=1671090801999&recvWindow=9999999&symbol=BTCUSDT&side=SELL&type=MARKET&quantity=1.23&signature=aap36wD5loVXizxvvPI3wz9Cjqwmb3KVbxoym0XeWG1jZq8umqrnSk8H8dkLQeySjgVY91Ufs%2BBGCW%2B4sZjQEpgAfjM76riNxjlD3coGGEsPsT2lG39R%2F1q72zpDs8pYcQ4A692NgHO1zXcgScTGgdkjp%2Brp2bcddKjyz5XBrBM%3D'
```

2.6 - curl command

> **Bash script**

```
#!/usr/bin/env bash# Set up authentication:apiKey="vE3BDAL1gP1UaexugRLtteaAHg3UO8Nza20uexEuW1Kh3tVwQfFHdAiyjjY428o2"   ### REPLACE THIS WITH YOUR API KEY# Set up the request:apiMethod="POST"apiCall="v1/order"apiParams="timestamp=1671090801999&recvWindow=9999999&symbol=BTCUSDT&side=SELL&type=MARKET&quantity=1.23"function rawurlencode {    local value="$1"    local len=${#value}    local encoded=""    local pos c o    for (( pos=0 ; pos<len ; pos++ ))    do        c=${value:$pos:1}        case "$c" in            [-_.~a-zA-Z0-9] ) o="${c}" ;;            * )   printf -v o '%%%02x' "'$c"        esac        encoded+="$o"    done    echo "$encoded"}ts=$(date +%s000)paramsWithTs="$apiParams&timestamp=$ts"rawSignature=$(echo -n "$paramsWithTs" \               | openssl dgst -keyform PEM -sha256 -sign ./test-prv-key.pem \  ### THIS IS YOUR PRIVATE KEY. DO NOT SHARE THIS FILE WITH ANYONE.               | openssl enc -base64 \               | tr -d '\n')signature=$(rawurlencode "$rawSignature")curl -H "X-MBX-APIKEY: $apiKey" -X $apiMethod \    "https://papi.binance.com/papi/$apiCall?$paramsWithTs&signature=$signature"
```

A sample Bash script containing similar steps is available in the right side.

-   [General API Information](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [HTTP Return Codes](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [HTTP 503 Status: Message Variants & Handling](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [Error Codes and Messages](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [General Information on Endpoints](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
-   [LIMITS](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [IP Limits](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [Order Rate Limits](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
-   [Endpoint Security Type](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
-   [SIGNED (TRADE and USER\_DATA) Endpoint Security](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [Timing security](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [SIGNED Endpoint Examples for POST /papi/v1/um/order](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
    -   [RSA Keys - SIGNED Endpoint Examples for POST /papi/v1/um/order](https://developers.binance.com/docs/derivatives/portfolio-margin/general-info)
