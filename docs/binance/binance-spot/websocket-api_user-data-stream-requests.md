---
title: "User Data Stream requests | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests"
fetched_at: "2026-02-26T10:38:13.543Z"
---
### User Data Stream subscription[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests)

**General information:**

-   [User Data Stream](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream) subscriptions allow you to receive all the events related to a given account on a WebSocket connection.
-   There are 2 ways to start a subscription:
    -   If you have an authenticated session, then you can subscribe to events for that authenticated account using [`userDataStream.subscribe`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests).
    -   In any session, authenticated or not, you can subscribe to events for one or more accounts for which you can provide an API Key signature, using [`userDataStream.subscribe.signature`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests).
    -   You can have only one active subscription for a given account on a given connection.
-   Subscriptions are identified by a `subscriptionId` which is returned when starting the subscription. That `subscriptionId` allows you to map the events you receive to a given subscription.
    -   All active subscriptions for a session can be found using [`session.subscriptions`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests).
-   Limits
    -   A single session supports **up to 1,000 active subscriptions** simultaneously.
        -   Attempting to start a new subscription beyond this limit will result in an error.
        -   If your accounts are very active, we suggest not opening too many subscriptions at once, in order to not overload your connection.
    -   A single session can handle a maximum of **65,535 total subscriptions** over its lifetime.
        -   If this limit is reached, you will receive an error and must re-establish a new connection to be able to start new subscriptions.
-   To verify the status of User Data Stream subscriptions, check the `userDataStream` field in [`session.status`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests):
    -   `null` - User Data Stream subscriptions are **not available** on this WebSocket API.
    -   `true` - There is at **least one subscription active** in this session.
    -   `false` - There are **no active subscriptions** in this session.

#### Subscribe to User Data Stream (USER\_STREAM)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests)

```
{    "id": "d3df8a21-98ea-4fe0-8f4e-0fcea5d418b7",    "method": "userDataStream.subscribe"}
```

Subscribe to the User Data Stream in the current WebSocket connection.

**Notes:**

-   This method requires an authenticated WebSocket connection using Ed25519 keys. Please refer to [`session.logon`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests).
-   To check the subscription status, use [`session.status`](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/authentication-requests), see the `userDataStream` flag indicating you have have an active subscription.
-   User Data Stream events are available in both JSON and [SBE](https://developers.binance.com/docs/binance-spot-api-docs/faqs/sbe_faq) sessions.
    -   Please refer to [User Data Streams](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream) for the event format details.
    -   For SBE, only SBE schema 2:1 or later is supported.

**Weight**: 2

**Parameters**: NONE

**Response**:

```
{    "id": "d3df8a21-98ea-4fe0-8f4e-0fcea5d418b7",    "status": 200,    "result": {        "subscriptionId": 0    }}
```

#### Unsubscribe from User Data Stream[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests)

```
{    "id": "d3df8a21-98ea-4fe0-8f4e-0fcea5d418b7",    "method": "userDataStream.unsubscribe"}
```

Stop listening to the User Data Stream in the current WebSocket connection.

Note that `session.logout` will only close the subscription created with `userDataStream.subscribe` but not subscriptions opened with `userDataStream.subscribe.signature`.

**Weight**: 2

**Parameters**:

Name

Type

Mandatory

Description

`subscriptionId`

INT

No

When called with no parameter, this will close all subscriptions.  
When called with the `subscriptionId` parameter, this will attempt to close the subscription with that subscription id, if it exists.

**Response**:

```
{    "id": "d3df8a21-98ea-4fe0-8f4e-0fcea5d418b7",    "status": 200,    "result": {}}
```

#### Listing all subscriptions[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests)

```
{    "id": "d3df5a22-88ea-4fe0-9f4e-0fcea5d418b7",    "method": "session.subscriptions",    "params": {}}
```

**Note:**

-   Users are expected to track on their side which subscription corresponds to which account.

**Weight**: 2

**Data Source**: Memory

**Response**:

```
{    "id": "d3df5a22-88ea-4fe0-9f4e-0fcea5d418b7",    "status": 200,    "result": [        {            "subscriptionId": 0        },        {            "subscriptionId": 1        }    ]}
```

#### Subscribe to User Data Stream through signature subscription (USER\_STREAM)[​](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests)

```
{    "id": "d3df8a22-98ea-4fe0-9f4e-0fcea5d418b7",    "method": "userDataStream.subscribe.signature",    "params": {        "apiKey": "mjcKCrJzTU6TChLsnPmgnQJJMR616J4yWvdZWDUeXkk6vL6dLyS7rcVOQlADlVjA",        "timestamp": 1747385641636,        "signature": "yN1vWpXb+qoZ3/dGiFs9vmpNdV7e3FxkA+BstzbezDKwObcijvk/CVkWxIwMCtCJbP270R0OempYwEpS6rDZCQ=="    }}
```

**Weight:** 2

**Parameters**:

Name

Type

Mandatory

Description

`apiKey`

STRING

Yes

`timestamp`

LONG

Yes

`signature`

STRING

Yes

`recvWindow`

DECIMAL

No

The value cannot be greater than `60000`.  
Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.

**Data Source:** Memory

**Response:**

```
{    "id": "d3df8a22-98ea-4fe0-9f4e-0fcea5d418b7",    "status": 200,    "result": {        "subscriptionId": 0    }}
```

-   [User Data Stream subscription](https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/user-data-stream-requests)
