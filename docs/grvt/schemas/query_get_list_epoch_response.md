!!! info "[QueryGetListEpochResponse](/../../schemas/query_get_list_epoch_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[Epoch]|True|The list of epochs|
    ??? info "[Epoch](/../../schemas/epoch)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |epoch<br>`e` |integer|True|The epoch number|
        |start_time<br>`st` |string|True|The start time of the epoch|
        |end_time<br>`et` |string|True|The end time of the epoch|
