!!! info "[ApiGetListEpochBadgeResponse](/../../schemas/api_get_list_epoch_badge_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[EpochBadge]|True|The list of epoch badges|
    ??? info "[EpochBadge](/../../schemas/epoch_badge)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |account_id<br>`ai` |string|True|The off chain account id|
        |main_account_id<br>`ma` |string|True|The account ID|
        |type<br>`t` |RewardProgramType|True|The type of the reward program|
        |epoch<br>`e` |integer|True|The epoch number|
        |epoch_start_time<br>`es` |string|True|The start time of the epoch|
        |epoch_end_time<br>`ee` |string|True|The end time of the epoch|
        |badge<br>`b` |EpochBadgeType|True|The type of the badge|
        |distributed_badges<br>`db` |[EpochBadgeType]|True|The distributed badges|
        |total_point<br>`tp` |string|True|Total point|
        |rank<br>`r` |integer|True|Rank|
        |claimed_at<br>`ca` |string|True|The time when the badge was claimed, or the epoch end time if the user has already completed the KYC process|
        ??? info "[RewardProgramType](/../../schemas/reward_program_type)"
            |Value| Description |
            |-|-|
            |`ECOSYSTEM` = 1||
            |`TRADER` = 2||
            |`LP` = 3||
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
