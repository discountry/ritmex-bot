---
title: "User Commission | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission"
fetched_at: "2026-01-27T05:28:12.244Z"
---
# User Commission (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)

Get account commission.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)

GET `/eapi/v1/commission`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)

```
{    "commissions": [        {            "underlying": "BTCUSDT",            "makerFee": "0.000240",            "takerFee": "0.000240"        },        {            "underlying": "ETHUSDT",            "makerFee": "0.000240",            "takerFee": "0.000240"        },        {            "underlying": "BNBUSDT",            "makerFee": "0.000240",            "takerFee": "0.000240"        },        {            "underlying": "SOLUSDT",            "makerFee": "0.000240",            "takerFee": "0.000240"        },        {            "underlying": "XRPUSDT",            "makerFee": "0.000240",            "takerFee": "0.000240"        },        {            "underlying": "DOGEUSDT",            "makerFee": "0.000240",            "takerFee": "0.000240"        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/User-Commission)
