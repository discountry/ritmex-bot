---
title: "Query Account Configuration | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config"
fetched_at: "2026-01-27T05:28:24.610Z"
---
# Futures Account Configuration(USER\_DATA)

## API Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)

Query account configuration

## HTTP Request[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)

GET `/fapi/v1/accountConfig`

## Request Weight[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)

**5**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)

Name

Type

Mandatory

Description

recvWindow

LONG

NO

timestamp

LONG

YES

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)

```
{       "feeTier": 0,               // account commission tier     "canTrade": true,           // if can trade    "canDeposit": true,         // if can transfer in asset    "canWithdraw": true,        // if can transfer out asset    "dualSidePosition": true,    "updateTime": 0,            // reserved property, please ignore     "multiAssetsMargin": false,    "tradeGroupId": -1}
```

-   [API Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)
-   [Request Weight](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config)
