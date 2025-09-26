!!! info "[DepositHistory](/../../schemas/deposit_history)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |l_1_hash<br>`l1` |string|True|The L1 txHash of the deposit|
    |l_2_hash<br>`l2` |string|True|The L2 txHash of the deposit|
    |to_account_id<br>`ta` |string|True|The account to deposit into|
    |currency<br>`c` |string|True|The token currency to deposit|
    |num_tokens<br>`nt` |string|True|The number of tokens to deposit|
    |initiated_time<br>`it` |string|True|The timestamp when the deposit was initiated on L1 in unix nanoseconds|
    |confirmed_time<br>`ct` |string|True|The timestamp when the deposit was confirmed on L2 in unix nanoseconds|
    |from_address<br>`fa` |string|True|The address of the sender|
