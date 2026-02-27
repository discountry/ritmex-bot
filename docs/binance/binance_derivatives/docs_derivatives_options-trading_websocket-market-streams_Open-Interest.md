---
title: "Open Interest | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest"
fetched_at: "2026-01-27T05:28:13.789Z"
---
# Open Interest

## Stream Description[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)

Option open interest for specific underlying asset on specific expiration date. E.g.[ethusdt@openInterest@221125](wss://fstream.binance.com/market/stream?streams=ethusdt@openInterest@221125)

## URL PATH[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)

`/market`

## Stream Name[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)

`underlying@optionOpenInterest@<expirationDate>`

## Update Speed[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)

**60s**

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)

```
[    {      "e":"openInterest",         // Event type      "E":1668759300045,          // Event time      "s":"ETH-221125-2700-C",    // option symbol      "o":"1580.87",              // Open interest in contracts      "h":"1912992.178168204"     // Open interest in USDT    }]
```

-   [Stream Description](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)
-   [URL PATH](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)
-   [Stream Name](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)
-   [Update Speed](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/websocket-market-streams/Open-Interest)
