---
title: "Get Auto Cancel All Open Orders Config | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config"
fetched_at: "2026-01-27T05:28:11.146Z"
---
# Get Auto-Cancel All Open Orders (Kill-Switch) Config (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)

This endpoint returns the auto-cancel parameters for each underlying symbol. Note only active auto-cancel parameters will be returned, if countdownTime is set to 0 (ie. countdownTime has been turned off), the underlying symbol and corresponding countdownTime parameter will not be returned in the response.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)

GET `/eapi/v1/countdownCancelAll` 

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)

1

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)

Name

Type

Mandatory

Description

underlying

STRING

NO

Option underlying, e.g BTCUSDT

recvWindow

LONG

NO

timestamp

LONG

YES

> -   countdownTime = 0 means the function is disabled.

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)

```
{  "underlying": "ETHUSDT",  "countdownTime": 100000}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Get-Auto-Cancel-All-Open-Orders-Config)
