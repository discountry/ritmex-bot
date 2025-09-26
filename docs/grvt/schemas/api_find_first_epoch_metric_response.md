!!! info "[ApiFindFirstEpochMetricResponse](/../../schemas/api_find_first_epoch_metric_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |phase_zero_metric<br>`pz` |EcosystemMetric|True|Phase zero metric|
    |phase_one_metric<br>`po` |EcosystemMetric|True|Phase one metric|
    |rank<br>`r` |integer|True|The rank of the account in the ecosystem|
    |total<br>`t` |integer|True|The total number of accounts in the ecosystem|
    |total_point<br>`tp` |string|True|Total ecosystem point of the first epoch|
    |last_calculated_at<br>`lc` |string|True|The time when the ecosystem points were last calculated|
    ??? info "[EcosystemMetric](/../../schemas/ecosystem_metric)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |direct_invite_count<br>`di` |integer|True|Direct invite count|
        |indirect_invite_count<br>`ii` |integer|True|Indirect invite count|
        |direct_invite_trading_volume<br>`di1` |string|True|Direct invite trading volume|
        |indirect_invite_trading_volume<br>`ii1` |string|True|Indirect invite trading volume|
        |total_point<br>`tp` |string|True|Total ecosystem point of this epoch/phase|
    ??? info "[EcosystemMetric](/../../schemas/ecosystem_metric)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |direct_invite_count<br>`di` |integer|True|Direct invite count|
        |indirect_invite_count<br>`ii` |integer|True|Indirect invite count|
        |direct_invite_trading_volume<br>`di1` |string|True|Direct invite trading volume|
        |indirect_invite_trading_volume<br>`ii1` |string|True|Indirect invite trading volume|
        |total_point<br>`tp` |string|True|Total ecosystem point of this epoch/phase|
