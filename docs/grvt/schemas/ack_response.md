!!! info "[AckResponse](/../../schemas/ack_response)"
    Used to acknowledge a request has been received and will be processed<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |result<br>`r` |Ack|True|The Ack Object|
    ??? info "[Ack](/../../schemas/ack)"
        |Name<br>`Lite`|Type|Required<br>`Default`| Description |
        |-|-|-|-|
        |ack<br>`a` |boolean|True|Gravity has acknowledged that the request has been successfully received and it will process it in the backend|
