!!! info "[WSSubscribeParams](/../../schemas/ws_subscribe_params)"
    All V1 Websocket Subscription Requests are housed in this wrapper. You may specify a stream and a list of feeds to subscribe to.<br>When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.<br>Sequence numbers can be either gateway-specific or global:<br>- **Gateway Unique Sequence Number**: Increments by one per stream, resets to 0 on gateway restart.<br>- **Global Unique Sequence Number**: A cluster-wide unique number assigned to each cluster payload, does not reset on gateway restarts, and can be used to track and identify message order across streams using `sequence_number` and `prev_sequence_number` in the feed response.<br>Set `useGlobalSequenceNumber = true` if you need a persistent, unique identifier across all streams or ordering across multiple feeds.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |stream<br>`s` |string|True|The channel to subscribe to (eg: ticker.s / ticker.d)|
    |selectors<br>`s1` |[string]|True|The list of feeds to subscribe to|
