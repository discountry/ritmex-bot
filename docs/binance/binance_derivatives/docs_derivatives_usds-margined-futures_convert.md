---
title: "List all convert pairs | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/convert"
fetched_at: "2026-01-27T05:28:26.536Z"
---
# List All Convert Pairs

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)

Query for all convertible token pairs and the tokens’ respective upper/lower limits

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)

GET `/fapi/v1/convert/exchangeInfo`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)

**20(IP)**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)

Name

Type

Mandatory

Description

fromAsset

STRING

EITHER OR BOTH

User spends coin

toAsset

STRING

EITHER OR BOTH

User receives coin

> -   User needs to supply either or both of the input parameter
> -   If not defined for both fromAsset and toAsset, only partial token pairs will be returned
> -   Asset BNFCR is only available to convert for MICA region users.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)

```
[  {    "fromAsset":"BTC",    "toAsset":"USDT",    "fromAssetMinAmount":"0.0004",    "fromAssetMaxAmount":"50",    "toAssetMinAmount":"20",    "toAssetMaxAmount":"2500000"  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert)
