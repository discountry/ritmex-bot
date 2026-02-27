---
title: "Accept Quote | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote"
fetched_at: "2026-01-27T05:28:26.549Z"
---
# Accept the offered quote (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)

Accept the offered quote by quote ID.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)

POST `/fapi/v1/convert/acceptQuote`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)

**200(IP)**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)

Name

Type

Mandatory

Description

quoteId

STRING

YES

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)

```
{  "orderId":"933256278426274426",  "createTime":1623381330472,  "orderStatus":"PROCESS" //PROCESS/ACCEPT_SUCCESS/SUCCESS/FAIL}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/convert/Accept-Quote)
