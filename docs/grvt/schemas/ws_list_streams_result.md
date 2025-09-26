!!! info "[WSListStreamsResult](/../../schemas/ws_list_streams_result)"
    Returns a list of all rooms the client has subscribed to.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream_reference<br>`sr` |[StreamReference]|True|The list of stream references  the connection is connected to|
    ??? info "[StreamReference](/../../schemas/stream_reference)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |stream<br>`s` |string|True|The channel to subscribe to (eg: ticker.s / ticker.d)|
        |selectors<br>`s1` |[string]|True|The list of selectors for the stream|
