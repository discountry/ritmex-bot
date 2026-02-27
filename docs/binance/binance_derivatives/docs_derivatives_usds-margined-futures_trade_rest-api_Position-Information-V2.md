---
title: "Position Information V2 | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2"
fetched_at: "2026-01-27T05:28:31.398Z"
---
# Position Information V2 (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)

Get current position information.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)

GET `/fapi/v2/positionRisk`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)

Name

Type

Mandatory

Description

symbol

STRING

NO

recvWindow

LONG

NO

timestamp

LONG

YES

**Note**

> Please use with user data stream `ACCOUNT_UPDATE` to meet your timeliness and accuracy needs.

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)

> For One-way position mode:

```
[  	{  		"entryPrice": "0.00000",        "breakEvenPrice": "0.0",    		"marginType": "isolated",   		"isAutoAddMargin": "false",  		"isolatedMargin": "0.00000000",	  		"leverage": "10",   		"liquidationPrice": "0",   		"markPrice": "6679.50671178",	  		"maxNotionalValue": "20000000",   		"positionAmt": "0.000",  		"notional": "0",,   		"isolatedWallet": "0",  		"symbol": "BTCUSDT",   		"unRealizedProfit": "0.00000000",   		"positionSide": "BOTH",  		"updateTime": 0  	}]
```

> For Hedge position mode:

```
[    {        "symbol": "BTCUSDT",        "positionAmt": "0.001",        "entryPrice": "22185.2",        "breakEvenPrice": "0.0",          "markPrice": "21123.05052574",        "unRealizedProfit": "-1.06214947",        "liquidationPrice": "19731.45529116",        "leverage": "4",        "maxNotionalValue": "100000000",        "marginType": "cross",        "isolatedMargin": "0.00000000",        "isAutoAddMargin": "false",        "positionSide": "LONG",        "notional": "21.12305052",        "isolatedWallet": "0",        "updateTime": 1655217461579    },    {        "symbol": "BTCUSDT",        "positionAmt": "0.000",        "entryPrice": "0.0",        "breakEvenPrice": "0.0",          "markPrice": "21123.05052574",        "unRealizedProfit": "0.00000000",        "liquidationPrice": "0",        "leverage": "4",        "maxNotionalValue": "100000000",        "marginType": "cross",        "isolatedMargin": "0.00000000",        "isAutoAddMargin": "false",        "positionSide": "SHORT",        "notional": "0",        "isolatedWallet": "0",        "updateTime": 0    }]
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2)
