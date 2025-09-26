!!! info "[ApiDepositRequest](/../../schemas/api_deposit_request)"
    GRVT runs on a ZKSync Hyperchain which settles directly onto Ethereum.<br>To Deposit funds from your L1 wallet into a GRVT SubAccount, you will be required to submit a deposit transaction directly to Ethereum.<br>GRVT's bridge verifier will scan Ethereum from time to time. Once it receives proof that your deposit has been confirmed on Ethereum, it will initiate the deposit process.<br><br>This current payload is used for alpha testing only.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |to_account_id<br>`ta` |string|True|The main account to deposit into|
    |currency<br>`c` |Currency|True|The token currency to deposit|
    |num_tokens<br>`nt` |string|True|The number of tokens to deposit, quoted in token_currency decimals|
    ??? info "[Currency](/../../schemas/currency)"
        The list of Currencies that are supported on the GRVT exchange<br>

        |Value| Description |
        |-|-|
        |`USD` = 1|the USD fiat currency|
        |`USDC` = 2|the USDC token|
        |`USDT` = 3|the USDT token|
        |`ETH` = 4|the ETH token|
        |`BTC` = 5|the BTC token|
