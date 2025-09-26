!!! info "[ApiGetListFlatReferralResponse](/../../schemas/api_get_list_flat_referral_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |flat_referrals<br>`fr` |[FlatReferral]|True|The list of flat referrals|
    ??? info "[FlatReferral](/../../schemas/flat_referral)"
        <br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |account_id<br>`ai` |string|True|The off chain account id|
        |referrer_id<br>`ri` |string|True|The off chain referrer account id|
        |referrer_level<br>`rl` |integer|True|The referrer level; 1: direct referrer, 2: indirect referrer|
        |account_create_time<br>`ac` |string|True|The account creation time|
        |main_account_id<br>`ma` |string|True|The main account id|
        |referrer_main_account_id<br>`rm` |string|True|The referrer main account id|
        |is_business<br>`ib` |boolean|True|The account is a business account or not|
        |is_kyc_completed<br>`ik` |boolean|True|The account is KYC verified or not|
        |kyc_completed_at<br>`kc` |string|True|The KYC completed time|
        |kyc_type<br>`kt` |string|True|The KYC type, can be 'individual' or 'business'|
        |kyc_first_completed_at<br>`kf` |string|True|The first KYC completed time|
