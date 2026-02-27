---
title: "Get Cm Income History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History"
fetched_at: "2026-01-27T05:28:17.090Z"
---
# Get CM Income History(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)

Get CM Income History

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)

GET `/papi/v1/cm/income`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)

**30**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)

Name

Type

Mandatory

Description

symbol

STRING

NO

incomeType

STRING

NO

"TRANSFER","WELCOME\_BONUS", "FUNDING\_FEE", "REALIZED\_PNL", "COMMISSION", "INSURANCE\_CLEAR", and "DELIVERED\_SETTELMENT"

startTime

LONG

NO

Timestamp in ms to get funding from INCLUSIVE.

endTime

LONG

NO

Timestamp in ms to get funding until INCLUSIVE.

page

INT

NO

limit

INT

NO

Default 100; max 1000

recvWindow

LONG

NO

timestamp

LONG

YES

> -   If `incomeType` is not sent, all kinds of flow will be returned
> -   "trandId" is unique in the same "incomeType" for a user
> -   The interval between `startTime` and `endTime` can not exceed 200 days:
>     -   If `startTime` and `endTime` are not sent, the last 200 days will be returned

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)

```
[    {        "symbol": "",               // trade symbol, if existing        "incomeType": "TRANSFER",   // income type        "income": "-0.37500000",    // income amount        "asset": "BTC",             // income asset        "info":"WITHDRAW",          // extra information        "time": 1570608000000,        "tranId":"9689322392",      // transaction id        "tradeId":""                // trade id, if existing    },    {        "symbol": "BTCUSD_200925",        "incomeType": "COMMISSION",         "income": "-0.01000000",        "asset": "BTC",        "info":"",        "time": 1570636800000,        "tranId":"9689322392",        "tradeId":"2059192"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History)
