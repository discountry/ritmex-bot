---
title: "Margin Account New OCO | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO"
fetched_at: "2026-01-27T05:28:20.589Z"
---
# Margin Account New OCO(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)

Send in a new OCO for a margin account

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)

POST `/papi/v1/margin/order/oco`

## Request Weight(Order)[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)

Name

Type

Mandatory

Description

symbol

STRING

YES

listClientOrderId

STRING

NO

A unique Id for the entire orderList

side

ENUM

YES

quantity

DECIMAL

YES

limitClientOrderId

STRING

NO

A unique Id for the limit order

price

DECIMAL

YES

limitIcebergQty

DECIMAL

NO

stopClientOrderId

STRING

NO

A unique Id for the stop loss/stop loss limit leg

stopPrice

DECIMAL

YES

stopLimitPrice

DECIMAL

NO

If provided, stopLimitTimeInForce is required.

stopIcebergQty

DECIMAL

NO

stopLimitTimeInForce

ENUM

NO

Valid values are `GTC/FOK/IOC`

newOrderRespType

ENUM

NO

Set the response JSON.

sideEffectType

ENUM

NO

NO\_SIDE\_EFFECT, MARGIN\_BUY, AUTO\_REPAY; default NO\_SIDE\_EFFECT.

recvWindow

LONG

NO

The value cannot be greater than `60000`

timestamp

LONG

YES

Other Info:

> -   Price Restrictions:
>     -   `SELL`: Limit Price > Last Price > Stop Price
>     -   `BUY`: Limit Price < Last Price < Stop Price
> -   Quantity Restrictions:
>     -   Both legs must have the same quantity
>     -   `ICEBERG` quantities however do not have to be the same.
> -   Order Rate Limit
>     -   `OCO` counts as 2 orders against the order rate limit.

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)

```
{  "orderListId": 0,  "contingencyType": "OCO",  "listStatusType": "EXEC_STARTED",  "listOrderStatus": "EXECUTING",  "listClientOrderId": "JYVpp3F0f5CAG15DhtrqLp",  "transactionTime": 1563417480525,  "symbol": "LTCBTC",  "marginBuyBorrowAmount": "5",       // will not return if no margin trade happens  "marginBuyBorrowAsset": "BTC",    // will not return if no margin trade happens  "orders": [    {      "symbol": "LTCBTC",      "orderId": 2,      "clientOrderId": "Kk7sqHb9J6mJWTMDVW7Vos"    },    {      "symbol": "LTCBTC",      "orderId": 3,      "clientOrderId": "xTXKaGYd4bluPVp78IVRvl"    }  ],  "orderReports": [    {      "symbol": "LTCBTC",      "orderId": 2,      "orderListId": 0,      "clientOrderId": "Kk7sqHb9J6mJWTMDVW7Vos",      "transactTime": 1563417480525,      "price": "0.000000",      "origQty": "0.624363",      "executedQty": "0.000000",      "cummulativeQuoteQty": "0.000000",      "status": "NEW",      "timeInForce": "GTC",      "type": "STOP_LOSS",      "side": "BUY",      "stopPrice": "0.960664"    },    {      "symbol": "LTCBTC",      "orderId": 3,      "orderListId": 0,      "clientOrderId": "xTXKaGYd4bluPVp78IVRvl",      "transactTime": 1563417480525,      "price": "0.036435",      "origQty": "0.624363",      "executedQty": "0.000000",      "cummulativeQuoteQty": "0.000000",      "status": "NEW",      "timeInForce": "GTC",      "type": "LIMIT_MAKER",      "side": "BUY"    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)
-   [Request Weight(Order)](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-New-OCO)
