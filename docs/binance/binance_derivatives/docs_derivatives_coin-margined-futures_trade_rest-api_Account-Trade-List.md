---
title: "Query Account Trade List | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List"
fetched_at: "2026-01-27T05:28:04.620Z"
---
# Account Trade List (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)

Get trades for a specific account and symbol.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)

GET `/dapi/v1/userTrades`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)

**20** with symbol，**40** with pair

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)

Name

Type

Mandatory

Description

symbol

STRING

NO

pair

STRING

NO

orderId

STRING

NO

startTime

LONG

NO

endTime

LONG

NO

fromId

LONG

NO

Trade id to fetch from. Default gets most recent trades.

limit

INT

NO

Default 50; max 1000

recvWindow

LONG

NO

timestamp

LONG

YES

> -   Either symbol or pair must be sent
> -   Symbol and pair cannot be sent together
> -   Pair and fromId cannot be sent together
> -   OrderId can only be sent together with symbol
> -   If a pair is sent,tickers for all symbols of the pair will be returned
> -   The parameter `fromId` cannot be sent with `startTime` or `endTime`
> -   If startTime and endTime are both not sent, then the last 7 days' data will be returned.
> -   The time between startTime and endTime cannot be longer than 7 days.

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)

```
[	{		'symbol': 'BTCUSD_200626',	  	'id': 6,	  	'orderId': 28,	  	'pair': 'BTCUSD',	  	'side': 'SELL',	  	'price': '8800',	  	'qty': '1',	  	'realizedPnl': '0',	  	'marginAsset': 'BTC',	  	'baseQty': '0.01136364',	  	'commission': '0.00000454',	  	'commissionAsset': 'BTC',	  	'time': 1590743483586,	  	'positionSide': 'BOTH',	  	'buyer': false,	  	'maker': false	}]
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/rest-api/Account-Trade-List)
