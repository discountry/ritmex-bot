---
title: "User Exercise Record | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record"
fetched_at: "2026-01-27T05:28:12.480Z"
---
# User Exercise Record (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)

Get account exercise records.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)

GET `/eapi/v1/exerciseRecord`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)

Name

Type

Mandatory

Description

symbol

STRING

NO

Option trading pair, e.g BTC-200730-9000-C

startTime

LONG

NO

startTime

endTime

LONG

NO

endTime

limit

INT

NO

default 1000, max 1000

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)

```
[    {        "id": "1125899906842624042",        "currency": "USDT",        "symbol": "BTC-220721-25000-C",        "exercisePrice": "25000.00000000",        "quantity": "1.00000000",        "amount": "0.00000000",        "fee": "0.00000000",        "createDate": 1658361600000,        "priceScale": 2,        "quantityScale": 2,        "optionSide": "CALL",        "positionSide": "LONG",        "quoteAsset": "USDT"    }] 
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Exercise-Record)
