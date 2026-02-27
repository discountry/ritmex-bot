---
title: "Event Futures Balance And Position Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update"
fetched_at: "2026-01-27T05:28:23.859Z"
---
# Event: Futures Balance and Position Update

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)

Event type is `ACCOUNT_UPDATE`.

-   When balance or position get updated, this event will be pushed.
    
    -   `ACCOUNT_UPDATE` will be pushed only when update happens on user's account, including changes on balances, positions, or margin type.
    -   Unfilled orders or cancelled orders will not make the event `ACCOUNT_UPDATE` pushed, since there's no change on positions.
    -   "position" in `ACCOUNT_UPDATE`: Only symbols of changed positions will be pushed.
-   When "FUNDING FEE" changes to the user's balance, the event will be pushed with the brief message:
    
    -   When "FUNDING FEE" occurs in a **crossed position**, `ACCOUNT_UPDATE` will be pushed with only the balance `B`(including the "FUNDING FEE" asset only), without any position `P` message.
    -   When "FUNDING FEE" occurs in an **isolated position**, `ACCOUNT_UPDATE` will be pushed with only the balance `B`(including the "FUNDING FEE" asset only) and the relative position message `P`( including the isolated position on which the "FUNDING FEE" occurs only, without any other position message).
-   The field "m" represents the reason type for the event and may shows the following possible types:
    
    -   DEPOSIT
    -   WITHDRAW
    -   ORDER
    -   FUNDING\_FEE
    -   WITHDRAW\_REJECT
    -   ADJUSTMENT
    -   INSURANCE\_CLEAR
    -   ADMIN\_DEPOSIT
    -   ADMIN\_WITHDRAW
    -   MARGIN\_TRANSFER
    -   MARGIN\_TYPE\_CHANGE
    -   ASSET\_TRANSFER
    -   OPTIONS\_PREMIUM\_FEE
    -   OPTIONS\_SETTLE\_PROFIT
    -   AUTO\_EXCHANGE
    -   COIN\_SWAP\_DEPOSIT
    -   COIN\_SWAP\_WITHDRAW
-   The field "bc" represents the balance change except for PnL and commission.
    

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)

`ACCOUNT_UPDATE`

## Update Speed[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)

50ms

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)

```
{  "e": "ACCOUNT_UPDATE",                // Event Type  "fs": "UM",                           // Event business unit. 'UM' for USDS-M futures and 'CM' for COIN-M futures  "E": 1564745798939,                   // Event Time  "T": 1564745798938 ,                  // Transaction  "i":"",                           // Account Alias, ignore for UM  "a":                                  // Update Data    {      "m":"ORDER",                      // Event reason type      "B":[                             // Balances        {          "a":"USDT",                   // Asset          "wb":"122624.12345678",       // Wallet Balance          "cw":"100.12345678",          // Cross Wallet Balance          "bc":"50.12345678"            // Balance Change except PnL and Commission        },        {          "a":"BUSD",                    "wb":"1.00000000",          "cw":"0.00000000",                  "bc":"-49.12345678"        }      ],      "P":[        {          "s":"BTCUSDT",            // Symbol          "pa":"0",                 // Position Amount          "ep":"0.00000",            // Entry Price          "cr":"200",               // (Pre-fee) Accumulated Realized          "up":"0",                     // Unrealized PnL          "ps":"BOTH",                   // Position Side          "bep":"0.00000"            // breakeven price        }，        {            "s":"BTCUSDT",            "pa":"20",            "ep":"6563.66500",            "cr":"0",            "up":"2850.21200",            "ps":"LONG",            "bep":"0.00000"            // breakeven price         }      ]    }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)
-   [Update Speed](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Balance-and-Position-Update)
