---
title: "Get Market Maker Protection Config | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints"
fetched_at: "2026-01-27T05:28:10.914Z"
---
# Get Market Maker Protection Config (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)

Get config for MMP.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)

GET `/eapi/v1/mmp (HMAC SHA256)`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)

Name

Type

Mandatory

Description

underlying

STRING

TRUE

underlying, e.g BTCUSDT

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)

```
{    "underlyingId": 2,    "underlying": "BTCUSDT",    "windowTimeInMilliseconds": 3000,    "frozenTimeInMilliseconds": 300000,    "qtyLimit": "2",    "deltaLimit": "2.3",    "lastTriggerTime": 0}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints)
