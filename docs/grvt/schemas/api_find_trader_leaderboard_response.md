!!! info "[ApiFindTraderLeaderboardResponse](/../../schemas/api_find_trader_leaderboard_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |users<br>`u` |[TraderLeaderboardUser]|True|The list of trader leaderboard users|
    ??? info "[TraderLeaderboardUser](/../../schemas/trader_leaderboard_user)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |account_id<br>`ai` |string|True|The off chain account id|
        |rank<br>`r` |integer|True|The rank of the account in the Trader|
        |total_point<br>`tp` |number|True|Total Trader point|
        |twitter_username<br>`tu` |string|True|The twitter username of the account|
