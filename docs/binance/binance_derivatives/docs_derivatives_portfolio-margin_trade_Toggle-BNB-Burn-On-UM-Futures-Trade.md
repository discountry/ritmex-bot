---
title: "Toggle BNB Burn On Um Futures Trade | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade"
fetched_at: "2026-01-27T05:28:23.194Z"
---
# Toggle BNB Burn On UM Futures Trade (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)

Change user's BNB Fee Discount for UM Futures (Fee Discount On or Fee Discount Off ) on _**EVERY symbol**_

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)

POST `/papi/v1/um/feeBurn`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)

Name

Type

Mandatory

Description

feeBurn

STRING

YES

"true": Fee Discount On; "false": Fee Discount Off

recvWindow

LONG

NO

timestamp

LONG

YES

-   The BNB would not be collected from UM-PM account to the Portfolio Margin account.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)

```
{	"code": 200,	"msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Toggle-BNB-Burn-On-UM-Futures-Trade)
