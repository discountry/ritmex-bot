---
title: "Get UM Futures Trade Download Link by Id | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id"
fetched_at: "2026-01-27T05:28:17.893Z"
---
# Get UM Futures Trade Download Link by Id(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)

Get UM futures trade download link by Id

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)

GET `/papi/v1/um/trade/asyn/id`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)

**10**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)

> **Response:**

```
{	"downloadId":"545923594199212032",  	"status":"completed",     // Enum：completed，processing  	"url":"www.binance.com",  // The link is mapped to download id	"s3Link": null,  	"notified":true,          // ignore  	"expirationTimestamp":1645009771000,  // The link would expire after this timestamp  	"isExpired":null,}
```

> **OR** (Response when server is processing)

```
{	"downloadId":"545923594199212032",  	"status":"processing",  	"url":"", 	"s3Link": null,  	"notified":false,  	"expirationTimestamp":-1  	"isExpired":null,  	}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Trade-Download-Link-by-Id)
