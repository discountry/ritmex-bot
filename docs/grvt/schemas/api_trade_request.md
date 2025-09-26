!!! info "[ApiTradeRequest](/../../schemas/api_trade_request)"
    Retrieves up to 1000 of the most recent trades in any given instrument. Do not use this to poll for data -- a websocket subscription is much more performant, and useful.<br>This endpoint offers public trading data, use the Trading APIs instead to query for your personalized trade tape.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |instrument<br>`i` |string|True|The readable instrument name:<ul><li>Perpetual: `ETH_USDT_Perp`</li><li>Future: `BTC_USDT_Fut_20Oct23`</li><li>Call: `ETH_USDT_Call_20Oct23_2800`</li><li>Put: `ETH_USDT_Put_20Oct23_2800`</li></ul>|
    |limit<br>`l` |integer|True|The limit to query for. Defaults to 500; Max 1000|
