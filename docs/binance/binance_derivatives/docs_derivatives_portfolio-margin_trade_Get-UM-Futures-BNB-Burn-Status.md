---
title: "Get Um Futures BNB Burn Status | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status"
fetched_at: "2026-01-27T05:28:20.377Z"
---
# Get UM Futures BNB Burn Status (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)

Get user's BNB Fee Discount for UM Futures (Fee Discount On or Fee Discount Off )

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)

GET `/papi/v1/um/feeBurn`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)

**30**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)

```
{	"feeBurn": true // "true": Fee Discount On; "false": Fee Discount Off}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Get-UM-Futures-BNB-Burn-Status)
