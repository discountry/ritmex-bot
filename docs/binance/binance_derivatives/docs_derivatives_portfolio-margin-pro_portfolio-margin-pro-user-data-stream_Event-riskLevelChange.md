---
title: "Event Risklevelchange | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin-pro/portfolio-margin-pro-user-data-stream/Event-riskLevelChange"
fetched_at: "2026-01-27T05:28:15.887Z"
---
# Event: riskLevelChange

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/portfolio-margin-pro-user-data-stream/Event-riskLevelChange)

-   When the user's position risk ratio is too high, this stream will be pushed.
-   This message is only used as risk guidance information and is not recommended for investment strategies.
-   `RISK_LEVEL_CHANGE`includes following types：`MARGIN_CALL`, `REDUCE_ONLY`, `FORCE_LIQUIDATION`
-   In the case of a highly volatile market, there may be the possibility that the user's position has been liquidated at the same time when this stream is pushed out.

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/portfolio-margin-pro-user-data-stream/Event-riskLevelChange)

`RISK_LEVEL_CHANGE`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/portfolio-margin-pro-user-data-stream/Event-riskLevelChange)

```
{    "e":"riskLevelChange",      // Event Type    "E":1587727187525,      // Event Time    "u":"1.99999999",      // uniMMR level    "s":"MARGIN_CALL",        //MARGIN_CALL, REDUCE_ONLY, FORCE_LIQUIDATION     "eq":"30.23416728",      // account equity in USD value    "ae":"30.23416728",      // actual equity without collateral rate in USD value    "m":"15.11708371"      // total maintenance margin in USD value }  
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/portfolio-margin-pro-user-data-stream/Event-riskLevelChange)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/portfolio-margin-pro-user-data-stream/Event-riskLevelChange)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin-pro/portfolio-margin-pro-user-data-stream/Event-riskLevelChange)
