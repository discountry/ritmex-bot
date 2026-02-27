---
title: "Account Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information"
fetched_at: "2026-01-27T05:28:15.923Z"
---
# Account Information(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)

Query account information

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)

GET `/papi/v1/account`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)

**20**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)

```
{   "uniMMR": "5167.92171923",        // Portfolio margin account maintenance margin rate   "accountEquity": "122607.35137903",   // Account equity, in USD value   "actualEquity": "73.47428058",   //Account equity without collateral rate, in USD value   "accountInitialMargin": "23.72469206",    "accountMaintMargin": "23.72469206", // Portfolio margin account maintenance margin, unit：USD   "accountStatus": "NORMAL"   // Portfolio margin account status:"NORMAL", "MARGIN_CALL", "SUPPLY_MARGIN", "REDUCE_ONLY", "ACTIVE_LIQUIDATION", "FORCE_LIQUIDATION", "BANKRUPTED"   "virtualMaxWithdrawAmount": "1627523.32459208"   // Portfolio margin maximum amount for transfer out in USD   "totalAvailableBalance":"",   "totalMarginOpenLoss":"", // in USD margin open order   "updateTime": 1657707212154 // last update time }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Information)
