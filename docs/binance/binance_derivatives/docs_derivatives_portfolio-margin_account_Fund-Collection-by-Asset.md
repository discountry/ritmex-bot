---
title: "Fund Collection By Asset | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset"
fetched_at: "2026-01-27T05:28:16.685Z"
---
# Fund Collection by Asset(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)

Transfers specific asset from Futures Account to Margin account

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)

POST `/papi/v1/asset-collection`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)

**30**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)

Name

Type

Mandatory

Description

asset

STRING

YES

recvWindow

LONG

NO

timestamp

LONG

YES

> -   The BNB transfer is not be supported

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)

```
{    "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Fund-Collection-by-Asset)
