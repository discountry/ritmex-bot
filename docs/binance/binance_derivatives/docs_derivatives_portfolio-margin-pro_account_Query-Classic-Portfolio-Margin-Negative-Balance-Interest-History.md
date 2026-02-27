---
title: "Query Portfolio Margin Pro Negative Balance Interest History(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History"
fetched_at: "2026-01-27T05:28:15.076Z"
---
# Query Portfolio Margin Pro Negative Balance Interest History(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)

Query interest history of negative balance for portfolio margin.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)

GET `/sapi/v1/portfolio/interest-history`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)

**50**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)

```
[    {        "asset": "USDT",            "interest": "24.4440",               //interest amount        "interestAccruedTime": 1670227200000,        "interestRate": "0.0001164",         //daily interest rate        "principal": "210000"    } ]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Query-Classic-Portfolio-Margin-Negative-Balance-Interest-History)
