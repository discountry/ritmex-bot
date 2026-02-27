---
title: "Connect | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/user-data-streams"
fetched_at: "2026-01-27T05:28:12.487Z"
---
# Connect

-   The base API endpoint is: **[https://eapi.binance.com](https://eapi.binance.com/)**
-   A User Data Stream `listenKey` is valid for 60 minutes after creation.
-   Doing a `PUT` on a `listenKey` will extend its validity for 60 minutes.
-   Doing a `DELETE` on a `listenKey` will close the stream and invalidate the `listenKey`.
-   Doing a `POST` on an account with an active `listenKey` will return the currently active `listenKey` and extend its validity for 60 minutes.
-   Connection method for Websocket：
    -   Base Url: **wss://fstream.binance.com/private/**
    -   User Data Streams are accessed at **/ws/<listenKey>**
    -   Example: `wss://fstream.binance.com/private/ws/XaEAKTsQSRLZAGH9tuIu37plSRsdjmlAVBoNYPUITlTAko1WI22PgmBMpI1rS8Yh`
-   A single connection is only valid for 24 hours; expect to be disconnected at the 24 hour mark
