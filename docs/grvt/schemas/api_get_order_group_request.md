!!! info "[ApiGetOrderGroupRequest](/../../schemas/api_get_order_group_request)"
    Retrieves the grouping of non-cancelled, non-filled client orders for a given subaccount when the grouping exist.<br><br>helping to identify TP/SL pairs or other order relationships within the account.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |sub_account_id<br>`sa` |string|True|The subaccount ID for which the order groups should be retrieved.|
