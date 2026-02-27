---
title: "Get BNB Burn Status | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status"
fetched_at: "2026-01-27T05:28:25.144Z"
---
# Get BNB Burn Status (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)

Get user's BNB Fee Discount (Fee Discount On or Fee Discount Off )

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)

GET `/fapi/v1/feeBurn`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)

**30**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)

```
{	"feeBurn": true // "true": Fee Discount On; "false": Fee Discount Off}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-BNB-Burn-Status)
