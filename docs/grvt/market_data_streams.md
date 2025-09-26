# MarketData Websocket Streams

## Ticker
### Mini Ticker Snap
```
STREAM: v1.mini.s
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_mini_ticker_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.mini.s",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.mini.s",
                "subs": ["BTC_USDT_Perp@500"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.mini.s",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.mini.s",
                "unsubs": ["BTC_USDT_Perp@500"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.mini.s",
            "feed":["BTC_USDT_Perp@500"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.mini.s",
            "subs":["BTC_USDT_Perp@500"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_mini_ticker_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.mini.s",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "instrument": "BTC_USDT_Perp",
                "mark_price": "65038.01",
                "index_price": "65038.01",
                "last_price": "65038.01",
                "last_size": "123456.78",
                "mid_price": "65038.01",
                "best_bid_price": "65038.01",
                "best_bid_size": "123456.78",
                "best_ask_price": "65038.01",
                "best_ask_size": "123456.78"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.mini.s",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "i": "BTC_USDT_Perp",
                "mp": "65038.01",
                "ip": "65038.01",
                "lp": "65038.01",
                "ls": "123456.78",
                "mp1": "65038.01",
                "bb": "65038.01",
                "bb1": "123456.78",
                "ba": "65038.01",
                "ba1": "123456.78"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1004|404|Data Not Found|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3030|400|Feed rate is invalid|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Mini Ticker Delta
```
STREAM: v1.mini.d
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_mini_ticker_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.mini.d",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.mini.d",
                "subs": ["BTC_USDT_Perp@500"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.mini.d",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.mini.d",
                "unsubs": ["BTC_USDT_Perp@500"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.mini.d",
            "feed":["BTC_USDT_Perp@500"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.mini.d",
            "subs":["BTC_USDT_Perp@500"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_mini_ticker_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.mini.d",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "instrument": "BTC_USDT_Perp",
                "mark_price": "65038.01",
                "index_price": "65038.01",
                "last_price": "65038.01",
                "last_size": "123456.78",
                "mid_price": "65038.01",
                "best_bid_price": "65038.01",
                "best_bid_size": "123456.78",
                "best_ask_price": "65038.01",
                "best_ask_size": "123456.78"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.mini.d",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "i": "BTC_USDT_Perp",
                "mp": "65038.01",
                "ip": "65038.01",
                "lp": "65038.01",
                "ls": "123456.78",
                "mp1": "65038.01",
                "bb": "65038.01",
                "bb1": "123456.78",
                "ba": "65038.01",
                "ba1": "123456.78"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1004|404|Data Not Found|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3030|400|Feed rate is invalid|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.mini.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.mini.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.mini.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Ticker Snap
```
STREAM: v1.ticker.s
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_ticker_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.ticker.s",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.ticker.s",
                "subs": ["BTC_USDT_Perp@500"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.ticker.s",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.ticker.s",
                "unsubs": ["BTC_USDT_Perp@500"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.ticker.s",
            "feed":["BTC_USDT_Perp@500"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.ticker.s",
            "subs":["BTC_USDT_Perp@500"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_ticker_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.ticker.s",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "instrument": "BTC_USDT_Perp",
                "mark_price": "65038.01",
                "index_price": "65038.01",
                "last_price": "65038.01",
                "last_size": "123456.78",
                "mid_price": "65038.01",
                "best_bid_price": "65038.01",
                "best_bid_size": "123456.78",
                "best_ask_price": "65038.01",
                "best_ask_size": "123456.78",
                "funding_rate_8h_curr": 0.0003,
                "funding_rate_8h_avg": 0.0003,
                "interest_rate": 0.0003,
                "forward_price": "65038.01",
                "buy_volume_24h_b": "123456.78",
                "sell_volume_24h_b": "123456.78",
                "buy_volume_24h_q": "123456.78",
                "sell_volume_24h_q": "123456.78",
                "high_price": "65038.01",
                "low_price": "65038.01",
                "open_price": "65038.01",
                "open_interest": "123456.78",
                "long_short_ratio": "0.5"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.ticker.s",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "i": "BTC_USDT_Perp",
                "mp": "65038.01",
                "ip": "65038.01",
                "lp": "65038.01",
                "ls": "123456.78",
                "mp1": "65038.01",
                "bb": "65038.01",
                "bb1": "123456.78",
                "ba": "65038.01",
                "ba1": "123456.78",
                "fr": 0.0003,
                "fr1": 0.0003,
                "ir": 0.0003,
                "fp": "65038.01",
                "bv": "123456.78",
                "sv": "123456.78",
                "bv1": "123456.78",
                "sv1": "123456.78",
                "hp": "65038.01",
                "lp1": "65038.01",
                "op": "65038.01",
                "oi": "123456.78",
                "ls1": "0.5"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1004|404|Data Not Found|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3030|400|Feed rate is invalid|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.s",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.s",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.s",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Ticker Delta
```
STREAM: v1.ticker.d
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_ticker_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.ticker.d",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.ticker.d",
                "subs": ["BTC_USDT_Perp@500"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.ticker.d",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.ticker.d",
                "unsubs": ["BTC_USDT_Perp@500"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.ticker.d",
            "feed":["BTC_USDT_Perp@500"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.ticker.d",
            "subs":["BTC_USDT_Perp@500"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_ticker_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.ticker.d",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "instrument": "BTC_USDT_Perp",
                "mark_price": "65038.01",
                "index_price": "65038.01",
                "last_price": "65038.01",
                "last_size": "123456.78",
                "mid_price": "65038.01",
                "best_bid_price": "65038.01",
                "best_bid_size": "123456.78",
                "best_ask_price": "65038.01",
                "best_ask_size": "123456.78",
                "funding_rate_8h_curr": 0.0003,
                "funding_rate_8h_avg": 0.0003,
                "interest_rate": 0.0003,
                "forward_price": "65038.01",
                "buy_volume_24h_b": "123456.78",
                "sell_volume_24h_b": "123456.78",
                "buy_volume_24h_q": "123456.78",
                "sell_volume_24h_q": "123456.78",
                "high_price": "65038.01",
                "low_price": "65038.01",
                "open_price": "65038.01",
                "open_interest": "123456.78",
                "long_short_ratio": "0.5"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.ticker.d",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "i": "BTC_USDT_Perp",
                "mp": "65038.01",
                "ip": "65038.01",
                "lp": "65038.01",
                "ls": "123456.78",
                "mp1": "65038.01",
                "bb": "65038.01",
                "bb1": "123456.78",
                "ba": "65038.01",
                "ba1": "123456.78",
                "fr": 0.0003,
                "fr1": 0.0003,
                "ir": 0.0003,
                "fp": "65038.01",
                "bv": "123456.78",
                "sv": "123456.78",
                "bv1": "123456.78",
                "sv1": "123456.78",
                "hp": "65038.01",
                "lp1": "65038.01",
                "op": "65038.01",
                "oi": "123456.78",
                "ls1": "0.5"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1004|404|Data Not Found|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3030|400|Feed rate is invalid|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.ticker.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.ticker.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.ticker.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Orderbook
### Orderbook Snap
```
STREAM: v1.book.s
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_orderbook_levels_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.book.s",
                "selectors": ["BTC_USDT_Perp@500-50"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.book.s",
                "subs": ["BTC_USDT_Perp@500-50"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.book.s",
                "selectors": ["BTC_USDT_Perp@500-50"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.book.s",
                "unsubs": ["BTC_USDT_Perp@500-50"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.book.s",
            "feed":["BTC_USDT_Perp@500-50"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.book.s",
            "subs":["BTC_USDT_Perp@500-50"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_orderbook_levels_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.book.s",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "instrument": "BTC_USDT_Perp",
                "bids": [{
                    "price": "65038.01",
                    "size": "3456.78",
                    "num_orders": 123
                }],
                "asks": [{
                    "price": "65038.01",
                    "size": "3456.78",
                    "num_orders": 123
                }]
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.book.s",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "i": "BTC_USDT_Perp",
                "b": [{
                    "p": "65038.01",
                    "s": "3456.78",
                    "no": 123
                }],
                "a": [{
                    "p": "65038.01",
                    "s": "3456.78",
                    "no": 123
                }]
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1004|404|Data Not Found|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3030|400|Feed rate is invalid|
        |3031|400|Depth is invalid|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.s",
                    "selectors": ["BTC_USDT_Perp@500-50"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.s",
                    "s1": ["BTC_USDT_Perp@500-50"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.s",
                "feed":["BTC_USDT_Perp@500-50"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Orderbook Delta
```
STREAM: v1.book.d
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_orderbook_levels_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.book.d",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.book.d",
                "subs": ["BTC_USDT_Perp@500"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.book.d",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.book.d",
                "unsubs": ["BTC_USDT_Perp@500"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.book.d",
            "feed":["BTC_USDT_Perp@500"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.book.d",
            "subs":["BTC_USDT_Perp@500"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_orderbook_levels_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.book.d",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "instrument": "BTC_USDT_Perp",
                "bids": [{
                    "price": "65038.01",
                    "size": "3456.78",
                    "num_orders": 123
                }],
                "asks": [{
                    "price": "65038.01",
                    "size": "3456.78",
                    "num_orders": 123
                }]
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.book.d",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "i": "BTC_USDT_Perp",
                "b": [{
                    "p": "65038.01",
                    "s": "3456.78",
                    "no": 123
                }],
                "a": [{
                    "p": "65038.01",
                    "s": "3456.78",
                    "no": 123
                }]
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1004|404|Data Not Found|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3030|400|Feed rate is invalid|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.book.d",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.book.d",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.book.d",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Trade
### Trade
```
STREAM: v1.trade
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_trade_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.trade",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.trade",
                "subs": ["BTC_USDT_Perp@500"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.trade",
                "selectors": ["BTC_USDT_Perp@500"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.trade",
                "unsubs": ["BTC_USDT_Perp@500"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.trade",
            "feed":["BTC_USDT_Perp@500"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.trade",
            "subs":["BTC_USDT_Perp@500"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_trade_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.trade",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "instrument": "BTC_USDT_Perp",
                "is_taker_buyer": true,
                "size": "123456.78",
                "price": "65038.01",
                "mark_price": "65038.01",
                "index_price": "65038.01",
                "interest_rate": 0.0003,
                "forward_price": "65038.01",
                "trade_id": "209358-2",
                "venue": "ORDERBOOK",
                "is_rpi": false
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.trade",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "i": "BTC_USDT_Perp",
                "it": true,
                "s": "123456.78",
                "p": "65038.01",
                "mp": "65038.01",
                "ip": "65038.01",
                "ir": 0.0003,
                "fp": "65038.01",
                "ti": "209358-2",
                "v": "ORDERBOOK",
                "ir1": false
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3011|400|Limit exceeds min or max value|
        |3013|400|Exact limit value is not supported|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.trade",
                    "selectors": ["BTC_USDT_Perp@500"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.trade",
                    "s1": ["BTC_USDT_Perp@500"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.trade",
                "feed":["BTC_USDT_Perp@500"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Candlestick
### Candlestick
```
STREAM: v1.candle
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_candlestick_feed_selector_v1.md"
    ??? info "JSONRPC Wrappers"
        -8<- "docs/schemas/jsonrpc_request.md"
        -8<- "docs/schemas/jsonrpc_response.md"
        -8<- "docs/schemas/ws_subscribe_params.md"
        -8<- "docs/schemas/ws_subscribe_result.md"
        -8<- "docs/schemas/ws_unsubscribe_params.md"
        -8<- "docs/schemas/ws_unsubscribe_result.md"
        -8<- "docs/schemas/ws_subscribe_request_v1_legacy.md"
        -8<- "docs/schemas/ws_subscribe_response_v1_legacy.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    ???+ question "Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "stream": "v1.candle",
                "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.candle",
                "subs": ["BTC_USDT_Perp@CI_1_M-TRADE"],
                "unsubs": [],
                "num_snapshots": [10],
                "first_sequence_number": [872634876]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Unsubscribe"
        **Full Unsubscribe Request**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "method": "unsubscribe",
            "params": {
                "stream": "v1.candle",
                "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.candle",
                "unsubs": ["BTC_USDT_Perp@CI_1_M-TRADE"]
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
    ??? question "Legacy Subscribe"
        **Full Subscribe Request**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.candle",
            "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.candle",
            "subs":["BTC_USDT_Perp@CI_1_M-TRADE"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_candlestick_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.candle",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "open_time": "1697788800000000000",
                "close_time": "1697788800000000000",
                "open": "123456.78",
                "close": "123456.78",
                "high": "123456.78",
                "low": "123456.78",
                "volume_b": "123456.78",
                "volume_q": "123456.78",
                "trades": 123456,
                "instrument": "BTC_USDT_Perp"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.candle",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "ot": "1697788800000000000",
                "ct": "1697788800000000000",
                "o": "123456.78",
                "c": "123456.78",
                "h": "123456.78",
                "l": "123456.78",
                "vb": "123456.78",
                "vq": "123456.78",
                "t": 123456,
                "i": "BTC_USDT_Perp"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3040|400|Candlestick interval is invalid|
        |3041|400|Candlestick type is invalid|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1002,
                "message": "Internal Server Error"
            },
            "id": 123,
            "method": "subscribe"
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "j": "2.0",
            "e": {
                "c": 1002,
                "m": "Internal Server Error"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.candle",
                    "selectors": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.candle",
                    "s1": ["BTC_USDT_Perp@CI_1_M-TRADE"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws" \
            -x '
            {
                "request_id":1,
                "stream":"v1.candle",
                "feed":["BTC_USDT_Perp@CI_1_M-TRADE"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
