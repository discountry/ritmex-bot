---
title: "Event Account Data | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data"
fetched_at: "2026-01-27T05:28:12.490Z"
---
# Event: Account data

## Event Description[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)

-   Update under the following conditions:
    -   Account deposit or withdrawal
    -   Position info change
    -   Periodic update every 10s when having position

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)

`/private`

## Event Name[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)

`ACCOUNT_UPDATE`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)

**50ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)

```
{    "stream": "89ljxuL6jFTN3Ej85aYOqH2BYXQ7eeuNYcGm7ktV",    "data": {        "e": "ACCOUNT_UPDATE",        // Event type        "E": 1762914568643,           // Event time        "T": 1762914568619,           // Transaction Time        "eq": "10000371.61462086",    // account equity in USDT        "aeq": "10000475.51032086",   // account adjusted equity in USDT        "b": "10000475.51032086",     // account wallet balance in USDT        "m": "-103.89570000",         // position value        "u": "16.10430000",           // unrealized pnl        "i": "32354.38562539",        // initial margin in USDT        "M": "6089.28766956"          // maintenance margin in USDT    }}
```

-   [Event Description](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)
-   [Event Name](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/user-data-streams/Event-Account-data)
