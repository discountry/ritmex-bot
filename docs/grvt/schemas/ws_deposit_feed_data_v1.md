!!! info "[WSDepositFeedDataV1](/../../schemas/ws_deposit_feed_data_v1)"
    Subscribes to a feed of deposit updates.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|The websocket channel to which the response is sent|
    |selector<br>`s1` |string|True|Primary selector|
    |sequence_number<br>`sn` |string|True|A sequence number used to determine message order within a stream.<br>- If `useGlobalSequenceNumber` is **false**, this returns the gateway sequence number, which increments by one locally within each stream and resets on gateway restarts.<br>- If `useGlobalSequenceNumber` is **true**, this returns the global sequence number, which uniquely identifies messages across the cluster.<br>  - A single cluster payload can be multiplexed into multiple stream payloads.<br>  - To distinguish each stream payload, a `dedupCounter` is included.<br>  - The returned sequence number is computed as: `cluster_sequence_number * 10^5 + dedupCounter`.|
    |feed<br>`f` |Deposit|True|The Deposit object|
    ??? info "[Deposit](/../../schemas/deposit)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |tx_hash<br>`th` |string|True|The hash of the bridgemint event producing the deposit|
        |to_account_id<br>`ta` |string|True|The account to deposit into|
        |currency<br>`c` |string|True|The token currency to deposit|
        |num_tokens<br>`nt` |string|True|The number of tokens to deposit|
