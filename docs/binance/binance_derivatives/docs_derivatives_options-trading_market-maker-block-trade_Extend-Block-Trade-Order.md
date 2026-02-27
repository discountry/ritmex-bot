---
title: "Extend Block Trade Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order"
fetched_at: "2026-01-27T05:28:10.808Z"
---
# Extend Block Trade Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)

Extends a block trade expire time by 30 mins from the current time.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)

PUT `/eapi/v1/block/order/create` 

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)

Name

Type

Mandatory

 Description

blockOrderMatchingKey

STRING

YES

recvWindow

INT

NO

The value cannot be greater than 60000

timestamp

INT

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)

```
{    "blockTradeSettlementKey": "3668822b8-1baa-6a2f-adb8-d3de6289b361",    "expireTime": 1730172007000,    "liquidity": "TAKER",    "status": "RECEIVED",    "createTime": 1730170088111,    "legs": [        {            "symbol": "BNB-241101-700-C",            "side": "BUY",            "quantity": "1.2",            "price": "2.8"        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Extend-Block-Trade-Order)
