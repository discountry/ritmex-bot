!!! info "[ApiFundingAccountSummaryResponse](/../../schemas/api_funding_account_summary_response)"
    The funding account summary, that reports the total equity and spot balances of a funding (main) account<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |FundingAccountSummary|True|The funding account summary|
    |tier<br>`t` |ClientTier|True|Client fee tier at the time of query|
    ??? info "[FundingAccountSummary](/../../schemas/funding_account_summary)"
        The funding account summary, that reports the total equity and spot balances of a funding (main) account<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |main_account_id<br>`ma` |string|True|The main account ID of the account to which the summary belongs|
        |total_equity<br>`te` |string|True|Total equity of the main account, denominated in USD|
        |spot_balances<br>`sb` |[SpotBalance]|True|The list of spot assets owned by this main account, and their balances|
        |vault_investments<br>`vi` |[VaultInvestment]|True|The list of vault investments held by this main account|
        ??? info "[SpotBalance](/../../schemas/spot_balance)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |currency<br>`c` |string|True|The currency you hold a spot balance in|
            |balance<br>`b` |string|True|This currency's balance in this trading account.|
            |index_price<br>`ip` |string|True|The index price of this currency. (reported in `USD`)|
        ??? info "[VaultInvestment](/../../schemas/vault_investment)"
            Summarizes a vault investment held by a funding account<br>

            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |vault_id<br>`vi` |string|True|The trading account ID of the vault invested in.|
            |num_lp_tokens<br>`nl` |string|True|The number of shares held by the investor.|
            |share_price<br>`sp` |string|True|The current share price (in USD) of this vault investment.|
    ??? info "[ClientTier](/../../schemas/client_tier)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |tier<br>`t` |integer|True||
        |futures_taker_fee<br>`ft` |integer|True||
        |futures_maker_fee<br>`fm` |integer|True||
        |options_taker_fee<br>`ot` |integer|True||
        |options_maker_fee<br>`om` |integer|True||
