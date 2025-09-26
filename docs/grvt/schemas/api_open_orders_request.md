!!! info "[ApiOpenOrdersRequest](/../../schemas/api_open_orders_request)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |sub_account_id<br>`sa` |string|True|The subaccount ID to filter by|
    |kind<br>`k` |[Kind]|False<br>`all`|The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be returned|
    |base<br>`b` |[string]|False<br>`all`|The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be returned|
    |quote<br>`q` |[string]|False<br>`all`|The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be returned|
    ??? info "[Kind](/../../schemas/kind)"
        The list of asset kinds that are supported on the GRVT exchange<br>

        |Value| Description |
        |-|-|
        |`PERPETUAL` = 1|the perpetual asset kind|
        |`FUTURE` = 2|the future asset kind|
        |`CALL` = 3|the call option asset kind|
        |`PUT` = 4|the put option asset kind|
