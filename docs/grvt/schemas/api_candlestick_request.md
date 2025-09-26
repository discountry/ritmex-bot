!!! info "[ApiCandlestickRequest](/../../schemas/api_candlestick_request)"
    Kline/Candlestick bars for an instrument. Klines are uniquely identified by their instrument, type, interval, and open time.<br><br>Pagination works as follows:<ul><li>We perform a reverse chronological lookup, starting from `end_time`. If `end_time` is not set, we start from the most recent data.</li><li>The lookup is limited to `limit` records. If more data is requested, the response will contain a `next` cursor for you to query the next page.</li><li>If a `cursor` is provided, it will be used to fetch results from that point onwards.</li><li>Pagination will continue until the `start_time` is reached. If `start_time` is not set, pagination will continue as far back as our data retention policy allows.</li></ul><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
    |interval<br>`i1` |CandlestickInterval|True|The interval of each candlestick|
    |type<br>`t` |CandlestickType|True|The type of candlestick data to retrieve|
    |start_time<br>`st` |string|False<br>`0`|Start time of kline data in unix nanoseconds|
    |end_time<br>`et` |string|False<br>`now()`|End time of kline data in unix nanoseconds|
    |limit<br>`l` |integer|False<br>`500`|The limit to query for. Defaults to 500; Max 1000|
    |cursor<br>`c` |string|False<br>`''`|The cursor to indicate when to start the query from|
    ??? info "[CandlestickInterval](/../../schemas/candlestick_interval)"
        |Value| Description |
        |-|-|
        |`CI_1_M` = 1|1 minute|
        |`CI_3_M` = 2|3 minutes|
        |`CI_5_M` = 3|5 minutes|
        |`CI_15_M` = 4|15 minutes|
        |`CI_30_M` = 5|30 minutes|
        |`CI_1_H` = 6|1 hour|
        |`CI_2_H` = 7|2 hour|
        |`CI_4_H` = 8|4 hour|
        |`CI_6_H` = 9|6 hour|
        |`CI_8_H` = 10|8 hour|
        |`CI_12_H` = 11|12 hour|
        |`CI_1_D` = 12|1 day|
        |`CI_3_D` = 13|3 days|
        |`CI_5_D` = 14|5 days|
        |`CI_1_W` = 15|1 week|
        |`CI_2_W` = 16|2 weeks|
        |`CI_3_W` = 17|3 weeks|
        |`CI_4_W` = 18|4 weeks|
    ??? info "[CandlestickType](/../../schemas/candlestick_type)"
        |Value| Description |
        |-|-|
        |`TRADE` = 1|Tracks traded prices|
        |`MARK` = 2|Tracks mark prices|
        |`INDEX` = 3|Tracks index prices|
        |`MID` = 4|Tracks book mid prices|
