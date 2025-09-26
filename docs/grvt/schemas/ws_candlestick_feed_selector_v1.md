!!! info "[WSCandlestickFeedSelectorV1](/../../schemas/ws_candlestick_feed_selector_v1)"
    Subscribes to a stream of Kline/Candlestick updates for an instrument. A Kline is uniquely identified by its open time.<br>A new Kline is published every interval (if it exists). Upon subscription, the server will send the 5 most recent Kline for the requested interval.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
    |interval<br>`i1` |CandlestickInterval|True|The interval of each candlestick|
    |type<br>`t` |CandlestickType|True|The type of candlestick data to retrieve|
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
