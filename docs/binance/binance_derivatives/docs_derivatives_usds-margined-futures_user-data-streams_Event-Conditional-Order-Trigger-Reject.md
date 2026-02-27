---
title: "Event Conditional Order Trigger Reject | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Conditional-Order-Trigger-Reject"
fetched_at: "2026-01-27T05:28:33.127Z"
---
# Event: Conditional\_Order\_Trigger\_Reject

## Event Description[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Conditional-Order-Trigger-Reject)

`CONDITIONAL_ORDER_TRIGGER_REJECT` update when a triggered TP/SL order got rejected.

## Event Name[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Conditional-Order-Trigger-Reject)

`CONDITIONAL_ORDER_TRIGGER_REJECT`

## Response Example[​](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Conditional-Order-Trigger-Reject)

```
{    "e":"CONDITIONAL_ORDER_TRIGGER_REJECT",      // Event Type    "E":1685517224945,      // Event Time    "T":1685517224955,      // me message send Time    "or":{      "s":"ETHUSDT",      // Symbol         "i":155618472834,      // orderId      "r":"Due to the order could not be filled immediately, the FOK order has been rejected. The order will not be recorded in the order history",      // reject reason     }}  
```

-   [Event Description](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Conditional-Order-Trigger-Reject)
-   [Event Name](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Conditional-Order-Trigger-Reject)
-   [Response Example](https://developers.binance.com/docs/derivatives/usds-margined-futures/user-data-streams/Event-Conditional-Order-Trigger-Reject)
