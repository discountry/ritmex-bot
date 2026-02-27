---
title: "Cancel All Option Orders On Specific Symbol | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol"
fetched_at: "2026-01-27T05:28:11.719Z"
---
# Cancel all Option orders on specific symbol (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)

Cancel all active order on a symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)

DELETE `/eapi/v1/allOpenOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)

Name

Type

Mandatory

Description

symbol

STRING

YES

Option trading pair, e.g BTC-200730-9000-C

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)

```
{  "code": "0",  "msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Cancel-all-Option-orders-on-specific-symbol)
