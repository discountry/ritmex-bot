---
title: "Query Block Trade Details | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail"
fetched_at: "2026-01-27T05:28:10.836Z"
---
# Query Block Trade Details (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)

Query block trade details; returns block trade details from counterparty's perspective.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)

GET `/eapi/v1/block/order/execute`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)

Name

Type

Mandatory

 Description

blockOrderMatchingKey

STRING

YES

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)

```
{    "blockTradeSettlementKey": "12b96c28-ba05-8906-c89t-703215cfb2e6",    "expireTime": 1730171860460,    "liquidity": "MAKER",    "status": "RECEIVED",    "createTime": 1730170060462,    "legs": [        {            "symbol": "BNB-241101-700-C",            "side": "SELL",            "quantity": "1.66",            "price": "20"        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Detail)
