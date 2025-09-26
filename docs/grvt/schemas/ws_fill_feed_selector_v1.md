!!! info "[WSFillFeedSelectorV1](/../../schemas/ws_fill_feed_selector_v1)"
    Subscribes to a feed of private trade updates. This happens when a trade is executed.<br>To subscribe to all private trades, specify an empty `instrument` (eg. `2345123`).<br>Otherwise, specify the `instrument` to only receive private trades for that instrument (eg. `2345123-BTC_USDT_Perp`).<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |sub_account_id<br>`sa` |string|True|The sub account ID to request for|
    |instrument<br>`i` |string|False<br>`'all'`|The instrument filter to apply.|
