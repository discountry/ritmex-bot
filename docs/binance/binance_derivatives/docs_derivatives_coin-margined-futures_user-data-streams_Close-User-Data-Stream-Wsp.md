---
title: "Close User Data Stream(Websocket API) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp"
fetched_at: "2026-01-27T05:28:06.577Z"
---
# Close User Data Stream (USER\_STREAM)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)

Close out a user data stream.

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)

`userDataStream.stop`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)

```
{  "id": "819e1b1b-8c06-485b-a13e-131326c69599",  "method": "userDataStream.stop",  "params": {    "apiKey": "vmPUZE6mv9SD5VNHk9HlWFsOr9aLE2zvsw0MuIgwCIPy8atIco14y7Ju91duEh8A"  }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)

Name

Type

Mandatory

 Description

`apiKey`

STRING

NO

Required if session is not authenticated via `session.logon`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)

```
{  "id": "819e1b1b-8c06-485b-a13e-131326c69599",  "status": 200,  "result": {},   "rateLimits": [    {      "rateLimitType": "REQUEST_WEIGHT",      "interval": "MINUTE",      "intervalNum": 1,      "limit": 2400,      "count": 2    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Close-User-Data-Stream-Wsp)
