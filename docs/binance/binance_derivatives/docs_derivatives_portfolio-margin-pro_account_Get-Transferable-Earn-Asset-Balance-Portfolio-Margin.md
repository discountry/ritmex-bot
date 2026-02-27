---
title: "Get Transferable Earn Asset Balance for Portfolio Margin(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin"
fetched_at: "2026-01-27T05:28:14.716Z"
---
# Get Transferable Earn Asset Balance for Portfolio Margin (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)

Get transferable earn asset balance for all types of Portfolio Margin account

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)

GET `/sapi/v1/portfolio/earn-asset-balance`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)

**1500**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)

Name

Type

Mandatory

Description

asset

STRING

YES

`LDUSDT` only

transferType

STRING

YES

`EARN_TO_FUTURE` /`FUTURE_TO_EARN`

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)

```
{    "asset": "LDUSDT",    "amount": "0.55"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Transferable-Earn-Asset-Balance-Portfolio-Margin)
