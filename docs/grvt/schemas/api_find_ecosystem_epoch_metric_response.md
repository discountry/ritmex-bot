!!! info "[ApiFindEcosystemEpochMetricResponse](/../../schemas/api_find_ecosystem_epoch_metric_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |metric<br>`m` |EcosystemMetric|True|The epoch metric|
    |rank<br>`r` |integer|True|The rank of the account in the ecosystem|
    |total<br>`t` |integer|True|The total number of accounts in the ecosystem|
    |last_calculated_at<br>`lc` |string|True|The time when the ecosystem points were last calculated|
    |total_direct_invite_count<br>`td` |integer|True|Direct invite count without relying on epochs|
    |total_indirect_invite_count<br>`ti` |integer|True|Indirect invite count without relying on epochs|
    ??? info "[EcosystemMetric](/../../schemas/ecosystem_metric)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |direct_invite_count<br>`di` |integer|True|Direct invite count|
        |indirect_invite_count<br>`ii` |integer|True|Indirect invite count|
        |direct_invite_trading_volume<br>`di1` |string|True|Direct invite trading volume|
        |indirect_invite_trading_volume<br>`ii1` |string|True|Indirect invite trading volume|
        |total_point<br>`tp` |string|True|Total ecosystem point of this epoch/phase|
