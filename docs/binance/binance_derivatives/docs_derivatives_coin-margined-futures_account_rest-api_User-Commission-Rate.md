---
title: "User Commission Rate | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate"
fetched_at: "2026-01-27T05:28:01.811Z"
---
# User Commission Rate (USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)

Query user commission rate

## HTTP Request[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)

GET `/dapi/v1/commissionRate`

## Request Weight[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)

**20**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)

Name

Type

Mandatory

Description

symbol

STRING

YES

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)

```
{	"symbol": "BTCUSD_PERP",  	"makerCommissionRate": "0.00015",  // 0.015%  	"takerCommissionRate": "0.00040"   // 0.040%}
```

-   [API Description](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)
-   [Request Weight](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)
-   [Response Example](https://developers.binance.com/docs/derivatives/coin-margined-futures/account/rest-api/User-Commission-Rate)
