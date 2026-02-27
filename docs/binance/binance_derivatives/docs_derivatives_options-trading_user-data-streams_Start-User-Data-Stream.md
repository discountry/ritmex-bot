---
title: "Start User Data Stream | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream"
fetched_at: "2026-01-27T05:28:12.999Z"
---
# Start User Data Stream (USER\_STREAM)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)

Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent. If the account has an active `listenKey`, that `listenKey` will be returned and its validity will be extended for 60 minutes.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)

POST `/eapi/v1/listenKey`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)

None

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)

```
{  "listenKey": "pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a65a1",  "expiration": 1762855900452}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Start-User-Data-Stream)
