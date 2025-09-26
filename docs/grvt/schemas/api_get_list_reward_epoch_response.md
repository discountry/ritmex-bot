!!! info "[ApiGetListRewardEpochResponse](/../../schemas/api_get_list_reward_epoch_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |ecosystem_epochs<br>`ee` |[RewardEpochInfo]|True|The list of epoch for ecosystem reward|
    |trading_epochs<br>`te` |[RewardEpochInfo]|True|The list of epoch for trader reward and lp reward|
    ??? info "[RewardEpochInfo](/../../schemas/reward_epoch_info)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |epoch<br>`e` |integer|True|The epoch number|
        |epoch_start_time<br>`es` |string|True|The start time of the epoch|
        |epoch_end_time<br>`ee` |string|True|The end time of the epoch|
        |status<br>`s` |RewardEpochStatus|True|The status of the epoch|
        ??? info "[RewardEpochStatus](/../../schemas/reward_epoch_status)"
            |Value| Description |
            |-|-|
            |`PAST` = 1|Past|
            |`CURRENT` = 2|Current|
            |`FUTURE` = 3|Future|
    ??? info "[RewardEpochInfo](/../../schemas/reward_epoch_info)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |epoch<br>`e` |integer|True|The epoch number|
        |epoch_start_time<br>`es` |string|True|The start time of the epoch|
        |epoch_end_time<br>`ee` |string|True|The end time of the epoch|
        |status<br>`s` |RewardEpochStatus|True|The status of the epoch|
        ??? info "[RewardEpochStatus](/../../schemas/reward_epoch_status)"
            |Value| Description |
            |-|-|
            |`PAST` = 1|Past|
            |`CURRENT` = 2|Current|
            |`FUTURE` = 3|Future|
