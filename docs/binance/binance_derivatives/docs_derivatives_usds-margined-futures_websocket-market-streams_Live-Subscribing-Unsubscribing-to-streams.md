---
title: "Live Subscribing Unsubscribing To Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams"
fetched_at: "2026-01-27T05:28:35.108Z"
---
# Live Subscribing/Unsubscribing to streams

-   The following data can be sent through the websocket instance in order to subscribe/unsubscribe from streams. Examples can be seen below.
-   The `id` used in the JSON payloads is an unsigned INT used as an identifier to uniquely identify the messages going back and forth.

## Subscribe to a stream[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{      "method": "SUBSCRIBE",      "params":       [       "btcusdt@aggTrade",        "btcusdt@depth"       ],      "id": 1   }
```

> **Response**

```
{  "result": null,  "id": 1}
```

## Unsubscribe to a stream[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{     "method": "UNSUBSCRIBE",      "params":       [        "btcusdt@depth"     ],      "id": 312   }
```

> **Response**

```
{  "result": null,  "id": 312}
```

## Listing Subscriptions[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{     "method": "LIST_SUBSCRIPTIONS",      "id": 3   }     
```

> **Response**

```
{  "result": [    "btcusdt@aggTrade"  ],  "id": 3}
```

## Setting Properties[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

Currently, the only property can be set is to set whether `combined` stream payloads are enabled are not. The combined property is set to `false` when connecting using `/ws/` ("raw streams") and `true` when connecting using `/stream/`.

> **Request**

```
{      "method": "SET_PROPERTY",      "params":       [       "combined",        true     ],      "id": 5   }
```

> **Response**

```
{  "result": null,  "id": 5}
```

## Retrieving Properties[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{     "method": "GET_PROPERTY",      "params":       [       "combined"     ],      "id": 2   }   
```

> **Response**

```
{  "result": true, // Indicates that combined is set to true.  "id": 2}
```

### Error Messages[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

Error Message

Description

{"code": 0, "msg": "Unknown property"}

Parameter used in the `SET_PROPERTY` or `GET_PROPERTY` was invalid

{"code": 1, "msg": "Invalid value type: expected Boolean"}

Value should only be `true` or `false`

{"code": 2, "msg": "Invalid request: property name must be a string"}

Property name provided was invalid

{"code": 2, "msg": "Invalid request: request ID must be an unsigned integer"}

Parameter `id` had to be provided or the value provided in the `id` parameter is an unsupported type

{"code": 2, "msg": "Invalid request: unknown variant %s, expected one of `SUBSCRIBE`, `UNSUBSCRIBE`, `LIST_SUBSCRIPTIONS`, `SET_PROPERTY`, `GET_PROPERTY` at line 1 column 28"}

Possible typo in the provided method or provided method was neither of the expected values

{"code": 2, "msg": "Invalid request: too many parameters"}

Unnecessary parameters provided in the data

{"code": 2, "msg": "Invalid request: property name must be a string"}

Property name was not provided

{"code": 2, "msg": "Invalid request: missing field `method` at line 1 column 73"}

`method` was not provided in the data

{"code":3,"msg":"Invalid JSON: expected value at line %s column %s"}

JSON data sent has incorrect syntax.

-   [Subscribe to a stream](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Unsubscribe to a stream](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Listing Subscriptions](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Setting Properties](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Retrieving Properties](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
    -   [Error Messages](https://developers.binance.com/docs/derivatives/usds-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
