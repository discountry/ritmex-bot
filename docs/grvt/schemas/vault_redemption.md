!!! info "[VaultRedemption](/../../schemas/vault_redemption)"
    Vault redemption information.<br><br>This struct contains information about a pending redemption from a vault.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |num_lp_tokens<br>`nl` |string|True|The number of LP Tokens requested for redemption.|
    |request_valuation<br>`rv` |string|True|The valuation (in USD) of the redemption request.|
    |request_time<br>`rt` |string|True|[Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds|
    |max_redemption_period_timestamp<br>`mr` |string|True|[Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed.|
