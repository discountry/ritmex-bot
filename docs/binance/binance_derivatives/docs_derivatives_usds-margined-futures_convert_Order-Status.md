---
title: "Order Status | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status"
fetched_at: "2026-01-27T05:28:26.676Z"
---
# Order status(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)

Query order status by order ID.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)

GET `/fapi/v1/convert/orderStatus`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)

**50(IP)**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)

Name

Type

Mandatory

Description

orderId

STRING

NO

Either orderId or quoteId is required

quoteId

STRING

NO

Either orderId or quoteId is required

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)

```
{  "orderId":933256278426274426,  "orderStatus":"SUCCESS",  "fromAsset":"BTC",  "fromAmount":"0.00054414",  "toAsset":"USDT",  "toAmount":"20",  "ratio":"36755",  "inverseRatio":"0.00002721",  "createTime":1623381330472}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Order-Status)
