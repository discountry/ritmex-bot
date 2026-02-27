---
title: "Live Subscribing Unsubscribing To Streams | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams"
fetched_at: "2026-01-27T05:28:08.730Z"
---
# Live Subscribing/Unsubscribing to streams

-   The following data can be sent through the websocket instance in order to subscribe/unsubscribe from streams. Examples can be seen below.
-   The `id` used in the JSON payloads is an unsigned INT used as an identifier to uniquely identify the messages going back and forth.

## Subscribe to a stream[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{      "method": "SUBSCRIBE",      "params":       [       "btcusd_200925@aggTrade",        "btcusd_200925@depth"       ],      "id": 1   }
```

> **Response**

```
{  "result": null,  "id": 1}
```

## Unsubscribe to a stream[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{     "method": "UNSUBSCRIBE",      "params":       [        "btcusd_200925@depth"     ],      "id": 312   }
```

> **Response**

```
{  "result": null,  "id": 312}
```

## Listing Subscriptions[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{     "method": "LIST_SUBSCRIPTIONS",      "id": 3   }     
```

> **Response**

```
{  "result": [    "btcusd_200925@aggTrade"  ],  "id": 3}
```

## Setting Properties[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

Currently, the only property can be set is to set whether `combined` stream payloads are enabled are not. The combined property is set to `false` when connecting using `/ws/` ("raw streams") and `true` when connecting using `/stream/`.

> **Request**

```
{      "method": "SET_PROPERTY",      "params":       [       "combined",        true     ],      "id": 5   }
```

> **Response**

```
{  "result": null,  "id": 5}
```

## Retrieving Properties[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)

> **Request**

```
{     "method": "GET_PROPERTY",      "params":       [       "combined"     ],      "id": 2   }   
```

> **Response**

```
{  "result": true, // Indicates that combined is set to true.  "id": 2}
```

-   [Subscribe to a stream](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Unsubscribe to a stream](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Listing Subscriptions](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Setting Properties](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
-   [Retrieving Properties](https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/Live-Subscribing-Unsubscribing-to-streams)
