---
title: "Auto Cancel All Open Orders Heartbeat | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat"
fetched_at: "2026-01-27T05:28:11.063Z"
---
# Auto-Cancel All Open Orders (Kill-Switch) Heartbeat (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)

This endpoint resets the time from which the countdown will begin to the time this messaged is received. It should be called repeatedly as heartbeats. Multiple heartbeats can be updated at once by specifying the underlying symbols as a list (ex. BTCUSDT,ETHUSDT) in the underlyings parameter.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)

POST `/eapi/v1/countdownCancelAllHeartBeat`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)

10

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)

Name

Type

Mandatory

Description

underlyings

STRING

YES

Option Underlying Symbols, e.g BTCUSDT,ETHUSDT

recvWindow

LONG

NO

timestamp

LONG

YES

> -   The response will only include underlying symbols where the heartbeat has been successfully updated.

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)

```
{ "underlyings":["BTCUSDT","ETHUSDT"]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Auto-Cancel-All-Open-Orders-Heartbeat)
