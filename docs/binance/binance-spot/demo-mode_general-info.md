---
title: "General Info | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/general-info"
fetched_at: "2026-02-26T10:38:06.931Z"
---
# Demo Mode for SPOT Trading

This page explains how to use [Demo Mode Trading](https://www.binance.com/en/support/faq/detail/9be58f73e5e14338809e3b705b9687dd) via the API.

## How can I trade on Demo Mode using the API?[​](https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/general-info)

1.  After logging into your Binance account, click on Binance Demo Trading and then you can create an API key in the [API Key Management page](https://demo.binance.com/en/my/settings/api-management).
2.  Follow the official documentation of the SPOT API, replacing the URLs of the endpoints/methods with the following values:

Service

Spot API URLs

Demo Mode URLs

REST API

-   https://api.binance.com/api
-   https://api-gcp.binance.com/api
-   https://api1.binance.com/api
-   https://api2.binance.com/api
-   https://api3.binance.com/api
-   https://api4.binance.com/api

-   **https://demo-api.binance.com/api**

WebSocket API

-   wss://ws-api.binance.com/ws-api/v3
-   wss://ws-api.binance.com:9443/ws-api/v3

-   **wss://demo-ws-api.binance.com/ws-api/v3**

WebSocket Market Streams

-   wss://stream.binance.com/ws
-   wss://stream.binance.com:9443/ws

-   **wss://demo-stream.binance.com/ws**
-   **wss://demo-stream.binance.com:9443/ws**

-   wss://stream.binance.com/stream
-   wss://stream.binance.com:9443/stream

-   **wss://demo-stream.binance.com/stream**
-   **wss://demo-stream.binance.com:9443/stream**

WebSocket Market Streams (SBE)

-   wss://stream-sbe.binance.com/ws
-   wss://stream-sbe.binance.com:9443/ws

-   **wss://demo-stream-sbe.binance.com/ws**
-   **wss://demo-stream-sbe.binance.com:9443/ws**

-   wss://stream-sbe.binance.com/stream
-   wss://stream-sbe.binance.com:9443/stream

-   **wss://demo-stream-sbe.binance.com/stream**
-   **wss://demo-stream-sbe.binance.com:9443/stream**

FIX  
(Send FIX requests; receive FIX responses)

-   tcp+tls://fix-oe.binance.com:9000

-   **tcp+tls://demo-fix-oe.binance.com:9000**

-   tcp+tls://fix-dc.binance.com:9000

-   **tcp+tls://demo-fix-dc.binance.com:9000**

-   tcp+tls://fix-md.binance.com:9000

-   **tcp+tls://demo-fix-md.binance.com:9000**

FIX SBE  
(Send FIX requests; receive FIX SBE responses)

-   tcp+tls://fix-oe.binance.com:9001

-   **tcp+tls://demo-fix-oe.binance.com:9001**

-   tcp+tls://fix-dc.binance.com:9001

-   **tcp+tls://demo-fix-dc.binance.com:9001**

-   tcp+tls://fix-md.binance.com:9001

-   **tcp+tls://demo-fix-md.binance.com:9001**

FIX SBE  
(Send FIX SBE requests; receive FIX SBE responses)

-   tcp+tls://fix-oe.binance.com:9002

-   **tcp+tls://demo-fix-oe.binance.com:9002**

-   tcp+tls://fix-dc.binance.com:9002

-   **tcp+tls://demo-fix-dc.binance.com:9002**

-   tcp+tls://fix-md.binance.com:9002

-   **tcp+tls://demo-fix-md.binance.com:9002**

## What is the difference between SPOT Testnet and SPOT Demo Mode?[​](https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/general-info)

SPOT Testnet

SPOT Demo Mode

Balances are reset every month.

You can reset your balance whenever you want via the UI.

SPOT Testnet sometimes has new features before the live exchange.

Demo Mode always has the same features as the live exchange.

Testnet's prices and order books are independent from the live exchange.

Demo Mode's prices and order books are similar to the live exchange.

IP Limits, Unfilled Order Count, Exchange Filters are generally the same as the live exchange.

IP Limits, Unfilled Order Count, Exchange Filters are exactly the same as the live exchange.

**In summary**:

-   SPOT Testnet is useful to integrate with upcoming features not yet available on the live exchange.
-   Demo Mode is useful to test against _realistic_ market data.

> \[!WARNING\] Realistic market data is not equal to "real" market data. Do not assume trading strategies that work in Demo Mode will work in the live exchange.

## What happens when Demo Mode is under maintenance?[​](https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/general-info)

-   There will be an announcement on the [CHANGELOG](https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/CHANGELOG) page prior to downtime.
-   During maintenance, you will not be able to place or cancel orders.

-   [How can I trade on Demo Mode using the API?](https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/general-info)
-   [What is the difference between SPOT Testnet and SPOT Demo Mode?](https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/general-info)
-   [What happens when Demo Mode is under maintenance?](https://developers.binance.com/docs/binance-spot-api-docs/demo-mode/general-info)
