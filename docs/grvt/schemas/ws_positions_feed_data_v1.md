!!! info "[WSPositionsFeedDataV1](/../../schemas/ws_positions_feed_data_v1)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|Stream name|
    |selector<br>`s1` |string|True|Primary selector|
    |sequence_number<br>`sn` |string|True|A sequence number used to determine message order within a stream.<br>- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.<br>- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.<br>  - A single cluster payload can be multiplexed into multiple stream payloads.<br>  - To distinguish each stream payload, a `dedupCounter` is included.<br>  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.|
    |feed<br>`f` |Positions|True|A Position being created or updated matching the request filter|
    ??? info "[Positions](/../../schemas/positions)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |event_time<br>`et` |string|True|Time at which the event was emitted in unix nanoseconds|
        |sub_account_id<br>`sa` |string|True|The sub account ID that participated in the trade|
        |instrument<br>`i` |string|True|The instrument being represented|
        |size<br>`s` |string|True|The size of the position, expressed in base asset decimal units. Negative for short positions|
        |notional<br>`n` |string|True|The notional value of the position, negative for short assets, expressed in quote asset decimal units|
        |entry_price<br>`ep` |string|True|The entry price of the position, expressed in `9` decimals<br>Whenever increasing the size of a position, the entry price is updated to the new average entry price<br>`new_entry_price = (old_entry_price * old_size + trade_price * trade_size) / (old_size + trade_size)`|
        |exit_price<br>`ep1` |string|True|The exit price of the position, expressed in `9` decimals<br>Whenever decreasing the size of a position, the exit price is updated to the new average exit price<br>`new_exit_price = (old_exit_price * old_exit_trade_size + trade_price * trade_size) / (old_exit_trade_size + trade_size)`|
        |mark_price<br>`mp` |string|True|The mark price of the position, expressed in `9` decimals|
        |unrealized_pnl<br>`up` |string|True|The unrealized PnL of the position, expressed in quote asset decimal units<br>`unrealized_pnl = (mark_price - entry_price) * size`|
        |realized_pnl<br>`rp` |string|True|The realized PnL of the position, expressed in quote asset decimal units<br>`realized_pnl = (exit_price - entry_price) * exit_trade_size`|
        |total_pnl<br>`tp` |string|True|The total PnL of the position, expressed in quote asset decimal units<br>`total_pnl = realized_pnl + unrealized_pnl`|
        |roi<br>`r` |string|True|The ROI of the position, expressed as a percentage<br>`roi = (total_pnl / (entry_price * abs(size))) * 100^`|
        |quote_index_price<br>`qi` |string|True|The index price of the quote currency. (reported in `USD`)|
        |est_liquidation_price<br>`el` |string|True|The estimated liquidation price|
        |leverage<br>`l` |string|True|The current leverage value for this position|
