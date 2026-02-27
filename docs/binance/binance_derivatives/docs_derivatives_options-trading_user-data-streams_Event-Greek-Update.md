---
title: "Event Greek Update | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update"
fetched_at: "2026-01-27T05:28:12.735Z"
---
# Event: Greek Update

## Event Description[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)

`GREEK_UPDATE` will be triggered when a position changes or periodically every 10 seconds when having position.

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)

`/private`

## Event Name[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)

`GREEK_UPDATE`

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)

```
{        "e": "GREEK_UPDATE",        "E": 1762917544216,        "T": 1762917544216,        "G": [            {                "u": "BTCUSDT",                 "d": "-0.01304097",   //delta                "g": "-0.00000124",   //gamma                "t": "16.11648100",   //theta                 "v": "-3.83444011"    //vega            }        ]}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)
-   [Event Name](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Greek-Update)
