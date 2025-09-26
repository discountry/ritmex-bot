!!! info "[ApiSubAccountTradeResponse](/../../schemas/api_sub_account_trade_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[SubAccountTrade]|True|The sub account trade result set for given interval|
    ??? info "[SubAccountTrade](/../../schemas/sub_account_trade)"
        <br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |start_interval<br>`si` |string|True|Start of calculation epoch|
        |sub_account_id<br>`sa` |string|True|The sub account id|
        |instrument<br>`i` |string|True|The instrument being represented|
        |total_fee<br>`tf` |string|True|Total fee paid|
        |total_trade_volume<br>`tt` |string|True|Total volume traded|
