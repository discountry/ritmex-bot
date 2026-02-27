---
title: "Market Data Only | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/faqs/market_data_only"
fetched_at: "2026-02-26T10:38:07.444Z"
---
# Market Data Only URLs

These URLs do not require any authentication (i.e. The API key is not necessary) and serve only public market data.

### RESTful API[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/market_data_only)

On the RESTful API, these are the endpoints you can request on `data-api.binance.vision`:

-   [GET /api/v3/aggTrades](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/avgPrice](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/depth](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/exchangeInfo](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/general-endpoints)
-   [GET /api/v3/klines](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/ping](https://developers.binance.com/docs/binance-spot-api-docs/rest-api.md)
-   [GET /api/v3/ticker](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/ticker/24hr](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/ticker/bookTicker](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/ticker/price](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/time](https://developers.binance.com/docs/binance-spot-api-docs/rest-api.md)
-   [GET /api/v3/trades](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)
-   [GET /api/v3/uiKlines](https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints)

Sample request:

```
curl -sX GET "https://data-api.binance.vision/api/v3/exchangeInfo?symbol=BTCUSDT" 
```

### Websocket Streams[​](https://developers.binance.com/docs/binance-spot-api-docs/faqs/market_data_only)

Public market data can also be retrieved through the websocket market data using the URL `data-stream.binance.vision`. The streams available through this domain are the same that can be found in the [Websocket Market Streams](https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams) documentation.

Note that User Data Streams **cannot** be accessed through this URL.

Sample request:

```
wss://data-stream.binance.vision:443/ws/btcusdt@kline_1m
```

-   [RESTful API](https://developers.binance.com/docs/binance-spot-api-docs/faqs/market_data_only)
-   [Websocket Streams](https://developers.binance.com/docs/binance-spot-api-docs/faqs/market_data_only)
