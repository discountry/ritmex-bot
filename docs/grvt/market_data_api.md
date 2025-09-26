# MarketData APIs
All requests should be made using the `POST` HTTP method.

## Instrument
### Get Instrument
```
FULL ENDPOINT: full/v1/instrument
LITE ENDPOINT: lite/v1/instrument
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_instrument_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "instrument": "BTC_USDT_Perp"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "i": "BTC_USDT_Perp"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_instrument_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
                "instrument": "BTC_USDT_Perp",
                "instrument_hash": "0x030501",
                "base": "BTC",
                "quote": "USDT",
                "kind": "PERPETUAL",
                "venues": ["ORDERBOOK"],
                "settlement_period": "PERPETUAL",
                "base_decimals": 3,
                "quote_decimals": 3,
                "tick_size": "0.01",
                "min_size": "0.01",
                "create_time": "1697788800000000000",
                "max_position_size": "100.0"
            }
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
                "i": "BTC_USDT_Perp",
                "ih": "0x030501",
                "b": "BTC",
                "q": "USDT",
                "k": "PERPETUAL",
                "v": ["ORDERBOOK"],
                "sp1": "PERPETUAL",
                "bd": 3,
                "qd": 3,
                "ts": "0.01",
                "ms": "0.01",
                "ct": "1697788800000000000",
                "mp": "100.0"
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1004|404|Data Not Found|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/instrument' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instrument",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/instrument' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instrument",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/instrument' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instrument",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/instrument' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instrument",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/instrument' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instrument",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/instrument' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instrument",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.grvt.io/full/v1/instrument' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instrument",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.grvt.io/lite/v1/instrument' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instrument",
                "p": {
                    "i": "BTC_USDT_Perp"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Get All Instruments
```
FULL ENDPOINT: full/v1/all_instruments
LITE ENDPOINT: lite/v1/all_instruments
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_all_instruments_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "is_active": true
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "ia": true
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_all_instruments_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "instrument": "BTC_USDT_Perp",
                "instrument_hash": "0x030501",
                "base": "BTC",
                "quote": "USDT",
                "kind": "PERPETUAL",
                "venues": ["ORDERBOOK"],
                "settlement_period": "PERPETUAL",
                "base_decimals": 3,
                "quote_decimals": 3,
                "tick_size": "0.01",
                "min_size": "0.01",
                "create_time": "1697788800000000000",
                "max_position_size": "100.0"
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "i": "BTC_USDT_Perp",
                "ih": "0x030501",
                "b": "BTC",
                "q": "USDT",
                "k": "PERPETUAL",
                "v": ["ORDERBOOK"],
                "sp1": "PERPETUAL",
                "bd": 3,
                "qd": 3,
                "ts": "0.01",
                "ms": "0.01",
                "ct": "1697788800000000000",
                "mp": "100.0"
            }]
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/all_instruments' \
            --data '{
                "is_active": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/all_instruments",
                "params": {
                    "is_active": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/all_instruments' \
            --data '{
                "ia": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/all_instruments",
                "p": {
                    "ia": true
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/all_instruments' \
            --data '{
                "is_active": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/all_instruments",
                "params": {
                    "is_active": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/all_instruments' \
            --data '{
                "ia": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/all_instruments",
                "p": {
                    "ia": true
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/all_instruments' \
            --data '{
                "is_active": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/all_instruments",
                "params": {
                    "is_active": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/all_instruments' \
            --data '{
                "ia": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/all_instruments",
                "p": {
                    "ia": true
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
            curl --location 'https://market-data.grvt.io/full/v1/all_instruments' \
            --data '{
                "is_active": true
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/all_instruments",
                "params": {
                    "is_active": true
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.grvt.io/lite/v1/all_instruments' \
            --data '{
                "ia": true
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/all_instruments",
                "p": {
                    "ia": true
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Get Filtered Instruments
```
FULL ENDPOINT: full/v1/instruments
LITE ENDPOINT: lite/v1/instruments
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_filtered_instruments_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "kind": ["PERPETUAL"],
            "base": ["BTC", "ETH"],
            "quote": ["USDT", "USDC"],
            "is_active": true,
            "limit": 500
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "k": ["PERPETUAL"],
            "b": ["BTC", "ETH"],
            "q": ["USDT", "USDC"],
            "ia": true,
            "l": 500
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_filtered_instruments_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "instrument": "BTC_USDT_Perp",
                "instrument_hash": "0x030501",
                "base": "BTC",
                "quote": "USDT",
                "kind": "PERPETUAL",
                "venues": ["ORDERBOOK"],
                "settlement_period": "PERPETUAL",
                "base_decimals": 3,
                "quote_decimals": 3,
                "tick_size": "0.01",
                "min_size": "0.01",
                "create_time": "1697788800000000000",
                "max_position_size": "100.0"
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "i": "BTC_USDT_Perp",
                "ih": "0x030501",
                "b": "BTC",
                "q": "USDT",
                "k": "PERPETUAL",
                "v": ["ORDERBOOK"],
                "sp1": "PERPETUAL",
                "bd": 3,
                "qd": 3,
                "ts": "0.01",
                "ms": "0.01",
                "ct": "1697788800000000000",
                "mp": "100.0"
            }]
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/instruments' \
            --data '{
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "is_active": true,
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instruments",
                "params": {
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "is_active": true,
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/instruments' \
            --data '{
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "ia": true,
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instruments",
                "p": {
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "ia": true,
                    "l": 500
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/instruments' \
            --data '{
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "is_active": true,
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instruments",
                "params": {
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "is_active": true,
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/instruments' \
            --data '{
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "ia": true,
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instruments",
                "p": {
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "ia": true,
                    "l": 500
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/instruments' \
            --data '{
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "is_active": true,
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instruments",
                "params": {
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "is_active": true,
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/instruments' \
            --data '{
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "ia": true,
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instruments",
                "p": {
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "ia": true,
                    "l": 500
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
            curl --location 'https://market-data.grvt.io/full/v1/instruments' \
            --data '{
                "kind": ["PERPETUAL"],
                "base": ["BTC", "ETH"],
                "quote": ["USDT", "USDC"],
                "is_active": true,
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/instruments",
                "params": {
                    "kind": ["PERPETUAL"],
                    "base": ["BTC", "ETH"],
                    "quote": ["USDT", "USDC"],
                    "is_active": true,
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.grvt.io/lite/v1/instruments' \
            --data '{
                "k": ["PERPETUAL"],
                "b": ["BTC", "ETH"],
                "q": ["USDT", "USDC"],
                "ia": true,
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/instruments",
                "p": {
                    "k": ["PERPETUAL"],
                    "b": ["BTC", "ETH"],
                    "q": ["USDT", "USDC"],
                    "ia": true,
                    "l": 500
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Get Currency
```
FULL ENDPOINT: full/v1/currency
LITE ENDPOINT: lite/v1/currency
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_get_currency_request.md"
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
    -8<- "docs/schemas/api_get_currency_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "id": 3,
                "symbol": "USDT",
                "balance_decimals": 6,
                "quantity_multiplier": 1000000
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "i": 3,
                "s": "USDT",
                "bd": 6,
                "qm": 1000000
            }]
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1004|404|Data Not Found|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/currency",
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
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/currency",
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/currency",
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
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/currency",
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/currency",
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
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/currency",
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
            curl --location 'https://market-data.grvt.io/full/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/currency",
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
            curl --location 'https://market-data.grvt.io/lite/v1/currency' \
            --data '{
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/currency",
                "p": {
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Ticker
### Mini Ticker
```
FULL ENDPOINT: full/v1/mini
LITE ENDPOINT: lite/v1/mini
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_mini_ticker_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "instrument": "BTC_USDT_Perp"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "i": "BTC_USDT_Perp"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_mini_ticker_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
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
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1004|404|Data Not Found|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/mini' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/mini",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/mini' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/mini",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/mini' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/mini",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/mini' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/mini",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/mini' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/mini",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/mini' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/mini",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.grvt.io/full/v1/mini' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/mini",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.grvt.io/lite/v1/mini' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/mini",
                "p": {
                    "i": "BTC_USDT_Perp"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Ticker
```
FULL ENDPOINT: full/v1/ticker
LITE ENDPOINT: lite/v1/ticker
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_ticker_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "instrument": "BTC_USDT_Perp"
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "i": "BTC_USDT_Perp"
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_ticker_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
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
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1004|404|Data Not Found|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/ticker' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/ticker",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/ticker' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/ticker",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/ticker' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/ticker",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/ticker' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/ticker",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/ticker' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/ticker",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/ticker' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/ticker",
                "p": {
                    "i": "BTC_USDT_Perp"
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
            curl --location 'https://market-data.grvt.io/full/v1/ticker' \
            --data '{
                "instrument": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/ticker",
                "params": {
                    "instrument": "BTC_USDT_Perp"
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.grvt.io/lite/v1/ticker' \
            --data '{
                "i": "BTC_USDT_Perp"
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/ticker",
                "p": {
                    "i": "BTC_USDT_Perp"
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Orderbook
### Orderbook Levels
```
FULL ENDPOINT: full/v1/book
LITE ENDPOINT: lite/v1/book
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_orderbook_levels_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "instrument": "BTC_USDT_Perp",
            "depth": 50
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "i": "BTC_USDT_Perp",
            "d": 50
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_orderbook_levels_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": {
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
        **Lite Response**
        ``` { .json .copy }
        {
            "r": {
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
        |1003|400|Request could not be processed due to malformed syntax|
        |1004|404|Data Not Found|
        |3000|400|Instrument is invalid|
        |3031|400|Depth is invalid|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/book' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "depth": 50
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/book",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "depth": 50
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/book' \
            --data '{
                "i": "BTC_USDT_Perp",
                "d": 50
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/book",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "d": 50
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/book' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "depth": 50
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/book",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "depth": 50
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/book' \
            --data '{
                "i": "BTC_USDT_Perp",
                "d": 50
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/book",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "d": 50
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/book' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "depth": 50
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/book",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "depth": 50
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/book' \
            --data '{
                "i": "BTC_USDT_Perp",
                "d": 50
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/book",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "d": 50
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
            curl --location 'https://market-data.grvt.io/full/v1/book' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "depth": 50
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/book",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "depth": 50
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.grvt.io/lite/v1/book' \
            --data '{
                "i": "BTC_USDT_Perp",
                "d": 50
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/book",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "d": 50
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
## Trade
### Trade
```
FULL ENDPOINT: full/v1/trade
LITE ENDPOINT: lite/v1/trade
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_trade_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "instrument": "BTC_USDT_Perp",
            "limit": 500
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "i": "BTC_USDT_Perp",
            "l": 500
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_trade_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }]
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
            }]
        }
        ```
    </section>
=== "Errors"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    !!! info "Error Codes"
        |Code|HttpStatus| Description |
        |-|-|-|
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/trade' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/trade' \
            --data '{
                "i": "BTC_USDT_Perp",
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "l": 500
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/trade' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/trade' \
            --data '{
                "i": "BTC_USDT_Perp",
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "l": 500
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/trade' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/trade' \
            --data '{
                "i": "BTC_USDT_Perp",
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "l": 500
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
            curl --location 'https://market-data.grvt.io/full/v1/trade' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "limit": 500
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "limit": 500
                },
                "id": 123
            }
            ' -w 360
            ```
        </section>
        <section markdown="1" style="float: right; width: 50%;">
        !!! example "REST Lite"
            ``` { .bash .copy }
            curl --location 'https://market-data.grvt.io/lite/v1/trade' \
            --data '{
                "i": "BTC_USDT_Perp",
                "l": 500
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "l": 500
                },
                "i": 123
            }
            ' -w 360
            ```
        </section>
<hr class="solid">
### Trade History
```
FULL ENDPOINT: full/v1/trade_history
LITE ENDPOINT: lite/v1/trade_history
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_trade_history_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
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
    -8<- "docs/schemas/api_trade_history_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade_history",
                "params": {
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
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade_history",
                "p": {
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade_history",
                "params": {
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
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade_history",
                "p": {
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade_history",
                "params": {
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
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade_history",
                "p": {
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
            curl --location 'https://market-data.grvt.io/full/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/trade_history",
                "params": {
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
            curl --location 'https://market-data.grvt.io/lite/v1/trade_history' \
            --data '{
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
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/trade_history",
                "p": {
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
## Candlestick
### Candlestick
```
FULL ENDPOINT: full/v1/kline
LITE ENDPOINT: lite/v1/kline
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_candlestick_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
            "instrument": "BTC_USDT_Perp",
            "interval": "CI_1_M",
            "type": "TRADE",
            "start_time": "1697788800000000000",
            "end_time": "1697788800000000000",
            "limit": 500,
            "cursor": ""
        }
        ```
        **Lite Request**
        ``` { .json .copy }
        {
            "i": "BTC_USDT_Perp",
            "i1": "CI_1_M",
            "t": "TRADE",
            "st": "1697788800000000000",
            "et": "1697788800000000000",
            "l": 500,
            "c": ""
        }
        ```
    </section>
=== "Response"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_candlestick_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
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
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
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
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/kline' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "interval": "CI_1_M",
                "type": "TRADE",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/kline",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "interval": "CI_1_M",
                    "type": "TRADE",
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
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/kline' \
            --data '{
                "i": "BTC_USDT_Perp",
                "i1": "CI_1_M",
                "t": "TRADE",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/kline",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "i1": "CI_1_M",
                    "t": "TRADE",
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/kline' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "interval": "CI_1_M",
                "type": "TRADE",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/kline",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "interval": "CI_1_M",
                    "type": "TRADE",
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
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/kline' \
            --data '{
                "i": "BTC_USDT_Perp",
                "i1": "CI_1_M",
                "t": "TRADE",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/kline",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "i1": "CI_1_M",
                    "t": "TRADE",
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/kline' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "interval": "CI_1_M",
                "type": "TRADE",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/kline",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "interval": "CI_1_M",
                    "type": "TRADE",
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
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/kline' \
            --data '{
                "i": "BTC_USDT_Perp",
                "i1": "CI_1_M",
                "t": "TRADE",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/kline",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "i1": "CI_1_M",
                    "t": "TRADE",
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
            curl --location 'https://market-data.grvt.io/full/v1/kline' \
            --data '{
                "instrument": "BTC_USDT_Perp",
                "interval": "CI_1_M",
                "type": "TRADE",
                "start_time": "1697788800000000000",
                "end_time": "1697788800000000000",
                "limit": 500,
                "cursor": ""
            }
            '
            ```
        !!! example "JSONRPC Full"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/kline",
                "params": {
                    "instrument": "BTC_USDT_Perp",
                    "interval": "CI_1_M",
                    "type": "TRADE",
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
            curl --location 'https://market-data.grvt.io/lite/v1/kline' \
            --data '{
                "i": "BTC_USDT_Perp",
                "i1": "CI_1_M",
                "t": "TRADE",
                "st": "1697788800000000000",
                "et": "1697788800000000000",
                "l": 500,
                "c": ""
            }
            '
            ```
        !!! example "JSONRPC Lite"
            ``` { .bash .copy }
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/kline",
                "p": {
                    "i": "BTC_USDT_Perp",
                    "i1": "CI_1_M",
                    "t": "TRADE",
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
## Settlement
### Funding Rate
```
FULL ENDPOINT: full/v1/funding
LITE ENDPOINT: lite/v1/funding
```

=== "Request"
    <section markdown="1" style="float: left; width: 70%; padding-right: 10px;">
    -8<- "docs/schemas/api_funding_rate_request.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! question "Query"
        **Full Request**
        ``` { .json .copy }
        {
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
    -8<- "docs/schemas/api_funding_rate_response.md"
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! success
        **Full Response**
        ``` { .json .copy }
        {
            "result": [{
                "instrument": "BTC_USDT_Perp",
                "funding_rate": 0.0003,
                "funding_time": "1697788800000000000",
                "mark_price": "65038.01",
                "funding_rate_8_h_avg": 0.0003
            }],
            "next": "Qw0918="
        }
        ```
        **Lite Response**
        ``` { .json .copy }
        {
            "r": [{
                "i": "BTC_USDT_Perp",
                "fr": 0.0003,
                "ft": "1697788800000000000",
                "mp": "65038.01",
                "fr1": 0.0003
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
        |1002|500|Internal Server Error|
        |1003|400|Request could not be processed due to malformed syntax|
        |1006|429|You have surpassed the allocated rate limit for your tier|
    </section>
    <section markdown="1" style="float: right; width: 30%;">
    !!! failure
        **Full Error Response**
        ``` { .json .copy }
        {
            "request_id":1,
            "code":1002,
            "message":"Internal Server Error",
            "status":500
        }
        ```
        **Lite Error Response**
        ``` { .json .copy }
        {
            "ri":1,
            "c":1002,
            "m":"Internal Server Error",
            "s":500
        }
        ```
    </section>
=== "Try it out"
    === "DEV"
        <section markdown="1" style="float: left; width: 50%; padding-right: 10px;">
        !!! example "REST Full"
            ``` { .bash .copy }
            curl --location 'https://market-data.dev.gravitymarkets.io/full/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding",
                "params": {
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
            curl --location 'https://market-data.dev.gravitymarkets.io/lite/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.dev.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding",
                "p": {
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
            curl --location 'https://market-data.staging.gravitymarkets.io/full/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding",
                "params": {
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
            curl --location 'https://market-data.staging.gravitymarkets.io/lite/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.staging.gravitymarkets.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding",
                "p": {
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
            curl --location 'https://market-data.testnet.grvt.io/full/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.testnet.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding",
                "params": {
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
            curl --location 'https://market-data.testnet.grvt.io/lite/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.testnet.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding",
                "p": {
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
            curl --location 'https://market-data.grvt.io/full/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.grvt.io/ws/full" \
            -x '
            {
                "jsonrpc": "2.0",
                "method": "v1/funding",
                "params": {
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
            curl --location 'https://market-data.grvt.io/lite/v1/funding' \
            --data '{
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
            wscat -c "wss://market-data.grvt.io/ws/lite" \
            -x '
            {
                "j": "2.0",
                "m": "v1/funding",
                "p": {
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
