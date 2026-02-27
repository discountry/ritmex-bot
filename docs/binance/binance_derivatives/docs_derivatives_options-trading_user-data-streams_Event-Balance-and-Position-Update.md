---
title: "Event Balance and Position Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Balance-and-Position-Update"
fetched_at: "2026-01-27T05:28:12.627Z"
---
# Event: Balance and Position Update

## Event Description[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Balance-and-Position-Update)

Event type is `ACCOUNT_UPDATE`.

-   When balance or position get updated, this event will be pushed.
    
    -   `ACCOUNT_UPDATE` will be pushed only when update happens on user's account, including changes on balances, positions.
    -   Unfilled orders or cancelled orders will not make the event `ACCOUNT_UPDATE` pushed, since there's no change on positions.
    -   "position" in `ACCOUNT_UPDATE`: Only symbols of changed positions will be pushed.
-   The field "m" represents the reason type for the event and may shows the following possible types:
    
    -   DEPOSIT
    -   WITHDRAW
    -   ORDER
-   The field "bc" represents the balance change except for PnL and commission.
    

## Event Name[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Balance-and-Position-Update)

`BALANCE_POSITION_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Balance-and-Position-Update)

```
{        "e": "BALANCE_POSITION_UPDATE",        "E": 1762917544216,        "T": 1762917544206,        "m": "ORDER",        "B": [            {                "a": "USDT",                  // Margin asset                  "b": "10000471.37940900",     // Account balance                  "bc": "0"                     // Balance Change except PnL and Commission            }        ],        "P": [            {                "s": "BTC-251123-126000-C",   // symbol                 "c": "-0.1000",               // position quantity                "p": "-120.00000000",         // Position value                  "a": "1200.00000000"          // Average entry price               }        ]}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Balance-and-Position-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Balance-and-Position-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Balance-and-Position-Update)
