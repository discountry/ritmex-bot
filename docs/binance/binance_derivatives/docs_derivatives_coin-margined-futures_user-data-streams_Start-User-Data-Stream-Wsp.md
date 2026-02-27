---
title: "Start User Data Stream(Websocket API) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp"
fetched_at: "2026-01-27T05:28:07.410Z"
---
# Start User Data Stream (USER\_STREAM)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)

Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent. If the account has an active `listenKey`, that `listenKey` will be returned and its validity will be extended for 60 minutes.

## Method[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)

`userDataStream.start`

## Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)

```
{  "id": "d3df8a61-98ea-4fe0-8f4e-0fcea5d418b0",  "method": "userDataStream.start",  "params": {    "apiKey": "vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A"  }}
```

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)

Name

Type

Mandatory

 Description

`apiKey`

STRING

NO

Required if session is not authenticated via session.logon

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)

```
{  "id": "d3df8a61-98ea-4fe0-8f4e-0fcea5d418b0",  "status": 200,  "result": {    "listenKey": "xs0mRXdAKlIPDRFrlPcw0qI41Eh3ixNntmymGyhrhgqo7L6FuLaWArTD7RLP"  },   "rateLimits": [	{		"rateLimitType": "REQUEST_WEIGHT",        "interval": "MINUTE",        "intervalNum": 1,        "limit": 2400,        "count": 8    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)
-   [Method](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)
-   [Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Start-User-Data-Stream-Wsp)
