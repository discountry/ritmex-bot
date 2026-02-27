---
title: "Change Um Initial Leverage | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage"
fetched_at: "2026-01-27T05:28:16.430Z"
---
# Change UM Initial Leverage(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)

Change user's initial leverage of specific symbol in UM.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)

POST `/papi/v1/um/leverage`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)

```
{    "leverage": 21,    "maxNotionalValue": "1000000",    "symbol": "BTCUSDT"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage)
