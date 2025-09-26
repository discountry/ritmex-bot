!!! info "[WSCandlestickFeedDataV1](/../../schemas/ws_candlestick_feed_data_v1)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|Stream name|
    |selector<br>`s1` |string|True|Primary selector|
    |sequence_number<br>`sn` |string|True|A sequence number used to determine message order within a stream.<br>- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.<br>- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.<br>  - A single cluster payload can be multiplexed into multiple stream payloads.<br>  - To distinguish each stream payload, a `dedupCounter` is included.<br>  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.|
    |feed<br>`f` |Candlestick|True|A candlestick entry matching the request filters|
    ??? info "[Candlestick](/../../schemas/candlestick)"
        <br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |open_time<br>`ot` |string|True|Open time of kline bar in unix nanoseconds|
        |close_time<br>`ct` |string|True|Close time of kline bar in unix nanosecond|
        |open<br>`o` |string|True|The open price, expressed in underlying currency resolution units|
        |close<br>`c` |string|True|The close price, expressed in underlying currency resolution units|
        |high<br>`h` |string|True|The high price, expressed in underlying currency resolution units|
        |low<br>`l` |string|True|The low price, expressed in underlying currency resolution units|
        |volume_b<br>`vb` |string|True|The underlying volume transacted, expressed in base asset decimal units|
        |volume_q<br>`vq` |string|True|The quote volume transacted, expressed in quote asset decimal units|
        |trades<br>`t` |integer|True|The number of trades transacted|
        |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
