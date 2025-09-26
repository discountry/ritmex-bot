!!! info "[WSTradeFeedDataV1](/../../schemas/ws_trade_feed_data_v1)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|Stream name|
    |selector<br>`s1` |string|True|Primary selector|
    |sequence_number<br>`sn` |string|True|A sequence number used to determine message order within a stream.<br>- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.<br>- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.<br>  - A single cluster payload can be multiplexed into multiple stream payloads.<br>  - To distinguish each stream payload, a `dedupCounter` is included.<br>  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.|
    |feed<br>`f` |Trade|True|A public trade matching the request filter|
    ??? info "[Trade](/../../schemas/trade)"
        All private RFQs and Private AXEs will be filtered out from the responses<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |event_time<br>`et` |string|True|Time at which the event was emitted in unix nanoseconds|
        |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
        |is_taker_buyer<br>`it` |boolean|True|If taker was the buyer on the trade|
        |size<br>`s` |string|True|The number of assets being traded, expressed in base asset decimal units|
        |price<br>`p` |string|True|The traded price, expressed in `9` decimals|
        |mark_price<br>`mp` |string|True|The mark price of the instrument at point of trade, expressed in `9` decimals|
        |index_price<br>`ip` |string|True|The index price of the instrument at point of trade, expressed in `9` decimals|
        |interest_rate<br>`ir` |string|True|The interest rate of the underlying at point of trade, expressed in centibeeps (1/100th of a basis point)|
        |forward_price<br>`fp` |string|True|[Options] The forward price of the option at point of trade, expressed in `9` decimals|
        |trade_id<br>`ti` |string|True|A trade identifier, globally unique, and monotonically increasing (not by `1`).<br>All trades sharing a single taker execution share the same first component (before `-`), and `event_time`.<br>`trade_id` is guaranteed to be consistent across MarketData `Trade` and Trading `Fill`.|
        |venue<br>`v` |Venue|True|The venue where the trade occurred|
        |is_rpi<br>`ir1` |boolean|True|If the trade is a RPI trade|
        ??? info "[Venue](/../../schemas/venue)"
            The list of Trading Venues that are supported on the GRVT exchange<br>

            |Value| Description |
            |-|-|
            |`ORDERBOOK` = 1|the trade is cleared on the orderbook venue|
            |`RFQ` = 2|the trade is cleared on the RFQ venue|
