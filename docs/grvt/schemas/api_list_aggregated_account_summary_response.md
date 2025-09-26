!!! info "[ApiListAggregatedAccountSummaryResponse](/../../schemas/api_list_aggregated_account_summary_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |account_summaries<br>`as` |[ApiAggregatedAccountSummaryResponse]|True|The list of aggregated account summaries of requested main accounts|
    ??? info "[ApiAggregatedAccountSummaryResponse](/../../schemas/api_aggregated_account_summary_response)"
        The aggregated account summary, that reports the total equity and spot balances of a funding (main) account, and its constituent trading (sub) accounts<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |result<br>`r` |AggregatedAccountSummary|True|The aggregated account summary|
        ??? info "[AggregatedAccountSummary](/../../schemas/aggregated_account_summary)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |main_account_id<br>`ma` |string|True|The main account ID of the account to which the summary belongs|
            |total_equity<br>`te` |string|True|Total equity of the main (+ sub) account, denominated in USD|
            |spot_balances<br>`sb` |[SpotBalance]|True|The list of spot assets owned by this main (+ sub) account, and their balances|
            ??? info "[SpotBalance](/../../schemas/spot_balance)"
                |Name<br>`Lite`|Type|Required<br>`Default`| Description |
                |-|-|-|-|
                |currency<br>`c` |Currency|True|The currency you hold a spot balance in|
                |balance<br>`b` |string|True|This currency's balance in this trading account.|
                |index_price<br>`ip` |string|True|The index price of this currency. (reported in `USD`)|
                ??? info "[Currency](/../../schemas/currency)"
                    The list of Currencies that are supported on the GRVT exchange<br>

                    |Value| Description |
                    |-|-|
                    |`USD` = 1|the USD fiat currency|
                    |`USDC` = 2|the USDC token|
                    |`USDT` = 3|the USDT token|
                    |`ETH` = 4|the ETH token|
                    |`BTC` = 5|the BTC token|
                    |`SOL` = 6|the SOL token|
                    |`ARB` = 7|the ARB token|
                    |`BNB` = 8|the BNB token|
                    |`ZK` = 9|the ZK token|
                    |`POL` = 10|the POL token|
                    |`OP` = 11|the OP token|
                    |`ATOM` = 12|the ATOM token|
                    |`KPEPE` = 13|the 1000PEPE token|
                    |`TON` = 14|the TON token|
                    |`XRP` = 15|the XRP token|
                    |`TRUMP` = 20|the TRUMP token|
                    |`SUI` = 21|the SUI token|
                    |`LINK` = 25|the LINK token|
                    |`JUP` = 27|the JUP token|
                    |`FARTCOIN` = 28|the FARTCOIN token|
                    |`ENA` = 29|the ENA token|
                    |`DOGE` = 30|the DOGE token|
                    |`ADA` = 33|the ADA token|
                    |`AAVE` = 34|the AAVE token|
                    |`BERA` = 35|the BERA token|
                    |`IP` = 40|the IP token|
