---
title: "Get Um Futures Symbol Configuration | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config"
fetched_at: "2026-01-27T05:28:17.688Z"
---
# UM Futures Symbol Configuration(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)

Get current UM account symbol configuration.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)

GET `/papi/v1/um/symbolConfig`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)

```
[  {  "symbol": "BTCUSDT",   "marginType": "CROSSED",  "isAutoAddMargin": "false",  "leverage": 21,  "maxNotionalValue": "1000000",  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Futures-Symbol-Config)
