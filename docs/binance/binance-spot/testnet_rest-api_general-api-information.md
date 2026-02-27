---
title: "General API Information | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/rest-api/general-api-information"
fetched_at: "2026-02-26T10:38:10.432Z"
---
-   The base endpoint is **[https://testnet.binance.vision/api](https://testnet.binance.vision/api)**
-   Responses are in JSON by default. To receive responses in SBE, refer to the [SBE FAQ](https://developers.binance.com/docs/binance-spot-api-docs/faqs/sbe_faq) page.
-   Data is returned in **chronological order**, unless noted otherwise.
    -   Without `startTime` or `endTime`, returns the most recent items up to the limit.
    -   With `startTime`, returns oldest items from `startTime` up to the limit.
    -   With `endTime`, returns most recent items up to `endTime` and the limit.
    -   With both, behaves like `startTime` but does not exceed `endTime`.
-   All time and timestamp related fields in the JSON responses are in **milliseconds by default.** To receive the information in microseconds, please add the header `X-MBX-TIME-UNIT:MICROSECOND` or `X-MBX-TIME-UNIT:microsecond`.
-   We support HMAC, RSA, and Ed25519 keys. For more information, please see [API Key types](https://developers.binance.com/docs/binance-spot-api-docs/faqs/api_key_types).
-   Timestamp parameters (e.g. `startTime`, `endTime`, `timestamp`) can be passed in milliseconds or microseconds.
-   If there are enums or terms you want clarification on, please see the [SPOT Glossary](https://developers.binance.com/docs/binance-spot-api-docs/faqs/spot_glossary) for more information.
-   APIs have a timeout of 10 seconds when processing a request. If a response from the Matching Engine takes longer than this, the API responds with "Timeout waiting for response from backend server. Send status unknown; execution status unknown." [(-1007 TIMEOUT)](https://developers.binance.com/docs/binance-spot-api-docs/testnet/errors)
    -   This does not always mean that the request failed in the Matching Engine.
    -   If the status of the request has not appeared in [User Data Stream](https://developers.binance.com/docs/binance-spot-api-docs/testnet/user-data-stream), please perform an API query for its status.
-   **Please avoid SQL keywords in requests** as they may trigger a security block by a WAF (Web Application Firewall) rule. See [https://www.binance.com/en/support/faq/detail/360004492232](https://www.binance.com/en/support/faq/detail/360004492232) for more details.
-   If your request contains a symbol name containing non-ASCII characters, then the response may contain non-ASCII characters encoded in UTF-8.
-   Some endpoints may return asset and/or symbol names containing non-ASCII characters encoded in UTF-8 even if the request did not contain non-ASCII characters.
