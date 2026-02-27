---
title: "Query Margin Account OCO | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO"
fetched_at: "2026-01-27T05:28:22.536Z"
---
# Query Margin Account's OCO (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)

Retrieves a specific OCO based on provided optional parameters

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)

GET `/papi/v1/margin/orderList`

## Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)

**5**

## Parameters:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)

Name

Type

Mandatory

Description

orderListId

LONG

NO

Either orderListId or origClientOrderId must be provided

origClientOrderId

STRING

NO

Either orderListId or origClientOrderId must be provided

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)

```
{  "orderListId": 27,  "contingencyType": "OCO",  "listStatusType": "EXEC_STARTED",  "listOrderStatus": "EXECUTING",  "listClientOrderId": "h2USkA5YQpaXHPIrkd96xE",  "transactionTime": 1565245656253,  "symbol": "LTCBTC",  "orders": [    {      "symbol": "LTCBTC",      "orderId": 4,      "clientOrderId": "qD1gy3kc3Gx0rihm9Y3xwS"    },    {      "symbol": "LTCBTC",      "orderId": 5,      "clientOrderId": "ARzZ9I00CPM8i3NhmU9Ega"    }  ]}
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)
-   [Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)
-   [Parameters:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)
-   [Response:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-OCO)
