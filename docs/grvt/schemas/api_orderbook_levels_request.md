!!! info "[ApiOrderbookLevelsRequest](/../../schemas/api_orderbook_levels_request)"
    Retrieves aggregated price depth for a single instrument, with a maximum depth of 10 levels. Do not use this to poll for data -- a websocket subscription is much more performant, and useful.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
    |depth<br>`d` |integer|True|Depth of the order book to be retrieved (10, 50, 100, 500)|
