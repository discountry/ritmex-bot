---
title: "Connect | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams"
fetched_at: "2026-01-27T05:28:23.574Z"
---
# User Data Streams Connect

-   The base API endpoint is: **[https://papi.binance.com](https://papi.binance.com/)**
    
-   A User Data Stream `listenKey` is valid for 60 minutes after creation.
    
-   Doing a `PUT` on a `listenKey` will extend its validity for 60 minutes, if response `-1125` error "This listenKey does not exist." Please use `POST /papi/v1/listenKey` to recreate `listenKey`.
    
-   Doing a `DELETE` on a `listenKey` will close the stream and invalidate the `listenKey`.
    
-   Doing a `POST` on an account with an active `listenKey` will return the currently active `listenKey` and extend its validity for 60 minutes. \*Connection method for Websocket:
    
    -   Base Url: **wss://fstream.binance.com/pm**
    -   User Data Streams are accessed at **/ws/<listenKey>**
    -   Example: `wss://fstream.binance.com/pm/ws/pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a65a1`
-   For one connection(one user data), the user data stream payloads can guaranteed to be in order during heavy periods; **Strongly recommend you order your updates using E**
    
-   A single connection is only valid for 24 hours; expect to be disconnected at the 24 hour mark
