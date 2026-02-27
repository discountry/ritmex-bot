---
title: "Cancel All Option Orders By Underlying | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying"
fetched_at: "2026-01-27T05:28:11.628Z"
---
# Cancel All Option Orders By Underlying (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)

Cancel all active orders on specified underlying.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)

DELETE `/eapi/v1/allOpenOrdersByUnderlying`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)

Name

Type

Mandatory

Description

underlying

STRING

YES

Option underlying, e.g BTCUSDT

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)

```
{    "code": 0,    "msg": "success",}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-All-Option-Orders-By-Underlying)
