---
title: "Open Interest | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest"
fetched_at: "2026-01-27T05:28:09.887Z"
---
# Open Interest

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)

Get open interest for specific underlying asset on specific expiration date.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)

GET `/eapi/v1/openInterest`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)

**0**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)

Name

Type

Mandatory

Description

underlyingAsset

STRING

YES

underlying asset, e.g ETH/BTC

expiration

STRING

YES

expiration date, e.g 221225

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)

```
[    {        "symbol": "ETH-221119-1175-P",        "sumOpenInterest": "4.01",        "sumOpenInterestUsd": "4880.2985615624",        "timestamp": "1668754020000"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Open-Interest)
