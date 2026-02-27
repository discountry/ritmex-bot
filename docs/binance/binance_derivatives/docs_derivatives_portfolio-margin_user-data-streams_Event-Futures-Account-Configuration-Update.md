---
title: "Event Futures Account Configuration Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Account-Configuration-Update"
fetched_at: "2026-01-27T05:28:23.635Z"
---
# Event: Futures Account Configuration Update(Leverage Update)

## Event Description[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Account-Configuration-Update)

When the account configuration is changed, the event type will be pushed as `ACCOUNT_CONFIG_UPDATE` When the leverage of a trade pair changes, the payload will contain the object `ac` to represent the account configuration of the trade pair, where `s` represents the specific trade pair and `l` represents the leverage.

## Event Name[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Account-Configuration-Update)

`ACCOUNT_CONFIG_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Account-Configuration-Update)

```
{    "e":"ACCOUNT_CONFIG_UPDATE",       // Event Type        "fs": "UM",                       // Event business unit    "E":1611646737479,                 // Event Time    "T":1611646737476,                 // Transaction Time    "ac":{                                 "s":"BTCUSD_PERP",                     // symbol    "l":25                             // leverage     }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Account-Configuration-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Account-Configuration-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/portfolio-margin/user-data-streams/Event-Futures-Account-Configuration-Update)
