---
title: "Event Margin Account Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Account-Update"
fetched_at: "2026-01-27T05:28:23.887Z"
---
# Event: Margin Account Update

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Account-Update)

`outboundAccountPosition` is sent any time an account balance has changed and contains the assets that were possibly changed by the event that generated the balance change.

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Account-Update)

`outboundAccountPosition`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Account-Update)

```
{  "e": "outboundAccountPosition", //Event type  "E": 1564034571105,             //Event Time  "u": 1564034571073,             //Time of last account update  "U": 1027053479517,             // time updateID  "B": [                          //Balances Array    {      "a": "ETH",                 //Asset      "f": "10000.000000",        //Free      "l": "0.000000"             //Locked    }  ]}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Account-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Account-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Margin-Account-Update)
