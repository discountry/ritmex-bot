---
title: "General API Information | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/websocket-api/general-api-information"
fetched_at: "2026-02-26T10:38:12.847Z"
---
-   The base endpoint is: **`wss://ws-api.binance.com:443/ws-api/v3`**.
    -   If you experience issues with the standard 443 port, alternative port 9443 is also available.
    -   The base endpoint for [testnet](https://testnet.binance.vision/) is: `wss://ws-api.testnet.binance.vision/ws-api/v3`
-   A single connection to the API is only valid for 24 hours; expect to be disconnected after the 24-hour mark.
-   We support HMAC, RSA, and Ed25519 keys. For more information, please see [API Key types](https://developers.binance.com/docs/binance-spot-api-docs/faqs/api_key_types).
-   Responses are in JSON by default. To receive responses in SBE, refer to the [SBE FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/sbe_faq) page.
-   If your request contains a symbol name containing non-ASCII characters, then the response may contain non-ASCII characters encoded in UTF-8.
-   Some methods may return asset and/or symbol names containing non-ASCII characters encoded in UTF-8 even if the request did not contain non-ASCII characters.
-   The WebSocket server will send a `ping frame` every 20 seconds.
    -   If the WebSocket server does not receive a `pong frame` back from the connection within a minute the connection will be disconnected.
    -   When you receive a ping, you must send a pong with a copy of ping's payload as soon as possible.
    -   Unsolicited `pong frames` are allowed, but will not prevent disconnection. **It is recommended that the payload for these pong frames are empty.**
-   Data is returned in **chronological order**, unless noted otherwise.
    -   Without `startTime` or `endTime`, returns the most recent items up to the limit.
    -   With `startTime`, returns oldest items from `startTime` up to the limit.
    -   With `endTime`, returns most recent items up to `endTime` and the limit.
    -   With both, behaves like `startTime` but does not exceed `endTime`.
-   All timestamps in the JSON responses are in **milliseconds in UTC by default**. To receive the information in microseconds, please add the parameter `timeUnit=MICROSECOND` or `timeUnit=microsecond` in the URL.
-   Timestamp parameters (e.g. `startTime`, `endTime`, `timestamp`) can be passed in milliseconds or microseconds.
-   All field names and values are **case-sensitive**, unless noted otherwise.
-   If there are enums or terms you want clarification on, please see [SPOT Glossary](https://developers.binance.com/docs/binance-spot-api-docs/faqs/spot_glossary) for more information.
-   APIs have a timeout of 10 seconds when processing a request. If a response from the Matching Engine takes longer than this, the API responds with "Timeout waiting for response from backend server. Send status unknown; execution status unknown." [(-1007 TIMEOUT)](https://developers.binance.com/docs/binance-spot-api-docs/errors)
    -   This does not always mean that the request failed in the Matching Engine.
    -   If the status of the request has not appeared in [User Data Stream](https://developers.binance.com/docs/binance-spot-api-docs/user-data-stream), please perform an API query for its status.
-   **Please avoid SQL keywords in requests** as they may trigger a security block by a WAF (Web Application Firewall) rule. See [https://www.binance.com/en/support/faq/detail/360004492232](https://www.binance.com/en/support/faq/detail/360004492232) for more details.
