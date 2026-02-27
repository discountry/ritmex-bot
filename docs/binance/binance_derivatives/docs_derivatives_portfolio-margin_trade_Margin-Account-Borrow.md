---
title: "Margin Account Borrow | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow"
fetched_at: "2026-01-27T05:28:20.452Z"
---
# Margin Account Borrow(MARGIN)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)

Apply for a margin loan.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)

POST `/papi/v1/marginLoan`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)

**100**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)

Name

Type

Mandatory

Description

asset

STRING

YES

amount

DECIMAL

YES

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)

```
{    //transaction id    "tranId": 100000001}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow)
