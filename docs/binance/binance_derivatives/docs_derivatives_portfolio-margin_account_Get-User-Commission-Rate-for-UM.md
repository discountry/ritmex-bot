---
title: "Get User Commission Rate For Um | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM"
fetched_at: "2026-01-27T05:28:18.140Z"
---
# Get User Commission Rate for UM(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)

Get User Commission Rate for UM

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)

GET `/papi/v1/um/commissionRate`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)

**20**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)

```
{    "symbol": "BTCUSDT",    "makerCommissionRate": "0.0002",  // 0.02%    "takerCommissionRate": "0.0004"   // 0.04%}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM)
