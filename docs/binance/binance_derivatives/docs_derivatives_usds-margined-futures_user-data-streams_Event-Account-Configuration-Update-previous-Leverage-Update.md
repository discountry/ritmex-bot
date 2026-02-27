---
title: "Event Account Configuration Update Previous Leverage Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Account-Configuration-Update-previous-Leverage-Update"
fetched_at: "2026-01-27T05:28:32.874Z"
---
# Event: Account Configuration Update previous Leverage Update

## Event Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Account-Configuration-Update-previous-Leverage-Update)

When the account configuration is changed, the event type will be pushed as `ACCOUNT_CONFIG_UPDATE` When the leverage of a trade pair changes, the payload will contain the object `ac` to represent the account configuration of the trade pair, where `s` represents the specific trade pair and `l` represents the leverage When the user Multi-Assets margin mode changes the payload will contain the object `ai` representing the user account configuration, where `j` represents the user Multi-Assets margin mode

## Event Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Account-Configuration-Update-previous-Leverage-Update)

`ACCOUNT_CONFIG_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Account-Configuration-Update-previous-Leverage-Update)

> **Payload:**

```
{    "e":"ACCOUNT_CONFIG_UPDATE",       // Event Type    "E":1611646737479,		           // Event Time    "T":1611646737476,		           // Transaction Time    "ac":{								    "s":"BTCUSDT",					   // symbol    "l":25						       // leverage         }}   
```

> **Or**

```
{    "e":"ACCOUNT_CONFIG_UPDATE",       // Event Type    "E":1611646737479,		           // Event Time    "T":1611646737476,		           // Transaction Time    "ai":{							   // User's Account Configuration    "j":true						   // Multi-Assets Mode    }}  
```

-   [Event Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Account-Configuration-Update-previous-Leverage-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Account-Configuration-Update-previous-Leverage-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Account-Configuration-Update-previous-Leverage-Update)
