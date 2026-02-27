---
title: "Futures Trading Quantitative Rules Indicators | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators"
fetched_at: "2026-01-27T05:28:24.910Z"
---
# Futures Trading Quantitative Rules Indicators (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)

Futures trading quantitative rules indicators, for more information on this, please refer to the [Futures Trading Quantitative Rules](https://www.binance.com/en/support/faq/4f462ebe6ff445d4a170be7d9e897272)

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)

GET `/fapi/v1/apiTradingStatus`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)

-   **1** for a single symbol
-   **10** when the symbol parameter is omitted

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)

> **Response:**

```
{    "indicators": { // indicator: quantitative rules indicators, value: user's indicators value, triggerValue: trigger indicator value threshold of quantitative rules.         "BTCUSDT": [            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "UFR",  // Unfilled Ratio (UFR)                "value": 0.05,  // Current value                "triggerValue": 0.995  // Trigger value            },            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "IFER",  // IOC/FOK Expiration Ratio (IFER)                "value": 0.99,  // Current value                "triggerValue": 0.99  // Trigger value            },            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "GCR",  // GTC Cancellation Ratio (GCR)                "value": 0.99,  // Current value                "triggerValue": 0.99  // Trigger value            },            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "DR",  // Dust Ratio (DR)                "value": 0.99,  // Current value                "triggerValue": 0.99  // Trigger value            }        ],        "ETHUSDT": [            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "UFR",                "value": 0.05,                "triggerValue": 0.995            },            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "IFER",                "value": 0.99,                "triggerValue": 0.99            },            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "GCR",                "value": 0.99,                "triggerValue": 0.99            }            {				"isLocked": true,			    "plannedRecoverTime": 1545741270000,                "indicator": "DR",                "value": 0.99,                "triggerValue": 0.99            }        ]    },    "updateTime": 1545741270000}
```

> Or (account violation triggered)

```
{    "indicators":{        "ACCOUNT":[            {                "indicator":"TMV",  //  Too many violations under multiple symbols trigger account violation                "value":10,                "triggerValue":1,                "plannedRecoverTime":1644919865000,                "isLocked":true            }        ]    },    "updateTime":1644913304748}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Trading-Quantitative-Rules-Indicators)
