---
title: "Event User Data Stream Expired | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-User-Data-Stream-Expired"
fetched_at: "2026-01-27T05:28:24.141Z"
---
# Event: User Data Stream Expired

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-User-Data-Stream-Expired)

When the `listenKey` used for the user data stream turns expired, this event will be pushed.

**Notice:**

-   This event is not related to the websocket disconnection.
-   This event will be received only when a valid `listenKey` in connection got expired.
-   No more user data event will be updated after this event received until a new valid `listenKey` used.

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-User-Data-Stream-Expired)

`listenKeyExpired`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-User-Data-Stream-Expired)

```
{    'e': 'listenKeyExpired',      // event type    'E': 1576653824250              // event time}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-User-Data-Stream-Expired)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-User-Data-Stream-Expired)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-User-Data-Stream-Expired)
