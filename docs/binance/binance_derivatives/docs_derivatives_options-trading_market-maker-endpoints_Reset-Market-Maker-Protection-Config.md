---
title: "Reset Market Maker Protection Config | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config"
fetched_at: "2026-01-27T05:28:11.171Z"
---
# Reset Market Maker Protection Config (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)

Reset MMP, start MMP order again.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)

POST `/eapi/v1/mmpReset`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)

```
{    "underlyingId": 2,    "underlying": "BTCUSDT",    "windowTimeInMilliseconds": 3000,    "frozenTimeInMilliseconds": 300000,    "qtyLimit": "2",    "deltaLimit": "2.3",    "lastTriggerTime": 0}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-endpoints/Reset-Market-Maker-Protection-Config)
