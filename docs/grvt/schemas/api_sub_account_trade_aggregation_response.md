!!! info "[ApiSubAccountTradeAggregationResponse](/../../schemas/api_sub_account_trade_aggregation_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[SubAccountTradeAggregation]|True|The sub account trade aggregation result set for given interval|
    |next<br>`n` |string|False<br>`''`|The cursor to indicate when to start the next query from|
    ??? info "[SubAccountTradeAggregation](/../../schemas/sub_account_trade_aggregation)"
        Similar to sub-account trade, but not divided by individual assets.<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |sub_account_id<br>`sa` |string|True|The sub account id|
        |total_fee<br>`tf` |string|True|Total fee paid|
        |total_trade_volume<br>`tt` |string|True|Total volume traded|
        |num_traded<br>`nt` |string|True|Number of trades|
        |positive_fee<br>`pf` |string|True|Total positive fee paid by user|
        |signer<br>`s` |string|True|The signer of the trade|
        |realized_pnl<br>`rp` |string|True|Realized PnL|
