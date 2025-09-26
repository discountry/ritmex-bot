!!! info "[ApiCancelAllOrdersRequest](/../../schemas/api_cancel_all_orders_request)"
    Cancel all orders on the orderbook for this trading account. This may not match new orders in flight.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |sub_account_id<br>`sa` |string|True|The subaccount ID cancelling all orders|
    |kind<br>`k` |[Kind]|False<br>`all`|The kind filter to apply. If nil, this defaults to all kinds. Otherwise, only entries matching the filter will be cancelled|
    |base<br>`b` |[string]|False<br>`all`|The base filter to apply. If nil, this defaults to all bases. Otherwise, only entries matching the filter will be cancelled|
    |quote<br>`q` |[string]|False<br>`all`|The quote filter to apply. If nil, this defaults to all quotes. Otherwise, only entries matching the filter will be cancelled|
    ??? info "[Kind](/../../schemas/kind)"
        The list of asset kinds that are supported on the GRVT exchange<br>

        |Value| Description |
        |-|-|
        |`PERPETUAL` = 1|the perpetual asset kind|
        |`FUTURE` = 2|the future asset kind|
        |`CALL` = 3|the call option asset kind|
        |`PUT` = 4|the put option asset kind|
