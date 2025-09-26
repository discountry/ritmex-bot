!!! info "[QueryEpochBadgeRequest](/../../schemas/query_epoch_badge_request)"
    Query list of epoch badges<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |account_id<br>`ai` |string|False<br>`'all'`|The off chain account id to get referral stats|
    |epoch<br>`e` |integer|False<br>`'all'`|The numerical epoch index|
    |type<br>`t` |RewardProgramType|False<br>`'all'`|The type of the reward program|
    |limit<br>`l` |integer|False<br>`'500'`|The limit to query for. Defaults to 500; Max 1000|
    |cursor<br>`c` |string|False<br>`'all'`|The cursor to indicate when to start the query from|
    ??? info "[RewardProgramType](/../../schemas/reward_program_type)"
        |Value| Description |
        |-|-|
        |`ECOSYSTEM` = 1||
        |`TRADER` = 2||
        |`LP` = 3||
