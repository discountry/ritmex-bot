---
title: "Change Margin Type | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type"
fetched_at: "2026-01-27T05:28:30.387Z"
---
# Change Margin Type(TRADE)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)

Change symbol level margin type

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)

POST `/fapi/v1/marginType`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)

Name

Type

Mandatory

Description

symbol

STRING

YES

marginType

ENUM

YES

ISOLATED, CROSSED

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)

```
{	"code": 200,	"msg": "success"}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type)
