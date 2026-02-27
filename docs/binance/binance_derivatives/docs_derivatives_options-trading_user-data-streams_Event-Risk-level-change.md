---
title: "Event Risk Level Change | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change"
fetched_at: "2026-01-27T05:28:12.744Z"
---
# Event: Risk level change

## Event Description[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)

-   Updates whenever there is an account risk level change. The following are possibly values:
    -   NORMAL
    -   REDUCE\_ONLY
-   Note: Risk level changes are only applicable to VIP and Market Makers user accounts. VIP and certain Market Maker accounts will be automatically placed into REDUCE\_ONLY mode if their margin balance is insufficient to meet their maintenance margin obligations. Once in REDUCE\_ONLY mode, the system will re-evaluate the risk level only upon the following events:
    -   Funds transfer
    -   Trade fill
    -   Option expiry

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)

`/private`

## Event Name[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)

`RISK_LEVEL_CHANGE`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)

**50ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)

```
{     "e":"RISK_LEVEL_CHANGE", //Event Type     "E":1587727187525, //Event Time     "s":"REDUCE_ONLY", //risk level    "mb":"1534.11708371", //margin balance     "mm":"254789.11708371" //maintenance margin } 
```

-   [Event Description](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)
-   [Event Name](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Risk-level-change)
