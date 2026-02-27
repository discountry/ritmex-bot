---
title: "Query Margin Account Order | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order"
fetched_at: "2026-01-27T05:28:22.667Z"
---
# Query Margin Account Order (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)

Query Margin Account Order

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)

GET `/papi/v1/margin/order`

## Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)

**10**

## Parameters:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)

Name

Type

Mandatory

Description

symbol

STRING

YES

orderId

LONG

NO

origClientOrderId

STRING

NO

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

**Notes:**

-   Either `orderId` or `origClientOrderId` must be sent.
-   For some historical orders cummulativeQuoteQty will be < 0, meaning the data is not available at this time.

## Response:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)

```
{   "clientOrderId": "ZwfQzuDIGpceVhKW5DvCmO",   "cummulativeQuoteQty": "0.00000000",   "executedQty": "0.00000000",   "icebergQty": "0.00000000",   "isWorking": true,   "orderId": 213205622,   "origQty": "0.30000000",   "price": "0.00493630",   "side": "SELL",   "status": "NEW",   "stopPrice": "0.00000000",   "symbol": "BNBBTC",   "time": 1562133008725,   "timeInForce": "GTC",   "type": "LIMIT",   "updateTime": 1562133008725，   "accountId": 152950866,   "selfTradePreventionMode": "EXPIRE_TAKER",   "preventedMatchId": null,   "preventedQuantity": null}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)
-   [Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)
-   [Parameters:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)
-   [Response:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Order)
