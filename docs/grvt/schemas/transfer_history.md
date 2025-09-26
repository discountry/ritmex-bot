!!! info "[TransferHistory](/../../schemas/transfer_history)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |tx_id<br>`ti` |string|True|The transaction ID of the transfer|
    |from_account_id<br>`fa` |string|True|The account to transfer from|
    |from_sub_account_id<br>`fs` |string|True|The subaccount to transfer from (0 if transferring from main account)|
    |to_account_id<br>`ta` |string|True|The account to deposit into|
    |to_sub_account_id<br>`ts` |string|True|The subaccount to transfer to (0 if transferring to main account)|
    |currency<br>`c` |string|True|The token currency to transfer|
    |num_tokens<br>`nt` |string|True|The number of tokens to transfer|
    |signature<br>`s` |Signature|True|The signature of the transfer|
    |event_time<br>`et` |string|True|The timestamp of the transfer in unix nanoseconds|
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
