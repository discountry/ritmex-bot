---
title: "Query Block Trade Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order"
fetched_at: "2026-01-27T05:28:10.925Z"
---
# Query Block Trade Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)

Check block trade order status.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)

GET `/eapi/v1/block/order/orders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)

Name

Type

Mandatory

 Description

blockOrderMatchingKey

STRING

NO

If specified, returns the specific block trade associated with the blockOrderMatchingKey

endTime

LONG

NO

startTime

LONG

NO

underlying

STRING

NO

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)

```
[    {        "blockTradeSettlementKey": "7d046e6e-a429-4335-ab9d-6a681febcde5",        "expireTime": 1730172115801,        "liquidity": "TAKER",        "status": "RECEIVED",        "createTime": 1730170315803,        "legs": [            {                "symbol": "BNB-241101-700-C",                "side": "BUY",                "quantity": "1.2",                "price": "2.8"            }        ]    },    {        "blockTradeSettlementKey": "28b96c28-ba05-6906-a47c-703215cfbfe6",        "expireTime": 1730171860460,        "liquidity": "TAKER",        "status": "RECEIVED",        "createTime": 1730170060462,        "legs": [            {                "symbol": "BNB-241101-700-C",                "side": "BUY",                "quantity": "1.66",                "price": "20"            }        ]    }]  
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Query-Block-Trade-Order)
