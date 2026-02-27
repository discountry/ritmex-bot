---
title: "Get Download Id For Futures Transaction History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History"
fetched_at: "2026-01-27T05:28:01.033Z"
---
# Get Download Id For Futures Transaction History(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)

Get download id for futures transaction history

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)

GET `/dapi/v1/income/asyn`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)

```
{	"avgCostTimestampOfLast30d":7241837, // Average time taken for data download in the past 30 days  	"downloadId":"546975389218332672",}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/Get-Download-Id-For-Futures-Transaction-History)
