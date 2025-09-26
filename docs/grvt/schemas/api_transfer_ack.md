!!! info "[ApiTransferAck](/../../schemas/api_transfer_ack)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |ack<br>`a` |boolean|True|Gravity has acknowledged that the transfer has been successfully processed. If true, a `tx_id` will be returned. If false, an error will be returned.|
    |tx_id<br>`ti` |string|True|The transaction ID of the transfer. This is only returned if the transfer is successful.|
