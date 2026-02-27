---
title: "Connect | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams"
fetched_at: "2026-01-27T05:28:06.403Z"
---
# User Data Streams Connect

-   The base API endpoint is: **[https://dapi.binance.com](https://dapi.binance.com/)**
    
-   A User Data Stream `listenKey` is valid for 60 minutes after creation.
    
-   Doing a `PUT` on a `listenKey` will extend its validity for 60 minutes, if response `-1125` error "This listenKey does not exist." Please use `POST /dapi/v1/listenKey` to recreate `listenKey`.
    
-   Doing a `DELETE` on a `listenKey` will close the stream and invalidate the `listenKey`.
    
-   Doing a `POST` on an account with an active `listenKey` will return the currently active `listenKey` and extend its validity for 60 minutes.
    
-   There are two connection methods for Websocket：
    
    -   Base Url 1: **wss://dstream.binance.com**
        
    -   User Data Streams are accessed at **/ws/<listenKey>**
        
    -   Example: `wss://dstream.binance.com/ws/XaEAKTsQSRLZAGH9tuIu37plSRsdjmlAVBoNYPUITlTAko1WI22PgmBMpI1rS8Yh`
        
    -   Base Url 2: **wss://dstream-auth.binance.com**
        
    -   User Data Streams are accessed at **/ws/<listenKey>?listenKey=<validateListenKey>**
        
    -   **<validateListenKey> must be a valid listenKey when you establish a connection**
        
    -   Example:
        
    -   `wss://dstream-auth.binance.com/ws/XaEAKTsQSRLZAGH9tuIu37plSRsdjmlAVBoNYPUITlTAko1WI22PgmBMpI1rS8Yh？listenKey=XaEAKTsQSRLZAGH9tuIu37plSRsdjmlAVBoNYPUITlTAko1WI22PgmBMpI1rS8Yh`
        
-   For one connection(one user data), the user data stream payloads can guaranteed to be in order during heavy periods; **Strongly recommend you order your updates using E**
    
-   A single connection is only valid for 24 hours; expect to be disconnected at the 24 hour mark
