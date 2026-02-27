---
title: "Portfolio Margin Um Trading Quantitative Rules Indicators | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators"
fetched_at: "2026-01-27T05:28:18.322Z"
---
# Portfolio Margin UM Trading Quantitative Rules Indicators(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)

Portfolio Margin UM Trading Quantitative Rules Indicators

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)

GET `/papi/v1/um/apiTradingStatus`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)

**1** for a single symbol **10** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)

Name

Type

Mandatory

Description

symbol

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)

```
{    "indicators": { // indicator: quantitative rules indicators, value: user's indicators value, triggerValue: trigger indicator value threshold of quantitative rules.         "BTCUSDT": [            {                "isLocked": true,                "plannedRecoverTime": 1545741270000,                "indicator": "UFR",  // Unfilled Ratio (UFR)                "value": 0.05,  // Current value                "triggerValue": 0.995  // Trigger value            },            {                "isLocked": true,                "plannedRecoverTime": 1545741270000,                "indicator": "IFER",  // IOC/FOK Expiration Ratio (IFER)                "value": 0.99,  // Current value                "triggerValue": 0.99  // Trigger value            },            {                "isLocked": true,                "plannedRecoverTime": 1545741270000,                "indicator": "GCR",  // GTC Cancellation Ratio (GCR)                "value": 0.99,  // Current value                "triggerValue": 0.99  // Trigger value            },            {                "isLocked": true,                "plannedRecoverTime": 1545741270000,                "indicator": "DR",  // Dust Ratio (DR)                "value": 0.99,  // Current value                "triggerValue": 0.99  // Trigger value            }        ]    },    "updateTime": 1545741270000}
```

Or (account violation triggered)

```
{    "indicators":{        "ACCOUNT":[            {                "indicator":"TMV",  //  Too many violations under multiple symbols trigger account violation                "value":10,                "triggerValue":1,                "plannedRecoverTime":1644919865000,                "isLocked":true            }        ]    },    "updateTime":1644913304748}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Portfolio-Margin-UM-Trading-Quantitative-Rules-Indicators)
