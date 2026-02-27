---
title: "Account Funding Flow | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow"
fetched_at: "2026-01-27T05:28:09.229Z"
---
# Account Funding Flow (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)

Query account funding flows.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)

GET `/eapi/v1/bill`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)

Name

Type

Mandatory

Description

currency

STRING

YES

Asset type, only support USDT as of now

recordId

LONG

NO

Return the recordId and subsequent data, the latest data is returned by default, e.g 100000

startTime

LONG

NO

Start Time, e.g 1593511200000

endTime

LONG

NO

End Time, e.g 1593512200000

limit

INT

NO

Number of result sets returned Default:100 Max:1000

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)

```
[  {    "id": 1125899906842624000,    "asset": "USDT",              // Asset type    "amount": "-0.552",           // Amount (positive numbers represent inflow, negative numbers represent outflow)    "type": "FEE",                // type (fees)    "createDate": 1592449456000,  // Time  },  {    "id": 1125899906842624000,    "asset": "USDT",              // Asset type    "amount": "100",              // Amount (positive numbers represent inflow, negative numbers represent outflow)    "type": "CONTRACT",           // type (buy/sell contracts)    "createDate": 1592449456000,  // Time  },  {    "id": 1125899906842624000,    "asset": "USDT",              // Asset type    "amount": "10000",            // Amount (positive numbers represent inflow, negative numbers represent outflow)    "type": "TRANSFER",           // type（Funds transfer）    "createDate": 1592448410000,  // Time  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/account/Account-Funding-Flow)
