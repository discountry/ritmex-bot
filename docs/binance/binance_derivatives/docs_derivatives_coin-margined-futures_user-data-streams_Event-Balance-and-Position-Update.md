---
title: "Event Balance And Position Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Balance-and-Position-Update"
fetched_at: "2026-01-27T05:28:06.670Z"
---
# Event: Balance and Position Update

## Event Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Balance-and-Position-Update)

Event type is `ACCOUNT_UPDATE`.

-   When balance or position get updated, this event will be pushed.
    
    -   `ACCOUNT_UPDATE` will be pushed only when update happens on user's account, including changes on balances, positions, or margin type.
    -   Unfilled orders or cancelled orders will not make the event `ACCOUNT_UPDATE` pushed, since there's no change on positions.
    -   "position" in `ACCOUNT_UPDATE`: All symbols will be pushed.
-   The field "m" represents the reason type for the event and may shows the following possible types:
    
    -   DEPOSIT
    -   WITHDRAW
    -   ORDER
    -   FUNDING\_FEE
    -   ADJUSTMENT
    -   INSURANCE\_CLEAR
    -   ADMIN\_DEPOSIT
    -   ADMIN\_WITHDRAW
    -   MARGIN\_TRANSFER
    -   MARGIN\_TYPE\_CHANGE
    -   ASSET\_TRANSFER
    -   COIN\_SWAP\_DEPOSIT
    -   COIN\_SWAP\_WITHDRAW
-   The field "bc" represents the balance change except for PnL and commission.
    

## Event Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Balance-and-Position-Update)

`ACCOUNT_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Balance-and-Position-Update)

```
{  "e": "ACCOUNT_UPDATE",			// Event Type  "E": 1564745798939,            	// Event Time  "T": 1564745798938 ,           	// Transaction  "i": "SfsR",						// Account Alias  "a":                          	// Update Data    {      "m":"ORDER",					// Event reason type      "B":[                     	// Balances        {          "a":"BTC",           	    // Asset          "wb":"122624.12345678",   // Wallet Balance          "cw":"100.12345678",		// Cross Wallet Balance          "bc":"50.12345678"			// Balance Change except PnL and Commission        },        {          "a":"ETH",                     "wb":"1.00000000",          "cw":"0.00000000",          "bc":"-49.12345678"        }      ],      "P":[        {          "s":"BTCUSD_200925",      // Symbol          "pa":"0",               	// Position Amount          "ep":"0.0",               // Entry Price          "bep":"0.0",               // Break-Even Price           "cr":"200",             	// (Pre-fee) Accumulated Realized          "up":"0",					// Unrealized PnL          "mt":"isolated",			// Margin Type          "iw":"0.00000000",		// Isolated Wallet (if isolated position)          "ps":"BOTH"				// Position Side        },        {        	"s":"BTCUSD_200925",        	"pa":"20",        	"ep":"6563.6",            "bep":"6563.7",        	"cr":"0",        	"up":"2850.21200000",        	"mt":"isolated",        	"iw":"13200.70726908",        	"ps":"LONG"      	 },        {        	"s":"BTCUSD_200925",        	"pa":"-10",        	"ep":"6563.8"            "bep":"6563.6",,        	"cr":"-45.04000000",        	"up":"-1423.15600000",        	"mt":"isolated",        	"iw":"6570.42511771",        	"ps":"SHORT"        }      ]    }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Balance-and-Position-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Balance-and-Position-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Balance-and-Position-Update)
