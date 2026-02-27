---
title: "Get Download Id For UM Futures Transaction History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History"
fetched_at: "2026-01-27T05:28:17.176Z"
---
# Get Download Id For UM Futures Transaction History (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)

Get download id for UM futures transaction history

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)

GET `/papi/v1/um/income/asyn`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)

Name

Type

Mandatory

Description

startTime

LONG

YES

Timestamp in ms

endTime

LONG

YES

Timestamp in ms

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Request Limitation is 5 times per month, shared by front end download page and rest api
> -   The time between `startTime` and `endTime` can not be longer than 1 year

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)

```
{	"avgCostTimestampOfLast30d":7241837, // Average time taken for data download in the past 30 days  	"downloadId":"546975389218332672",}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Transaction-History)
