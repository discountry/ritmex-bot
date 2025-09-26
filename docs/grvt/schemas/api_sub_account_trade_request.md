!!! info "[ApiSubAccountTradeRequest](/../../schemas/api_sub_account_trade_request)"
    startTime are optional parameters. The semantics of these parameters are as follows:<ul><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
    |interval<br>`i1` |SubAccountTradeInterval|True|The interval of each sub account trade|
    |sub_account_i_ds<br>`sa` |[string]|True|The list of sub account ids to query|
    |start_interval<br>`si` |string|True|Optional. The starting time in unix nanoseconds of a specific interval to query|
    |start_time<br>`st` |string|False<br>`0`|Optional. Start time in unix nanoseconds|
    |end_time<br>`et` |string|False<br>`now()`|Optional. End time in unix nanoseconds|
    ??? info "[SubAccountTradeInterval](/../../schemas/sub_account_trade_interval)"
        |Value| Description |
        |-|-|
        |`SAT_1_MO` = 1|1 month|
        |`SAT_1_D` = 2|1 day|
