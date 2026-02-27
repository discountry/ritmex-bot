---
title: "Get Um Income History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History"
fetched_at: "2026-01-27T05:28:18.066Z"
---
# Get UM Income History(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)

Get UM Income History

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)

GET `/papi/v1/um/income`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)

**30**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)

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

TRANSFER, WELCOME\_BONUS, REALIZED\_PNL, FUNDING\_FEE, COMMISSION, INSURANCE\_CLEAR, REFERRAL\_KICKBACK, COMMISSION\_REBATE, API\_REBATE, CONTEST\_REWARD, CROSS\_COLLATERAL\_TRANSFER, OPTIONS\_PREMIUM\_FEE, OPTIONS\_SETTLE\_PROFIT, INTERNAL\_TRANSFER, AUTO\_EXCHANGE, DELIVERED\_SETTELMENT, COIN\_SWAP\_DEPOSIT, COIN\_SWAP\_WITHDRAW, POSITION\_LIMIT\_INCREASE\_FEE

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

> -   If neither `startTime` nor `endTime` is sent, the recent 7-day data will be returned.
> -   If `incomeType` is not sent, all kinds of flow will be returned
> -   "trandId" is unique in the same incomeType for a user
> -   Income history only contains data for the last three months

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)

```
[    {        "symbol": "",                   // trade symbol, if existing        "incomeType": "TRANSFER",   // income type        "income": "-0.37500000",  // income amount        "asset": "USDT",                // income asset        "info":"TRANSFER",          // extra information        "time": 1570608000000,              "tranId":"9689322392",      // transaction id        "tradeId":""                    // trade id, if existing    },    {        "symbol": "BTCUSDT",        "incomeType": "COMMISSION",         "income": "-0.01000000",        "asset": "USDT",        "info":"COMMISSION",        "time": 1570636800000,        "tranId":"9689322392",        "tradeId":"2059192"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History)
