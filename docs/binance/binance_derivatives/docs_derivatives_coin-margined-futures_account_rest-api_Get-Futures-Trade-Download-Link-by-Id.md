---
title: "Get Futures Trade Download Link By Id | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id"
fetched_at: "2026-01-27T05:28:01.337Z"
---
# Get Futures Trade Download Link by Id(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)

Get futures trade download link by Id

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)

GET `/dapi/v1/trade/asyn/id`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)

Name

Type

Mandatory

Description

downloadId

STRING

YES

get by download id api

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Download link expiration: 24h

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)

> **Response:**

```
{	"downloadId":"545923594199212032",  	"status":"completed",     // Enum：completed，processing  	"url":"www.binance.com",  // The link is mapped to download id  	"notified":true,          // ignore  	"expirationTimestamp":1645009771000,  // The link would expire after this timestamp  	"isExpired":null,}
```

> **OR** (Response when server is processing)

```
{	"downloadId":"545923594199212032",  	"status":"processing",  	"url":"",   	"notified":false,  	"expirationTimestamp":-1  	"isExpired":null,  	}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Futures-Trade-Download-Link-by-Id)
