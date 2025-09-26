!!! info "[WSSubscribeResponseV1Legacy](/../../schemas/ws_subscribe_response_v1_legacy)"
    All V1 Websocket Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.<br>If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.<br>To ensure you always know if you have missed any payloads, GRVT servers apply the following heuristics to sequence numbers:<ul><li>All snapshot payloads will have a sequence number of `0`. All delta payloads will have a sequence number of `1+`. So its easy to distinguish between snapshots, and deltas</li><li>Num snapshots returned in Response (per stream): You can ensure that you received the right number of snapshots</li><li>First sequence number returned in Response (per stream): You can ensure that you received the first stream, without gaps from snapshots</li><li>Sequence numbers should always monotonically increase by `1`. If it decreases, or increases by more than `1`. Please reconnect</li><li>Duplicate sequence numbers are possible due to network retries. If you receive a duplicate, please ignore it, or idempotently re-update it.</li></ul><br>When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |request_id<br>`ri` |integer|False<br>`0`|Optional Field which is used to match the response by the client.<br>If not passed, this field will not be returned|
    |stream<br>`s` |string|True|The channel to subscribe to (eg: ticker.s / ticker.d)|
    |subs<br>`s1` |[string]|True|The list of feeds subscribed to|
    |unsubs<br>`u` |[string]|True|The list of feeds unsubscribed from|
    |num_snapshots<br>`ns` |[integer]|True|The number of snapshot payloads to expect for each subscribed feed. Returned in same order as `subs`|
    |first_sequence_number<br>`fs` |[string]|True|The first sequence number to expect for each subscribed feed. Returned in same order as `subs`|
