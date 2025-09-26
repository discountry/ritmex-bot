!!! info "[ApiSubAccountTradeAggregationRequest](/../../schemas/api_sub_account_trade_aggregation_request)"
    startTime are optional parameters. The semantics of these parameters are as follows:<ul><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |limit<br>`l` |integer|True|Optional. The limit of the number of results to return|
    |interval<br>`i` |SubAccountTradeInterval|True|The interval of each sub account trade|
    |sub_account_i_ds<br>`sa` |[string]|True|The list of sub account ids to query|
    |start_interval<br>`si` |string|True|Optional. The starting time in unix nanoseconds of a specific interval to query|
    |start_time<br>`st` |string|False<br>`0`|Optional. Start time in unix nanoseconds|
    |end_time<br>`et` |string|False<br>`now()`|Optional. End time in unix nanoseconds|
    |is_maker<br>`im` |boolean|True|Filter on the maker of the trade|
    |is_taker<br>`it` |boolean|True|Filter on the taker of the trade|
    |cursor<br>`c` |string|False<br>``|The cursor to indicate when to start the next query from|
    |group_by_signer<br>`gb` |boolean|True|Whether to group trades by signer per sub account|
    ??? info "[SubAccountTradeInterval](/../../schemas/sub_account_trade_interval)"
        |Value| Description |
        |-|-|
        |`SAT_1_MO` = 1|1 month|
        |`SAT_1_D` = 2|1 day|
        |`SAT_1_H` = 3|1 hour|
        |`SAT_4_H` = 4|4 hour|
