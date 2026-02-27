---
title: "Accept Block Trade Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order"
fetched_at: "2026-01-27T05:28:10.582Z"
---
# Accept Block Trade Order (TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)

Accept a block trade order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)

POST `/eapi/v1/block/order/execute`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)

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

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)

```
{    "blockTradeSettlementKey": "7d046e6e-a429-4335-ab9d-6a681febcde5",    "expireTime": 1730172115801,    "liquidity": "MAKER",    "status": "ACCEPTED",    "createTime": 1730170315803,    "legs": [        {            "symbol": "BNB-241101-700-C",            "side": "SELL",            "quantity": "1.2",            "price": "2.8"        }    ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Accept-Block-Trade-Order)
