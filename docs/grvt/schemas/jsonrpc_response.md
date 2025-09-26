!!! info "[JSONRPCResponse](/../../schemas/jsonrpc_response)"
    All Websocket JSON RPC Responses are housed in this wrapper. It returns a confirmation of the JSON RPC subscribe request.<br>If a `request_id` is supplied in the JSON RPC request, it will be propagated back in this JSON RPC response.<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |jsonrpc<br>`j` |string|True|The JSON RPC version to use for the request|
    |result<br>`r` |object|False<br>`null`|The result for the request|
    |error<br>`e` |Error|False<br>`null`|The error for the request|
    |id<br>`i` |integer|False<br>`0`|Optional Field which is used to match the response by the client.<br>If not passed, this field will not be returned|
    |method<br>`m` |string|True|The method used in the request for this response (eg: `subscribe` / `unsubscribe` / `v1/instrument` )|
    ??? info "[Error](/../../schemas/error)"
        An error response<br>

        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |code<br>`c` |integer|True|The error code for the request|
        |message<br>`m` |string|True|The error message for the request|
