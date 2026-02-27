---
title: "Authentication requests | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests"
fetched_at: "2026-02-26T10:38:12.599Z"
---
**Note:** Only _Ed25519_ keys are supported for this feature.

### Log in with API key (SIGNED)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests)

```
{    "id": "c174a2b1-3f51-4580-b200-8528bd237cb7",    "method": "session.logon",    "params": {        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "signature": "1cf54395b336b0a9727ef27d5d98987962bc47aca6e13fe978612d0adee066ed",        "timestamp": 1649729878532    }}
```

Authenticate WebSocket connection using the provided API key.

After calling `session.logon`, you can omit `apiKey` and `signature` parameters for future requests that require them.

Note that only one API key can be authenticated. Calling `session.logon` multiple times changes the current authenticated API key.

**Weight:** 2

**Parameters:**

Name

Type

Mandatory

Description

`apiKey`

STRING

YES

`recvWindow`

DECIMAL

NO

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

`signature`

STRING

YES

`timestamp`

LONG

YES

**Data Source:** Memory

**Response:**

```
{    "id": "c174a2b1-3f51-4580-b200-8528bd237cb7",    "status": 200,    "result": {        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "authorizedSince": 1649729878532,        "connectedSince": 1649729873021,        "returnRateLimits": false,        "serverTime": 1649729878630,        "userDataStream": false // is User Data Stream subscription active?    }}
```

### Query session status[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests)

```
{    "id": "b50c16cd-62c9-4e29-89e4-37f10111f5bf",    "method": "session.status"}
```

Query the status of the WebSocket connection, inspecting which API key (if any) is used to authorize requests.

**Weight:** 2

**Parameters:** NONE

**Data Source:** Memory

**Response:**

```
{    "id": "b50c16cd-62c9-4e29-89e4-37f10111f5bf",    "status": 200,    "result": {        // if the connection is not authenticated, "apiKey" and "authorizedSince" will be shown as null        "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A",        "authorizedSince": 1649729878532,        "connectedSince": 1649729873021,        "returnRateLimits": false,        "serverTime": 1649730611671,        "userDataStream": true     // is User Data Stream subscription active?    }}
```

### Log out of the session[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests)

```
{    "id": "c174a2b1-3f51-4580-b200-8528bd237cb7",    "method": "session.logout"}
```

Forget the API key previously authenticated. If the connection is not authenticated, this request does nothing.

Note that the WebSocket connection stays open after `session.logout` request. You can continue using the connection, but now you will have to explicitly provide the `apiKey` and `signature` parameters where needed.

**Weight:** 2

**Parameters:** NONE

**Data Source:** Memory

**Response:**

```
{    "id": "c174a2b1-3f51-4580-b200-8528bd237cb7",    "status": 200,    "result": {        "apiKey": null,        "authorizedSince": null,        "connectedSince": 1649729873021,        "returnRateLimits": false,        "serverTime": 1649730611671,        "userDataStream": false // is User Data Stream subscription active?    }}
```

-   [Log in with API key (SIGNED)](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests)
-   [Query session status](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests)
-   [Log out of the session](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests)
