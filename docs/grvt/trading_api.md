# Trading APIs
All requests should be made using the `POST` HTTP method.

## Order
### Create Order
```
FULL ENDPOINT: full/v1/create_order
LITE ENDPOINT: lite/v1/create_order
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_create_order_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "order": {
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
                }
            }
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "o": {
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
                }
            }
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_create_order_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
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
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1004|404|Data Not Found|
        |1005|500|Unknown Error|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |1400|403|Signer does not have trade permission|
        |1009|503|We are temporarily deactivating this API endpoint, please try again later|
        |2000|403|Signature is from an unauthorized signer|
        |2001|403|Signature has expired|
        |2002|403|Signature does not match payload|
        |2003|403|Order sub account does not match logged in user|
        |2004|403|Signature is from an expired session key|
        |2006|403|Signature R/S must have exactly 64 characters long without 0x prefix|
        |2005|403|Signature V must be 27/28|
        |2007|403|Signature S must be in the lower half of the curve|
        |2010|400|Order ID should be empty when creating an order|
        |2011|400|Client Order ID should be supplied when creating an order|
        |2012|400|Client Order ID overlaps with existing active order|
        |2030|400|Orderbook Orders must have a TimeInForce of GTT/IOC/FOK|
        |2031|400|RFQ Orders must have a TimeInForce of GTT/AON/IOC/FOK|
        |2032|400|Post Only can only be set to true for GTT/AON orders|
        |2020|400|Market Order must always be supplied without a limit price|
        |2021|400|Limit Order must always be supplied with a limit price|
        |2040|400|Order must contain at least one leg|
        |2041|400|Order Legs must be sorted by Derivative.Instrument/Underlying/BaseCurrency/Expiration/StrikePrice|
        |2042|400|Orderbook Orders must contain only one leg|
        |2050|400|Order state must be empty upon creation|
        |2051|400|Order execution metadata must be empty upon creation|
        |2060|400|Order Legs contain one or more inactive derivative|
        |2061|400|Unsupported Instrument Requested|
        |2062|400|Order size smaller than min size|
        |2063|400|Order size smaller than min block size in block trade venue|
        |2064|400|Invalid limit price tick|
        |2065|400|Order size too granular|
        |2070|400|Liquidation Order is not supported|
        |2080|400|Insufficient margin to create order|
        |2081|400|Order Fill would result in exceeding maximum position size|
        |2082|400|Pre-order check failed|
        |2083|400|Order Fill would result in exceeding maximum position size under current configurable leverage tier|
        |2090|429|Max open orders exceeded|
        |2110|400|Invalid trigger by|
        |2111|400|Unsupported trigger by|
        |2112|400|Invalid trigger order|
        |2113|400|Trigger price must be non-zero|
        |2114|400|Invalid position linked TPSL orders, position linked TPSL must be a reduce-only order|
        |2115|400|Invalid position linked TPSL orders, position linked TPSL must not have smaller size than the position|
        |2116|400|Position linked TPSL order for this asset already exists|
        |3004|500|Instrument does not have a valid maintenance margin configuration|
        |3005|500|Instrument's underlying currency does not have a valid balance decimal configuration|
        |3006|500|Instrument's quote currency does not have a valid balance decimal configuration|
        |2400|400|Reduce only order with no position|
        |2401|400|Reduce only order must not increase position size|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "order": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/create_order",
                "params": {
                    "order": {
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
                        }
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "o": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/create_order",
                "p": {
                    "o": {
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
                        }
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "order": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/create_order",
                "params": {
                    "order": {
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
                        }
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "o": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/create_order",
                "p": {
                    "o": {
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
                        }
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "order": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/create_order",
                "params": {
                    "order": {
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
                        }
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "o": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/create_order",
                "p": {
                    "o": {
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
                        }
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "order": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/create_order",
                "params": {
                    "order": {
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
                        }
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/create_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "o": {
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
                    }
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/create_order",
                "p": {
                    "o": {
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
                        }
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Cancel Order
```
FULL ENDPOINT: full/v1/cancel_order
LITE ENDPOINT: lite/v1/cancel_order
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_cancel_order_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "order_id": "0x1028403",
            "client_order_id": "23042",
            "time_to_live_ms": "500"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "oi": "0x1028403",
            "co": "23042",
            "tt": "500"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |2300|400|Order cancel time-to-live settings currently disabled.|
        |2301|400|Order cancel time-to-live exceeds maximum allowed value.|
        |3021|400|Either order ID or client order ID must be supplied|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042",
                "time_to_live_ms": "500"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042",
                    "time_to_live_ms": "500"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042",
                "tt": "500"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042",
                    "tt": "500"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042",
                "time_to_live_ms": "500"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042",
                    "time_to_live_ms": "500"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042",
                "tt": "500"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042",
                    "tt": "500"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042",
                "time_to_live_ms": "500"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042",
                    "time_to_live_ms": "500"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042",
                "tt": "500"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042",
                    "tt": "500"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042",
                "time_to_live_ms": "500"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042",
                    "time_to_live_ms": "500"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/cancel_order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042",
                "tt": "500"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042",
                    "tt": "500"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Cancel All Orders
```
FULL ENDPOINT: full/v1/cancel_all_orders
LITE ENDPOINT: lite/v1/cancel_all_orders
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_cancel_all_orders_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "kind": ["PERPETUAL"],
            "base": ["BTC", "ETH"],
            "quote": ["USDT", "USDC"]
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "k": ["PERPETUAL"],
            "b": ["BTC", "ETH"],
            "q": ["USDT", "USDC"]
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_all_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_all_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_all_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_all_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_all_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_all_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_all_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/cancel_all_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_all_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Get Order
```
FULL ENDPOINT: full/v1/order
LITE ENDPOINT: lite/v1/order
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_order_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "order_id": "0x1028403",
            "client_order_id": "23042"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "oi": "0x1028403",
            "co": "23042"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_order_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
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
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |1004|404|Data Not Found|
        |3021|400|Either order ID or client order ID must be supplied|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "order_id": "0x1028403",
                "client_order_id": "23042"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "order_id": "0x1028403",
                    "client_order_id": "23042"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/order' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "oi": "0x1028403",
                "co": "23042"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "oi": "0x1028403",
                    "co": "23042"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Open Orders
```
FULL ENDPOINT: full/v1/open_orders
LITE ENDPOINT: lite/v1/open_orders
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_open_orders_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "kind": ["PERPETUAL"],
            "base": ["BTC", "ETH"],
            "quote": ["USDT", "USDC"]
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "k": ["PERPETUAL"],
            "b": ["BTC", "ETH"],
            "q": ["USDT", "USDC"]
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_open_orders_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
            }]
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
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |1003|400|Request could not be processed due to malformed syntax|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/open_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/open_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/open_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/open_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/open_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/open_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/open_orders",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/open_orders' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/open_orders",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Order History
```
FULL ENDPOINT: full/v1/order_history
LITE ENDPOINT: lite/v1/order_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_order_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "kind": ["PERPETUAL"],
            "base": ["BTC", "ETH"],
            "quote": ["USDT", "USDC"],
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": ""
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "k": ["PERPETUAL"],
            "b": ["BTC", "ETH"],
            "q": ["USDT", "USDC"],
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c": ""
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_order_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
            }],
            "n": "Qw0918="
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/order_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/order_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/order_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Cancel On Disconnect
```
FULL ENDPOINT: full/v1/cancel_on_disconnect
LITE ENDPOINT: lite/v1/cancel_on_disconnect
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_cancel_on_disconnect_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "countdown_time": 300
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "ct": 300
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |6000|400|Countdown time is bigger than 300s supported|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "countdown_time": 300
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_on_disconnect",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "countdown_time": 300
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "ct": 300
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_on_disconnect",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ct": 300
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "countdown_time": 300
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_on_disconnect",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "countdown_time": 300
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "ct": 300
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_on_disconnect",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ct": 300
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "countdown_time": 300
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_on_disconnect",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "countdown_time": 300
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "ct": 300
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_on_disconnect",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ct": 300
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "countdown_time": 300
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/cancel_on_disconnect",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "countdown_time": 300
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/cancel_on_disconnect' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "ct": 300
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/cancel_on_disconnect",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ct": 300
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Execution
### Fill History
```
FULL ENDPOINT: full/v1/fill_history
LITE ENDPOINT: lite/v1/fill_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_fill_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "kind": ["PERPETUAL"],
            "base": ["BTC", "ETH"],
            "quote": ["USDT", "USDC"],
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": ""
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "k": ["PERPETUAL"],
            "b": ["BTC", "ETH"],
            "q": ["USDT", "USDC"],
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c": ""
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_fill_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
            }],
            "n": "Qw0918="
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/fill_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/fill_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/fill_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/fill_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/fill_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/fill_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/fill_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/fill_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/fill_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Positions
```
FULL ENDPOINT: full/v1/positions
LITE ENDPOINT: lite/v1/positions
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_positions_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "kind": ["PERPETUAL"],
            "base": ["BTC", "ETH"],
            "quote": ["USDT", "USDC"]
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "k": ["PERPETUAL"],
            "b": ["BTC", "ETH"],
            "q": ["USDT", "USDC"]
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_positions_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
            }]
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/positions",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/positions",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/positions",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/positions",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/positions",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/positions",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/positions",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"]
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/positions' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"]
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/positions",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"]
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Funding Payment History
```
FULL ENDPOINT: full/v1/funding_payment_history
LITE ENDPOINT: lite/v1/funding_payment_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_funding_payment_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "instrument": "BTC_USDT_Perp",
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": ""
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "i": "BTC_USDT_Perp",
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c": ""
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_funding_payment_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "event_time": "1697788800000000000",
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "currency": "USDT",
                "amount": "9.75",
                "tx_id": "209358"
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "et": "1697788800000000000",
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "c": "USDT",
                "a": "9.75",
                "ti": "209358"
            }],
            "n": "Qw0918="
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_payment_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_payment_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_payment_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_payment_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_payment_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_payment_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_payment_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/funding_payment_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_payment_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Transfer
### Deposit History
```
FULL ENDPOINT: full/v1/deposit_history
LITE ENDPOINT: lite/v1/deposit_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_deposit_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "currency": ["USDT", "USDC"],
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": "",
            "main_account_id": null
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "c": ["USDT", "USDC"],
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c1": "",
            "ma": null
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_deposit_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "l_1_hash": "0x10000101000203040506",
                "l_2_hash": "0x10000101000203040506",
                "to_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "currency": "USDT",
                "num_tokens": "1500.0",
                "initiated_time": "1697788800000000000",
                "confirmed_time": "1697788800000000000",
                "from_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "l1": "0x10000101000203040506",
                "l2": "0x10000101000203040506",
                "ta": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "c": "USDT",
                "nt": "1500.0",
                "it": "1697788800000000000",
                "ct": "1697788800000000000",
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"
            }],
            "n": "Qw0918="
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/deposit_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/deposit_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/deposit_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/deposit_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/deposit_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/deposit_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/deposit_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/deposit_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/deposit_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Transfer
```
FULL ENDPOINT: full/v1/transfer
LITE ENDPOINT: lite/v1/transfer
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_transfer_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
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
            "transfer_type": "UNSPECIFIED",
            "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
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
            "tt": "UNSPECIFIED",
            "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_transfer_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true",
                "tx_id": "1028403"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true",
                "ti": "1028403"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |5000|400|Transfer Metadata does not match the expected structure.|
        |5001|400|Transfer Provider does not match the expected provider.|
        |4002|400|Transfer failed with an unrefined failure reason, please report to GRVT|
        |5002|400|Direction of the transfer does not match the expected direction.|
        |5003|400|Endpoint account ID is invalid.|
        |5004|400|Funding account does not exist in our system.|
        |5005|400|Invalid ChainID for the transfer request.|
        |7100|500|Unknown transaction type|
        |7101|400|Transfer account not found|
        |7102|400|Transfer sub-account not found|
        |7103|500|Charged trading fee below the config minimum|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "transfer_type": "UNSPECIFIED",
                "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer",
                "params": {
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
                    "transfer_type": "UNSPECIFIED",
                    "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "tt": "UNSPECIFIED",
                "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer",
                "p": {
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
                    "tt": "UNSPECIFIED",
                    "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "transfer_type": "UNSPECIFIED",
                "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer",
                "params": {
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
                    "transfer_type": "UNSPECIFIED",
                    "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "tt": "UNSPECIFIED",
                "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer",
                "p": {
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
                    "tt": "UNSPECIFIED",
                    "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "transfer_type": "UNSPECIFIED",
                "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer",
                "params": {
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
                    "transfer_type": "UNSPECIFIED",
                    "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "tt": "UNSPECIFIED",
                "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer",
                "p": {
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
                    "tt": "UNSPECIFIED",
                    "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "transfer_type": "UNSPECIFIED",
                "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer",
                "params": {
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
                    "transfer_type": "UNSPECIFIED",
                    "transfer_metadata": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/transfer' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
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
                "tt": "UNSPECIFIED",
                "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer",
                "p": {
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
                    "tt": "UNSPECIFIED",
                    "tm": {"provider":"XY","direction":"WITHDRAWAL","provider_tx_id":"txn123456","chainid":"42161","endpoint":"0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0"}
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Transfer History
```
FULL ENDPOINT: full/v1/transfer_history
LITE ENDPOINT: lite/v1/transfer_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_transfer_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "currency": ["USDT", "USDC"],
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": "",
            "tx_id": "1028403",
            "main_account_id": null
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "c": ["USDT", "USDC"],
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c1": "",
            "ti": "1028403",
            "ma": null
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_transfer_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
            }],
            "n": "Qw0918="
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "tx_id": "1028403",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "tx_id": "1028403",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ti": "1028403",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ti": "1028403",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "tx_id": "1028403",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "tx_id": "1028403",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ti": "1028403",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ti": "1028403",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "tx_id": "1028403",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "tx_id": "1028403",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ti": "1028403",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ti": "1028403",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "tx_id": "1028403",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/transfer_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "tx_id": "1028403",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/transfer_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ti": "1028403",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/transfer_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ti": "1028403",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Withdrawal
```
FULL ENDPOINT: full/v1/withdrawal
LITE ENDPOINT: lite/v1/withdrawal
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_withdrawal_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "currency": "USDT",
            "num_tokens": "1500.0",
            "signature": {
                "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "expiration": "1697788800000000000",
                "nonce": 1234567890
            }
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
            "c": "USDT",
            "nt": "1500.0",
            "s": {
                "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "e": "1697788800000000000",
                "n": 1234567890
            }
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |4010|400|This wallet is not supported. Please try another wallet.|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "currency": "USDT",
                "num_tokens": "1500.0",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal",
                "params": {
                    "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "currency": "USDT",
                    "num_tokens": "1500.0",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "c": "USDT",
                "nt": "1500.0",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal",
                "p": {
                    "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "c": "USDT",
                    "nt": "1500.0",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "currency": "USDT",
                "num_tokens": "1500.0",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal",
                "params": {
                    "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "currency": "USDT",
                    "num_tokens": "1500.0",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "c": "USDT",
                "nt": "1500.0",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal",
                "p": {
                    "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "c": "USDT",
                    "nt": "1500.0",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "currency": "USDT",
                "num_tokens": "1500.0",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal",
                "params": {
                    "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "currency": "USDT",
                    "num_tokens": "1500.0",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "c": "USDT",
                "nt": "1500.0",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal",
                "p": {
                    "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "c": "USDT",
                    "nt": "1500.0",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "currency": "USDT",
                "num_tokens": "1500.0",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal",
                "params": {
                    "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "currency": "USDT",
                    "num_tokens": "1500.0",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/withdrawal' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "c": "USDT",
                "nt": "1500.0",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal",
                "p": {
                    "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "c": "USDT",
                    "nt": "1500.0",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Withdrawal History
```
FULL ENDPOINT: full/v1/withdrawal_history
LITE ENDPOINT: lite/v1/withdrawal_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_withdrawal_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "currency": ["USDT", "USDC"],
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": "",
            "main_account_id": null
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "c": ["USDT", "USDC"],
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c1": "",
            "ma": null
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_withdrawal_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "tx_id": "1028403",
                "from_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "to_eth_address": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
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
                "event_time": "1697788800000000000"
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "ti": "1028403",
                "fa": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
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
                "et": "1697788800000000000"
            }],
            "n": "Qw0918="
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "currency": ["USDT", "USDC"],
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": "",
                "main_account_id": null
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/withdrawal_history",
                "params": {
                    "currency": ["USDT", "USDC"],
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": "",
                    "main_account_id": null
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/withdrawal_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "c": ["USDT", "USDC"],
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c1": "",
                "ma": null
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/withdrawal_history",
                "p": {
                    "c": ["USDT", "USDC"],
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c1": "",
                    "ma": null
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Account
### Sub Account Summary
```
FULL ENDPOINT: full/v1/account_summary
LITE ENDPOINT: lite/v1/account_summary
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_sub_account_summary_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_sub_account_summary_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "event_time": "1697788800000000000",
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "margin_type": "SIMPLE_CROSS_MARGIN",
                "settle_currency": "USDT",
                "unrealized_pnl": "123456.78",
                "total_equity": "123456.78",
                "initial_margin": "123456.78",
                "maintenance_margin": "123456.78",
                "available_balance": "123456.78",
                "spot_balances": [{
                    "currency": "USDT",
                    "balance": "123456.78",
                    "index_price": "1.0000102"
                }],
                "positions": [{
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
                }],
                "settle_index_price": "1.0000102",
                "is_vault": null,
                "vault_im_additions": "123456.78",
                "derisk_margin": "185185.77",
                "derisk_to_maintenance_margin_ratio": "1.5"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "et": "1697788800000000000",
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "mt": "SIMPLE_CROSS_MARGIN",
                "sc": "USDT",
                "up": "123456.78",
                "te": "123456.78",
                "im": "123456.78",
                "mm": "123456.78",
                "ab": "123456.78",
                "sb": [{
                    "c": "USDT",
                    "b": "123456.78",
                    "ip": "1.0000102"
                }],
                "p": [{
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
                }],
                "si": "1.0000102",
                "iv": null,
                "vi": "123456.78",
                "dm": "185185.77",
                "dt": "1.5"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_summary",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_summary",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_summary",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_summary",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_summary",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_summary",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_summary",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_summary",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Sub Account History
```
FULL ENDPOINT: full/v1/account_history
LITE ENDPOINT: lite/v1/account_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_sub_account_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": ""
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c": ""
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_sub_account_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "event_time": "1697788800000000000",
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "margin_type": "SIMPLE_CROSS_MARGIN",
                "settle_currency": "USDT",
                "unrealized_pnl": "123456.78",
                "total_equity": "123456.78",
                "initial_margin": "123456.78",
                "maintenance_margin": "123456.78",
                "available_balance": "123456.78",
                "spot_balances": [{
                    "currency": "USDT",
                    "balance": "123456.78",
                    "index_price": "1.0000102"
                }],
                "positions": [{
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
                }],
                "settle_index_price": "1.0000102",
                "is_vault": null,
                "vault_im_additions": "123456.78",
                "derisk_margin": "185185.77",
                "derisk_to_maintenance_margin_ratio": "1.5"
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "et": "1697788800000000000",
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "mt": "SIMPLE_CROSS_MARGIN",
                "sc": "USDT",
                "up": "123456.78",
                "te": "123456.78",
                "im": "123456.78",
                "mm": "123456.78",
                "ab": "123456.78",
                "sb": [{
                    "c": "USDT",
                    "b": "123456.78",
                    "ip": "1.0000102"
                }],
                "p": [{
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
                }],
                "si": "1.0000102",
                "iv": null,
                "vi": "123456.78",
                "dm": "185185.77",
                "dt": "1.5"
            }],
            "n": "Qw0918="
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/account_history",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "start_time": "1697788800000000000",
                    "end_time": "1697788800000000000",
                    "limit": 500,
                    "cursor": ""
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/account_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/account_history",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "st": "1697788800000000000",
                    "et": "1697788800000000000",
                    "l": 500,
                    "c": ""
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Aggregated Account Summary
```
FULL ENDPOINT: full/v1/aggregated_account_summary
LITE ENDPOINT: lite/v1/aggregated_account_summary
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/empty_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_aggregated_account_summary_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "main_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "total_equity": "3945034.23",
                "spot_balances": [{
                    "currency": "USDT",
                    "balance": "123456.78",
                    "index_price": "1.0000102"
                }],
                "vault_investments": [{
                    "vault_id": 123456789,
                    "num_lp_tokens": 1000000,
                    "share_price": 1000000
                }]
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "ma": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "3945034.23",
                "sb": [{
                    "c": "USDT",
                    "b": "123456.78",
                    "ip": "1.0000102"
                }],
                "vi": [{
                    "vi": 123456789,
                    "nl": 1000000,
                    "sp": 1000000
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
        |1001|403|You are not authorized to access this functionality|
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1001,
            "message":"You are not authorized to access this functionality",
            "status":403
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1001,
            "m":"You are not authorized to access this functionality",
            "s":403
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/aggregated_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/aggregated_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/aggregated_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/aggregated_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/aggregated_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/aggregated_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/aggregated_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/aggregated_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/aggregated_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Funding Account Summary
```
FULL ENDPOINT: full/v1/funding_account_summary
LITE ENDPOINT: lite/v1/funding_account_summary
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/empty_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_funding_account_summary_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "main_account_id": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "total_equity": "3945034.23",
                "spot_balances": [{
                    "currency": "USDT",
                    "balance": "123456.78",
                    "index_price": "1.0000102"
                }],
                "vault_investments": [{
                    "vault_id": 123456789,
                    "num_lp_tokens": 1000000,
                    "share_price": 1000000
                }]
            },
            "tier": {
                "tier": null,
                "futures_taker_fee": null,
                "futures_maker_fee": null,
                "options_taker_fee": null,
                "options_maker_fee": null
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "ma": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "te": "3945034.23",
                "sb": [{
                    "c": "USDT",
                    "b": "123456.78",
                    "ip": "1.0000102"
                }],
                "vi": [{
                    "vi": 123456789,
                    "nl": 1000000,
                    "sp": 1000000
                }]
            },
            "t": {
                "t": null,
                "ft": null,
                "fm": null,
                "ot": null,
                "om": null
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
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1001,
            "message":"You are not authorized to access this functionality",
            "status":403
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1001,
            "m":"You are not authorized to access this functionality",
            "s":403
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding_account_summary",
                "params": {
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/funding_account_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding_account_summary",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## DeriskMMRatio
### Set Derisk M M Ratio
```
FULL ENDPOINT: full/v1/set_derisk_mm_ratio
LITE ENDPOINT: lite/v1/set_derisk_mm_ratio
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_set_derisk_to_maintenance_margin_ratio_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "ratio": "1.5",
            "signature": {
                "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "expiration": "1697788800000000000",
                "nonce": 1234567890
            }
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "r": "1.5",
            "s": {
                "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "e": "1697788800000000000",
                "n": 1234567890
            }
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_set_derisk_to_maintenance_margin_ratio_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "success": "true"
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "s": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1004|404|Data Not Found|
        |6100|400|Derisk MM Ratio is out of range|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "ratio": "1.5",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_derisk_mm_ratio",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ratio": "1.5",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "r": "1.5",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_derisk_mm_ratio",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "r": "1.5",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "ratio": "1.5",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_derisk_mm_ratio",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ratio": "1.5",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "r": "1.5",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_derisk_mm_ratio",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "r": "1.5",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "ratio": "1.5",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_derisk_mm_ratio",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ratio": "1.5",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "r": "1.5",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_derisk_mm_ratio",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "r": "1.5",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "ratio": "1.5",
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_derisk_mm_ratio",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "ratio": "1.5",
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/set_derisk_mm_ratio' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "r": "1.5",
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_derisk_mm_ratio",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "r": "1.5",
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## InitialLeverage
### Get All Initial Leverage
```
FULL ENDPOINT: full/v1/get_all_initial_leverage
LITE ENDPOINT: lite/v1/get_all_initial_leverage
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_all_initial_leverage_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_all_initial_leverage_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "results": [{
                "instrument": "BTC_USDT_Perp",
                "leverage": "10",
                "min_leverage": "10",
                "max_leverage": "50"
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "i": "BTC_USDT_Perp",
                "l": "10",
                "ml": "10",
                "ml1": "50"
            }]
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1004|404|Data Not Found|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/get_all_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/get_all_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/get_all_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/get_all_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/get_all_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/get_all_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/get_all_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/get_all_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/get_all_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Set Initial Leverage
```
FULL ENDPOINT: full/v1/set_initial_leverage
LITE ENDPOINT: lite/v1/set_initial_leverage
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_set_initial_leverage_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
            "instrument": "BTC_USDT_Perp",
            "leverage": "10"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "sa": "'$GRVT_SUB_ACCOUNT_ID'",
            "i": "BTC_USDT_Perp",
            "l": "10"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_set_initial_leverage_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "success": "true"
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "s": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1004|404|Data Not Found|
        |2100|400|Invalid initial leverage|
        |2101|400|Vaults cannot configure leverage|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "leverage": "10"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "leverage": "10"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "l": "10"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "l": "10"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "leverage": "10"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "leverage": "10"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "l": "10"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "l": "10"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "leverage": "10"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "leverage": "10"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "l": "10"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "l": "10"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "instrument": "BTC_USDT_Perp",
                "leverage": "10"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/set_initial_leverage",
                "params": {
                    "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                    "instrument": "BTC_USDT_Perp",
                    "leverage": "10"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/set_initial_leverage' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "i": "BTC_USDT_Perp",
                "l": "10"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/set_initial_leverage",
                "p": {
                    "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                    "i": "BTC_USDT_Perp",
                    "l": "10"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Vault
### Vault Burn Tokens
```
FULL ENDPOINT: full/v1/vault_burn_tokens
LITE ENDPOINT: lite/v1/vault_burn_tokens
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_burn_tokens_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "vault_id": "3477045127917224",
            "currency": "USDT",
            "num_tokens": 1000000,
            "signature": {
                "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "expiration": "1697788800000000000",
                "nonce": 1234567890
            }
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "vi": "3477045127917224",
            "c": "USDT",
            "nt": 1000000,
            "s": {
                "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "e": "1697788800000000000",
                "n": 1234567890
            }
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |1009|503|We are temporarily deactivating this API endpoint, please try again later|
        |2000|403|Signature is from an unauthorized signer|
        |2001|403|Signature has expired|
        |2002|403|Signature does not match payload|
        |2004|403|Signature is from an expired session key|
        |2006|403|Signature R/S must have exactly 64 characters long without 0x prefix|
        |2005|403|Signature V must be 27/28|
        |2007|403|Signature S must be in the lower half of the curve|
        |2008|403|Signature exceeds maximum allowed duration.|
        |7000|400|Vault ID provided is invalid and does not belong to any vault|
        |7005|400|You are attempting to burn more vault tokens than you own.|
        |7006|400|You are attempting to burn vault tokens whilst having an active redemption request.|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_burn_tokens",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_burn_tokens",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_burn_tokens",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_burn_tokens",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_burn_tokens",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_burn_tokens",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_burn_tokens",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/vault_burn_tokens' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_burn_tokens",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Vault Invest
```
FULL ENDPOINT: full/v1/vault_invest
LITE ENDPOINT: lite/v1/vault_invest
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_invest_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "vault_id": "3477045127917224",
            "currency": "USDT",
            "num_tokens": 1000000,
            "signature": {
                "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "expiration": "1697788800000000000",
                "nonce": 1234567890
            }
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "vi": "3477045127917224",
            "c": "USDT",
            "nt": 1000000,
            "s": {
                "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "e": "1697788800000000000",
                "n": 1234567890
            }
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |1009|503|We are temporarily deactivating this API endpoint, please try again later|
        |2000|403|Signature is from an unauthorized signer|
        |2001|403|Signature has expired|
        |2002|403|Signature does not match payload|
        |2004|403|Signature is from an expired session key|
        |2006|403|Signature R/S must have exactly 64 characters long without 0x prefix|
        |2005|403|Signature V must be 27/28|
        |2007|403|Signature S must be in the lower half of the curve|
        |2008|403|Signature exceeds maximum allowed duration.|
        |4000|400|Insufficient balance to complete transfer|
        |7000|400|Vault ID provided is invalid and does not belong to any vault|
        |7003|400|This vault has been delisted/closed.|
        |7004|400|This investment would cause the vault to exceed its valuation cap.|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_invest",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_invest",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_invest",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_invest",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_invest",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_invest",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_invest",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/vault_invest' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_invest",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Vault Investor Summary
```
FULL ENDPOINT: full/v1/vault_investor_summary
LITE ENDPOINT: lite/v1/vault_investor_summary
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_investor_summary_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "vault_id": "3477045127917224"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "vi": "3477045127917224"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_investor_summary_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "vault_investor_summary": [{
                "sub_account_id": "'$GRVT_SUB_ACCOUNT_ID'",
                "num_lp_tokens": 1000000,
                "avg_entry_price": 1000000,
                "current_price": 1000000,
                "total_equity": 1000000,
                "all_time_realized_pnl": 1000000,
                "pending_redemption": {
                    "num_lp_tokens": 1000000,
                    "request_valuation": 1000000,
                    "request_time": "1697788800000000000",
                    "max_redemption_period_timestamp": 1727788800000000000
                },
                "can_burn": null
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "vi": [{
                "sa": "'$GRVT_SUB_ACCOUNT_ID'",
                "nl": 1000000,
                "ae": 1000000,
                "cp": 1000000,
                "te": 1000000,
                "at": 1000000,
                "pr": {
                    "nl": 1000000,
                    "rv": 1000000,
                    "rt": "1697788800000000000",
                    "mr": 1727788800000000000
                },
                "cb": null
            }]
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |7000|400|Vault ID provided is invalid and does not belong to any vault|
        |7007|400|The investor is not an LP for this vault.|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_investor_summary",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_investor_summary",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_investor_summary",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_investor_summary",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_investor_summary",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_investor_summary",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_investor_summary",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/vault_investor_summary' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_investor_summary",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Vault Redeem
```
FULL ENDPOINT: full/v1/vault_redeem
LITE ENDPOINT: lite/v1/vault_redeem
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_redeem_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "vault_id": "3477045127917224",
            "currency": "USDT",
            "num_tokens": 1000000,
            "signature": {
                "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "expiration": "1697788800000000000",
                "nonce": 1234567890
            }
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "vi": "3477045127917224",
            "c": "USDT",
            "nt": 1000000,
            "s": {
                "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                "v": 28,
                "e": "1697788800000000000",
                "n": 1234567890
            }
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |7000|400|Vault ID provided is invalid and does not belong to any vault|
        |7001|400|Vault does not have sufficient LP token balance|
        |7002|400|User has an ongoing redemption|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224",
                "currency": "USDT",
                "num_tokens": 1000000,
                "signature": {
                    "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "expiration": "1697788800000000000",
                    "nonce": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem",
                "params": {
                    "vault_id": "3477045127917224",
                    "currency": "USDT",
                    "num_tokens": 1000000,
                    "signature": {
                        "signer": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "expiration": "1697788800000000000",
                        "nonce": 1234567890
                    }
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/vault_redeem' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224",
                "c": "USDT",
                "nt": 1000000,
                "s": {
                    "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                    "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                    "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                    "v": 28,
                    "e": "1697788800000000000",
                    "n": 1234567890
                }
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem",
                "p": {
                    "vi": "3477045127917224",
                    "c": "USDT",
                    "nt": 1000000,
                    "s": {
                        "s": "0xc73c0c2538fd9b833d20933ccc88fdaa74fcb0d0",
                        "r": "0xb788d96fee91c7cdc35918e0441b756d4000ec1d07d900c73347d9abbc20acc8",
                        "s1": "0x3d786193125f7c29c958647da64d0e2875ece2c3f845a591bdd7dae8c475e26d",
                        "v": 28,
                        "e": "1697788800000000000",
                        "n": 1234567890
                    }
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Vault Redeem Cancel
```
FULL ENDPOINT: full/v1/vault_redeem_cancel
LITE ENDPOINT: lite/v1/vault_redeem_cancel
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_redeem_cancel_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "vault_id": "3477045127917224"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "vi": "3477045127917224"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/ack_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "ack": "true"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "a": "true"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |7000|400|Vault ID provided is invalid and does not belong to any vault|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem_cancel",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem_cancel",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem_cancel",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem_cancel",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem_cancel",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem_cancel",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_redeem_cancel",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/vault_redeem_cancel' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_redeem_cancel",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Vault Redemption Queue
```
FULL ENDPOINT: full/v1/vault_view_redemption_queue
LITE ENDPOINT: lite/v1/vault_view_redemption_queue
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_view_redemption_queue_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "vault_id": "3477045127917224"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "vi": "3477045127917224"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_vault_view_redemption_queue_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "redemption_queue": [{
                "request_time": "1697788800000000000",
                "num_lp_tokens": "1000000",
                "max_redemption_period_timestamp": "1727788800000000000",
                "age_category": "NORMAL",
                "is_manager": true,
                "eligible_for_auto_redemption_timestamp": "1727788800000000000"
            }],
            "pending_redemption_token_count": "1000000",
            "urgent_redemption_token_count": "0",
            "auto_redeemable_balance": "0",
            "share_price": "1.25",
            "pre_min": {
                "requests": [{
                    "request_time": "1697788800000000000",
                    "num_lp_tokens": "1000000",
                    "max_redemption_period_timestamp": "1727788800000000000",
                    "age_category": "NORMAL",
                    "is_manager": true,
                    "eligible_for_auto_redemption_timestamp": "1727788800000000000"
                }],
                "token_count": "1000000"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "rq": [{
                "rt": "1697788800000000000",
                "nl": "1000000",
                "mr": "1727788800000000000",
                "ac": "NORMAL",
                "im": true,
                "ef": "1727788800000000000"
            }],
            "pr": "1000000",
            "ur": "0",
            "ar": "0",
            "sp": "1.25",
            "pm": {
                "r": [{
                    "rt": "1697788800000000000",
                    "nl": "1000000",
                    "mr": "1727788800000000000",
                    "ac": "NORMAL",
                    "im": true,
                    "ef": "1727788800000000000"
                }],
                "tc": "1000000"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
        |7000|400|Vault ID provided is invalid and does not belong to any vault|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_view_redemption_queue",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_view_redemption_queue",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_view_redemption_queue",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_view_redemption_queue",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_view_redemption_queue",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_view_redemption_queue",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_view_redemption_queue",
                "params": {
                    "vault_id": "3477045127917224"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/vault_view_redemption_queue' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "3477045127917224"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_view_redemption_queue",
                "p": {
                    "vi": "3477045127917224"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Vault Manager Investment History
```
FULL ENDPOINT: full/v1/vault_manager_investor_history
LITE ENDPOINT: lite/v1/vault_manager_investor_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_query_vault_manager_investor_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "vault_id": "2312134",
            "only_own_investments": true
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "vi": "2312134",
            "oo": true
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_query_vault_manager_investor_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "event_time": "1697788800000000000",
                "off_chain_account_id": "ACC:123456",
                "vault_id": "2312134",
                "type": "VAULT_INVEST",
                "price": "1000000",
                "size": "1000000",
                "realized_pnl": "1000000",
                "performance_fee": "1000000"
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "et": "1697788800000000000",
                "oc": "ACC:123456",
                "vi": "2312134",
                "t": "VAULT_INVEST",
                "p": "1000000",
                "s": "1000000",
                "rp": "1000000",
                "pf": "1000000"
            }]
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
        |1008|401|Your IP has not been whitelisted for access|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1000,
            "message":"You need to authenticate prior to using this functionality",
            "status":401
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1000,
            "m":"You need to authenticate prior to using this functionality",
            "s":401
        }
        ```
    </section>
=== "Try it out"
    -8<- "sections/auth_closed.md"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/full/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "2312134",
                "only_own_investments": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_manager_investor_history",
                "params": {
                    "vault_id": "2312134",
                    "only_own_investments": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.dev.gravitymarkets.io/lite/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "2312134",
                "oo": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.dev.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_manager_investor_history",
                "p": {
                    "vi": "2312134",
                    "oo": true
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "STAGING"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/full/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "2312134",
                "only_own_investments": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_manager_investor_history",
                "params": {
                    "vault_id": "2312134",
                    "only_own_investments": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.staging.gravitymarkets.io/lite/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "2312134",
                "oo": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.staging.gravitymarkets.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_manager_investor_history",
                "p": {
                    "vi": "2312134",
                    "oo": true
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "TESTNET"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/full/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "2312134",
                "only_own_investments": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_manager_investor_history",
                "params": {
                    "vault_id": "2312134",
                    "only_own_investments": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.testnet.grvt.io/lite/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "2312134",
                "oo": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.testnet.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_manager_investor_history",
                "p": {
                    "vi": "2312134",
                    "oo": true
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
    === "PROD"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/full/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vault_id": "2312134",
                "only_own_investments": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/full" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/vault_manager_investor_history",
                "params": {
                    "vault_id": "2312134",
                    "only_own_investments": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://trades.grvt.io/lite/v1/vault_manager_investor_history' \
            --header "Cookie: $GRVT_COOKIE" \
            --header "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            --data '{
                "vi": "2312134",
                "oo": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://trades.grvt.io/ws/lite" \
            -H "Cookie: $GRVT_COOKIE" \
            -H "X-Grvt-Account-Id: $GRVT_ACCOUNT_ID" \
            -x '
            {
                "j": "2.0",
                "m": "v1/vault_manager_investor_history",
                "p": {
                    "vi": "2312134",
                    "oo": true
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
