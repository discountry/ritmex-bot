!!! info "[ApiVaultInvestorSummaryResponse](/../../schemas/api_vault_investor_summary_response)"
    Response payload for the summary of a vault investor.<br><br>This API provides the summary of investments in a specific vault.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |vault_investor_summary<br>`vi` |[VaultInvestorSummary]|True|The summary of investments in the vault.|
    ??? info "[VaultInvestorSummary](/../../schemas/vault_investor_summary)"
        Vault investor summary information.<br><br>This struct contains the summary of investments in a vault.<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |sub_account_id<br>`sa` |string|True|The unique identifier of the vault sub account.|
        |num_lp_tokens<br>`nl` |string|True|The number of Vault LP tokens held by the investor.|
        |avg_entry_price<br>`ae` |string|True|The average entry price (in USD) of the vault LP tokens.|
        |current_price<br>`cp` |string|True|The current price (in USD) of the vault LP tokens.|
        |total_equity<br>`te` |string|True|The current valuation (in USD) of all held vault LP tokens.|
        |all_time_realized_pnl<br>`at` |string|True|The all-time realized PnL (in USD) that the investor has received from the vault.|
        |pending_redemption<br>`pr` |VaultRedemption|False<br>`None`|The singleton pending redemption (omitted if none).|
        |can_burn<br>`cb` |boolean|False<br>`true`|True if the requesting account is authorized to burn tokens on this vault, omitted otherwise.|
        ??? info "[VaultRedemption](/../../schemas/vault_redemption)"
            Vault redemption information.<br><br>This struct contains information about a pending redemption from a vault.<br>

            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |num_lp_tokens<br>`nl` |string|True|The number of LP Tokens requested for redemption.|
            |request_valuation<br>`rv` |string|True|The valuation (in USD) of the redemption request.|
            |request_time<br>`rt` |string|True|[Filled by GRVT Backend] Time at which the redemption request was received by GRVT in unix nanoseconds|
            |max_redemption_period_timestamp<br>`mr` |string|True|[Filled by GRVT Backend] Time in unix nanoseconds, beyond which the request will be force-redeemed.|
