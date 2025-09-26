!!! info "[WSUnsubscribeAllResult](/../../schemas/ws_unsubscribe_all_result)"
    Returns a list of all rooms the client has unsubscribed from.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream_reference<br>`sr` |[StreamReference]|True|The list of stream references unsubscribed from|
    ??? info "[StreamReference](/../../schemas/stream_reference)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |stream<br>`s` |string|True|The channel to subscribe to (eg: ticker.s / ticker.d)|
        |selectors<br>`s1` |[string]|True|The list of selectors for the stream|
