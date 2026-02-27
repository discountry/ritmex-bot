---
title: "Account Trade List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List"
fetched_at: "2026-01-27T05:28:11.430Z"
---
# Account Trade List (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)

Get trades for a specific account and symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)

`GET /eapi/v1/userTrades (HMAC SHA256)`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)

Name

Type

Mandatory

Description

symbol

STRING

NO

Option symbol, e.g BTC-200730-9000-C

fromId

LONG

NO

Trade id to fetch from. Default gets most recent trades, e.g 4611875134427365376

startTime

LONG

NO

Start time, e.g 1593511200000

endTime

LONG

NO

End time, e.g 1593512200000

limit

INT

NO

Default 100; max 1000

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)

```
[  {    "id": 4611875134427365377,          // unique id    "tradeId": 239,                     // trade id    "orderId": 4611875134427365377,     // order id    "symbol": "BTC-200730-9000-C",      // option symbol    "price": "100",                     // trade price    "quantity": "1",                    // trade quantity    "fee": "0",                         // fee(negative is fee deduction)    "realizedProfit": "0.00000000",     // realized profit/loss    "side": "BUY",                      // order side    "type": "LIMIT",                    // order type      "liquidity": "TAKER",               // TAKER or MAKER          "time": 1592465880683               // trade time    "priceScale": 2,    "quantityScale": 2,    "optionSide": "CALL",    "quoteAsset": "USDT"  } ]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/trade/Account-Trade-List)
