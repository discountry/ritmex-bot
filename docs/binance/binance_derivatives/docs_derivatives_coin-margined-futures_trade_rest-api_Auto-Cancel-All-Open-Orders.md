---
title: "Auto Cancel All Open Orders | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders"
fetched_at: "2026-01-27T05:28:04.736Z"
---
# Auto-Cancel All Open Orders (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)

Cancel all open orders of the specified symbol at the end of the specified countdown. This rest endpoint means to ensure your open orders are canceled in case of an outage. The endpoint should be called repeatedly as heartbeats so that the existing countdown time can be canceled and repalced by a new one. The system will check all countdowns **approximately every 10 milliseconds**, so please note that sufficient redundancy should be considered when using this function. We do not recommend setting the countdown time to be too precise or too small.

-   Example usage:

> Call this endpoint at 30s intervals with an countdownTime of 120000 (120s).  
> If this endpoint is not called within 120 seconds, all your orders of the specified symbol will be automatically canceled.  
> If this endpoint is called with an countdownTime of 0, the countdown timer will be stopped.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)

POST `/dapi/v1/countdownCancelAll`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)

**10**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)

Name

Type

Mandatory

Description

symbol

STRING

YES

countdownTime

LONG

YES

countdown time, 1000 for 1 second. 0 to cancel the timer

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)

```
{	"symbol": "BTCUSD_200925", 	"countdownTime": "100000"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Auto-Cancel-All-Open-Orders)
