!!! info "[WSRequestV1](/../../schemas/ws_request_v1)"
    All V1 Websocket Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.<br>If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).<br>When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |request_id<br>`ri` |number|False<br>`0`|Optional Field which is used to match the response by the client.<br>If not passed, this field will not be returned|
    |stream<br>`s` |string|True|The channel to subscribe to (eg: ticker.s / ticker.d)|
    |feed<br>`f` |[string]|True|The list of feeds to subscribe to|
    |method<br>`m` |string|True|The method to use for the request (eg: subscribe / unsubscribe)|
    |is_full<br>`if` |boolean|False<br>`false`|Whether the request is for full data or lite data|
