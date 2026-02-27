---
title: "Kline Candlestick Data | Binance Open Platform"
source: "https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data"
fetched_at: "2026-01-27T05:28:09.879Z"
---
# Kline/Candlestick Data

## API Description[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)

Kline/candlestick bars for an option symbol. Klines are uniquely identified by their open time.

## HTTP Request[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)

GET `/eapi/v1/klines`

## Request Weight[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)

**1**

## Request Parameters[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)

Name

Type

Mandatory

Description

symbol

STRING

YES

Option trading pair, e.g BTC-200730-9000-C

interval

STRING

YES

Time interval

startTime

LONG

NO

Start Time 1592317127349

endTime

LONG

NO

End Time

limit

INT

NO

Number of records Default:500 Max:1500

> -   If startTime and endTime are not sent, the most recent klines are returned.

## Response Example[​](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)

```
[    [        1762779600000,  // Open time        "1300.000",     // Open        "1300.000",     // High        "1300.000",     // Low        "1300.000",     // Close        "0.1000",       // Volume        1762780499999,  // Close time        "130.0000000",  // Quote asset volume        1,              // Number of trades        "0.1000",       // Taker buy base asset volume        "130.0000000",  // Taker buy quote asset volume        "0"             // Ignore.    ],]
```

-   [API Description](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)
-   [HTTP Request](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)
-   [Request Weight](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)
-   [Request Parameters](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)
-   [Response Example](https://developers.binance.com/docs/derivatives/options-trading/market-data/Kline-Candlestick-Data)
