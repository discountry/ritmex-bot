!!! info "[ApiCandlestickResponse](/../../schemas/api_candlestick_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[Candlestick]|True|The candlestick result set for given interval|
    |next<br>`n` |string|False<br>`''`|The cursor to indicate when to start the next query from|
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
