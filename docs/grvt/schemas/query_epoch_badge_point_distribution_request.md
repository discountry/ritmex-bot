!!! info "[QueryEpochBadgePointDistributionRequest](/../../schemas/query_epoch_badge_point_distribution_request)"
    Query list of epoch badges<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |epoch<br>`e` |integer|False<br>`'all'`|The numerical epoch index|
    |type<br>`t` |RewardProgramType|True|The type of the reward program|
    ??? info "[RewardProgramType](/../../schemas/reward_program_type)"
        |Value| Description |
        |-|-|
        |`ECOSYSTEM` = 1||
        |`TRADER` = 2||
        |`LP` = 3||
