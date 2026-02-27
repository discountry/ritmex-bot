---
title: "Query Margin Account Open OCO | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO"
fetched_at: "2026-01-27T05:28:22.674Z"
---
# Query Margin Account's Open OCO (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)

Query Margin Account's Open OCO

## HTTP Request[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)

GET `/papi/v1/margin/openOrderList`

## Weight[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)

**5**

## Parameters:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

The value cannot be greater than 60000

timestamp

LONG

YES

## Response:[​](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)

```
[  {    "orderListId": 31,    "contingencyType": "OCO",    "listStatusType": "EXEC_STARTED",    "listOrderStatus": "EXECUTING",    "listClientOrderId": "wuB13fmulKj3YjdqWEcsnp",    "transactionTime": 1565246080644,    "symbol": "LTCBTC",    "orders": [      {        "symbol": "LTCBTC",        "orderId": 4,        "clientOrderId": "r3EH2N76dHfLoSZWIUw1bT"      },      {        "symbol": "LTCBTC",        "orderId": 5,        "clientOrderId": "Cv1SnyPD3qhqpbjpYEHbd2"      }    ]  }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)
-   [Weight](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)
-   [Parameters:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)
-   [Response:](https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Margin-Account-Open-OCO)
