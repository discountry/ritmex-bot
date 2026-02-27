---
title: "Event Margin Call | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Margin-Call"
fetched_at: "2026-01-27T05:28:06.838Z"
---
# Event: Margin Call

## Event Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Margin-Call)

-   When the user's position risk ratio is too high, this stream will be pushed.
-   This message is only used as risk guidance information and is not recommended for investment strategies.
-   In the case of a highly volatile market, there may be the possibility that the user's position has been liquidated at the same time when this stream is pushed out.

## Event Name[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Margin-Call)

`MARGIN_CALL`

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Margin-Call)

```
{    "e":"MARGIN_CALL",    	  // Event Type    "E":1587727187525,		  // Event Time    "i": "SfsR",			  // Account Alias    "cw":"3.16812045",		  // Cross Wallet Balance. Only pushed with crossed position margin call    "p":[					  // Position(s) of Margin Call      {        "s":"BTCUSD_200925",  // Symbol        "ps":"LONG",		  // Position Side        "pa":"132",			  // Position Amount        "mt":"CROSSED",		  // Margin Type        "iw":"0",			  // Isolated Wallet (if isolated position)        "mp":"9187.17127000", // Mark Price        "up":"-1.166074",	  // Unrealized PnL        "mm":"1.614445"		  // Maintenance Margin Required      }    ]}  
```

-   [Event Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Margin-Call)
-   [Event Name](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Margin-Call)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/user-data-streams/Event-Margin-Call)
