---
title: "24 Hour Ticker | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER"
fetched_at: "2026-01-27T05:28:13.213Z"
---
# 24-hour TICKER

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)

24hr ticker info for all symbols. Only symbols whose ticker info changed will be sent.

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)

`/public`

## Stream Name[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)

`<symbol>@optionTicker` or `<underlying>@optionTicker@<expiretionDate>` e.g: btcusdt@optionTicker@251230

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)

**1000ms**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)

```
{    "e": "24hrTicker",          // Event type    "E": 1764080707933,         // Event time    "s": "ETH-251226-3000-C",   // Symbol    "p": "0.0000",              // Price change    "P": "0.00",                // Price change percent    "w": "200.0000",            // Weighted average price    "c": "200.0000",            // Last price    "Q": "1.0000",              // Last quantity    "o": "200.0000",            // Open price    "h": "200.0000",            // High price    "l": "200.0000",            // Low price    "v": "9.0000",              // Trading volume(in contracts)    "q": "1800.0000",           // trade amount(in quote asset)     "O": 1764051060000,         // Statistics open time    "C": 1764080707933,         // Statistics close time    "F": 1,                     // First trade ID    "L": 22,                    // Last trade Id    "n": 9                      // Total number of trade}
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)
-   [Stream Name](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/24-hour-TICKER)
