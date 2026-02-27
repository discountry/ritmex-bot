---
title: "Request format | Binance Open Platform"
source: "https://developers.binance.com/docs/binance-spot-api-docs/testnet/websocket-api/request-format"
fetched_at: "2026-02-26T10:38:11.797Z"
---
Requests must be sent as JSON in **text frames**, one request per frame.

Example of request:

```
{    "id": "e2a85d9f-07a5-4f94-8d5f-789dc3deb097",    "method": "order.place",    "params": {        "symbol": "BTCUSDT",        "side": "BUY",        "type": "LIMIT",        "price": "0.1",        "quantity": "10",        "timeInForce": "GTC",        "timestamp": 1655716096498,        "apiKey": "T59MTDLWlpRW16JVeZ2Nju5A5C98WkMm8CSzWC4oqynUlTm1zXOxyauT8LmwXEv9",        "signature": "5942ad337e6779f2f4c62cd1c26dba71c91514400a24990a3e7f5edec9323f90"    }}
```

Request fields:

Name

Type

Mandatory

Description

`id`

INT / STRING / `null`

YES

Arbitrary ID used to match responses to requests

`method`

STRING

YES

Request method name

`params`

OBJECT

NO

Request parameters. May be omitted if there are no parameters

-   Request `id` is truly arbitrary. You can use UUIDs, sequential IDs, current timestamp, etc. The server does not interpret `id` in any way, simply echoing it back in the response.
    
    You can freely reuse IDs within a session. However, be careful to not send more than one request at a time with the same ID, since otherwise it might be impossible to tell the responses apart.
    
-   Request method names may be prefixed with explicit version: e.g., `"v3/order.place"`.
    
-   The order of `params` is not significant.
