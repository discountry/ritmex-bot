!!! info "[WSOrderbookLevelsFeedDataV1](/../../schemas/ws_orderbook_levels_feed_data_v1)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|Stream name|
    |selector<br>`s1` |string|True|Primary selector|
    |sequence_number<br>`sn` |string|True|A sequence number used to determine message order within a stream.<br>- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.<br>- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.<br>  - A single cluster payload can be multiplexed into multiple stream payloads.<br>  - To distinguish each stream payload, a `dedupCounter` is included.<br>  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.|
    |feed<br>`f` |OrderbookLevels|True|An orderbook levels object matching the request filter|
    ??? info "[OrderbookLevels](/../../schemas/orderbook_levels)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |event_time<br>`et` |string|True|Time at which the event was emitted in unix nanoseconds|
        |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
        |bids<br>`b` |[OrderbookLevel]|True|The list of best bids up till query depth|
        |asks<br>`a` |[OrderbookLevel]|True|The list of best asks up till query depth|
        ??? info "[OrderbookLevel](/../../schemas/orderbook_level)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |price<br>`p` |string|True|The price of the level, expressed in `9` decimals|
            |size<br>`s` |string|True|The number of assets offered, expressed in base asset decimal units|
            |num_orders<br>`no` |integer|True|The number of open orders at this level|
        ??? info "[OrderbookLevel](/../../schemas/orderbook_level)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |price<br>`p` |string|True|The price of the level, expressed in `9` decimals|
            |size<br>`s` |string|True|The number of assets offered, expressed in base asset decimal units|
            |num_orders<br>`no` |integer|True|The number of open orders at this level|
