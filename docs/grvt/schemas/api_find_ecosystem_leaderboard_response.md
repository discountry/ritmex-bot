!!! info "[ApiFindEcosystemLeaderboardResponse](/../../schemas/api_find_ecosystem_leaderboard_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |users<br>`u` |[EcosystemLeaderboardUser]|True|The list of ecosystem leaderboard users|
    ??? info "[EcosystemLeaderboardUser](/../../schemas/ecosystem_leaderboard_user)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |account_id<br>`ai` |string|True|The off chain account id|
        |rank<br>`r` |integer|True|The rank of the account in the ecosystem|
        |total_point<br>`tp` |string|True|Total ecosystem point|
        |twitter_username<br>`tu` |string|True|The twitter username of the account|
