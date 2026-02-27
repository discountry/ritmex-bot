---
title: "Cancel Margin Account All Open Orders On A Symbol | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol"
fetched_at: "2026-01-27T05:28:20.011Z"
---
# Cancel Margin Account All Open Orders on a Symbol(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)

Cancel Margin Account All Open Orders on a Symbol

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)

DELETE `/papi/v1/margin/allOpenOrders`

## Request Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)

Name

Type

Mandatory

Description

symbol

STRING

YES

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)

```
[  {    "symbol": "BTCUSDT",    "origClientOrderId": "E6APeyTJvkMvLMYMqu1KQ4",    "orderId": 11,    "orderListId": -1,    "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",    "price": "0.089853",    "origQty": "0.178622",    "executedQty": "0.000000",    "cummulativeQuoteQty": "0.000000",    "status": "CANCELED",    "timeInForce": "GTC",    "type": "LIMIT",    "side": "BUY"  },  {    "orderListId": 1929,    "contingencyType": "OCO",    "listStatusType": "ALL_DONE",    "listOrderStatus": "ALL_DONE",    "listClientOrderId": "2inzWQdDvZLHbbAmAozX2N",    "transactionTime": 1585230948299,    "symbol": "BTCUSDT",    "orders": [      {        "symbol": "BTCUSDT",        "orderId": 20,        "clientOrderId": "CwOOIPHSmYywx6jZX77TdL"      },      {        "symbol": "BTCUSDT",        "orderId": 21,        "clientOrderId": "461cPg51vQjV3zIMOXNz39"      }    ],    "orderReports": [      {        "symbol": "BTCUSDT",        "origClientOrderId": "CwOOIPHSmYywx6jZX77TdL",        "orderId": 20,        "orderListId": 1929,        "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",        "price": "0.668611",        "origQty": "0.690354",        "executedQty": "0.000000",        "cummulativeQuoteQty": "0.000000",        "status": "CANCELED",        "timeInForce": "GTC",        "type": "STOP_LOSS_LIMIT",        "side": "BUY",        "stopPrice": "0.378131",        "icebergQty": "0.017083"      },      {        "symbol": "BTCUSDT",        "origClientOrderId": "461cPg51vQjV3zIMOXNz39",        "orderId": 21,        "orderListId": 1929,        "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",        "price": "0.008791",        "origQty": "0.690354",        "executedQty": "0.000000",        "cummulativeQuoteQty": "0.000000",        "status": "CANCELED",        "timeInForce": "GTC",        "type": "LIMIT_MAKER",        "side": "BUY",        "icebergQty": "0.639962"      }    ]  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)
-   [Request Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol)
