---
title: "Query Portfolio Margin Negative Balance Interest History | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History"
fetched_at: "2026-01-27T05:28:18.645Z"
---
# Query Portfolio Margin Negative Balance Interest History(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)

Query interest history of negative balance for portfolio margin.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)

`GET /papi/v1/portfolio/interest-history`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)

**50**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)

Name

Type

Mandatory

Description

asset

STRING

NO

startTime

LONG

NO

endTime

LONG

NO

size

LONG

NO

Default:10 Max:100

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Response in descending order
> -   The max interval between startTime and endTime is 30 days. It is a MUST to ensure data correctness.
> -   If `startTime` and `endTime` not sent, return records of the last 7 days by default
> -   If `startTime` is sent and `endTime` is not sent, the records from `startTime` to the present will be returned; if `startTime` is more than 30 days ago, the records of the past 30 days will be returned.
> -   If `startTime` is not sent and `endTime` is sent, the records of the 7 days before `endTime` is returned.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)

```
[    {        "asset": "USDT",            "interest": "24.4440",               //interest amount        "interestAccuredTime": 1670227200000,        "interestRate": "0.0001164",         //daily interest rate        "principal": "210000"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-Portfolio-Margin-Negative-Balance-Interest-History)
