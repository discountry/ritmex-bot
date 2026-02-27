---
title: "Event Order Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update"
fetched_at: "2026-01-27T05:28:33.273Z"
---
# Event: Order Update

## Event Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update)

When new order created, order status changed will push such event. event type is `ORDER_TRADE_UPDATE`.

**Side**

-   BUY
-   SELL

**Order Type**

-   LIMIT
-   MARKET
-   STOP
-   STOP\_MARKET
-   TAKE\_PROFIT
-   TAKE\_PROFIT\_MARKET
-   TRAILING\_STOP\_MARKET
-   LIQUIDATION

**Execution Type**

-   NEW
-   CANCELED
-   CALCULATED - Liquidation Execution
-   EXPIRED
-   TRADE
-   AMENDMENT - Order Modified

**Order Status**

-   NEW
-   PARTIALLY\_FILLED
-   FILLED
-   CANCELED
-   EXPIRED
-   EXPIRED\_IN\_MATCH

**Time in force**

-   GTC
-   IOC
-   FOK
-   GTX

**Working Type**

-   MARK\_PRICE
-   CONTRACT\_PRICE

**Liquidation and ADL:**

-   If user gets liquidated due to insufficient margin balance:
    
    -   `c` shows as "autoclose-XXX"，`X` shows as "NEW"
-   If user has enough margin balance but gets ADL:
    
    -   `c` shows as “adl\_autoclose”，`X` shows as “NEW”

**Expiry Reason**

-   `0`: None, the default value
-   `1`: Order has expired to prevent users from inadvertently trading against themselves
-   `2`: IOC order could not be filled completely, remaining quantity is canceled
-   `3`: IOC order could not be filled completely to prevent users from inadvertently trading against themselves, remaining quantity is canceled
-   `4`: Order has been canceled, as it's knocked out by another higher priority RO (market) order or reversed positions would be opened
-   `5`: Order has expired when the account was liquidated
-   `6`: Order has expired as GTE condition unsatisfied
-   `7`: Order has been canceled as the symbol is delisted
-   `8`: The initial order has expired after the stop order is triggered
-   `9`: Market order could not be filled completely, remaining quantity is canceled

## Event Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update)

`ORDER_TRADE_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update)

```
{  "e":"ORDER_TRADE_UPDATE",		   // Event Type  "E":1568879465651,			       // Event Time  "T":1568879465650,			       // Transaction Time  "o":{								    "s":"BTCUSDT",			         // Symbol    "c":"TEST",				           // Client Order Id      // special client order id:      // starts with "autoclose-": liquidation order      // "adl_autoclose": ADL auto close order      // "settlement_autoclose-": settlement order for delisting or delivery    "S":"SELL",					         // Side    "o":"TRAILING_STOP_MARKET",	 // Order Type    "f":"GTC",					         // Time in Force    "q":"0.001",				         // Original Quantity    "p":"0",					           // Original Price    "ap":"0",					           // Average Price    "sp":"7103.04",				       // Stop Price. Please ignore with TRAILING_STOP_MARKET order    "x":"NEW",					         // Execution Type    "X":"NEW",					         // Order Status    "i":8886774,				         // Order Id    "l":"0",					           // Order Last Filled Quantity    "z":"0",					           // Order Filled Accumulated Quantity    "L":"0",					           // Last Filled Price    "N":"USDT",            	     // Commission Asset    "n":"0",               	     // Commission    "T":1568879465650,			     // Order Trade Time    "t":0,			        	       // Trade Id    "b":"0",			    	         // Bids Notional    "a":"9.91",					         // Ask Notional    "m":false,					         // Is this trade the maker side?    "R":false,					         // Is this reduce only    "wt":"CONTRACT_PRICE", 		   // Stop Price Working Type    "ot":"TRAILING_STOP_MARKET", // Original Order Type    "ps":"LONG",					       // Position Side    "cp":false,						       // If Close-All, pushed with conditional order    "AP":"7476.89",				       // Activation Price, only puhed with TRAILING_STOP_MARKET order    "cr":"5.0",					         // Callback Rate, only puhed with TRAILING_STOP_MARKET order    "pP": false,                 // If price protection is turned on    "si": 0,                     // ignore    "ss": 0,                     // ignore    "rp":"0",	   					       // Realized Profit of the trade    "V":"EXPIRE_TAKER",          // STP mode    "pm":"OPPONENT",             // Price match mode    "gtd":0,                     // TIF GTD order auto cancel time    "er":"0"                     // Expiry Reason  }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Order-Update)
