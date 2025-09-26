!!! info "[ApiQueryVaultManagerInvestorHistoryResponse](/../../schemas/api_query_vault_manager_investor_history_response)"
    Response to retrieve the vault summary for a given vault<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[ApiVaultInvestorHistory]|True|The list of vault investor history belong to the manager|
    ??? info "[ApiVaultInvestorHistory](/../../schemas/api_vault_investor_history)"
        The vault investor history returned by the service to client<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |event_time<br>`et` |string|True|Time at which the event was emitted in unix nanoseconds|
        |off_chain_account_id<br>`oc` |string|True|The off chain account id of the investor, only visible to the manager|
        |vault_id<br>`vi` |string|True|The unique identifier of the vault.|
        |type<br>`t` |VaultInvestorAction|True|The type of transaction that occurred. List of types: vaultInvest, vaultBurnLpToken, vaultRedeem|
        |price<br>`p` |string|True|The price of the vault LP tokens at the time of the event.|
        |size<br>`s` |string|True|The amount of Vault LP tokens invested or redeemed.|
        |realized_pnl<br>`rp` |string|True|The realized PnL of the vault.|
        |performance_fee<br>`pf` |string|True|The performance fee of the vault.|
        ??? info "[VaultInvestorAction](/../../schemas/vault_investor_action)"
            |Value| Description |
            |-|-|
            |`UNSPECIFIED` = 0||
            |`VAULT_INVEST` = 1||
            |`VAULT_BURN_LP_TOKEN` = 2||
            |`VAULT_REDEEM` = 3||
