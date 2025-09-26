!!! info "[ApiGetListFlatReferralRequest](/../../schemas/api_get_list_flat_referral_request)"
    startTime and endTime are optional parameters. The semantics of these parameters are as follows:<ul><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |referral_id<br>`ri` |string|True|The off chain referrer account id to get all flat referrals|
    |start_time<br>`st` |string|False<br>`0`|Optional. Start time in unix nanoseconds|
    |end_time<br>`et` |string|False<br>`now()`|Optional. End time in unix nanoseconds|
    |account_id<br>`ai` |string|True|The off chain account id to get all user's referrers|
