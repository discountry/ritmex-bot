---
title: "Set Auto Cancel All Open Orders Config | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config"
fetched_at: "2026-01-27T05:28:11.323Z"
---
# Set Auto-Cancel All Open Orders (Kill-Switch) Config (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)

This endpoint sets the parameters of the auto-cancel feature which cancels all open orders (both market maker protection and non market maker protection order types) of the underlying symbol at the end of the specified countdown time period if no heartbeat message is sent. After the countdown time period, all open orders will be cancelled and new orders will be rejected with error code -2010 until either a heartbeat message is sent or the auto-cancel feature is turned off by setting countdownTime to 0.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)

POST `/eapi/v1/countdownCancelAll`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)

Name

Type

Mandatory

Description

underlying

STRING

YES

Option underlying, e.g BTCUSDT

countdownTime

LONG

YES

Countdown time in milliseconds (ex. 1,000 for 1 second). 0 to disable the timer. Negative values (ex. -10000) are not accepted. Minimum acceptable value is 5,000 

recvWindow

LONG

NO

timestamp

LONG

YES

> -   This rest endpoint sets up the parameters to cancel your open orders in case of an outage or disconnection.
> -   Example usage: Call this endpoint with a countdownTime value of 10000 (10 seconds) to turn on the auto-cancel feature. If the corresponding countdownCancelAllHeartBeat endpoint is not called within 10 seconds with the specified underlying symbol, all open orders of the specified symbol will be automatically canceled. If this endpoint is called with an countdownTime of 0, the countdown timer will be stopped.
> -   The system will check all countdowns approximately every 1000 milliseconds, **please note that sufficient redundancy should be considered when using this function**. We do not recommend setting the countdown time to be too precise or too small.

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)

```
{  "underlying": "ETHUSDT",  "countdownTime": 30000}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Set-Auto-Cancel-All-Open-Orders-Config)
