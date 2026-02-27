---
title: "Get Portfolio Margin Pro SPAN Account Info(USER_DATA) | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2"
fetched_at: "2026-01-27T05:28:14.689Z"
---
# Get Portfolio Margin Pro SPAN Account Info(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)

Get Portfolio Margin Pro SPAN Account Info (For Portfolio Margin Pro SPAN users only)

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)

GET `/sapi/v2/portfolio/account`

## Request Weight(IP)[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)

```
{        "uniMMR": "5167.92171923",                "accountEquity": "122607.35137903",  // Account equity, unit：USD        "actualEquity": "142607.35137903",   // Actual equity, unit：USD        "accountMaintMargin": "23.72469206", //Account maintenance margin, unit：USD        "riskUnitMMList":[             {                 "asset": "BTC",                 "uniMaintainUsd": "23.72469206"             }        ]        "marginMM": "0.00000000",         "otherMM": "0.00000000",         "accountStatus": "NORMAL",   // Classic Portfolio margin account status:"NORMAL", "MARGIN_CALL", "SUPPLY_MARGIN", "REDUCE_ONLY", "ACTIVE_LIQUIDATION", "FORCE_LIQUIDATION", "BANKRUPTED"        "accountType": "PM_3"     //PM_1 for classic PM, PM_2 for PM, PM_3 for PM Pro(SPAN) }
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)
-   [Request Weight(IP)](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/account/Get-Classic-Portfolio-Margin-Account-Info-V2)
