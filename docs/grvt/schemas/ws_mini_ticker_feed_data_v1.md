!!! info "[WSMiniTickerFeedDataV1](/../../schemas/ws_mini_ticker_feed_data_v1)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|Stream name|
    |selector<br>`s1` |string|True|Primary selector|
    |sequence_number<br>`sn` |string|True|A sequence number used to determine message order within a stream.<br>- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.<br>- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.<br>  - A single cluster payload can be multiplexed into multiple stream payloads.<br>  - To distinguish each stream payload, a `dedupCounter` is included.<br>  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.|
    |feed<br>`f` |MiniTicker|True|A mini ticker matching the request filter|
    ??? info "[MiniTicker](/../../schemas/mini_ticker)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |event_time<br>`et` |string|False<br>`None`|Time at which the event was emitted in unix nanoseconds|
        |instrument<br>`i` |string|False<br>`None`|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
        |mark_price<br>`mp` |string|False<br>`None`|The mark price of the instrument, expressed in `9` decimals|
        |index_price<br>`ip` |string|False<br>`None`|The index price of the instrument, expressed in `9` decimals|
        |last_price<br>`lp` |string|False<br>`None`|The last traded price of the instrument (also close price), expressed in `9` decimals|
        |last_size<br>`ls` |string|False<br>`None`|The number of assets traded in the last trade, expressed in base asset decimal units|
        |mid_price<br>`mp1` |string|False<br>`None`|The mid price of the instrument, expressed in `9` decimals|
        |best_bid_price<br>`bb` |string|False<br>`None`|The best bid price of the instrument, expressed in `9` decimals|
        |best_bid_size<br>`bb1` |string|False<br>`None`|The number of assets offered on the best bid price of the instrument, expressed in base asset decimal units|
        |best_ask_price<br>`ba` |string|False<br>`None`|The best ask price of the instrument, expressed in `9` decimals|
        |best_ask_size<br>`ba1` |string|False<br>`None`|The number of assets offered on the best ask price of the instrument, expressed in base asset decimal units|
