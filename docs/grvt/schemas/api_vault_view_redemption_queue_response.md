!!! info "[ApiVaultViewRedemptionQueueResponse](/../../schemas/api_vault_view_redemption_queue_response)"
    Response payload for a vault manager to view the redemption queue for their vault, ordered by descending priority.<br><br>Also includes counters for total redemption sizes pending as well as urgent (refer to API integration guide for more detail on redemption request classifications).<br><br><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |redemption_queue<br>`rq` |[VaultRedemptionRequest]|True|Outstanding vault redemption requests, ordered by descending priority. Excludes requests that have not yet aged past the minimum redemption period.|
    |pending_redemption_token_count<br>`pr` |string|True|Number of shares eligible for automated redemption (held in queue for at least the minimum redemption period).|
    |urgent_redemption_token_count<br>`ur` |string|True|Number of shares nearing the maximum redemption period (>= 90% of maximum redemption period).|
    |auto_redeemable_balance<br>`ar` |string|True|Amount available for automated redemption request servicing (in USD).|
    |share_price<br>`sp` |string|True|Current share price (in USD).|
    |pre_min<br>`pm` |PreMinRedemptions|True|Dedicated section for requests yet to wait at least the minimum redemption period.|
    ??? info "[VaultRedemptionRequest](/../../schemas/vault_redemption_request)"
        Representation of a pending redemption request for a given vault.<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |request_time<br>`rt` |string|True|[Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds|
        |num_lp_tokens<br>`nl` |string|True|The number of shares to redeem|
        |max_redemption_period_timestamp<br>`mr` |string|True|[Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed.|
        |age_category<br>`ac` |VaultRedemptionReqAgeCategory|True|Age category of this redemption request.|
        |is_manager<br>`im` |boolean|False<br>`None`|`true` if this request belongs to the vault manager, omitted otherwise.|
        |eligible_for_auto_redemption_timestamp<br>`ef` |string|True|[Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be eligible for automated redemption.|
        ??? info "[VaultRedemptionReqAgeCategory](/../../schemas/vault_redemption_req_age_category)"
            Denotes the age category of a given redemption request.<br><br><br>

            |Value| Description |
            |-|-|
            |`NORMAL` = 1|This request is at least as old as the minimum redemption period, and is eligible for automated redemption.|
            |`URGENT` = 2|This request is nearing the maxmimum redemption period and will be factored into pre-order check margin requirements.|
            |`OVERDUE` = 3|This request has exceeded the maximum redemption period and will be considered for forced redemptions.|
            |`PRE_MIN` = 4|This request has yet to exceed the minimum redemption period, and is not yet eligible for automated redemption.|
    ??? info "[PreMinRedemptions](/../../schemas/pre_min_redemptions)"
        Vault redemption queue section hidden from main view. All requests here have yet to age past the vault's minimum redemption period.<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |requests<br>`r` |[VaultRedemptionRequest]|True|Pre-minimum-age redemption requests, ordered by age (first element is the oldest request that is pre-minimum-age).|
        |token_count<br>`tc` |string|True|Number of shares in the pre-minimum-age section of the vault's redemption queue.|
        ??? info "[VaultRedemptionRequest](/../../schemas/vault_redemption_request)"
            Representation of a pending redemption request for a given vault.<br>

            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |request_time<br>`rt` |string|True|[Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds|
            |num_lp_tokens<br>`nl` |string|True|The number of shares to redeem|
            |max_redemption_period_timestamp<br>`mr` |string|True|[Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed.|
            |age_category<br>`ac` |VaultRedemptionReqAgeCategory|True|Age category of this redemption request.|
            |is_manager<br>`im` |boolean|False<br>`None`|`true` if this request belongs to the vault manager, omitted otherwise.|
            |eligible_for_auto_redemption_timestamp<br>`ef` |string|True|[Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be eligible for automated redemption.|
            ??? info "[VaultRedemptionReqAgeCategory](/../../schemas/vault_redemption_req_age_category)"
                Denotes the age category of a given redemption request.<br><br><br>

                |Value| Description |
                |-|-|
                |`NORMAL` = 1|This request is at least as old as the minimum redemption period, and is eligible for automated redemption.|
                |`URGENT` = 2|This request is nearing the maxmimum redemption period and will be factored into pre-order check margin requirements.|
                |`OVERDUE` = 3|This request has exceeded the maximum redemption period and will be considered for forced redemptions.|
                |`PRE_MIN` = 4|This request has yet to exceed the minimum redemption period, and is not yet eligible for automated redemption.|
