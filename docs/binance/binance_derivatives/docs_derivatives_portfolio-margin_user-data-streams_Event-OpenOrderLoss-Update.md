---
title: "Event Openorderloss Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-OpenOrderLoss-Update"
fetched_at: "2026-01-27T05:28:24.115Z"
---
# Event: OpenOrderLoss Update

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-OpenOrderLoss-Update)

Cross margin order margin stream

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-OpenOrderLoss-Update)

`openOrderLoss`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-OpenOrderLoss-Update)

```
{    "e": "openOrderLoss",      //Event Type    "E": 1678710578788,        // Event Time    "O": [        {                    // Update Data        "a": "BUSD",        "o": "-0.1232313"       // Amount        },         {        "a": "BNB",        "o": "-12.1232313"        }    ]}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-OpenOrderLoss-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-OpenOrderLoss-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-OpenOrderLoss-Update)
