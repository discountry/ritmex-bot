---
title: "Change Cm Initial Leverage | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage"
fetched_at: "2026-01-27T05:28:16.211Z"
---
# Change CM Initial Leverage (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)

Change user's initial leverage of specific symbol in CM.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)

POST `/papi/v1/cm/leverage`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)

Name

Type

Mandatory

Description

symbol

STRING

YES

leverage

INT

YES

target initial leverage: int from 1 to 125

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)

```
{    "leverage": 21,    "maxQty": "1000",    "symbol": "BTCUSD_200925"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage)
