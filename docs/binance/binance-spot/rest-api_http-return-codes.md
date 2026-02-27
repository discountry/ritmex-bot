---
title: "HTTP Return Codes | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/rest-api/http-return-codes"
fetched_at: "2026-02-26T10:38:08.904Z"
---
-   HTTP `4XX` return codes are used for malformed requests; the issue is on the sender's side.
-   HTTP `403` return code is used when a WAF (Web Application Firewall) rule has been violated. This can indicate a rate limit violation or a security block. See [https://www.binance.com/en/support/faq/detail/360004492232](https://www.binance.com/en/support/faq/detail/360004492232) for more details.
-   HTTP `409` return code is used when a cancelReplace order partially succeeds. (i.e. if the cancellation of the order fails but the new order placement succeeds.)
-   HTTP `429` return code is used when breaking a request rate limit.
-   HTTP `418` return code is used when an IP has been auto-banned for continuing to send requests after receiving `429` codes.
-   HTTP `5XX` return codes are used for internal errors; the issue is on Binance's side. It is important to **NOT** treat this as a failure operation; the execution status is **UNKNOWN** and could have been a success.
