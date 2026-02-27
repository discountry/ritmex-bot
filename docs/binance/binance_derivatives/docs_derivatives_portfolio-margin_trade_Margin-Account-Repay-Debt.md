---
title: "Margin Account Repay Debt | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt"
fetched_at: "2026-01-27T05:28:20.629Z"
---
# Margin Account Repay Debt(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)

Repay debt for a margin loan.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)

POST `/papi/v1/margin/repay-debt`

## Request Weight(Order)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)

**3000**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)

Name

Type

Mandatory

Description

asset

STRING

YES

amount

STRING

NO

specifyRepayAssets

STRING

NO

Specific asset list to repay debt; Can be added in batch, separated by commas

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

> -   The repay asset amount cannot exceed 50000 USD equivalent value for a single request.
> -   If `amount` is not sent, all the asset loan will be repaid if having enough specific repay assets.
> -   If `amount` is sent, only the certain amount of the asset loan will be repaid if having enough specific repay assets.
> -   The system will use the same asset to repay the loan first (if have) no matter whether put the asset in `specifyRepayAssets`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)

```
{    "amount": "0.10000000",	"asset": "BNB",    "specifyRepayAssets": [    "USDT",    "BTC"	],    "updateTime": 1636371437000	"success": true}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)
-   [Request Weight(Order)](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt)
