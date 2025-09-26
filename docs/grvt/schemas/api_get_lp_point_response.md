!!! info "[ApiGetLPPointResponse](/../../schemas/api_get_lp_point_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |point<br>`p` |LPPoint|True|LP points of user|
    |maker_count<br>`mc` |integer|True|The number of maker|
    ??? info "[LPPoint](/../../schemas/lp_point)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |main_account_id<br>`ma` |string|True|The main account id|
        |liquidity_score<br>`ls` |string|True|Liquidity score|
        |rank<br>`r` |integer|True|The rank of user in the LP leaderboard|
