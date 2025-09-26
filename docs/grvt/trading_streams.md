# Trading Websocket Streams

## Order
### Order
```
STREAM: v1.order
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_order_feed_selector_v1.md"
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
                "stream": "v1.order",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.order",
                "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
                "stream": "v1.order",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.order",
                "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
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
            "stream":"v1.order",
            "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.order",
            "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_order_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.order",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "order_id": "0x1234567890abcdef",
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "is_market": false,
                "time_in_force": "GOOD_TILL_TIME",
                "post_only": false,
                "reduce_only": false,
                "legs": [{
                    "instrument": "BTC_USDT_Perp",
                    "size": "10.5",
                    "limit_price": "65038.01",
                    "is_buying_asset": true
                }],
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                },
                "metadata": {
                    "client_order_id": "23042",
                    "create_time": "1697788800000000000",
                    "trigger": {
                        "trigger_type": "TAKE_PROFIT",
                        "tpsl": {
                            "trigger_by": "LAST",
                            "trigger_price": "65038.10",
                            "close_position": false
                        }
                    },
                    "broker": "BROKER_CODE"
                },
                "state": {
                    "status": "PENDING",
                    "reject_reason": "CLIENT_CANCEL",
                    "book_size": ["10.5"],
                    "traded_size": ["1.5"],
                    "update_time": "1697788800000000000",
                    "avg_fill_price": ["60000.4"]
                }
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.order",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "oi": "0x1234567890abcdef",
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "im": false,
                "ti": "GOOD_TILL_TIME",
                "po": false,
                "ro": false,
                "l": [{
                    "i": "BTC_USDT_Perp",
                    "s": "10.5",
                    "lp": "65038.01",
                    "ib": true
                }],
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                },
                "m": {
                    "co": "23042",
                    "ct": "1697788800000000000",
                    "t": {
                        "tt": "TAKE_PROFIT",
                        "t": {
                            "tb": "LAST",
                            "tp": "65038.10",
                            "cp": false
                        }
                    },
                    "b": "BROKER_CODE"
                },
                "s1": {
                    "s": "PENDING",
                    "rr": "CLIENT_CANCEL",
                    "bs": ["10.5"],
                    "ts": ["1.5"],
                    "ut": "1697788800000000000",
                    "af": ["60000.4"]
                }
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1000|401|You need to authenticate prior to using this functionality|
        |1001|403|You are not authorized to access this functionality|
        |1002|500|Internal Server Error|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3020|400|Sub account ID must be an uint64 integer|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1000,
                "message": "You need to authenticate prior to using this functionality"
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
                "c": 1000,
                "m": "You need to authenticate prior to using this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.order",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.order",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.order",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Order State
```
STREAM: v1.state
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_order_state_feed_selector_v1.md"
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
                "stream": "v1.state",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.state",
                "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
                "stream": "v1.state",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.state",
                "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
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
            "stream":"v1.state",
            "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.state",
            "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_order_state_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.state",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "order_id": "10000101000203040506",
                "client_order_id": "23042",
                "order_state": {
                    "status": "PENDING",
                    "reject_reason": "CLIENT_CANCEL",
                    "book_size": ["10.5"],
                    "traded_size": ["1.5"],
                    "update_time": "1697788800000000000",
                    "avg_fill_price": ["60000.4"]
                }
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.state",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "oi": "10000101000203040506",
                "co": "23042",
                "os": {
                    "s": "PENDING",
                    "rr": "CLIENT_CANCEL",
                    "bs": ["10.5"],
                    "ts": ["1.5"],
                    "ut": "1697788800000000000",
                    "af": ["60000.4"]
                }
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1000|401|You need to authenticate prior to using this functionality|
        |1001|403|You are not authorized to access this functionality|
        |1002|500|Internal Server Error|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3020|400|Sub account ID must be an uint64 integer|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1000,
                "message": "You need to authenticate prior to using this functionality"
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
                "c": 1000,
                "m": "You need to authenticate prior to using this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.state",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.state",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.state",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Cancel Status
```
STREAM: v1.cancel
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_cancel_feed_selector_v1.md"
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
                "stream": "v1.cancel",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.cancel",
                "subs": ["'$GRVT_SUB_ACCOUNT_ID'"],
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
                "stream": "v1.cancel",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.cancel",
                "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'"]
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
            "stream":"v1.cancel",
            "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.cancel",
            "subs":["'$GRVT_SUB_ACCOUNT_ID'"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_cancel_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.cancel",
            "selector": "'$GRVT_SUB_ACCOUNT_ID'",
            "sequence_number": "872634876",
            "feed": {
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "client_order_id": "23042",
                "order_id": "10000101000203040506",
                "reason": "UNSPECIFIED",
                "update_time": "1697788800000000000",
                "cancel_status": "EXPIRED"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.cancel",
            "s1": "'$GRVT_SUB_ACCOUNT_ID'",
            "sn": "872634876",
            "f": {
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "co": "23042",
                "oi": "10000101000203040506",
                "r": "UNSPECIFIED",
                "ut": "1697788800000000000",
                "cs": "EXPIRED"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1000|401|You need to authenticate prior to using this functionality|
        |1001|403|You are not authorized to access this functionality|
        |1002|500|Internal Server Error|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3020|400|Sub account ID must be an uint64 integer|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1000,
                "message": "You need to authenticate prior to using this functionality"
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
                "c": 1000,
                "m": "You need to authenticate prior to using this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.cancel",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.cancel",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.cancel",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Execution
### Fill
```
STREAM: v1.fill
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_fill_feed_selector_v1.md"
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
                "stream": "v1.fill",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.fill",
                "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
                "stream": "v1.fill",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.fill",
                "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
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
            "stream":"v1.fill",
            "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.fill",
            "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_fill_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.fill",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "is_buyer": true,
                "is_taker": true,
                "size": "0.30",
                "price": "65038.01",
                "mark_price": "65038.01",
                "index_price": "65038.01",
                "interest_rate": 0.0003,
                "forward_price": "65038.01",
                "realized_pnl": "2400.50",
                "fee": "9.75",
                "fee_rate": 0.0003,
                "trade_id": "209358-2",
                "order_id": "0x10000101000203040506",
                "venue": "ORDERBOOK",
                "client_order_id": "23042",
                "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "broker": "UNSPECIFIED",
                "is_rpi": false
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.fill",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "ib": true,
                "it": true,
                "s": "0.30",
                "p": "65038.01",
                "mp": "65038.01",
                "ip": "65038.01",
                "ir": 0.0003,
                "fp": "65038.01",
                "rp": "2400.50",
                "f": "9.75",
                "fr": 0.0003,
                "ti": "209358-2",
                "oi": "0x10000101000203040506",
                "v": "ORDERBOOK",
                "co": "23042",
                "s1": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "b": "UNSPECIFIED",
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
        |1000|401|You need to authenticate prior to using this functionality|
        |1001|403|You are not authorized to access this functionality|
        |1002|500|Internal Server Error|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3020|400|Sub account ID must be an uint64 integer|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1000,
                "message": "You need to authenticate prior to using this functionality"
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
                "c": 1000,
                "m": "You need to authenticate prior to using this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.fill",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.fill",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.fill",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Positions
```
STREAM: v1.position
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_positions_feed_selector_v1.md"
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
                "stream": "v1.position",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.position",
                "subs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
                "stream": "v1.position",
                "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.position",
                "unsubs": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
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
            "stream":"v1.position",
            "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.position",
            "subs":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_positions_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.position",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "event_time": "1697788800000000000",
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "size": "2635000.50",
                "notional": "2635000.50",
                "entry_price": "65038.01",
                "exit_price": "65038.01",
                "mark_price": "65038.01",
                "unrealized_pnl": "135000.50",
                "realized_pnl": "-35000.30",
                "total_pnl": "100000.20",
                "roi": "10.20",
                "quote_index_price": "1.0000102",
                "est_liquidation_price": 60000.25,
                "leverage": "10"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.position",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "et": "1697788800000000000",
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "s": "2635000.50",
                "n": "2635000.50",
                "ep": "65038.01",
                "ep1": "65038.01",
                "mp": "65038.01",
                "up": "135000.50",
                "rp": "-35000.30",
                "tp": "100000.20",
                "r": "10.20",
                "qi": "1.0000102",
                "el": 60000.25,
                "l": "10"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1000|401|You need to authenticate prior to using this functionality|
        |1001|403|You are not authorized to access this functionality|
        |1002|500|Internal Server Error|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3000|400|Instrument is invalid|
        |3020|400|Sub account ID must be an uint64 integer|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1000,
                "message": "You need to authenticate prior to using this functionality"
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
                "c": 1000,
                "m": "You need to authenticate prior to using this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.position",
                    "selectors": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.position",
                    "s1": ["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.position",
                "feed":["'$GRVT_SUB_ACCOUNT_ID'-BTC_USDT_Perp"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Transfer
### Deposit
```
STREAM: v1.deposit
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_deposit_feed_selector_v1.md"
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
                "stream": "v1.deposit",
                "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.deposit",
                "subs": ["'$GRVT_MAIN_ACCOUNT_ID'"],
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
                "stream": "v1.deposit",
                "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.deposit",
                "unsubs": ["'$GRVT_MAIN_ACCOUNT_ID'"]
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
            "stream":"v1.deposit",
            "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.deposit",
            "subs":["'$GRVT_MAIN_ACCOUNT_ID'"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_deposit_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.deposit",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "tx_hash": "0x1234567890123456789012345678901234567890123456789012345678901234",
                "to_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "currency": "USDT",
                "num_tokens": "10.50"
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.deposit",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "th": "0x1234567890123456789012345678901234567890123456789012345678901234",
                "ta": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "c": "USDT",
                "nt": "10.50"
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1001|403|You are not authorized to access this functionality|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1001,
                "message": "You are not authorized to access this functionality"
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
                "c": 1001,
                "m": "You are not authorized to access this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1001,
            "message":"You are not authorized to access this functionality",
            "status":403
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.deposit",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.deposit",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.deposit",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Transfer
```
STREAM: v1.transfer
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_transfer_feed_selector_v1.md"
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
                "stream": "v1.transfer",
                "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.transfer",
                "subs": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
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
                "stream": "v1.transfer",
                "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.transfer",
                "unsubs": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
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
            "stream":"v1.transfer",
            "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.transfer",
            "subs":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_transfer_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.transfer",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "tx_id": "1028403",
                "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "from_sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "to_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "to_sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "currency": "USDT",
                "num_tokens": "1500.0",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                },
                "event_time": "1697788800000000000",
                "transfer_type": "UNSPECIFIED",
                "transfer_metadata": null
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.transfer",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "ti": "1028403",
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "fs": "'$GRVT_SUB_ACCOUNT_ID'",
                "ta": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "ts": "'$GRVT_SUB_ACCOUNT_ID'",
                "c": "USDT",
                "nt": "1500.0",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                },
                "et": "1697788800000000000",
                "tt": "UNSPECIFIED",
                "tm": null
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1001|403|You are not authorized to access this functionality|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
        |3020|400|Sub account ID must be an uint64 integer|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1001,
                "message": "You are not authorized to access this functionality"
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
                "c": 1001,
                "m": "You are not authorized to access this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1001,
            "message":"You are not authorized to access this functionality",
            "status":403
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.transfer",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.transfer",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.transfer",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'-'$GRVT_SUB_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Withdrawal
```
STREAM: v1.withdrawal
```

=== "Feed Selector"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_withdrawal_feed_selector_v1.md"
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
                "stream": "v1.withdrawal",
                "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.withdrawal",
                "subs": ["'$GRVT_MAIN_ACCOUNT_ID'"],
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
                "stream": "v1.withdrawal",
                "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
            },
            "id": 123
        }
        ```
        **Full Unsubscribe Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "result": {
                "stream": "v1.withdrawal",
                "unsubs": ["'$GRVT_MAIN_ACCOUNT_ID'"]
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
            "stream":"v1.withdrawal",
            "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
            "method":"subscribe",
            "is_full":true
        }
        ```
        **Full Subscribe Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "stream":"v1.withdrawal",
            "subs":["'$GRVT_MAIN_ACCOUNT_ID'"],
            "unsubs":[],
            "num_snapshots":[1],
            "first_sequence_number":[2813]
        }
        ```
    </section>
=== "Feed Data"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ws_withdrawal_feed_data_v1.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Feed Response**
        ``` { .json .copy }
        {
            "stream": "v1.withdrawal",
            "selector": "BTC_USDT_Perp",
            "sequence_number": "872634876",
            "feed": {
                "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "currency": "USDT",
                "num_tokens": "10.50",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
        }
        ```
        **Lite Feed Response**
        ``` { .json .copy }
        {
            "s": "v1.withdrawal",
            "s1": "BTC_USDT_Perp",
            "sn": "872634876",
            "f": {
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "c": "USDT",
                "nt": "10.50",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1001|403|You are not authorized to access this functionality|
        |1008|401|Your IP has not been whitelisted for access|
        |1101|400|Feed Format must be in the format of <primary>@<secondary>|
        |1102|400|Wrong number of primary selectors|
        |1103|400|Wrong number of secondary selectors|
    -8<- "docs/schemas/jsonrpc_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure "Error"
        **Full Error Response**
        ``` { .json .copy }
        {
            "jsonrpc": "2.0",
            "error": {
                "code": 1001,
                "message": "You are not authorized to access this functionality"
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
                "c": 1001,
                "m": "You are not authorized to access this functionality"
            },
            "i": 123,
            "m": "subscribe"
        }
        ```
        **Legacy Error Response**
        ``` { .json .copy }
        {
            "code":1001,
            "message":"You are not authorized to access this functionality",
            "status":403
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
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
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "subscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "unsubscribe",
                "params": {
                    "stream": "v1.withdrawal",
                    "selectors": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "id": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":true
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "subscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Unsubscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "unsubscribe",
                "p": {
                    "s": "v1.withdrawal",
                    "s1": ["'$GRVT_MAIN_ACCOUNT_ID'"]
                },
                "i": 123
            }
            ' -w 360
            ```
        !!! example "Legacy Subscribe Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "request_id":1,
                "stream":"v1.withdrawal",
                "feed":["'$GRVT_MAIN_ACCOUNT_ID'"],
                "method":"subscribe",
                "is_full":false
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
