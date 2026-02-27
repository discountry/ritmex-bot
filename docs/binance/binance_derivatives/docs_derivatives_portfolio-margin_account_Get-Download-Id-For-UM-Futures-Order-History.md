---
title: "Get Download Id For UM Futures Order History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History"
fetched_at: "2026-01-27T05:28:17.024Z"
---
# Get Download Id For UM Futures Order History (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)

Get download id for UM futures order history

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)

GET `/papi/v1/um/order/asyn`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)

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

> -   Request Limitation is 10 times per month, shared by front end download page and rest api
> -   The time between `startTime` and `endTime` can not be longer than 1 year

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)

```
{	"avgCostTimestampOfLast30d":7241837, // Average time taken for data download in the past 30 days  	"downloadId":"546975389218332672",}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Download-Id-For-UM-Futures-Order-History)
