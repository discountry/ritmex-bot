---
title: "Get User Commission Rate For Cm | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM"
fetched_at: "2026-01-27T05:28:18.074Z"
---
# Get User Commission Rate for CM(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)

Get User Commission Rate for CM

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)

GET `/papi/v1/cm/commissionRate`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)

**20**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)

Name

Type

Mandatory

Description

symbol

STRING

YES

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)

```
{    "symbol": "BTCUSD_PERP",    "makerCommissionRate": "0.00015",  // 0.015%    "takerCommissionRate": "0.00040"   // 0.040%}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM)
