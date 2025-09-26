!!! info "[Signature](/../../schemas/signature)"
    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |signer<br>`s` |string|True|The address (public key) of the wallet signing the payload|
    |r<br>`r` |string|True|Signature R|
    |s<br>`s1` |string|True|Signature S|
    |v<br>`v` |integer|True|Signature V|
    |expiration<br>`e` |string|True|Timestamp after which this signature expires, expressed in unix nanoseconds. Must be capped at 30 days|
    |nonce<br>`n` |integer|True|Users can randomly generate this value, used as a signature deconflicting key.<br>ie. You can send the same exact instruction twice with different nonces.<br>When the same nonce is used, the same payload will generate the same signature.<br>Our system will consider the payload a duplicate, and ignore it.|
