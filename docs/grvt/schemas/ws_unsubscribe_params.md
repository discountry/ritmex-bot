!!! info "[WSUnsubscribeParams](/../../schemas/ws_unsubscribe_params)"
    All V1 Websocket Unsubscription Requests are housed in this wrapper. You may specify a stream, a list of feeds and whether those feeds use global sequence numbers to unsubscribe from.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|The channel to unsubscribe from (eg: ticker.s / ticker.d)|
    |selectors<br>`s1` |[string]|True|The list of feeds to unsubscribe from|
