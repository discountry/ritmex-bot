---
title: "How To Manage A Local Order Book Correctly | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/websocket-market-streams/How-to-manage-a-local-order-book-correctly"
fetched_at: "2026-01-27T05:28:08.211Z"
---
# How to manage a local order book correctly

1.  Open a stream to **wss://dstream.binance.com/stream?streams=btcusd\_200925@depth**.
2.  Buffer the events you receive from the stream. For same price, latest received update covers the previous one.
3.  Get a depth snapshot from **[https://dapi.binance.com/dapi/v1/depth?symbol=BTCUSD\_200925&limit=1000](https://dapi.binance.com/dapi/v1/depth?symbol=BTCUSD_200925&limit=1000)** .
4.  Drop any event where `u` is < `lastUpdateId` in the snapshot
5.  The first processed event should have `U` `<= ``lastUpdateId` **AND** `u` >`= ``lastUpdateId`

-   U = firstUpdateId (the first update ID) from the WebSocket stream.
-   u = finalUpdateId (the last update ID) from the WebSocket stream.
-   lastUpdateId = the update ID you got from the REST depth snapshot.

6.  While listening to the stream, each new event's `pu` should be equal to the previous event's `u`, otherwise initialize the process from step 3.
7.  The data in each event is the **absolute** quantity for a price level
8.  If the quantity is 0, **remove** the price level
9.  Receiving an event that removes a price level that is not in your local order book can happen and is normal.
