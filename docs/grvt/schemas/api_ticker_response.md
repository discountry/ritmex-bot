!!! info "[ApiTickerResponse](/../../schemas/api_ticker_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |Ticker|True|The mini ticker matching the request asset|
    ??? info "[Ticker](/../../schemas/ticker)"
        Derived data such as the below, will not be included by default:<br>  - 24 hour volume (`buyVolume + sellVolume`)<br>  - 24 hour taker buy/sell ratio (`buyVolume / sellVolume`)<br>  - 24 hour average trade price (`volumeQ / volumeU`)<br>  - 24 hour average trade volume (`volume / trades`)<br>  - 24 hour percentage change (`24hStatChange / 24hStat`)<br>  - 48 hour statistics (`2 * 24hStat - 24hStatChange`)<br><br>To query for an extended ticker payload, leverage the `greeks` and the `derived` flags.<br>Ticker extensions are currently under design to offer you more convenience.<br>These flags are only supported on the `Ticker Snapshot` WS endpoint, and on the `Ticker` API endpoint.<br><br>

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
        |funding_rate_8h_curr<br>`fr` |string|False<br>`None`|The current funding rate of the instrument, expressed in percentage points|
        |funding_rate_8h_avg<br>`fr1` |string|False<br>`None`|The average funding rate of the instrument (over last 8h), expressed in percentage points|
        |interest_rate<br>`ir` |string|False<br>`None`|The interest rate of the underlying, expressed in centibeeps (1/100th of a basis point)|
        |forward_price<br>`fp` |string|False<br>`None`|[Options] The forward price of the option, expressed in `9` decimals|
        |buy_volume_24h_b<br>`bv` |string|False<br>`None`|The 24 hour taker buy volume of the instrument, expressed in base asset decimal units|
        |sell_volume_24h_b<br>`sv` |string|False<br>`None`|The 24 hour taker sell volume of the instrument, expressed in base asset decimal units|
        |buy_volume_24h_q<br>`bv1` |string|False<br>`None`|The 24 hour taker buy volume of the instrument, expressed in quote asset decimal units|
        |sell_volume_24h_q<br>`sv1` |string|False<br>`None`|The 24 hour taker sell volume of the instrument, expressed in quote asset decimal units|
        |high_price<br>`hp` |string|False<br>`None`|The 24 hour highest traded price of the instrument, expressed in `9` decimals|
        |low_price<br>`lp1` |string|False<br>`None`|The 24 hour lowest traded price of the instrument, expressed in `9` decimals|
        |open_price<br>`op` |string|False<br>`None`|The 24 hour first traded price of the instrument, expressed in `9` decimals|
        |open_interest<br>`oi` |string|False<br>`None`|The open interest in the instrument, expressed in base asset decimal units|
        |long_short_ratio<br>`ls1` |string|False<br>`None`|The ratio of accounts that are net long vs net short on this instrument|
