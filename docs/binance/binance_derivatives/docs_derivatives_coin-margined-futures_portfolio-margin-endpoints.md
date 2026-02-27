---
title: "Classic Portfolio Margin Account Information | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints"
fetched_at: "2026-01-27T05:28:04.311Z"
---
# Classic Portfolio Margin Account Information (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)

Get Classic Portfolio Margin current account information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)

GET `/dapi/v1/pmAccountInfo`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)

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

> -   maxWithdrawAmount is for asset transfer out to the spot wallet.

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)

```
{    "maxWithdrawAmountUSD": "25347.92083245",   // Classic Portfolio margin maximum virtual amount for transfer out in USD    "asset": "BTC",            // asset name    "maxWithdrawAmount": "1.33663654",        // maximum amount for transfer out}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/portfolio-margin-endpoints)
