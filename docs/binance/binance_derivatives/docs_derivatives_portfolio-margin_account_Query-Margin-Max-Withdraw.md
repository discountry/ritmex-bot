---
title: "Query Margin Max Withdraw | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw"
fetched_at: "2026-01-27T05:28:18.422Z"
---
# Query Margin Max Withdraw(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)

Query Margin Max Withdraw

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)

GET `/papi/v1/margin/maxWithdraw`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)

```
{   "amount": "60"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Margin-Max-Withdraw)
