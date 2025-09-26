!!! info "[ApiGetUserEcosystemPointResponse](/../../schemas/api_get_user_ecosystem_point_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |points<br>`p` |[EcosystemPoint]|True|The list of ecosystem points|
    ??? info "[EcosystemPoint](/../../schemas/ecosystem_point)"
        <br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |account_id<br>`ai` |string|True|The off chain account id|
        |main_account_id<br>`ma` |string|True|The main account id|
        |total_point<br>`tp` |string|True|Total ecosystem point|
        |direct_invite_count<br>`di` |integer|True|Direct invite count|
        |indirect_invite_count<br>`ii` |integer|True|Indirect invite count|
        |direct_invite_trading_volume<br>`di1` |string|True|Direct invite trading volume|
        |indirect_invite_trading_volume<br>`ii1` |string|True|Indirect invite trading volume|
        |calculate_at<br>`ca` |string|True|The time when the ecosystem point is calculated|
        |calculate_from<br>`cf` |string|True|Start time of the epoch - phase|
        |calculate_to<br>`ct` |string|True|End time of the epoch - phase|
        |rank<br>`r` |integer|True|The rank of the account in the ecosystem|
        |epoch<br>`e` |integer|True|The epoch number of the ecosystem point|
        |brokered_trading_volume<br>`bt` |string|True|Brokered trading volume|
        |brokered_trading_point<br>`bt1` |string|True|Brokered trading point|
        |referee_kyc_point<br>`rk` |string|True|Referee KYC point|
        |referrer_kyc_point<br>`rk1` |string|True|Referrer KYC point|
