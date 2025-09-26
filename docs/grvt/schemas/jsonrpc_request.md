!!! info "[JSONRPCRequest](/../../schemas/jsonrpc_request)"
    All Websocket JSON RPC Requests are housed in this wrapper. You may specify a stream, and a list of feeds to subscribe to.<br>If a `request_id` is supplied in this JSON RPC request, it will be propagated back to any relevant JSON RPC responses (including error).<br>When subscribing to the same primary selector again, the previous secondary selector will be replaced. See `Overview` page for more details.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |jsonrpc<br>`j` |string|True|The JSON RPC version to use for the request|
    |method<br>`m` |string|True|The method to use for the request (eg: `subscribe` / `unsubscribe` / `v1/instrument` )|
    |params<br>`p` |object|True|The parameters for the request|
    |id<br>`i` |integer|False<br>`0`|Optional Field which is used to match the response by the client.<br>If not passed, this field will not be returned|
