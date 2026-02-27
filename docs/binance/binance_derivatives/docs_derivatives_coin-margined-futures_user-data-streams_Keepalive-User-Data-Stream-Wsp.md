---
title: "Keepalive User Data Stream(Websocket API) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp"
fetched_at: "2026-01-27T05:28:07.307Z"
---
# Keepalive User Data Stream (USER\_STREAM)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)

Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 60 minutes.

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)

`userDataStream.ping`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)

```
{  "id": "815d5fce-0880-4287-a567-80badf004c74",  "method": "userDataStream.ping",  "params": {    "apiKey": "vmPUZE6mv9SD5VNHk9HlWFsOr9aLE2zvsw0MuIgwCIPy8atIco14y7Ju91duEh8A"   }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)

Name

Type

Mandatory

 Description

`apiKey`

STRING

NO

Required if session is not authenticated via `session.logon`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)

```
{  "id": "815d5fce-0880-4287-a567-80badf004c74",  "status": 200,  "result": {    "listenKey": "3HBntNTepshgEdjIwSUIBgB9keLyOCg5qv3n6bYAtktG8ejcaW5HXz9Vx1JgIieg"  },  "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 2    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Keepalive-User-Data-Stream-Wsp)
