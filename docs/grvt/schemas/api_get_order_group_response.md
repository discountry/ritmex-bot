!!! info "[ApiGetOrderGroupResponse](/../../schemas/api_get_order_group_response)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |[ClientOrderIDsByGroup]|True|A list of client orders grouped by their associated order group.<br>Each entry in the list contains a `groupID` and the corresponding `clientOrderID`s<br>that belong to that group.|
    ??? info "[ClientOrderIDsByGroup](/../../schemas/client_order_i_ds_by_group)"
        Grouping for the client order id and their associated groups.<br><br>This is used to define TP/SL pairs or other order groupings after loading the list of Open Orders.<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |group_id<br>`gi` |string|True|The group this order belongs to. It can be used to define TP/SL pairs or other order groupings|
        |client_order_id<br>`co` |[string]|True|List of client order IDs in the group|
        |sub_account_id<br>`sa` |string|True|The sub account ID that these orders belong to|
