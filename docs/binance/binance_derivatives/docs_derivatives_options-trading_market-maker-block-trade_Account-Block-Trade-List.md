---
title: "Account Block Trade List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List"
fetched_at: "2026-01-27T05:28:10.663Z"
---
# Account Block Trade List (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)

Gets block trades for a specific account.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)

GET `/eapi/v1/block/user-trades`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)

Name

Type

Mandatory

 Description

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

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)

```
[    {        "parentOrderId": "4675011431944499201",        "crossType": "USER_BLOCK",        "legs": [            {                "createTime": 1730170445600,                "updateTime": 1730170445600,                "symbol": "BNB-241101-700-C",                "orderId": "4675011431944499203",                "orderPrice": 2.8,                "orderQuantity": 1.2,                "orderStatus": "FILLED",                "executedQty": 1.2,                "executedAmount": 3.36,                "fee": 0.336,                "orderType": "PREV_QUOTED",                "orderSide": "BUY",                "id": "1125899906900937837",                "tradeId": 1,                "tradePrice": 2.8,                "tradeQty": 1.2,                "tradeTime": 1730170445600,                "liquidity": "TAKER",                "commission": 0.336            }        ],        "blockTradeSettlementKey": "7d085e6e-a229-2335-ab9d-6a581febcd25"    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-maker-block-trade/Account-Block-Trade-List)
