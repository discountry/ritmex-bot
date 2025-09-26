!!! info "[WSTransferFeedSelectorV1](/../../schemas/ws_transfer_feed_selector_v1)"
    Subscribes to a feed of transfers. This will execute when there is any transfer to or from the selected account.<br>To subscribe to a main account, specify the account ID (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a`).<br>To subscribe to a sub account, specify the main account and the sub account dash separated (eg. `0x9fe3758b67ce7a2875ee4b452f01a5282d84ed8a-1920109784202388`).<br>

    |Name<br>`Lite`|Type|Required<br>`Default`| Description |
    |-|-|-|-|
    |main_account_id<br>`ma` |string|True|The main account ID to request for|
    |sub_account_id<br>`sa` |string|False<br>`'0'`|The sub account ID to request for|
