!!! info "[WSUnsubscribeResult](/../../schemas/ws_unsubscribe_result)"
    Returns a confirmation of all unsubscribes<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|The channel to subscribe to (eg: ticker.s / ticker.d)|
    |unsubs<br>`u` |[string]|True|The list of feeds unsubscribed from|
