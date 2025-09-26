!!! info "[WSTradeFeedSelectorV1](/../../schemas/ws_trade_feed_selector_v1)"
    Subscribes to a stream of Public Trades for an instrument.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
    |limit<br>`l` |integer|True|The limit to query for. Valid values are (50, 200, 500, 1000). Default is 50|
