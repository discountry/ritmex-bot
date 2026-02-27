---
title: "Margin Max Borrow | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow"
fetched_at: "2026-01-27T05:28:18.168Z"
---
# Margin Max Borrow(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)

Query margin max borrow

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)

GET `/papi/v1/margin/maxBorrowable`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)

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

The value cannot be greater than `60000`

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)

```
{  "amount": "1.69248805", // account's currently max borrowable amount with sufficient system availability  "borrowLimit": "60" // max borrowable amount limited by the account level}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Margin-Max-Borrow)
