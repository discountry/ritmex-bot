---
title: "New Symbol Info | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info"
fetched_at: "2026-01-27T05:28:13.928Z"
---
# New Symbol Info

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)

New symbol listing stream.

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)

`/market`

## Stream Name[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)

`!optionSymbol`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)

**50ms**  

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)

```
{    "e":"optionSymbol",             // Event Type    "E":1669356423908,              // Event Time    "s":"BTC-250926-140000-C",      // Symbol    "ps":"BTCUSDT",                 // Underlying index of the contract    "qa":"USDT",                    // Quotation asset    "d":"CALL",                     // Option type    "sp":"21000",                   // Strike price    "dt":4133404800000,             // Delivery date time    "u":1,                          // unit, the quantity of the underlying asset represented by a single contract.    "ot":1569398400000,             // onboard date time    "cs":"TRADING"                  // Contract status }
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)
-   [Stream Name](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/New-Symbol-Info)
