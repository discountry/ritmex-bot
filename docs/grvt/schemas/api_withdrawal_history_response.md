!!! info "[ApiWithdrawalHistoryResponse](/../../schemas/api_withdrawal_history_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[WithdrawalHistory]|True|The withdrawals history matching the request account|
    |next<br>`n` |string|False<br>`''`|The cursor to indicate when to start the next query from|
    ??? info "[WithdrawalHistory](/../../schemas/withdrawal_history)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |tx_id<br>`ti` |string|True|The transaction ID of the withdrawal|
        |from_account_id<br>`fa` |string|True|The subaccount to withdraw from|
        |to_eth_address<br>`te` |string|True|The ethereum address to withdraw to|
        |currency<br>`c` |string|True|The token currency to withdraw|
        |num_tokens<br>`nt` |string|True|The number of tokens to withdraw|
        |signature<br>`s` |Signature|True|The signature of the withdrawal|
        |event_time<br>`et` |string|True|The timestamp of the withdrawal in unix nanoseconds|
        ??? info "[Signature](/../../schemas/signature)"
            |Name<br>`Lite`|Type|Required<br>`Default`| Description |
            |-|-|-|-|
            |signer<br>`s` |string|True|The address (public key) of the wallet signing the payload|
            |r<br>`r` |string|True|Signature R|
            |s<br>`s1` |string|True|Signature S|
            |v<br>`v` |integer|True|Signature V|
            |expiration<br>`e` |string|True|Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days|
            |nonce<br>`n` |integer|True|Users can randomly generate this value, used as a signature deconflicting key.<br>ie. You can send the same exact instruction twice with different nonces.<br>When the same nonce is used, the same payload will generate the same signature.<br>Our system will consider the payload a duplicate, and ignore it.|
