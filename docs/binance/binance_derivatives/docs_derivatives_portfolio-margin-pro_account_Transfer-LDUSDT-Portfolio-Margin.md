---
title: "Transfer LDUSDT for Portfolio Margin(TRADE) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin"
fetched_at: "2026-01-27T05:28:15.197Z"
---
# Transfer LDUSDT/RWUSD for Portfolio Margin(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)

Transfer LDUSDT/RWUSD as collateral for all types of Portfolio Margin account

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)

POST `/sapi/v1/portfolio/earn-asset-transfer`

## Request Weight(UID)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)

Name

Type

Mandatory

Description

asset

STRING

YES

`LDUSDT` and `RWUSD`

transferType

STRING

YES

`EARN_TO_FUTURE` /`FUTURE_TO_EARN`

amount

DECIMAL

YES

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)

```
{  "msg":"success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)
-   [Request Weight(UID)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Transfer-LDUSDT-Portfolio-Margin)
