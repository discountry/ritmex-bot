!!! info "[QueryEpochBadgePointDistributionResponse](/../../schemas/query_epoch_badge_point_distribution_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[EpochBadgePointDistribution]|True|The list of epoch badges|
    ??? info "[EpochBadgePointDistribution](/../../schemas/epoch_badge_point_distribution)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |badge<br>`b` |EpochBadgeType|True|The type of the badge|
        |epoch<br>`e` |integer|True|The epoch number|
        |type<br>`t` |RewardProgramType|True|The type of the reward program|
        |min_point<br>`mp` |string|True|The minimum point to get the badge|
        |max_point<br>`mp1` |string|True|The maximum point to get the badge|
        |min_rank<br>`mr` |integer|True|The minimum rank to get the badge|
        |max_rank<br>`mr1` |integer|True|The maximum rank to get the badge|
        |total_point<br>`tp` |string|True|The total point to get the badge|
        |count<br>`c` |integer|True|The number of users to get the badge|
        ??? info "[EpochBadgeType](/../../schemas/epoch_badge_type)"
            |Value| Description |
            |-|-|
            |`CHAMPION` = 1|Champion|
            |`LEGEND` = 2|Legend|
            |`VETERAN` = 3|Veteran|
            |`ELITE` = 4|Elite|
            |`MASTER` = 5|Master|
            |`EXPERT` = 6|Expert|
            |`WARRIOR` = 7|Warrior|
            |`SERGEANT` = 8|Sergeant|
            |`RANGER` = 9|Ranger|
            |`CHALLENGER` = 10|Challenger|
            |`APPRENTICE` = 11|Apprentice|
            |`ROOKIE` = 12|Rookie|
        ??? info "[RewardProgramType](/../../schemas/reward_program_type)"
            |Value| Description |
            |-|-|
            |`ECOSYSTEM` = 1||
            |`TRADER` = 2||
            |`LP` = 3||
