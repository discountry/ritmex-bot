!!! info "[ApiTransferRequest](/../../schemas/api_transfer_request)"
    This API allows you to transfer funds in multiple different ways<ul><br><li>Between SubAccounts within your Main Account</li><br><li>Between your MainAccount and your SubAccounts</li><br><li>To other MainAccounts that you have previously allowlisted</li><br></ul><b>Fast Withdrawal Funding Address</b><br>For fast withdrawals, funds must be sent to the designated funding account address. Please ensure you use the correct address based on the environment:<br><b>Production Environment Address:</b><br><em>[To be updated, not ready yet]</em><br>This address should be specified as the <code>to_account_id</code> in your API requests for transferring funds using the transfer API. Ensure accurate input to avoid loss of funds or use the UI.<br><br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |from_account_id<br>`fa` |string|True|The main account to transfer from|
    |from_sub_account_id<br>`fs` |string|True|The subaccount to transfer from (0 if transferring from main account)|
    |to_account_id<br>`ta` |string|True|The main account to deposit into|
    |to_sub_account_id<br>`ts` |string|True|The subaccount to transfer to (0 if transferring to main account)|
    |currency<br>`c` |string|True|The token currency to transfer|
    |num_tokens<br>`nt` |string|True|The number of tokens to transfer, quoted in tokenCurrency decimal units|
    |signature<br>`s` |Signature|True|The signature of the transfer|
    |transfer_type<br>`tt` |TransferType|True|The type of transfer|
    |transfer_metadata<br>`tm` |string|True|The metadata of the transfer|
    ??? info "[Signature](/../../schemas/signature)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |signer<br>`s` |string|True|The address (public key) of the wallet signing the payload|
        |r<br>`r` |string|True|Signature R|
        |s<br>`s1` |string|True|Signature S|
        |v<br>`v` |integer|True|Signature V|
        |expiration<br>`e` |string|True|Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days|
        |nonce<br>`n` |integer|True|Users can randomly generate this value, used as a signature deconflicting key.<br>ie. You can send the same exact instruction twice with different nonces.<br>When the same nonce is used, the same payload will generate the same signature.<br>Our system will consider the payload a duplicate, and ignore it.|
    ??? info "[TransferType](/../../schemas/transfer_type)"
        |Value| Description |
        |-|-|
        |`UNSPECIFIED` = 0|Default transfer that has nothing to do with bridging|
        |`STANDARD` = 1|Standard transfer that has nothing to do with bridging|
        |`FAST_ARB_DEPOSIT` = 2|Fast Arb Deposit Metadata type|
        |`FAST_ARB_WITHDRAWAL` = 3|Fast Arb Withdrawal Metadata type|
        |`NON_NATIVE_BRIDGE_DEPOSIT` = 4|Transfer type for non native bridging deposit|
        |`NON_NATIVE_BRIDGE_WITHDRAWAL` = 5|Transfer type for non native bridging withdrawal|
