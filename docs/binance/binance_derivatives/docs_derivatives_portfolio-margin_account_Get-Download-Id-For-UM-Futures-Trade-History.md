---
title: "Get Download Id For UM Futures Trade History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History"
fetched_at: "2026-01-27T05:28:17.203Z"
---
# Get Download Id For UM Futures Trade History (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)

Get download id for UM futures trade history

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)

GET `/papi/v1/um/trade/asyn`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)

```
{	"avgCostTimestampOfLast30d":7241837, // Average time taken for data download in the past 30 days  	"downloadId":"546975389218332672",}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Trade-History)
