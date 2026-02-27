---
title: "Connect | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams"
fetched_at: "2026-01-27T05:28:13.134Z"
---
# Connect

-   The baseurl of the websocket interface is: \*\*wss://fstream.binance.com/public/ \*\* or \*\*/ **wss://fstream.binance.com/market/**
    
-   Streams can be access either in a single raw stream or a combined stream
    
-   Raw streams are accessed at **/ws/<streamName>**
    
-   Combined streams are accessed at **/stream?streams=<streamName1>/<streamName2>/<streamName3>**
    
-   Example:
    
    -   `wss://fstream.binance.com/public/ws/btc-210630-9000-p@ticker`
    -   `wss://fstream.binance.com/market/stream?streams=btc-210630-9000-p@markPriceoptionMarkPrice`
-   A single connection is only valid for 24 hours; expect to be disconnected at the 24 hour mark
    
-   The websocket server will send a `ping frame` every 5 minutes. If the websocket server does not receive a `pong frame` back from the connection within a 15 minute period, the connection will be disconnected. Unsolicited `pong frames` are allowed.
    
-   WebSocket connections have a limit of 10 incoming messages per second.
    
-   A connection that goes beyond the limit will be disconnected; IPs that are repeatedly disconnected may be banned.
    
-   A single connection can listen to a maximum of **200** streams.
    
-   Considering the possible data latency from RESTful endpoints during an extremely volatile market, it is highly recommended to get the order status, position, etc from the Websocket user data stream.
    
-   Combined stream events are wrapped as follows: **{"stream":"<streamName>","data":<rawPayload>}**
    
-   All symbols for streams are **lowercase**
    
-   A single connection is only valid for 24 hours; expect to be disconnected at the 24 hour mark
    
-   The websocket server will send a `ping frame` every 5 minutes. If the websocket server does not receive a `pong frame` back from the connection within a 15 minute period, the connection will be disconnected. Unsolicited `pong frames` are allowed.
    
-   WebSocket connections have a limit of 10 incoming messages per second.
    
-   A connection that goes beyond the limit will be disconnected; IPs that are repeatedly disconnected may be banned.
    
-   A single connection can listen to a maximum of **200** streams.
    
-   Considering the possible data latency from RESTful endpoints during an extremely volatile market, it is highly recommended to get the order status, position, etc from the Websocket user data stream.
