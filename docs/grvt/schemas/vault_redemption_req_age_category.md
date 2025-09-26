!!! info "[VaultRedemptionReqAgeCategory](/../../schemas/vault_redemption_req_age_category)"
    Denotes the age category of a given redemption request.<br><br><br>

    |Value| Description |
    |-|-|
    |`NORMAL` = 1|This request is at least as old as the minimum redemption period, and is eligible for automated redemption.|
    |`URGENT` = 2|This request is nearing the maxmimum redemption period and will be factored into pre-order check margin requirements.|
    |`OVERDUE` = 3|This request has exceeded the maximum redemption period and will be considered for forced redemptions.|
    |`PRE_MIN` = 4|This request has yet to exceed the minimum redemption period, and is not yet eligible for automated redemption.|
